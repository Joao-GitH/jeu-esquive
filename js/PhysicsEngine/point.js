/**
 * Represents a 2D point with X and Y coordinates.
 * 
 * Automatically rounds values to one decimal place.
 */
export class Point {
	/** The X coordinate of the point. @type {number} */
	#x;
	/** The Y coordinate of the point. @type {number} */
	#y;
	
	/**
	 * Creates an instance of `Point`.
	 * 
	 * Rounds values to one decimal place to prevent floating-point inaccuracies.
	 * @param {number} x - The X coordinate.
	 * @param {number} y - The Y coordinate.
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/** The X coordinate of the point. */
	get x() { return this.#x; }
	set x(value) { 
		if(value > 0)
			this.#x = Math.floor(value * 10) / 10;
		else
			this.#x = Math.ceil(value * 10) / 10;
	}

	/** The Y coordinate of the point. */
	get y() { return this.#y; }
	set y(value) { 
		if(value > 0)
			this.#y = Math.floor(value * 10) / 10;
		else
			this.#y = Math.ceil(value * 10) / 10;
	}
}
