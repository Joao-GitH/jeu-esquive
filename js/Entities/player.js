import { Entity } from "./entities.js"
import { AnimationStorage } from "../Storage/animationsStorage.js";
export class Player extends Entity {

    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     */
    constructor(element) {
        super(element)
        this.animations = new Map([
            ["idle-down", AnimationStorage.idleDown]
        ])
		this.animations.get("idle-down").frameChange.add((o, e) => {this.element.src = o.currentFrame.src})
		this.animations.get("idle-down").start();
    }

}