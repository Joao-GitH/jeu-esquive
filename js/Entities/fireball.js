import { Entity } from "./entities.js"
import { Collider, Point, RectangleCollider } from "../PhysicsEngine/PhysicsEngine.js";
import SpriteSheet from "../utilities/spriteSheet.js";
export class Fireball extends Entity {

    constructor(){
		super("fireball", new RectangleCollider(0, 0, 40, 40), new Point(117, 129), [new SpriteSheet("img/fireball.png", 4, 1)]);
		this.animationManager.createAnimation("idle", 10, true, 0, 3);
		this.animationManager.play("idle");
		this.animationManager.flip = true;
		this.sprite.classList.add("boule");
		const position = this.#generatePosition();
		this.collider.x = position.x;
		this.collider.y = position.y;

	}
	#generatePosition() {
		let choixPosition = Math.floor(Math.random() * 2);
		if (choixPosition === 1) {
			let positionX = Math.floor(Math.random() * screen.width);
			if (positionX > screen.width - 150) {
				let positionY = Math.floor(Math.random() * screen.height);
				return new Point(positionX, positionY);
			}
			let choixPositionY = Math.floor(Math.random() * 2);
			let positionY = choixPositionY === 1 ? screen.height : 1;
			return new Point(positionX, positionY);
		} else {
			let positionY = Math.floor(Math.random() * screen.height);
			let choixPositionX = Math.floor(Math.random() * 2);
			let positionX = choixPositionX === 1 ? screen.width : 1;
			return new Point(positionX, positionY);
		}
	}
	setTargetToPlayer(player) {
		this.target.x = player.collider.center.x;
		this.target.y = player.collider.center.y;
		this.setVelocityToTarget();
		this.sprite.style.transform = `rotate(${this.#angleToTarget()}deg)`;
	}
	#angleToTarget() {
		const deltaX = this.target.x - this.collider.x;
		const deltaY = this.target.y - this.collider.y;
		const angleRadians = Math.atan2(deltaY, deltaX);
		const angleDegrees = angleRadians * (180 / Math.PI);
		return angleDegrees + 90;
	}


        
}
