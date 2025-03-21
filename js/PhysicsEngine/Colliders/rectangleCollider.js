import { CircleCollider, Collider, ColliderType } from "../PhysicsEngine.js";

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

	get center() { return { x: this.x + this.width / 2, y: this.y + this.height / 2 } }

	draw() {
		super.draw();
		this.world.ctx.beginPath();
		this.world.ctx.rect(this.x, this.y, this.width, this.height);
		this.world.ctx.strokeStyle = this.color;
		this.world.ctx.stroke();
		this.world.ctx.closePath();
	}

	/**
	 * @param {RectangleCollider} rect - The other rectangle collider.
	 */
	handleRectangleCollision(rect) {
		let dx = (this.x + this.width / 2) - (rect.x + rect.width / 2);
		let dy = (this.y + this.height / 2) - (rect.y + rect.height / 2);

		let combinedHalfWidth = (this.width + rect.width) / 2;
		let combinedHalfHeight = (this.height + rect.height) / 2;

		if (Math.abs(dx) < combinedHalfWidth && Math.abs(dy) < combinedHalfHeight) {
			let overlapX = combinedHalfWidth - Math.abs(dx);
			let overlapY = combinedHalfHeight - Math.abs(dy);

			// Determine which axis to resolve on
			if (overlapX < overlapY) {
				let pushAmount = dx > 0 ? overlapX : -overlapX;

				if (rect.type === ColliderType.dynamic) {
					// Transfer some velocity instead of stopping completely
					let totalVelocity = this.velocity.x + rect.velocity.x;
					this.velocity.x = totalVelocity * 0.5;  // Split momentum
					rect.velocity.x = totalVelocity * 0.5;

					this.x += pushAmount / 2;
					rect.x -= pushAmount / 2;
				} else {
					this.x += pushAmount;
					this.velocity.x = 0;
				}
			} else {
				let pushAmount = dy > 0 ? overlapY : -overlapY;

				if (rect.type === ColliderType.dynamic) {
					let totalVelocity = this.velocity.y + rect.velocity.y;
					this.velocity.y = totalVelocity * 0.5;
					rect.velocity.y = totalVelocity * 0.5;

					this.y += pushAmount / 2;
					rect.y -= pushAmount / 2;
				} else {
					this.y += pushAmount;
					this.velocity.y = 0;
				}
			}
		}
	}


	/**
	 * @param {CircleCollider} circle - The circle collider.
	 */
	handleCircleCollision(circle) {
		// Find the closest point on the rectangle to the circle's center
		let closestX = Math.max(this.x, Math.min(circle.x, this.x + this.width));
		let closestY = Math.max(this.y, Math.min(circle.y, this.y + this.height));

		// Calculate the distance from the circle's center to the closest point
		let dx = closestX - circle.x;
		let dy = closestY - circle.y;
		let distance = Math.sqrt(dx * dx + dy * dy);

		// If the distance is less than the circle's radius, we have a collision
		if (distance < circle.radius) {
			let overlap = circle.radius - distance;

			// Find the angle of the collision
			let angle = Math.atan2(dy, dx);
			let pushX = Math.cos(angle) * overlap;
			let pushY = Math.sin(angle) * overlap;

			if (circle.type === ColliderType.dynamic) {
				// Preserve momentum and split movement between both objects
				let totalVelocityX = this.velocity.x + circle.velocity.x;
				let totalVelocityY = this.velocity.y + circle.velocity.y;

				this.velocity.x = totalVelocityX * 0.5;
				this.velocity.y = totalVelocityY * 0.5;

				circle.velocity.x = totalVelocityX * 0.5;
				circle.velocity.y = totalVelocityY * 0.5;

				this.x += pushX / 2;
				this.y += pushY / 2;
				circle.x -= pushX / 2;
				circle.y -= pushY / 2;
			} else {
				// Static circle - only move the rectangle
				this.x += pushX;
				this.y += pushY;
				this.velocity.x = 0;
				this.velocity.y = 0;
			}
		}
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
		const dx = collider.x - closestX;
		const dy = collider.y - closestY;
		return dx * dx + dy * dy <= collider.radius * collider.radius;
	}
}