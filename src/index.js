import * as PIXI from 'pixi.js';
import gsap from 'gsap'


import Player from './classes/player';
import MoveSelect from './classes/moveSelect';
import Floor from './classes/floor';
import Enemy from './classes/enemy';
import TargetReticle from './classes/targetReticle';
import HealthBar from './classes/healthBar';

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
let enemyAttackInterval
let playerAttackInterval


//Create floor object
const floor = new Floor(app.stage);
floor.on('pointerdown', clickToMove);

// Create moveSelect object
const moveSelect = new MoveSelect(app.stage);

// Create player object
const player = new Player(app.stage);
const playerHealthBar = new HealthBar(player);

// Create enemy object
const enemy = new Enemy(app.stage);
const enemyHealthBar = new HealthBar(enemy);

enemy.on('pointerdown', clickEnemy);

// Create target reticule
const targetReticle = new TargetReticle(app.stage);

function enemyAttack() {
    playerHealthBar.damage(player, player.getHealth(), enemy.getAttackPower())
}

function playerAttack() {
    enemyHealthBar.damage(enemy, enemy.getHealth(), player.getAttackPower())
}

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

            enemyAttackInterval = setInterval(enemyAttack, 1000);
            playerAttackInterval = setInterval(playerAttack, 1000);

            if(playerHealthBar.alpha < 1) {
                playerHealthBar.alpha ++;
            }
            if(enemyHealthBar.alpha < 1) {
                enemyHealthBar.alpha ++;
            }
        }        
        player.move();
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
        if(enemyHealthBar.alpha > 0) {
            enemyHealthBar.alpha --;
        }

        console.log('out of range')
        clearInterval(enemyAttackInterval);
        clearInterval(playerAttackInterval);
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
    stopMovement();
});
