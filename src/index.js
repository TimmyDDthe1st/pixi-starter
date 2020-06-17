import * as PIXI from 'pixi.js';
import gsap from 'gsap'

import Player from './classes/player';
import MoveSelect from './classes/moveSelect';
import Floor from './classes/floor';
import Enemy from './classes/enemy';
import TargetReticle from './classes/targetReticle';

const app = new PIXI.Application({ width: 800, height: 800, });
document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const MELEE_RANGE = 100;

let mousePosX;
let mousePosY;
let playerPosX;
let playerPosY;
let isEnemy;
let movePlayer = false;

//Create floor object
const floor = new Floor(app.stage);
floor.on('pointerdown', clickToMove);

// Create moveSelect object
const moveSelect = new MoveSelect(app.stage);

// Create player object
const player = new Player(app.stage);

// Create enemy object
const enemy = new Enemy(app.stage);

enemy.on('pointerdown', clickEnemy);

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

// Create target reticule
const targetReticle = new TargetReticle(app.stage);


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
    
            targetReticle.x = enemy.x;
            targetReticle.y = enemy.y;

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
    player.attacking = true;
    clickToMove(e);
}

function playerMovement() {
    if(movePlayer && !isEnemy) {
        moveSelect.alpha = 1;
        player.move();
    }

    if(isEnemy && movePlayer) {
        if(getDistance(player, targetReticle) < MELEE_RANGE) {
            movePlayer = false;
            player.attacking = true;
            if(playerHealthBar.alpha < 1) {
                playerHealthBar.alpha ++;
            }
        }        
        player.move();
    }

    if(getDistance(player, targetReticle) > MELEE_RANGE) {
        player.attacking = false;
    }
}

function enemyTargetReticule() {
    if(isEnemy) {
        if(targetReticle.alpha < 1) {
            targetReticle.alpha += 0.1;
        }
        moveSelect.alpha = 0;
        targetReticle.rotation += 0.01;
    } else {
        if(targetReticle.alpha > 0){
            targetReticle.alpha -= 0.1;
        }
        if(playerHealthBar.alpha > 0) {
            playerHealthBar.alpha --;
        }
    }
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
    //playerTakeDamage();
    stopMovement();
});
