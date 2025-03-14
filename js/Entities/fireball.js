import { AnimationStorage } from "../Storage/animationsStorage.js";
import { Entity } from "./entities.js"
export class Fireball extends Entity {

    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     * @param {{ width:number ,height:number, offsetX:number, offsetY:number}} hitbox
     */
    constructor(element,hitbox) {
        super(element, hitbox,new Map([
            ["idle", AnimationStorage.fireball]
        ]))
        this.speed = this.getRandomArbitrary(5, 10)
        this.currentAnimation = this.animations.get("idle");
        this.currentAnimation.start();
    }
}
