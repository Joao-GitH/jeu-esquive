import { Event } from "../PhysicsEngine/event.js";

export class Timer {
    /** @type {number} */
    #interval;
    /** @type {number} */
    #intervalId = 0;
    /** @type {boolean} */
    #ticking;

    /** 
     * Time passed since the timer started in ms
     * 
     * @type {number} 
     */
    #timePassed;

    /**
     * Event handler invoked on every timer tick.
     * Listeners can subscribe to this event to perform actions at each tick.
     *
     * @type {Event<Timer, null>}
     */
    tick;

    /**
     * The interval (in milliseconds) at which the timer ticks.
     * Must be a positive number.
     */
    get interval() { return this.#interval; }
    set interval(value) {
        if (value < 0) {
            throw new Error("Interval must be a positive number.");
        }
        this.#interval = value;
    }

    /** True if the timer has started false otherwise @readonly*/
    get ticking() {  return this.#ticking; }
    /** @readonly */
    get timePassed() {return this.#timePassed;}

    /**
     * Creates a new Timer instance.
     *
     * @param {number} interval - The interval in milliseconds at which the timer ticks.
     */
    constructor(interval = 0) {
        this.interval = interval;
        this.#ticking = false;
        this.#intervalId = 0
        this.tick = new Event();
    }

    /**
     * Starts the timer.
     * The `tick` event is triggered at every interval defined by the `interval` property.
     */
    start() {
        if(!this.#ticking){
            this.#ticking = true;
            this.#timePassed = 0;
            this.tick.invoke(this);
            this.#intervalId = setInterval(() => {
                this.#timePassed += Date.now() - this.#timePassed;
                this.tick.invoke(this);
            }, this.interval);
        }
    }
    
    /**
     * Stops the timer.
     * No further `tick` events will be triggered until the timer is restarted.
     */
    stop() {
        this.#ticking = false;
        clearInterval(this.#intervalId);
    }
}