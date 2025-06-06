import { Entity } from "./entities.js"
import { Point, RectangleCollider, Vector } from "../PhysicsEngine/PhysicsEngine.js";
import { AnimationManager } from "../utilities/animationManager.js";
import SpriteSheet from "../utilities/spriteSheet.js";
import { Event } from "../PhysicsEngine/PhysicsEngine.js";
import SkillManager from "../skillManager.js";

export class Player extends Entity {
	/** @type {Event<Player, null>} */
	death = new Event();
    /** Creates an instance of Player. */
    constructor() {
		const sources =  [
			new SpriteSheet("img/Player/idle.png", 8, 6),
			new SpriteSheet("img/Player/walk.png", 8, 6),
			new SpriteSheet("img/Player/dash.png", 8, 6)
		]
        super("player", new RectangleCollider(0, 0, 60, 63), new Point(70, 68), sources);
		this.#createAnimations();
		this.dir = "down";
		this.skillManager = new SkillManager();
		document.body.append(this.skillManager.sprite);
		this.animationManager.play("idle-down");
		this.collider.collide.add((c, args) => {
			if(args.collider == this.target)
				this.collider.velocity = new Vector(0, 0);
			else
				this.#ondeath()
		})
    }
	#ondeath = () => {
		this.death.invoke(this);
	}
	#createAnimations(){
		const a = this.animationManager;
		const animations = ["idle", "walk"];
		const directions = ["down", "down-left", "up-left", "up", "up-right", "down-right"];
		for (let i = 0; i < animations.length; i++) {
			const animation = animations[i];
			let j = 0;
			for (const direction of directions) {
				const name = `${animation}-${direction}`;
				a.createAnimation(name, 10, true, j, j + 7, i);
				j += 8;
			}
		}
		a.createAnimation("dash-down", 10, false, 0, 7, 2);
		a.createAnimation("dash-down-left", 10, false, 8, 15, 2);
		a.createAnimation("dash-up-left", 10, false, 16, 23, 2);
		a.createAnimation("dash-up", 10, false, 24, 31, 2);
		a.createAnimation("dash-up-right", 10, false, 32, 39, 2);
		a.createAnimation("dash-down-right", 10, false, 40, 47, 2);
	}

	updateDir(){
		if(this.collider.velocity.x == 0 && this.collider.velocity.y == 0)
			return;
		if(this.collider.velocity.x < 3 && this.collider.velocity.x > -3){
			if(this.collider.velocity.y >= 0)
				this.dir = "down";
			else
				this.dir = "up";
		}
        else if(this.collider.velocity.y >= 0){
			if(this.collider.velocity.x >= 0)
				this.dir = "down-right";
			else
				this.dir = "down-left";
		}
		else if(this.collider.velocity.y < 0){
			if(this.collider.velocity.x >= 0)
				this.dir = "up-right";
			else
				this.dir = "up-left";
		}
	}

	updateAnimation() {
		this.updateDir();
		this.skillManager.sprite.style.top = this.sprite.style.top;
		this.skillManager.sprite.style.left = this.sprite.style.left;
		if(this.speed > 5 && this.collider.velocity.magnitude() > 0)
			this.animationManager.play(`dash-${this.dir}`);
		else if(this.collider.velocity.magnitude() > 0)
		 	this.animationManager.play(`walk-${this.dir}`);
		else
			this.animationManager.play(`idle-${this.dir}`);
	}
}