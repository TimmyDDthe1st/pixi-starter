import * as PIXI from 'pixi.js';

class HealthBar extends PIXI.Container{
    constructor(instance) {
        super();

        this.pivot.x = 32;
        this.position.x = instance.width;
        this.position.y = -50;
        this.alpha = 0;
        instance.addChild(this);

        //Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, 64, 8);
        innerBar.endFill();
        this.addChild(innerBar);
        
        //Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, 64, 8);
        outerBar.endFill();
        this.addChild(outerBar);
        instance.outer = outerBar;
    }
}

export default HealthBar;
