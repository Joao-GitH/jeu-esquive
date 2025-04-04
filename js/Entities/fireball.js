import { AnimationStorage } from "../Storage/animationsStorage.js";
import { Entity } from "./entities.js"
import { Collider, RectangleCollider } from "../PhysicsEngine/PhysicsEngine.js";
export class Fireball extends Entity {

    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     * @param {RectangleCollider} collider
     * @param {{x:number, y:number}} offset
     */
    constructor(element,collider,offset) {
        super(element, collider,offset,new Map([
            ["idle", AnimationStorage.fireball]
        ]))
        this.speed = this.getRandomArbitrary(5, 10)
        this.currentAnimation = this.animations.get("idle");
        this.currentAnimation.start();
    }
}
