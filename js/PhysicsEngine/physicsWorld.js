import { Vector, RectangleCollider, CircleCollider, Collider, ColliderType } from "./PhysicsEngine.js";

export class PhysicsWorld {
	/** @type {Collider[]} All colliders present in the world. */
	colliders;
	/** The gravitational force vector in the world. */
	gravity;
	/** The 2D rendering context for the canvas. */
	ctx;
	/** The friction factor */
	friction;

	/**
	 * Creates an instance of the `PhysicsWorld` class.
	 *
	 * @param {CanvasRenderingContext2D} ctx - The context 2d of the canvas where the world is drawn.
	 * @param {number | Vector} [gravity=0] - The gravitational force in the world. Can be a scalar or a `Vector`.
	 */
	constructor(ctx, gravity = 0) {
		this.ctx = ctx;
		this.colliders = [];
		this.gravity = gravity instanceof Vector ? gravity : new Vector(0, gravity);
		this.friction = new Vector(0.9, 1);
	}

	/** Updates all colliders in the world. */
	update() {
		for (const collider of this.colliders) {
			collider.update();
		}
	}

	/** Draws all colliders in the world. */
	draw() {
		for (const collider of this.colliders) {
			collider.draw();
		}
	}

	/**
	 * Adds one or more colliders to the world.
	 *
	 * @param {...Collider} colliders - The colliders to add.
	 */
	addColliders(...colliders) {
		for (const collider of colliders) {
			collider.world = this;
			this.colliders.push(collider);
		}
	}

	/**
	 * Removes a collider from the world.
	 *
	 * @param {...Collider} colliders - The colliders to remove.
	 */
	removeCollider(...colliders) {
		this.colliders = this.colliders.filter((col) => !colliders.includes(col));
	}

	/**
	 * Finds all colliders within a circular area.
	 *
	 * @param {number} x - The X-coordinate of the circle's center.
	 * @param {number} y - The Y-coordinate of the circle's center.
	 * @param {number} radius - The radius of the circle.
	 * @param {string} [className=""] - The class name to filter the results.
	 * @returns {Collider[]} An array of colliders within the area.
	 */
	queryCircleArea(x, y, radius, className = "") {
		const tmpCollider = new CircleCollider(x, y, radius);
		return this.#queryArea(tmpCollider, className);
	}

	/**
	 * Finds all colliders within a rectangular area.
	 *
	 * @param {number} x - The X-coordinate of the rectangle's top-left corner.
	 * @param {number} y - The Y-coordinate of the rectangle's top-left corner.
	 * @param {number} width - The width of the rectangle.
	 * @param {number} height - The height of the rectangle.
	 * @param {string} [className=""] - The class name to filter the results.
	 * @returns {Collider[]} An array of colliders within the area.
	 */
	queryRectangleArea(x, y, width, height, className = "") {
		const tmpCollider = new RectangleCollider(x, y, width, height);
		return this.#queryArea(tmpCollider, className);
	}

	/**
	 * Finds all colliders of a specific type.
	 *
	 * @param {ColliderType} type - The type of collider to find.
	 * @returns {Collider[]} An array of colliders of the specified type.
	 */
	queryAreaTypes(type) {
		return this.colliders.filter((collider) => collider.type === type);
	}

	/**
	 * Calculates the distance between two points.
	 *
	 * @param {number} x1 - The X-coordinate of the first point.
	 * @param {number} y1 - The Y-coordinate of the first point.
	 * @param {number} x2 - The X-coordinate of the second point.
	 * @param {number} y2 - The Y-coordinate of the second point.
	 * @returns {number} The distance between the two points.
	 */
	distance(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}

	/**
	 * Queries a temporary collider area for matching colliders.
	 *
	 * @param {Collider} tmpCollider - The temporary collider to query.
	 * @param {string} className - The class name to filter the results.
	 * @returns {Collider[]} An array of colliders matching the query.
	 */
	#queryArea(tmpCollider, className) {
		const foundColliders = this.colliders.filter((c) => tmpCollider.collides(c) && (className === "" || c.classList.includes(className)));
		return foundColliders;
	}
}