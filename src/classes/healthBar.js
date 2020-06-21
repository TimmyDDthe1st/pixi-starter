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
        this.outerBar = new PIXI.Graphics();
        this.outerBar.beginFill(0xFF3300);
        this.outerBar.drawRect(0, 0, 64, 8);
        this.outerBar.endFill();
        this.addChild(this.outerBar);
    }

    damage(entity, health, attackPower) {
        entity.takeDamage(attackPower)
        let length = health - attackPower;

        if(this.outerBar.width > 0) {
            this.outerBar.width = length;
        } else {
            this.outerBar.width = 0;
        }

    }
}

export default HealthBar;
