import { Event } from "../event.js";
import { Timer } from "./timer.js";

export class SpriteAnimation {

	
	/**
	 * Creates an instance of SpriteAnimation.
	 *
	 * @constructor
	 * @param {number} fps 
	 * @param {boolean} loop 
	 * @param {number[]} frames 
	 * @param {number} [source=0]
	 */
	constructor(fps, loop, frames, source = 0) {
		this.fps = fps;
		this.loop = loop;
		this.frames = frames;
		this.frame = 0;
		this.source = source;
		this.playing = false;
	}
	
	/**
	 * Clones the current `SpriteAnimation`.
	 * @returns {SpriteAnimation} A new `SpriteAnimation` instance.
	 */
	clone() {
		return new SpriteAnimation(this.fps, this.loop, this.frames, this.source);
	}
}