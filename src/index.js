import * as PIXI from 'pixi.js';
import playerImg from './assets/player.png';
import floorImg from './assets/floor.png';

const app = new PIXI.Application({ width: 800, height: 800, });
document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const middleScreenX = app.view.width / 2;
const middleScreenY = app.view.height / 2;

let mousePosX;
let mousePosY;
let playerPosX;
let playerPosY;

let movePlayer = false;

//Create floor object
const floor = new PIXI.Sprite.from(floorImg);
floor.anchor.set(0.5);
floor.x = middleScreenX;
floor.y = middleScreenY;
floor.interactive = true;
floor.buttonMode = true;

floor.on('pointerdown', onClick);

app.stage.addChild(floor);

console.log('floor added');


// Create player object
const player = new PIXI.Sprite.from(playerImg);
player.anchor.set(0.5);
player.x = middleScreenX
player.y = middleScreenY

app.stage.addChild(player);

function onClick(e) {
    mousePosX = Math.round(e.data.originalEvent.clientX / 10) * 10;
    mousePosY = Math.round(e.data.originalEvent.clientY / 10) * 10;

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

app.ticker.add (() => {        
    if(movePlayer) {
        player.x += player.direction.x * 5;
        player.y += player.direction.y * 5;
    }

    if(Math.round(player.x / 10) * 10 === mousePosX && Math.round(player.y / 10) * 10 === mousePosY) {
        console.log('I HERE!')
        movePlayer = false;
    }
});
