import { Event } from "./PhysicsEngine/PhysicsEngine.js";
import { Timer } from "./utilities/timer.js";

export class Animation {
    /** @type {HTMLImageElement} */
    #spriteSheet;
    /** @type {HTMLImageElement} */
    #currentFrame;
    /** @type {number} */
    #nbrFrames;

    /** Whether the animation loops. */
    loop;
    /** Current frame index in the animation. */
    frameIndex;
    /** @type {Timer} */
    #timer;
    /** Whether the frames should be flipped horizontally. */
    flip;
    /** @type {HTMLImageElement[]} */
    #frames = [];
    /** @type {HTMLImageElement[]} */
    #flippedFrames = [];
    /** Whether the animation is cancelable. */
    cancelable;

    /** @type {Event<Animation, null>} Event handler for frame changes. */
    frameChange = new Event();
    /**  @type {Event<Animation, null>} Event handler for animation completion. */
    finish = new Event();

    load = new Event();

    /** The sprite sheet for the animation. */
    get spriteSheet() { return this.#spriteSheet; }
    set spriteSheet(value) { this.#spriteSheet = value; }

    /** The current animation frame as an image. @readonly*/
    get currentFrame() { return this.#currentFrame; }

    /** Total number of frames in the animation. */
    get nbrFrames() { return this.#nbrFrames; }
    set nbrFrames(value) { this.#nbrFrames = value; }

    /** Interval (in milliseconds) between frame changes. */
    get interval() { return this.#timer.interval; }
    set interval(value) { this.#timer.interval = value; }


    /** Whether the animation is currently playing. */
    get playing() { return this.#timer.ticking; }


    /**
     * Creates a new `SpriteAnimation` instance.
     *
     * @param {string} spriteSheetFile - The sprite sheet source file.
     * @param {number} nbrFrames - Total number of frames in the animation.
     * @param {boolean} [loop=true] - Whether the animation should loop.
     * @param {number} [interval=150] - Frame interval in milliseconds.
     * @param {boolean} [flip=false] - Whether frames should be flipped.
     * @param {boolean} [cancelable=true] - Whether the animation is cancelable.
     */
    constructor(spriteSheetFile, nbrFrames, loop = true, interval = 100, flip = false, cancelable = true) {
        this.spriteSheet = new Image();
        this.#currentFrame = new Image();
        this.nbrFrames = nbrFrames;
        this.frameIndex = 0;
        this.loop = loop;
        this.flip = flip;
        this.cancelable = cancelable;

        this.#timer = new Timer(interval);
        this.#timer.tick.add(this.#timerTick);
        this.spriteSheet.crossOrigin = "anonymous";
        this.spriteSheet.addEventListener("load", async () => { 
            await this.#drawFrames(); 
        });
        this.spriteSheet.src = spriteSheetFile;
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
     * Clones the current `SpriteAnimation`.
     * @returns {Animation} A new `SpriteAnimation` instance.
     */
    clone() {
        return new Animation(this.spriteSheet.src, this.nbrFrames, this.loop, this.interval, this.flip, this.cancelable);
    }

    /** Handles timer ticks for frame updates. */
    #timerTick = () => {
        if (this.#frames.length === this.nbrFrames) {
            this.currentFrame.onload = () => {
                this.#updateFrameIndex();
                this.#onFrameChange();  
            }
            if (!this.loop && this.frameIndex === this.nbrFrames - 1) 
                this.stop();
            if(this.flip)
                this.currentFrame.src = this.#flippedFrames[this.frameIndex].src;
            else    
                this.currentFrame.src = this.#frames[this.frameIndex].src;
        }
    };

    /** Triggers the frame change event. */
    #onFrameChange() {
        this.frameChange.invoke(this);
    }

    /** Triggers the animation finish event. */
    #onFinish() {
        this.finish.invoke(this);
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

        await new Promise((resolve) => {
            let nbRemainingLoaded = this.nbrFrames;
            for (let i = 0; i < this.nbrFrames; i++) {
                ctx.clearRect(0,0, frameWidth, frameHeight);
                const sourceX = i * frameWidth;

                ctx.drawImage(this.spriteSheet, sourceX, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

                const frameImage = new Image();
                frameImage.onload = () => {
                    this.#frames.push(frameImage);
                    
                    nbRemainingLoaded--;
                    if (nbRemainingLoaded == 0){
                        resolve();
                    }
                }
                frameImage.src = offscreenCanvas.toDataURL();
            }
        });
        this.#flip();

    }
    #flip(){
        this.#flippedFrames = this.#frames.map(frame => {
            const flippedSrc = this.#flipFrame(frame.src);
            const flippedImage = new Image();
            flippedImage.src = flippedSrc;
            return flippedImage;
        });
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
