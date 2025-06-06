import { Event } from "../event.js";
import { SpriteAnimation } from "./spriteAnimation.js";
import SpriteSheet from "./spriteSheet.js";
import { Timer } from "./timer.js";

export class AnimationManager {
	/** @type {SpriteAnimation | null} Currently playing animation */
	#animation;

	/** @type {boolean} Whether the animation is flipped horizontally */
	#flip = false;

	/** @type {boolean} Indicates if all frames are loaded */
	#loaded = false;

	/** @type {Map<string, SpriteAnimation>} Stores animations by name */
	animations;

	/** @type {ImageBitmap[]} Unflipped frames */
	frames;

	/** @type {ImageBitmap[]} Flipped (horizontally mirrored) frames */
	flippedFrames;

	/** @type {ImageBitmap | null} Current frame to render */
	sprite;

	/** @type {Timer} Internal timer for frame switching */
	timer;

	/** @type {Event<AnimationManager>} Triggered when all frames are loaded */
	load = new Event();

	/** @type {Event<AnimationManager>} Triggered when the animation starts */
	start = new Event();

	/** @type {Event<AnimationManager>} Triggered when the animation ends */
	end = new Event();

	/** @type {Event<AnimationManager>} Triggered on each frame update */
	frameChange = new Event();

	/** Whether the animation frames are loaded */
	get loaded() {
		return this.#loaded;
	}

	/** Whether an animation is playing */
	get playing() {
		return this.#animation?.playing ?? false;
	}

	/** The name of the currently playing animation */
	get animation() {
		for (const [key, anim] of this.animations) {
			if (anim === this.#animation) return key;
		}
		return null;
	}

	/** Current frame index in the animation */
	get frame() {
		return this.#animation?.frame ?? 0;
	}
	set frame(value) {
		if (this.#animation) this.#animation.frame = value;
	}

	/** Whether the current sprite should be horizontally flipped */
	get flip() {
		return this.#flip;
	}
	set flip(value) {
		this.#flip = value;
		if(this.animation !== null){
			const frameIndex = this.#animation.frames[this.#animation.frame];
			if(this.#flip)
				this.sprite = this.flippedFrames[frameIndex]
			else 
				this.sprite = this.frames[frameIndex];
			this.onframeChange();
		}
	}

	/**
	 * Creates an instance of AnimationManager.
	 * @param {SpriteSheet[]} spriteSheets Path to the sprite sheet image
	 */
	constructor(spriteSheets) {
		this.animations = new Map();
		this.spriteSheets = spriteSheets;
		this.sprite = null;
		this.#animation = null;

		this.timer = new Timer();
		this.timer.tick.add(this.#onTimerTick);
		for (const spriteSheet of spriteSheets) {
			if(!spriteSheet.loaded){
				spriteSheet.load.add(this.#checkIfLoaded)
			}
		}
		this.#checkIfLoaded();
	}
	#checkIfLoaded = () => {
		for (const spriteSheet of this.spriteSheets) {
			if(!spriteSheet.loaded)
				return false;
		}
		this.#loaded = true;
		this.load.invoke(this);
	}

	/** Internal update function for frame timing */
	#onTimerTick = async () => {
		const frameIndex = this.#animation.frames[this.#animation.frame];
		const anim = this.#animation;
		const spriteSheet = this.spriteSheets[anim.source];
		if(this.#flip)
			this.sprite = spriteSheet.flippedFrames[frameIndex]
		else 
			this.sprite = spriteSheet.frames[frameIndex];

		this.onframeChange();

		anim.frame++;
		if (anim.frame >= anim.frames.length) {
			if (!anim.loop) {
				this.stop();
				return;
			}
			anim.frame = 0;
		}
	};

	/** Triggered when the current frame changes */
	onframeChange() {
		this.frameChange.invoke(this);
	}

	/** Triggered when an animation starts */
	onstart() {
		this.start.invoke(this);
	}

	/** Triggered when an animation ends */
	onend() {
		this.end.invoke(this);
	}

	/**
	 * Creates an animation from a range of frames
	 * @param {string} name Animation name
	 * @param {number} fps Frames per second
	 * @param {boolean} loop Whether it should loop
	 * @param {number} start Start frame index
	 * @param {number} end End frame index
	 * @param {number} source
	 */
	createAnimation(name, fps, loop, start, end, source = 0) {
		const frames = [];
		for (let i = start; i <= end; i++) {
			frames.push(i);
		}
		this.animations.set(name, new SpriteAnimation(fps, loop, frames, source));
	}

	/**
	 * Starts playing the given animation by name
	 * @param {string} name Animation name
	 * @throws {Error} If animation doesn't exist
	 */
	play(name) {
		if (!this.loaded) {
			this.load.clear();
			this.load.add(() => this.play(name));
			return;
		}
		const animation = this.animations.get(name);
		if (!animation)
			throw new Error(`There's no animation with the name: "${name}"`);

		if (this.#animation === animation && this.playing) return;

		animation.frame = 0;
		this.#animation = animation;
		this.#animation.playing = true;

		this.timer.interval = 1000 / animation.fps;
		this.timer.start();
		this.onstart();
	}

	/** Stops the current animation */
	stop() {
		if (this.#animation) {
			this.#animation.frame = 0;
			this.#animation.playing = false;
		}
		this.timer.stop();
		this.onend();
	}

	/**
	 * Gets number of frames in a given animation
	 * @param {string} name Animation name
	 * @returns {number}
	 */
	getFrameCount(name) {
		const animation = this.animations.get(name);
		if (!animation)
			throw new Error(`There's no animation with the name: "${name}"`);
		return animation.frames.length;
	}

	/**
	 * Combines the current animation's frames into a single horizontal sprite sheet.
	 * @param {string} name 
	 * @returns {HTMLImageElement} A new image element containing the combined frames.
	 */
	displayFrames(name) {
		if(!this.loaded){
			this.load.add(() => this.displayFrames(name))
			return;
		}
		const animation = this.animations.get(name);
		const frameIndices = animation.frames;
		const firstFrame = this.frames[frameIndices[0]];
		const frameWidth = firstFrame.width;
		const frameHeight = firstFrame.height;
		const totalFrames = frameIndices.length;

		// Create a canvas to hold the sprite sheet
		const canvas = document.createElement("canvas");
		canvas.width = frameWidth * totalFrames;
		canvas.height = frameHeight;
		const ctx = canvas.getContext("2d");

		// Draw each frame side-by-side
		for (let i = 0; i < totalFrames; i++) {
			const frame = this.frames[frameIndices[i]];
			ctx.drawImage(frame, i * frameWidth, 0);
		}

		// Convert the canvas to an image
		const image = new Image();
		image.src = canvas.toDataURL("image/png");

		return image;
	}

	spriteURL(){
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = this.sprite.width;
		canvas.height = this.sprite.height;
		ctx.drawImage(this.sprite, 0, 0);
		return canvas.toDataURL();
	}
}
