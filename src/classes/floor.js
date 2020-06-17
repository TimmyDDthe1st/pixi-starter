import * as PIXI from 'pixi.js';
import floorImg from '../assets/floor.png';

class Floor extends PIXI.Sprite{
    constructor(stage) {
        super(PIXI.Texture.from(floorImg));

        this.anchor.set(0.5);
        this.position.x = 400;
        this.position.y = 400;
        this.interactive = true;
        this.tag = 'floor';

        stage.addChild(this);
    }
}

export default Floor;
