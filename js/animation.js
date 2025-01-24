import { Timer } from "./utilities/timer.js";
import { EventHandler, EventArgs } from "./utilities/event.js";
export class Animation {
	/** @type {HTMLImageElement} */
	#spriteSheet;
	/** @type {HTMLImageElement} */
	#currentFrame;
	/** @type {number} */
	#nbrFrames;
	/** @type {boolean} */
	#loop;
	/** @type {number} */
	#frameIndex;
	/** @type {Timer} */
	#timer;
	/** @type {boolean} */
	#flip;
	/** @type {HTMLImageElement[]} */
	#frames = [];
	/** @type {boolean} */
	#cancelable;

	/** @type {EventHandler} Event handler for frame changes. */
	frameChange = new EventHandler();
	/**  @type {EventHandler} Event handler for animation completion. */
	finish = new EventHandler();

	load = new EventHandler();

	/** The sprite sheet for the animation. */
	get spriteSheet() { return this.#spriteSheet; }
	set spriteSheet(value) { this.#spriteSheet = value; }

	/** The current animation frame as an image. */
	get currentFrame() { return this.#currentFrame; }
	set currentFrame(value) { this.#currentFrame = value; }

	/** Total number of frames in the animation. */
	get nbrFrames() { return this.#nbrFrames; }
	set nbrFrames(value) { this.#nbrFrames = value; }

	/** Interval (in milliseconds) between frame changes. */
	get interval() { return this.#timer.interval; }
	set interval(value) { this.#timer.interval = value; }

	/** Whether the animation loops. */
	get loop() { return this.#loop; }
	set loop(value) { this.#loop = value; }

	/** Current frame index in the animation. */
	get frameIndex() { return this.#frameIndex; }
	set frameIndex(value) { this.#frameIndex = value; }

	/** Whether the animation is currently playing. */
	get playing() { return this.#timer.ticking; }

	/** Whether the frames should be flipped horizontally. */
	get flip() { return this.#flip; }
	set flip(value) { this.#flip = value; }

	/** Whether the animation is cancelable. */
	get cancelable() { return this.#cancelable; }
	set cancelable(value) { this.#cancelable = value; }

	/**
	 * Creates a new `Animation` instance.
	 *
	 * @param {string} spriteSheetFile - The sprite sheet source file.
	 * @param {number} nbrFrames - Total number of frames in the animation.
	 * @param {boolean} [loop=true] - Whether the animation should loop.
	 * @param {number} [interval=150] - Frame interval in milliseconds.
	 * @param {boolean} [flip=false] - Whether frames should be flipped.
	 * @param {boolean} [cancelable=true] - Whether the animation is cancelable.
	 */
	constructor(spriteSheetFile, nbrFrames, loop = true, interval = 120, flip = false, cancelable = true) {
		this.spriteSheet = new Image();
		this.currentFrame = new Image();
		this.nbrFrames = nbrFrames;
		this.frameIndex = 0;
		this.loop = loop;
		this.flip = flip;
		this.cancelable = cancelable;

		this.#timer = new Timer(interval);
		this.#timer.tick.add(this.#timerTick);
		this.spriteSheet.crossOrigin = "anonymous";
		this.spriteSheet.src = spriteSheetFile;
		this.spriteSheet.addEventListener("load", () => { this.#drawFrames() });
	}

	/** Starts the animation. */
	start() { this.#timer.start(); }

	/** Stops the animation and invokes the finish event. */
	stop() {
		if (this.cancelable || this.frameIndex === this.nbrFrames - 1) {
			this.#timer.stop();
			this.#onFinish();
		}
	}

	/**
	 * Clones the current `Animation`.
	 * @returns {Animation} A new `Animation` instance.
	 */
	clone() {
		return new Animation(this.spriteSheet.src, this.nbrFrames, this.loop, this.interval, this.flip, this.cancelable);
	}

	/** Handles timer ticks for frame updates. */
	#timerTick = () => {
		if (this.#frames.length === this.nbrFrames) {
			if (!this.loop && this.frameIndex === this.nbrFrames - 1)
				this.stop();
			this.currentFrame.src = this.#frames[this.frameIndex].src;
			this.currentFrame.onload = () => {
				this.#updateFrameIndex();
				this.#onFrameChange();
			}
		}
	};

	/** Triggers the frame change event. */
	#onFrameChange() {
		this.frameChange.invoke(this, EventArgs.empty);
	}

	/** Triggers the animation finish event. */
	#onFinish() {
		this.finish.invoke(this, EventArgs.empty);
	}

	/** Draws frames from the sprite sheet. */
	async #drawFrames() {
		const frameWidth = Math.floor(this.spriteSheet.width / this.nbrFrames);
		const frameHeight = Math.floor(this.spriteSheet.height);

		this.#frames = [];
		const offscreenCanvas = document.createElement("canvas");
		offscreenCanvas.width = frameWidth;
		offscreenCanvas.height = frameHeight;
		const ctx = offscreenCanvas.getContext("2d");

		const loadFramesPromise = new Promise((resolve) => {
			let nbRemainingLoaded = this.nbrFrames;
			for (let i = 0; i < this.nbrFrames; i++) {
				ctx.clearRect(0, 0, frameWidth, frameHeight);
				const sourceX = i * frameWidth;

				ctx.drawImage(this.spriteSheet, sourceX, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

				const frameImage = new Image();
				frameImage.onload = () => {
					this.#frames.push(frameImage);

					nbRemainingLoaded--;
					if (nbRemainingLoaded == 0) {
						resolve();
					}
				}
				frameImage.src = offscreenCanvas.toDataURL();
			}
		});

		await loadFramesPromise;

		if (this.flip) {
			this.#frames = this.#frames.map(frame => {
				const flippedSrc = this.#flipFrame(frame.src);
				const flippedImage = new Image();
				flippedImage.src = flippedSrc;
				return flippedImage;
			});
		}
	}

	/** Updates the frame index. */
	#updateFrameIndex() {
		this.frameIndex++;
		if (this.frameIndex >= this.nbrFrames) this.frameIndex = 0;
	}

	/**
	 * Flips a frame horizontally.
	 * @param {string} source - The frame's source data URL.
	 * @returns {string} The flipped frame's data URL.
	 */
	#flipFrame(source) {
		const img = new Image();
		img.src = source;

		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		const ctx = canvas.getContext("2d");
		ctx.translate(img.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(img, 0, 0);

		return canvas.toDataURL();
	}
}
