import { Animation } from "../animation.js"
export class AnimationStorage{
	static walkDown = new Animation("img/Player/Walk/down.png", 8);
	static walkDownRight = new Animation("img/Player/Walk/right_down.png", 8);
	static walkDownLeft = new Animation("img/Player/Walk/left_down.png", 8);
	static walkUp = new Animation("img/Player/Walk/up.png", 8);
	static walkUpRight = new Animation("img/Player/Walk/right_up.png", 8);
	static walkUpLeft = new Animation("img/Player/Walk/left_up.png", 8);

	static deathDown = new Animation("img/Player/Death/down.png", 8);
	static deathDownLeft = new Animation("img/Player/Death/left_down.png", 8);
	static deathUpLeft = new Animation("img/Player/Death/left_up.png", 8);
	static deathUp = new Animation("img/Player/Death/up.png", 8);
	static deathUpRight = new Animation("img/Player/Death/right_up.png", 8);
	static deathDownRight = new Animation("img/Player/Death/right_down.png", 8);

	static idleDown = new Animation("img/Player/Idle/down.png", 8);
	static idleDownLeft = new Animation("img/Player/Idle/left_down.png", 8);
	static idleUpLeft = new Animation("img/Player/Idle/left_up.png", 8);
	static idleUp = new Animation("img/Player/Idle/up.png", 8);
	static idleUpRight = new Animation("img/Player/Idle/right_up.png", 8);
	static idleDownRight = new Animation("img/Player/Idle/right_down.png", 8);

	static fireball = new Animation("img/Fireball/idle.png", 4);
}