import { Collider, ColliderType, RectangleCollider } from "../PhysicsEngine.js";

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

    get center() { return {x:this.x, y:this.y} }

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
     * @param {RectangleCollider} rect
     */
    handleRectangleCollision(rect) {
        let closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
        let closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));
    
        let dx = this.x - closestX;
        let dy = this.y - closestY;
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        // If the circle is overlapping the rectangle
        if (distance < this.radius) {
            let angle = Math.atan2(dy, dx);
            let overlap = this.radius - distance;
    
            if (rect.type === ColliderType.dynamic) {
                // If the collision is more along the Y-axis (vertical overlap)
                if (Math.abs(dy) > Math.abs(dx)) {
                    // Resolve collision vertically (along the Y-axis)
                    this.y += Math.sin(angle) * overlap * 0.5;
                    rect.y -= Math.sin(angle) * overlap * 0.5;
    
                    // Transfer Y velocity
                    let totalVelocityY = this.velocity.y + rect.velocity.y;
                    this.velocity.y = totalVelocityY * 0.5;
                    rect.velocity.y = totalVelocityY * 0.5;
                } else {
                    // Resolve collision horizontally (along the X-axis)
                    this.x += Math.cos(angle) * overlap * 0.5;
                    rect.x -= Math.cos(angle) * overlap * 0.5;
    
                    // Transfer X velocity
                    let totalVelocityX = this.velocity.x + rect.velocity.x;
                    this.velocity.x = totalVelocityX * 0.5;
                    rect.velocity.x = totalVelocityX * 0.5;
                }
            } else {
                // Static rectangle: resolve only on Y-axis (if vertical collision)
                if (Math.abs(dy) > Math.abs(dx)) {
                    this.y += Math.sin(angle) * overlap;
                    this.velocity.y = 0;
                    this.y = rect.y - this.radius; // Adjust position to prevent overlap
                }
                // If collision on X-axis, only adjust X-velocity
                else {
                    this.x += Math.cos(angle) * overlap;
                    this.velocity.x = 0;
                }
            }
        }
    }
    
    
    /**
     * @param {CircleCollider} circle
     */
    handleCircleCollision(circle) {
        let dx = this.x - circle.x;
        let dy = this.y - circle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let combinedRadius = this.radius + circle.radius;
    
        // If colliding
        if (distance <= combinedRadius) {
            let overlap = combinedRadius - distance;
            let angle = Math.atan2(dy, dx);
    
            if (circle.type === ColliderType.dynamic) {
                // Move both circles apart equally
                this.x += Math.cos(angle) * overlap * 0.5;
                this.y += Math.sin(angle) * overlap * 0.5;
                circle.x -= Math.cos(angle) * overlap * 0.5;
                circle.y -= Math.sin(angle) * overlap * 0.5;
    
                // Transfer velocity
                let totalVelocityX = this.velocity.x + circle.velocity.x;
                let totalVelocityY = this.velocity.y + circle.velocity.y;
                this.velocity.x = totalVelocityX * 0.5;
                this.velocity.y = totalVelocityY * 0.5;
                circle.velocity.x = totalVelocityX * 0.5;
                circle.velocity.y = totalVelocityY * 0.5;
            } else {
                // Move only this circle if the other one is static
                this.x += Math.cos(angle) * overlap;
                this.y += Math.sin(angle) * overlap;
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }
    }


	/**
	 * @param {RectangleCollider} collider - The rectangle collider.
	 */
	collidesRectangle(collider) {
		const closestX = Math.max(collider.x, Math.min(this.x, collider.x + collider.width));
		const closestY = Math.max(collider.y, Math.min(this.y, collider.y + collider.height));
		const dx = this.x - closestX;
		const dy = this.y - closestY;
		return dx * dx + dy * dy <= this.radius * this.radius;}

	/**
	 * @param {CircleCollider} collider - The circle collider.
	 */
	collidesCircle(collider) { 
        return this.distance(collider) <= this.radius + collider.radius;
    }
}