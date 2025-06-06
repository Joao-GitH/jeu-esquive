import { Event } from "../event.js";
export default class SpriteSheet extends Image{
	/** @type {Event<SpriteSheet, null>} */
	load = new Event();
	constructor(src, hFrames, vFrames) {
		super();
		this.loaded = false;
		this.onload = async () => {
			await this.#drawFrames();
			this.loaded = true;
			this.load.invoke(this);
		}
		this.src = src;
		this.hFrames = hFrames;
		this.vFrames = vFrames;
		this.frames = [];
		this.flippedFrames = [];
	}
	
	/** Extracts frames from the sprite sheet */
	async #drawFrames() {
		this.frames = [];
		this.flippedFrames = [];

		const frameWidth = Math.floor(this.width / this.hFrames);
		const frameHeight = Math.floor(this.height / this.vFrames);

		const canvas = document.createElement("canvas");
		canvas.width = frameWidth;
		canvas.height = frameHeight;
		const ctx = canvas.getContext("2d");

		for (let j = 0; j < this.vFrames; j++) {
			for (let i = 0; i < this.hFrames; i++) {
				const x = i * frameWidth;
				const y = j * frameHeight;

				ctx.clearRect(0, 0, frameWidth, frameHeight);
				ctx.drawImage(
					this,
					x, y, frameWidth, frameHeight,
					0, 0, frameWidth, frameHeight
				);

				const frame = await createImageBitmap(canvas);
				this.frames.push(frame);

				const flipped = await this.#flipBitmap(frame);
				this.flippedFrames.push(flipped);
			}
		}
	}

	/**
	 * Flips an ImageBitmap horizontally
	 * @param {ImageBitmap} frame Original frame
	 * @returns {Promise<ImageBitmap>} Flipped version
	 */
	async #flipBitmap(frame) {
		const canvas = document.createElement("canvas");
		canvas.width = frame.width;
		canvas.height = frame.height;

		const ctx = canvas.getContext("2d");
		ctx.save();
		ctx.scale(-1, 1);
		ctx.drawImage(frame, -frame.width, 0);
		ctx.restore();

		return await createImageBitmap(canvas);
	}
} 