import { Entity } from "./entities.js"
import { Animation } from "../animation.js";
import { AnimationStorage } from "../Storage/animationsStorage.js";
import { EventArgs } from "../utilities/event.js";
export class Player extends Entity {
	/** @protected */
    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     */
    constructor(element) {
        super(element, new Map([
            ["idle-down", AnimationStorage.idleDown],
			["idle-down-right", AnimationStorage.idleDownRight],
			["idle-down-left", AnimationStorage.idleDownLeft],
			["idle-up", AnimationStorage.idleUp],
			["idle-up-right", AnimationStorage.idleUpRight],
			["idle-up-left", AnimationStorage.idleUpLeft],
			["walk-down", AnimationStorage.walkDown],
			["walk-down-right", AnimationStorage.walkDownRight],
			["walk-down-left", AnimationStorage.walkDownLeft],
			["walk-up", AnimationStorage.walkUp],
			["walk-up-right", AnimationStorage.walkUpRight],
			["walk-up-left", AnimationStorage.walkUpLeft],
        ]));
		this.dir = "down";
		this.currentAnimation = this.animations.get("idle-down");
		this.currentAnimation.start();
    }
	updateDir(){
		if(this.vector.x == 0 && this.vector.y == 0)
			return;
		if(this.vector.x < 3 && this.vector.x > -3){
			if(this.vector.y >= 0)
				this.dir = "down";
			else
				this.dir = "up";
		}
        else if(this.vector.y >= 0){
			if(this.vector.x >= 0)
				this.dir = "down-right";
			else
				this.dir = "down-left";
		}
		else if(this.vector.y < 0){
			if(this.vector.x >= 0)
				this.dir = "up-right";
			else
				this.dir = "up-left";
		}
	}
	updateAnimation() {
		this.updateDir();
		if(this.magnitude() > 0)
			this.switchAnimation(`walk-${this.dir}`);
		else
			this.switchAnimation(`idle-${this.dir}`);
	}
}