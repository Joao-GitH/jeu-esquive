export class Vector {

    /**
     * Creates an instance of `Vector`.
     *
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

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
    clone(){
        return new Vector(this.x, this.y)
    }
    
    /**
     * Draws the vector on the canvas
     *
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     */
    draw(ctx, x, y){
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.x * 2, y + this.y * 2);
        ctx.stroke();
        ctx.closePath();
    }
}