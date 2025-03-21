import { Vector, ColliderType, CircleCollider, RectangleCollider, PhysicsWorld, Event } from "../PhysicsEngine.js";

export class Collider {
	/** The X position of the collider. */
	x;
	/** The Y position of the collider. */
	y;
	/** The color of the collider's border. */
	color;
	/** The velocity of the collider. */
	velocity;
	/** @type {PhysicsWorld} The world the collider belongs to. */
	world;
	/** The class name of the collider. */
	classList;
	/** The type of the collider. */
	type;
	/** @type {Event<Collider, {collider:Collider}>} */
	collide;


	/** @type {{x:number, y:number}} Center point of the collider @readonly*/
	get center() { return null }

	/**
	 * Creates an instance of `Collider`.
	 * @param {number} x - The X position of the collider.
	 * @param {number} y - The Y position of the collider.
	 * @param {ColliderType} [type=ColliderType.static] - The type of the collider.
	 */
	constructor(x, y, type = ColliderType.static) {
		this.x = x;
		this.y = y;
		this.color = "rgb(255, 0, 0)";
		this.velocity = new Vector(0, 0);
		this.classList = [];
		this.collide = new Event();
		this.type = type;
	}

	/**
	 * Gets all colliders currently touching this collider.
	 * 
	 * @returns {Collider[]}
	 * @readonly
	 */
	get neighbors() {
		return this.world.colliders.filter((c) => c !== this && this.collides(c))
	}

	/**
	 * Description placeholder
	 *
	 * @param {Collider} collider 
	 */
	oncollide(collider) {
		this.collide.invoke(this, { collider: collider });
	}

	/** Updates the collider's position applying gravity, collisions, and friction. */
	update() {
		this.applyGravity();
		const vectorX = this.velocity.x;
		const vectorY = this.velocity.y;

		// Apply friction if the collider is dynamic
		if (this.type === ColliderType.dynamic) {
			this.applyFriction();
		}

		// Update position based on velocity
		this.x += vectorX;
		this.y += vectorY;

		// Handle collisions after updating position
		if (this.type === ColliderType.dynamic) {
			this.applyCollisions(); // Handle collisions after updating position
		}
	}

	/** Draws the collider on the canvas. */
	draw() {
		this.velocity.draw(this.world.ctx, this.center.x, this.center.y);
	}

	/** Applies gravity to the collider if it is dynamic. @protected */
	applyGravity() {
		if (this.type === ColliderType.dynamic) {
			this.velocity.add(this.world.gravity);
		}
	}

	/** Applies friction to slow down the collider. @protected */
	applyFriction() {
		const friction = this.world.friction;

		// Apply friction to both X and Y velocities
		if (Math.abs(this.velocity.x) > 0.1) {
			this.velocity.x *= friction.x; // Reduce X velocity gradually
		} else {
			this.velocity.x = 0; // Stop X movement if very small velocity
		}

		if (Math.abs(this.velocity.y) > 0.1) {
			this.velocity.y *= friction.y; // Reduce Y velocity gradually
		} else {
			this.velocity.y = 0; // Stop Y movement if very small velocity
		}
	}

	/** Handles collisions with other colliders. @protected */
	applyCollisions() {
		for (const collider of this.neighbors) {
			collider.oncollide(collider);
			if (collider.type !== ColliderType.transparent) {
				if (collider instanceof RectangleCollider) {
					this.handleRectangleCollision(collider); // Handle rectangle collision
				}
				if (collider instanceof CircleCollider) {
					this.handleCircleCollision(collider); // Handle circle collision
				}
			}
		}
	}

	/**
	 * Handles collision with a rectangle collider.
	 * @param {RectangleCollider} rect - The rectangle collider.
	 * @protected
	 */
	handleRectangleCollision(rect) { }

	/**
	 * Handles collision with another circle collider.
	 * @param {CircleCollider} cir - The other circle collider.
	 * @protected
	 */
	handleCircleCollision(cir) { }

	/**
	 * Description placeholder
	 *
	 * @param {Collider} collider 
	 */
	distance(collider) {
		return Math.sqrt((this.x - collider.x) ** 2 + (this.y - collider.y) ** 2);
	}

	/**
	 * @param {Collider} collider
	 */
	collides(collider) {
		if (collider instanceof RectangleCollider) {
			return this.collidesRectangle(collider);
		}
		if (collider instanceof CircleCollider) {
			return this.collidesCircle(collider);
		}
		throw new Error("Unsupported collider types.");
	}

	/**
	 * Checks if a the collider collides with a rectangle.
	 * 
	 * @protected
	 * @param {RectangleCollider} collider - The rectangle collider.
	 * @returns {boolean} `true` if the collider and the rectangle are colliding.
	 */
	collidesRectangle(collider) { return false; }

	/**
	 * Checks if a the collider collides with a circle.
	 * 
	 * @protected
	 * @param {CircleCollider} collider - The circle collider.
	 * @returns {boolean} `true` if the collider and the rectangle are colliding.
	 */
	collidesCircle(collider) { return false; }
}