import * as PIXI from 'pixi.js';
import playerImg from '../assets/player.png';

class Player extends PIXI.Sprite{
    constructor(stage) {
        super(PIXI.Texture.from(playerImg));

        this.anchor.set(0.5);
        this.position.x = 400;
        this.position.y = 400;
        this.health = 100;
        this.attacking = false;
        this.tag = 'player';

        stage.addChild(this);
    }

    get attacking() {
        return this.attacking;
    }

    set attacking(state) {
        this.attacking = state;
    }

    move() {
        this.position.x += this.direction.x * 5;
        this.position.y += this.direction.y * 5;
    }
}

export default Player;
