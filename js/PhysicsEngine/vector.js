import { Point } from "./PhysicsEngine.js";

export class Vector {
    #point;

    /**
     * Creates an instance of `Vector`.
     *
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    constructor(x, y) {
        this.#point = new Point(x, y);
    }

    get x() { return this.#point.x; }
    set x(value) { this.#point.x = value; }

    get y() { return this.#point.y }
    set y(value) { this.#point.y = value; }

    /**
     * Adds the current vector to another vector.
     *
     * @param {Vector} v - The vector to add.
     */
    add(v) {
        this.x += v.x
        this.y += v.y;
    }

    /**
     * Subtracts another vector from the current vector.
     *
     * @param {Vector} v - The vector to subtract.
     */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    /**
     * Multiplies the vector by a scalar.
     *
     * @param {number} scalar - The scalar value to multiply by.
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * Calculates the magnitude (length) of the vector.
     *
     * @returns {number} The magnitude of the vector.
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalizes the vector (makes its magnitude equal to 1).
     *
     * If the magnitude is zero, sets x and y to 0
     */
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
        }
        this.x /= mag;
        this.y /= mag;
    }

    /** Inverses of the vector (negates both X and Y components). */
    inverse() {
        this.x = -this.x;
        this.y = -this.y;
    }

    /**
     * Converts the vector to a string representation.
     *
     * @returns {string} A string representation of the vector in the format `Vector(x, y)`.
     */
    toString() {
        return `Vector(${this.x}, ${this.y})`;
    }

    /**
     * @returns {Vector} A vector with the same propreties
     */
    clone() {
        return new Vector(this.x, this.y)
    }

    /**
     * Draws the vector on the canvas
     *
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     */
    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.x * 2, y + this.y * 2);
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Adds the current vector to another vector and returns a new vector.
     *
     * @param {Vector} v - The vector to add.
     * @returns {Vector} A new vector with the result of the addition.
     */
    toAdd(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /**
     * Subtracts another vector from the current vector and returns a new vector.
     *
     * @param {Vector} v - The vector to subtract.
     * @returns {Vector} A new vector with the result of the subtraction.
     */
    toSubtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    /**
     * Multiplies the vector by a scalar and returns a new vector.
     *
     * @param {number} scalar - The scalar value to multiply by.
     * @returns {Vector} A new vector with the result of the multiplication.
     */
    toMultiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    /**
     * Normalizes the vector (makes its magnitude equal to 1) and returns a new vector.
     *
     * If the magnitude is zero, sets x and y to 0
     * @returns {Vector} A new normalized vector.
     */
    toNormalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / mag, this.y / mag);
    }

    /** 
     * Returns a new vector that is the inverse (negates both X and Y components).
     * 
     * @returns {Vector} A new vector with the inverse of the current vector.
     */
    toInverse() {
        return new Vector(-this.x, -this.y);
    }
}