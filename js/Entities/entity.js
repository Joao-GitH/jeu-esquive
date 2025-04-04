import { Animation } from "../animation.js";
import { EventArgs } from "../utilities/event.js";
import { RectangleCollider } from "../PhysicsEngine/PhysicsEngine.js";
export class Entity{
    /** @type {Animation} */
    currentAnimation;
    /**
     * Creates an instance of Entity.
     *
     * @constructor
     * @param {HTMLImageElement} element 
     * @param {RectangleCollider} collider
     * @param {{x:number, y:number}} offset
     * @param {Map<string, Animation>} [animations=new Map()]
     */
    constructor(element, collider, offset, animations = new Map()){
        this.element = element;
        this.element.style.position = "absolute";
        this.vector = {x:0, y:0};
        this.target = {x:this.x, y:this.y}
        this.speed = 5;
        this.animations = animations;
        this.collider = collider;
        this.offset = offset;
        this.hitboxElement = document.createElement("div");
        this.hitboxElement.style.width = `${collider.width}px`;
        this.hitboxElement.style.height = `${collider.height}px`;
        this.hitboxElement.classList.add("hitbox");
        document.body.append(this.hitboxElement);

        
        
		for (const [key, value] of this.animations) {
			this.animations.set(key, value.clone());
		}
		this.#addEventFinishAnimations();
		this.#initAnimations();
    }

    get x(){ if(this.collider) return this.collider.x 
        else return 0}
    set x(value){
        this.collider.x = value;
        this.element.style.left = `${value + this.offset.x}px`; 
        this.hitboxElement.style.left = `${value}px`;
    }

    get y(){if(this.collider) return this.collider.y
        else return 0
    }
    set y(value){
        this.collider.y = value;
        this.element.style.top = `${value + this.offset.y}px`; 
        this.hitboxElement.style.top = `${value}px`;
    }

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