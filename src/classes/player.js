import * as PIXI from 'pixi.js';
import playerImg from '../assets/player.png';

class Player extends PIXI.Sprite{
    constructor(stage) {
        super(PIXI.Texture.from(playerImg));

        this.anchor.set(0.5);
        this.position.x = 400;
        this.position.y = 400;
        this.attackPower = 10;
        this.health = 64; // 64 = draw a full healthbar, relates to pixel width
        this.tag = 'player';

        stage.addChild(this);
    }

    move() {
        this.position.x += this.direction.x * 5;
        this.position.y += this.direction.y * 5;
    }

    getAttackPower() {
        return this.attackPower;
    }

    getHealth() {
        return this.health;
    }

    takeDamage(attackPower) {
        if(this.health > 0) {
            this.health -= attackPower;
        } else {
            this.health = 0;
        }
    }
}

export default Player;
