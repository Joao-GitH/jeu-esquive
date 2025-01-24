
export class EventArgs {
	static empty = new EventArgs();
}

export class EventHandler {
	/** @type {((object: object, e: EventArgs) => void)[]} */
    #eventListeners = [];
    /**
     * Invokes all registered event listeners.
     *
     * @param {object} object - The object triggering the event.
     * @param {EventArgs} e - The event arguments.
     */
    invoke(object, e) {
        if (this.#eventListeners.length > 0) {
            for (const eventListener of this.#eventListeners) {
                eventListener(object, e);
            }
        }
    }
    /**
     * Adds one or more event listeners to the event.
     *
     * @param {...((object: object, e: EventArgs) => void)} items - The event listeners to add.
     */
    add(...items) {
        for (const eventListener of items) {
            this.#eventListeners.push(eventListener);
        }
    }
    /**
     * Removes one or more event listeners.
     *
     * @param {...(object: object, e: EventArgs) => void} items - The event listeners to remove.
     */
    remove(...items) {
        this.#eventListeners = this.#eventListeners.filter(listener => !items.includes(listener));
    }
    /**
     * Removes an event listener at the specified index.
     *
     * @param {number} index - The index of the event listener to remove.
     */
    removeAt(index) {
        if (index >= 0 && index < this.#eventListeners.length) {
            this.#eventListeners.splice(index, 1);
        }
    }
    /** Removes all event listeners. */
    clear() {
        this.#eventListeners = [];
    }
}