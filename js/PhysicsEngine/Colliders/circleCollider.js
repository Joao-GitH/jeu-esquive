import { Collider, ColliderType, Point, RectangleCollider } from "../PhysicsEngine.js";

/**
 * Represents a circular collider.
 * 
 * Supports collision detection and physics interactions with other colliders.
 */
export class CircleCollider extends Collider {

    /** The radius of the collider. */
    radius;
    /**
     * Creates an instance of `CircleCollider`.
     *
     * @param {number} x - The X position of the circle.
     * @param {number} y - The Y position of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {ColliderType} [type=ColliderType.static] - The type of the collider.
     */
    constructor(x, y, radius, type = ColliderType.static) {
        super(x, y, type);
        this.radius = radius;
    }

    get center() { return new Point(this.x, this.y); }

    draw() {
        super.draw();
        const ctx = this.world.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }

	/**
	 * @param {RectangleCollider} collider - The rectangle collider.
	 */
	collidesRectangle(collider) {
		const closestX = Math.max(collider.x, Math.min(this.x, collider.x + collider.width));
		const closestY = Math.max(collider.y, Math.min(this.y, collider.y + collider.height));
        const dx = closestX - this.x;
		const dy = closestY - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance <= this.radius;
    }
    
	/**
	 * @param {CircleCollider} collider - The circle collider.
	 */
	collidesCircle(collider) { 
        return this.distance(collider) <= this.radius + collider.radius;
    }
}