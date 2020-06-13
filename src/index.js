import * as PIXI from 'pixi.js';
import gsap from 'gsap'
import playerImg from './assets/player.png';
import floorImg from './assets/floor.png';
import moveSelectImg from './assets/moveSelect.png';
import enemyImg from './assets/enemy.png';
import targetReticuleImg from './assets/targetedEnemy.png';

const app = new PIXI.Application({ width: 800, height: 800, });
document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const middleScreenX = app.view.width / 2;
const middleScreenY = app.view.height / 2;
const MELEE_RANGE = 100;

let mousePosX;
let mousePosY;
let playerPosX;
let playerPosY;
let isEnemy;
let movePlayer = false;
let playerAttacking = false;

//Create floor object
const floor = new PIXI.Sprite.from(floorImg);
floor.anchor.set(0.5);
floor.x = middleScreenX;
floor.y = middleScreenY;
floor.interactive = true;
floor.tag = 'floor';

floor.on('pointerdown', clickToMove);

app.stage.addChild(floor);

console.log('floor added');

// Create moveSelect object
const moveSelect = new PIXI.Sprite.from(moveSelectImg);
moveSelect.anchor.set(0.5);
moveSelect.alpha = 0;

app.stage.addChild(moveSelect);

// Create player object
const player = new PIXI.Sprite.from(playerImg);
player.anchor.set(0.5);
player.x = middleScreenX
player.y = middleScreenY

app.stage.addChild(player);

//Create the players health bar
const playerHealthBar = new PIXI.Container();
playerHealthBar.pivot.x = 32;
playerHealthBar.x = player.width / 2;
playerHealthBar.y = -50;
playerHealthBar.alpha = 0;

player.addChild(playerHealthBar);

//Create the black background rectangle
let innerBar = new PIXI.Graphics();
innerBar.beginFill(0x000000);
innerBar.drawRect(0, 0, 64, 8);
innerBar.endFill();
playerHealthBar.addChild(innerBar);

//Create the front red rectangle
let outerBar = new PIXI.Graphics();
outerBar.beginFill(0xFF3300);
outerBar.drawRect(0, 0, 64, 8);
outerBar.endFill();
playerHealthBar.addChild(outerBar);

playerHealthBar.outer = outerBar;

// Create enemy object
const enemy = new PIXI.Sprite.from(enemyImg);
enemy.anchor.set(0.5);
enemy.x = middleScreenX + 200;
enemy.y = middleScreenY - 200;
enemy.buttonMode = true;
enemy.interactive = true;
enemy.tag = 'enemy';

enemy.on('pointerdown', clickEnemy);

app.stage.addChild(enemy);

// Create target reticule
const targetedEnemy = new PIXI.Sprite.from(targetReticuleImg);
targetedEnemy.anchor.set(0.5);
targetedEnemy.alpha = 0;

app.stage.addChild(targetedEnemy);

function clickToMove(e) {
    moveSelect.alpha = 0;
    if(e.target.tag === 'floor'){
        mousePosX = Math.round(e.data.originalEvent.clientX / 10) * 10;
        mousePosY = Math.round(e.data.originalEvent.clientY / 10) * 10;

        gsap.fromTo(moveSelect, {angle: 0}, {angle: 360, duration: 0.5, ease:"elastic"});

        moveSelect.x = mousePosX;
        moveSelect.y = mousePosY;

        isEnemy = false;
    } else if(e.target.tag === 'enemy') {
        if(!isEnemy){
            mousePosX = Math.round(e.data.originalEvent.clientX / 10) * 10;
            mousePosY = Math.round(e.data.originalEvent.clientY / 10) * 10;
    
            targetedEnemy.x = enemy.x;
            targetedEnemy.y = enemy.y;

            isEnemy = true;
        }
    }

    playerPosX = Math.round(player.x);
    playerPosY = Math.round(player.y);

    const direction = new PIXI.Point();
    direction.x = mousePosX - playerPosX;
    direction.y = mousePosY - playerPosY;

    var length = Math.sqrt( direction.x*direction.x + direction.y*direction.y);
    direction.x/=length;
    direction.y/=length;

    player.direction = direction;

    movePlayer = true;
}

function clickEnemy(e) {
    playerAttacking = true;
    clickToMove(e);
}

function playerMovement() {
    if(movePlayer && !isEnemy) {
        if(moveSelect.alpha < 1){
            moveSelect.alpha += 0.1;
        }
        movePlayerTick();
    }

    if(isEnemy && movePlayer) {
        if(getDistance(player, targetedEnemy) < MELEE_RANGE) {
            movePlayer = false;
            playerAttacking = true;
            if(playerHealthBar.alpha < 1) {
                playerHealthBar.alpha ++;
            }
        }        
        movePlayerTick();
    }

    if(getDistance(player, targetedEnemy) > MELEE_RANGE) {
        playerAttacking = false;
    }
}

function enemyTargetReticule() {
    if(isEnemy) {
        if(targetedEnemy.alpha < 1) {
            targetedEnemy.alpha += 0.1;
        }
        moveSelect.alpha = 0;
        targetedEnemy.rotation += 0.01;
    } else {
        if(targetedEnemy.alpha > 0){
            targetedEnemy.alpha -= 0.1;
        }
        if(playerHealthBar.alpha > 0) {
            playerHealthBar.alpha --;
        }
    }
}

function movePlayerTick(){
    player.x += player.direction.x * 5;
    player.y += player.direction.y * 5;
}

function stopMovement() {
    if(Math.round(player.x / 10) * 10 === mousePosX && Math.round(player.y / 10) * 10 === mousePosY) {
        movePlayer = false;
        moveSelect.alpha = 0;
    }
}

function getDistance(object1, object2) {
    return Math.sqrt(
        (object2.x - object1.x) * (object2.x - object1.x)
        + (object2.y - object1.y) * (object2.y - object1.y),
    );
}

app.ticker.add (() => {    
    playerMovement();
    enemyTargetReticule();
    stopMovement();
});
