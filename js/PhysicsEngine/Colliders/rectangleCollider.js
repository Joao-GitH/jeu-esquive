import { CircleCollider, Collider, ColliderType, Point } from "../PhysicsEngine.js";

/**
 * Represents a rectangular collider.
 * 
 * Supports collision detection and physics interactions with other colliders.
 */
export class RectangleCollider extends Collider {
	/** The width of the collider. */
	width;
	/** The height of the collider. */
	height;

	/**
	 * Creates an instance of `RectangleCollider`.
	 *
	 * @param {number} x - The X position of the rectangle.
	 * @param {number} y - The Y position of the rectangle.
	 * @param {number} width - The width of the rectangle.
	 * @param {number} height - The height of the rectangle.
	 * @param {ColliderType} [type="static"] - The type of the rectangle.
	 */
	constructor(x, y, width, height, type = ColliderType.static) {
		super(x, y, type);
		this.width = width;
		this.height = height;
	}

	get center() { return new Point(this.x + this.width / 2, this.y + this.height / 2 ); }

	draw() {
		super.draw();
		this.world.ctx.beginPath();
		this.world.ctx.rect(this.x, this.y, this.width, this.height);
		this.world.ctx.strokeStyle = this.color;
		this.world.ctx.stroke();
		this.world.ctx.closePath();
	}
	
	/**
	 * @param {RectangleCollider} collider - The rectangle collider.
	 */
	collidesRectangle(collider) {
		return (
			this.x + this.width >= collider.x &&
			this.x <= collider.x + collider.width &&
			this.y + this.height >= collider.y &&
			this.y <= collider.y + collider.height
		);
	}

	/**
	 * @param {CircleCollider} collider - The circle collider.
	 */
	collidesCircle(collider) {
		const closestX = Math.max(this.x, Math.min(collider.x, this.x + this.width));
		const closestY = Math.max(this.y, Math.min(collider.y, this.y + this.height));
		const dx = closestX - collider.x;
		const dy = closestY - collider.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance <= collider.radius;
	}
}