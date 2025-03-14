import { Animation } from "../animation.js";
import { EventArgs } from "../utilities/event.js";
export class Entity{
    /** @type {Animation} */
    currentAnimation;
    /**
     * Creates an instance of Entity.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     * @param {{ width:number ,height:number, offsetX:number, offsetY:number}} hitbox
     * @param {Map<string, Animation>} [animations=new Map()]
     */
    constructor(element, hitbox ,animations = new Map()){
        this.element = element;
        this.element.style.position = "absolute";
        this.vector = {x:0, y:0};
        this.target = {x:this.x, y:this.y}
        this.speed = 5;
        this.animations = animations;
        this.hitbox = hitbox;

        this.hitboxElement = document.createElement("div");
        this.hitboxElement.style.width = `${hitbox.width}px`;
        this.hitboxElement.style.height = `${hitbox.height}px`;
        this.hitboxElement.classList.add("hitbox");
        document.body.append(this.hitboxElement);

        
        
		for (const [key, value] of this.animations) {
			this.animations.set(key, value.clone());
		}
		this.#addEventFinishAnimations();
		this.#initAnimations();
    }

    get x(){return parseInt(this.element.style.left)}
    set x(value){this.element.style.left = `${value}px`; this.hitboxElement.style.left = `${value + this.hitbox.offsetX}px`;}

    get y(){return parseInt(this.element.style.top)}
    set y(value){this.element.style.top = `${value}px`; this.hitboxElement.style.top = `${value + this.hitbox.offsetY}px`;}

    get width(){return this.element.getBoundingClientRect().width}
    set width(value){this.element.style.width = `${value}px`}

    get height(){return this.element.getBoundingClientRect().height}
    set height(value){this.element.style.height = `${value}px`}

    get center(){return {x:this.x + this.width / 2, y:this.y + this.height / 2}}

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
        if (this.currentAnimation !== null && this.currentAnimation !== animation && this.currentAnimation.cancelable) {
            this.currentAnimation.stop();
        }
        if (this.currentAnimation === null || !this.currentAnimation.playing) {
            animation.start();
            this.currentAnimation = animation;
        }
    }
    magnitude() {
        return Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y);
    }
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            this.vector.x = 0;
            this.vector.y = 0;
        }
        this.vector.x /= mag;
        this.vector.y /= mag;
    }
    distance(){
        return Math.sqrt(Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2))
    }
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
	updateAnimation() { }
}