import * as PIXI from 'pixi.js';
import moveSelectImg from '../assets/moveSelect.png';

class moveSelect extends PIXI.Sprite{
    constructor(stage) {
        super(PIXI.Texture.from(moveSelectImg));

        this.anchor.set(0.5);
        this.alpha = 0;   

        stage.addChild(this);
    }
}

export default moveSelect;
