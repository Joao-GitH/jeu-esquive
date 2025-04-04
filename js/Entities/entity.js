import { Animation } from "../animation.js";
import { CircleCollider, RectangleCollider, Event, Vector } from "../PhysicsEngine/PhysicsEngine.js";
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
        this.target = new CircleCollider(collider.x, collider.y, 10)
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
    
    draw(){
        this.element.style.left = `${this.collider.x - this.offset.x}px`;
        this.element.style.top = `${this.collider.y -    this.offset.y}px`;
        this.hitboxElement.style.left = `${this.collider.x}px`;
        this.hitboxElement.style.top = `${this.collider.y}px`;
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
	 */
	#animationFrameChange = (object) => {
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
	 */
	#animationFinish = (object) => {
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
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
	updateAnimation() { }
	setVelocityToTarget(){
		if (!this.collider.collides(this.target)) {
			this.collider.velocity = new Vector(this.target.x - this.collider.center.x, this.target.y - this.collider.center.y);
			this.collider.velocity.normalize();
			this.collider.velocity.multiply(this.speed);
		}
		else
			this.collider.velocity = new Vector(0,0);
	}
}