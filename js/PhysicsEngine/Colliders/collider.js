import { Vector, ColliderType, CircleCollider, RectangleCollider, PhysicsWorld, Event, Point } from "../PhysicsEngine.js";

/**
 * Represents a base collider in the physics engine.
 * 
 * Handles position, collision events, and physics interactions.
 */
export class Collider {
	/** The position of the collider stored as a Point object. */
	#point;
	/** The color of the collider's border. */
	color;
	/** The velocity of the collider. */
	velocity;
	/** The world the collider belongs to. @type {PhysicsWorld} */
	world;
	/** The class name of the collider. */
	classList;
	/** The type of the collider. */
	type;
	/** Event triggered when a collision occurs. @type {Event<Collider, {collider:Collider}>} */
	collide;
	/** Tracks colliders currently in contact. @type {Collider[]} */
	#collided;

	/** The X position of the collider. */
	get x() { return this.#point.x; }
	set x(value) { this.#point.x = value; }

	/** The Y position of the collider. */
	get y() { return this.#point.y; }
	set y(value) { this.#point.y = value; }

	/** 
	 * Center point of the collider.
	 * 
	 * @type {Point} 
	 * @readonly
	 */
	get center() { return null }


	/**
	 * Creates an instance of `Collider`.
	 * 
	 * @param {number} x - The X position of the collider.
	 * @param {number} y - The Y position of the collider.
	 * @param {ColliderType} [type=ColliderType.static] - The type of the collider.
	 */
	constructor(x, y, type = ColliderType.static) {
		this.#point = new Point(x, y);
		this.color = "rgb(255, 0, 0)";
		this.velocity = new Vector(0, 0);
		this.classList = [];
		this.collide = new Event();
		this.type = type;
		this.#collided = [];
	}

	/**
	 * Gets all colliders currently touching this collider.
	 * 
	 * @returns {Collider[]}
	 * @readonly
	 */
	get neighbors() {
		// Returns all colliders that are touching this collider but excludes itself
		return this.world.colliders.filter((c) => c !== this && this.collides(c))
	}

	/**
	 * Called when this collider collides with another collider.
	 *
	 * @param {Collider} collider - The collider that this object has collided with.
	 */
	oncollide(collider) {
		if (!this.#collided.includes(collider)) // Avoid duplicate entries
			this.#collided.push(collider);
		this.collide.invoke(this, { collider: collider });
	}

	/** Updates the collider's position applying gravity, collisions, and friction. */
	update() {
		this.#filterCollidedColliders(); // Remove stale collisions
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
			this.applyCollisions();
		}
		else{
			for (const collider of this.neighbors) {
				this.oncollide(collider);
			}
		}
	}

	/** Draws the collider on the canvas. */
	draw() {
		this.velocity.draw(this.world.ctx, this.center.x, this.center.y);
	}

	/** Applies gravity to the collider if it is dynamic. @protected */
	applyGravity() {
		if (this.type === ColliderType.dynamic) {
			const isTouchingGround = this.neighbors.some(neighbor => neighbor.y > this.y && this.collides(neighbor));

			// If not touching the ground, apply gravity
			if (!isTouchingGround) {
				this.velocity.add(this.world.gravity);
			}
		}
	}

	/** Applies friction to slow down the collider. @protected */
	applyFriction() {
		const friction = this.world.friction;

		// Apply friction to both X and Y velocities
		if (Math.abs(this.velocity.x) > 0.1) {
			this.velocity.x *= friction.x; // Reduce X velocity gradually
		}
		else {
			this.velocity.x = 0; // Stop X movement if very small velocity
		}

		if (Math.abs(this.velocity.y) > 0.1) {
			this.velocity.y *= friction.y; // Reduce Y velocity gradually
		}
		else {
			this.velocity.y = 0; // Stop Y movement if very small velocity
		}
	}

	/** Handles collisions with other colliders. @protected */
	applyCollisions() {
		for (const collider of this.neighbors) {
			if (!this.#collided.includes(collider)) // Avoid duplicate collision handling
				this.oncollide(collider);

			// Ignore collisions with transparent colliders
			if (collider.type !== ColliderType.transparent) {
				if (collider instanceof RectangleCollider) {
					this.handleRectangleCollision(collider);
				}
				if (collider instanceof CircleCollider) {
					this.handleCircleCollision(collider);
				}
			}
		}
	}

	/**
	 * Removes colliders from the collision list if they are no longer colliding.
	 * 
	 * This ensures that a collider is only stored in `#collided` while it's in contact.
	 */
	#filterCollidedColliders() {
		this.#collided = this.#collided.filter(c => this.collides(c));
	}

	/**
	 * Handles collision with a rectangle collider.
	 * 
	 * @param {RectangleCollider} rect - The rectangle collider.
	 * @protected
	 */
	handleRectangleCollision(rect) {
		if (this instanceof CircleCollider) {
			this.#rectangleCircleCollision(rect, this)
		}
		else if (this instanceof RectangleCollider) {
			this.#rectanglesCollision(rect, this);
		}
	}

	/**
	 * Handles collision with another circle collider.
	 * 
	 * @param {CircleCollider} cir - The other circle collider.
	 * @protected
	 */
	handleCircleCollision(cir) {
		if(this instanceof RectangleCollider){
			this.#rectangleCircleCollision(this, cir);
		}
		else if(this instanceof CircleCollider){
			this.#circlesCollision(this, cir)
		}
	}

	/** 
	 * @param {RectangleCollider} rect - The rectangle collider. 
	 * @param {RectangleCollider} rect2 - The rectangle collider. 
	 */
	#rectanglesCollision(rect, rect2) {
		let dx = (rect2.x + rect2.width / 2) - (rect.x + rect.width / 2);
		let dy = (rect2.y + rect2.height / 2) - (rect.y + rect.height / 2);

		let combinedHalfWidth = (rect2.width + rect.width) / 2;
		let combinedHalfHeight = (rect2.height + rect.height) / 2;

		if (Math.abs(dx) < combinedHalfWidth && Math.abs(dy) < combinedHalfHeight) {
			let overlapX = combinedHalfWidth - Math.abs(dx);
			let overlapY = combinedHalfHeight - Math.abs(dy);

			// Determine which axis to resolve on
			if (overlapX < overlapY) {
				let pushAmount = dx > 0 ? overlapX : -overlapX;

				if (rect.type === ColliderType.dynamic) {
					// Transfer some velocity instead of stopping completely
					let totalVelocity = rect2.velocity.x + rect.velocity.x;
					rect2.velocity.x = totalVelocity * 0.5;  // Split momentum
					rect.velocity.x = totalVelocity * 0.5;

					rect2.x += pushAmount / 2;
					rect.x -= pushAmount / 2;
				} else {
					rect2.x += pushAmount;
					rect2.velocity.x = 0;
				}
			} else {
				let pushAmount = dy > 0 ? overlapY : -overlapY;

				if (rect.type === ColliderType.dynamic) {
					let totalVelocity = rect2.velocity.y + rect.velocity.y;
					rect2.velocity.y = totalVelocity * 0.5;
					rect.velocity.y = totalVelocity * 0.5;

					rect2.y += pushAmount / 2;
					rect.y -= pushAmount / 2;
				} else {
					rect2.y += pushAmount;
					rect2.velocity.y = 0;
				}
			}
		}
	}

	/**
	* @param {RectangleCollider} rect - The rectangle collider.
	* @param {CircleCollider} cir - The other circle collider.
	*/
	#rectangleCircleCollision(rect, cir) {
		let closestX = Math.max(rect.x, Math.min(cir.x, rect.x + rect.width));
		let closestY = Math.max(rect.y, Math.min(cir.y, rect.y + rect.height));

		let dx = cir.x - closestX;
		let dy = cir.y - closestY;
		let distance = Math.sqrt(dx * dx + dy * dy);

		// If the circle is overlapping the rectangle
		if (distance < cir.radius) {
			let angle = Math.atan2(dy, dx);
			let overlap = cir.radius - distance;

			if (rect.type === ColliderType.dynamic) {
				// If the collision is more along the Y-axis (vertical overlap)
				if (Math.abs(dy) > Math.abs(dx)) {
					// Resolve collision vertically (along the Y-axis)
					cir.y += Math.sin(angle) * overlap / 2;
					rect.y -= Math.sin(angle) * overlap / 2;

					// Transfer Y velocity
					let totalVelocityY = cir.velocity.y + rect.velocity.y;
					cir.velocity.y = totalVelocityY / 2;
					rect.velocity.y = totalVelocityY / 2;
				} else {
					// Resolve collision horizontally (along the X-axis)
					cir.x += Math.cos(angle) * overlap / 2;
					rect.x -= Math.cos(angle) * overlap / 2;

					// Transfer X velocity
					let totalVelocityX = cir.velocity.x + rect.velocity.x;
					cir.velocity.x = totalVelocityX / 2;
					rect.velocity.x = totalVelocityX / 2;
				}
			} else {
				// Static rectangle: resolve only on Y-axis (if vertical collision)
				if (Math.abs(dy) > Math.abs(dx)) {
					cir.y += Math.sin(angle) * overlap;
					cir.velocity.y = 0;
					cir.y = rect.y - cir.radius; // Adjust position to prevent overlap
				}
				// If collision on X-axis, only adjust X-velocity
				else {
					cir.x += Math.cos(angle) * overlap;
					cir.velocity.x = 0;
				}
			}
		}
	}
	
    /**
     * @param {CircleCollider} cir1
     * @param {CircleCollider} cir2
     */
	#circlesCollision(cir1, cir2){
		let dx = cir1.x - cir2.x;
        let dy = cir1.y - cir2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let combinedRadius = cir1.radius + cir2.radius;
    
        // If colliding
        if (distance <= combinedRadius) {
            let overlap = combinedRadius - distance;
            let angle = Math.atan2(dy, dx);
    
            if (cir2.type === ColliderType.dynamic) {
                // Move both circles apart equally
                cir1.x += Math.cos(angle) * overlap / 2;
                cir1.y += Math.sin(angle) * overlap / 2;
                cir2.x -= Math.cos(angle) * overlap / 2;
                cir2.y -= Math.sin(angle) * overlap / 2;
    
                // Transfer velocity
                let totalVelocityX = cir1.velocity.x + cir2.velocity.x;
                let totalVelocityY = cir1.velocity.y + cir2.velocity.y;
                cir1.velocity.x = totalVelocityX / 2;
                cir1.velocity.y = totalVelocityY / 2;
                cir2.velocity.x = totalVelocityX / 2;
                cir2.velocity.y = totalVelocityY / 2;
            } else {
                // Move only cir1 circle if the other one is static
                cir1.x += Math.cos(angle) * overlap;
                cir1.y += Math.sin(angle) * overlap;
                cir1.velocity.x = 0;
                cir1.velocity.y = 0;
            }
        }
	}

	/**
	 * Calculates the Euclidean distance between this collider and another collider.
	 *
	 * @param {Collider} collider - The collider to measure distance from.
	 * @returns {number} The distance between the two colliders.
	 */
	distance(collider) {
		return Math.sqrt((this.x - collider.x) ** 2 + (this.y - collider.y) ** 2);
	}

	/**
	 * Checks if this collider collides with another collider.
	 * 
	 * Supports both rectangle and circle colliders.
	 *
	 * @param {Collider} collider
	 * @returns {boolean} `true` if they collide, otherwise `false`.
	 */
	collides(collider) {
		if (collider instanceof RectangleCollider) {
			return this.collidesRectangle(collider);
		}
		if (collider instanceof CircleCollider) {
			return this.collidesCircle(collider);
		}
		if (this instanceof RectangleCollider && collider instanceof RectangleCollider) {
			// AABB (Axis-Aligned Bounding Box) collision detection
			return (
				this.x + this.width >= collider.x &&
				this.x <= collider.x + collider.width &&
				this.y + this.height >= collider.y &&
				this.y <= collider.y + collider.height
			);
		}
		throw new Error("Unsupported collider types.");
	}

	/**
	 * Checks if this collider collides with a rectangle.
	 * 
	 * Must be overridden in subclasses.
	 *
	 * @protected
	 * @param {RectangleCollider} collider - The rectangle collider.
	 * @returns {boolean} `true` if colliding.
	 */
	collidesRectangle(collider) { return false; }

	/**
	 * Checks if this collider collides with a circle.
	 * Must be overridden in subclasses.
	 *
	 * @protected
	 * @param {CircleCollider} collider - The circle collider.
	 * @returns {boolean} `true` if colliding.
	 */
	collidesCircle(collider) { return false; }


}