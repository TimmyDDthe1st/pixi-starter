import * as PIXI from 'pixi.js';
import gsap from 'gsap'
import playerImg from './assets/player.png';
import floorImg from './assets/floor.png';
import moveSelectImg from './assets/moveSelect.png';
import enemyImg from './assets/enemy.png';

const app = new PIXI.Application({ width: 800, height: 800, });
document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const middleScreenX = app.view.width / 2;
const middleScreenY = app.view.height / 2;

let mousePosX;
let mousePosY;
let playerPosX;
let playerPosY;
let isEnemy;
let movePlayer = false;

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

app.stage.addChild(moveSelect);

// Create player object
const player = new PIXI.Sprite.from(playerImg);
player.anchor.set(0.5);
player.x = middleScreenX
player.y = middleScreenY
moveSelect.alpha = 0;

app.stage.addChild(player);

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

function clickToMove(e) {
    mousePosX = Math.round(e.data.originalEvent.clientX / 10) * 10;
    mousePosY = Math.round(e.data.originalEvent.clientY / 10) * 10;

    if(e.target.tag === 'floor'){
        gsap.fromTo(moveSelect, {angle: 0}, {angle: 360, duration: 0.5, ease:"elastic"});
        moveSelect.x = mousePosX;
        moveSelect.y = mousePosY;
        moveSelect.alpha = 1;
        isEnemy = false;
    } else if(e.target.tag === 'enemy') {
        gsap.fromTo(moveSelect, {angle: 0}, {angle: 360, duration: 0.5, ease:"elastic"});
        moveSelect.x = enemy.x;
        moveSelect.y = enemy.y;
        moveSelect.alpha = 1;
        isEnemy = true;
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

app.ticker.add (() => {    
    console.log(movePlayer);  
    if(movePlayer && !isEnemy) {
        console.log(`Player moving to ${mousePosX}X ${mousePosY}Y`);
        player.x += player.direction.x * 5;
        player.y += player.direction.y * 5;
    }

    if(Math.round(player.x / 10) * 10 === mousePosX && Math.round(player.y / 10) * 10 === mousePosY) {
        movePlayer = false;
        moveSelect.alpha = 0;
    }
});
