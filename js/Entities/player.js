import { Entity } from "./entities.js"
import { Animation } from "../animation.js";
import { AnimationStorage } from "../Storage/animationsStorage.js";
import { EventArgs } from "../utilities/event.js";
export class Player extends Entity {
	#currentAnimation;
    /**
     * Creates an instance of Player.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     */
    constructor(element) {
        super(element);
        this.animations = new Map([
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
        ]);
		this.dir = "down";
		for (const [key, value] of this.animations) {
			this.animations.set(key, value.clone());
		}
		this.#addEventFinishAnimations();
		this.#initAnimations();
		this.#currentAnimation = this.animations.get("idle-down");
		this.#currentAnimation.start();
    }
	/** Initializes animations by setting up their frame change events. */
	#initAnimations() {
		for (const animation of this.animations.values()) {
			animation.frameChange.add(this.#animationFrameChange);
		}
	}

	/**
	 * Handles the animation frame change event by updating the entity's sprite.
	 *
	 * @param {Animation} object - The animation object.
	 * @param {EventArgs} e - The event arguments.
	 */
	#animationFrameChange = (object, e) => {
		this.element.src = object.currentFrame.src;
	};

	/** Adds an event listener for animation finish events. */
    #addEventFinishAnimations() {
        for (const animation of this.animations.values()) {
            animation.finish.add(this.#animationFinish);
        }
    }
	/**
	 * Handles the animation finish event.
	 *
	 * @param {Animation} object - The animation object.
	 * @param {EventArgs} e - The event arguments.
	 */
	#animationFinish = (object, e) => {
		if (!object.cancelable) this.updateAnimation();
	};
	/**
     * Switches the current animation to the specified key.
     * Stops the current animation if one is active.
     *
     * @param {string} key - The key of the animation to switch to.
     * @throws {Error} If the animation key does not exist.
     */
    switchAnimation(key) {
        const animation = this.animations.get(key);
        if (animation === undefined) {
            throw new Error(`There's no animation with the key: "${key}"`);
        }
        if (this.#currentAnimation !== null && this.#currentAnimation !== animation && this.#currentAnimation.cancelable) {
            this.#currentAnimation.stop();
        }
        if (this.#currentAnimation === null || !this.#currentAnimation.playing) {
            animation.start();
            this.#currentAnimation = animation;
        }
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