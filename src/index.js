import * as PIXI from 'pixi.js'
import playerImg from './assets/player.png';
import floorImg from './assets/floor.png';

const app = new PIXI.Application({ width: 800, height: 800, });
document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const middleScreenX = app.view.width / 2;
const middleScreenY = app.view.height / 2;

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

player.interactive = true;
player.buttonMode = true;

player.on('pointerdown', onClick);

app.stage.addChild(player);

function onClick() {

    console.log('click');
    // let position = e.data.global;

    // player.x = position.x;
    // player.y = position.y;
}

