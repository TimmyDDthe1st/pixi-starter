import * as PIXI from 'pixi.js';
import targetReticleImg from '../assets/targetReticle.png';

class TargetReticle extends PIXI.Sprite{
    constructor(stage) {
        super(PIXI.Texture.from(targetReticleImg));

        this.anchor.set(0.5);
        this.alpha = 0;
        
        stage.addChild(this);
    }
}

export default TargetReticle;
