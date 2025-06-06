import { AnimationManager } from "../utilities/animationManager.js";
import { Event } from "../event.js";
import { CircleCollider, Collider, Point, RectangleCollider, Vector } from "../PhysicsEngine/PhysicsEngine.js";
import SpriteSheet from "../utilities/spriteSheet.js";

/**
 * Represents an entity in the game.
 * 
 * An entity has animations, a collider, a direction.
 */
export class Entity {
	/** Movement speed of the entity */
	speed = 5;
	/** Current facing direction of the entity */
	direction = new Point(1, 0);
	/** Animation manager handling current animation state */
	animationManager;

	/** Current sprite image to render for the entity @type {HTMLImageElement | null}*/
	sprite = new Image();

	/**
	 * Creates an instance of Entity.
	 *
	 * @constructor
	 * @param {string} name - Name of the entity
	 * @param {Collider} collider - Collider object for physics and positioning
	 * @param {Point} [spriteOffset=new Point(0, 0)] - Offset to apply to sprite drawing
	 * @param {SpriteSheet[]} [sources=[]] 
	 */
	constructor(name, collider, spriteOffset = new Point(0, 0), sources = []) {
		this.name = name;
		this.collider = collider;
		this.hitbox = document.createElement("div");
		this.#setHitbox();
		//document.body.append(this.hitbox);
		this.target = new CircleCollider(collider.x, collider.y, 10)
		this.spriteOffset = spriteOffset;
		this.animationManager = new AnimationManager(sources);
		this.animationManager.frameChange.add(this.animationFrameChange);
		document.body.append(this.sprite);
	}

	/** 
	 * Updates the entity's facing direction based on its current velocity.
	 * 
	 * This method sets the direction vector to indicate the last non-zero movement direction.
	 * 
	 * @protected
	 */
	setDirection() {
		const velocity = this.collider.velocity;
		if (velocity.x != 0 && velocity.y != 0) {
			if (velocity.x > 0)
				this.direction.x = 1;
			else if (velocity.x < 0)
				this.direction.x = -1;

			if (velocity.y > 0)
				this.direction.y = 1;
			else if (velocity.y < 0)
				this.direction.y = -1;
		}
	}

	#setHitbox(){
		this.hitbox.className = "hitbox";
		this.hitbox.style.left = `${this.collider.x}px`;
		this.hitbox.style.top = `${this.collider.y}px`;
		if(this.collider instanceof RectangleCollider){
			this.hitbox.style.height = `${this.collider.height}px`;
			this.hitbox.style.width = `${this.collider.width}px`;
		}
	}

	/**
	 * Handles animation frame changes by updating the entity's sprite.
	 *
	 * @param {AnimationManager} obj - The animation object.
	 * @protected
	 */
	animationFrameChange = (obj) => {
		this.sprite.src = obj.spriteURL();
	}
	
	
	draw() {
		this.sprite.style.left = `${this.collider.x - this.spriteOffset.x}px`;
		this.sprite.style.top = `${this.collider.y - this.spriteOffset.y}px`;
		this.hitbox.style.left = `${this.collider.x}px`;
		this.hitbox.style.top = `${this.collider.y}px`;
	}

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
