import * as PIXI from 'pixi.js';
import enemyImg from '../assets/enemy.png';

class Enemy extends PIXI.Sprite{
    constructor(stage) {
        super(PIXI.Texture.from(enemyImg));

        this.anchor.set(0.5);
        this.position.x = 600;
        this.position.y = 400;
        this.buttonMode = true;
        this.interactive = true;
        this.attackPower = 4;
        this.health = 64;
        this.tag = 'enemy';

        stage.addChild(this);
    }

    moveTo(instance) {
        this.position.x += instance.position.x;
        this.position.y += instance.position.y;
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

export default Enemy;
