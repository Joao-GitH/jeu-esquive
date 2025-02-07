import { Animation } from "../animation.js"
export class AnimationStorage{
	static walkDown = new Animation("img/Player/Walk/down.png", 8);
	static walkLeftDown = new Animation("img/Player/Walk/left_down.png", 8);
	static walkLeft = new Animation("img/Player/Walk/left.png", 8);
	static walkLeftUp = new Animation("img/Player/Walk/left_up.png", 8);
	static walkUp = new Animation("img/Player/Walk/up.png", 8);
	static walkRightUp = new Animation("img/Player/Walk/right_up.png", 8);
	static walkRight = new Animation("img/Player/Walk/right.png", 8);
	static walkRightDown = new Animation("img/Player/Walk/right_down.png", 8);

	static deathDown = new Animation("img/Player/Death/down.png", 8);
	static deathLeftDown = new Animation("img/Player/Death/left_down.png", 8);
	static deathLeft = new Animation("img/Player/Death/left.png", 8);
	static deathLeftUp = new Animation("img/Player/Death/left_up.png", 8);
	static deathUp = new Animation("img/Player/Death/up.png", 8);
	static deathRightUp = new Animation("img/Player/Death/right_up.png", 8);
	static deathRight = new Animation("img/Player/Death/right.png", 8);
	static deathRightDown = new Animation("img/Player/Death/right_down.png", 8);

	static idleDown = new Animation("img/Player/Idle/down.png", 8);
	static idleLeftDown = new Animation("img/Player/Idle/left_down.png", 8);
	static idleLeft = new Animation("img/Player/Idle/left.png", 8);
	static idleLeftUp = new Animation("img/Player/Idle/left_up.png", 8);
	static idleUp = new Animation("img/Player/Idle/up.png", 8);
	static idleRightUp = new Animation("img/Player/Idle/right_up.png", 8);
	static idleRight = new Animation("img/Player/Idle/right.png", 8);
	static idleRightDown = new Animation("img/Player/Idle/right_down.png", 8);

	static fireball = new Animation("img/fireballSpritesheet.png", 6);
}