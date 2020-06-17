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
        this.health = 100;
        this.tag = 'enemy';

        stage.addChild(this);
    }
}

export default Enemy;
