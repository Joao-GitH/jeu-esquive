import { AnimationManager } from "./utilities/animationManager.js";
import SpriteSheet from "./utilities/spriteSheet.js";

export default class SkillManager {
	constructor() {
		this.sprite = new Image();
		this.animationManager = new AnimationManager([
			new SpriteSheet("img/Skills/defend.png", 11, 1),
			new SpriteSheet("img/Skills/flash.png", 11, 1),
		])
		this.sprite.id = "skill-sprite";
		this.animationManager.createAnimation("defend", 10, true, 0, 7);
		this.animationManager.createAnimation("flash", 10, false, 0, 8, 1);
		this.animationManager.frameChange.add(o => this.sprite.src = o.spriteURL());
		this.animationManager.end.add(() => this.sprite.src = new Image().src)
	}
}