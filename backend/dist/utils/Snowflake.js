"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
const ProcessId = 1n;
const WorkerId = 0n;
/**
 * A class for generating and deconstructing Twitter snowflakes.
 *
 * A {@link https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake}
 * is a 64-bit unsigned integer with 4 fields that have a fixed epoch value.
 *
 * If we have a snowflake `266241948824764416` we can represent it as binary:
 * ```
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *           number of ms since epoch           worker  pid    increment
 * ```
 */
class Snowflake {
    /**
     * Internal incrementor for generating snowflakes
     * @internal
     */
    #increment = 0n;
    /**
     * Internal reference of the epoch passed in the constructor
     * @internal
     */
    #epoch;
    /**
     * Alias for {@link deconstruct}
     */
    // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-invalid-this
    decode = this.deconstruct;
    /**
     * @param epoch the epoch to use
     */
    constructor(epoch) {
        this.#epoch = BigInt(epoch instanceof Date ? epoch.getTime() : epoch);
    }
    /**
     * The epoch for this snowflake.
     */
    get epoch() {
        return this.#epoch;
    }
    /**
     * Generates a snowflake given an epoch and optionally a timestamp
     * @param options options to pass into the generator, see {@link SnowflakeGenerateOptions}
     *
     * **note** when `increment` is not provided it defaults to the private `increment` of the instance
     * @example
     * ```typescript
     * const epoch = new Date('2000-01-01T00:00:00.000Z');
     * const snowflake = new Snowflake(epoch).generate();
     * ```
     * @returns A unique snowflake
     */
    generate({ increment, timestamp = Date.now(), workerId = WorkerId, processId = ProcessId, } = {}) {
        if (timestamp instanceof Date)
            timestamp = BigInt(timestamp.getTime());
        else if (typeof timestamp === 'number')
            timestamp = BigInt(timestamp);
        else if (typeof timestamp !== 'bigint') {
            throw new TypeError(`"timestamp" argument must be a number, bigint, or Date (received ${typeof timestamp})`);
        }
        if (typeof increment === 'bigint' && increment >= 4095n)
            increment = 0n;
        else {
            increment = this.#increment++;
            if (this.#increment >= 4095n)
                this.#increment = 0n;
        }
        // timestamp, workerId, processId, increment
        return ((timestamp - this.#epoch) << 22n) | ((workerId & 31n) << 17n) | ((processId & 31n) << 12n) | increment;
    }
    /**
     * Deconstructs a snowflake given a snowflake ID
     * @param id the snowflake to deconstruct
     * @returns a deconstructed snowflake
     * @example
     * ```typescript
     * const epoch = new Date('2000-01-01T00:00:00.000Z');
     * const snowflake = new Snowflake(epoch).deconstruct('3971046231244935168');
     * ```
     */
    deconstruct(id) {
        const bigIntId = BigInt(id);
        return {
            id: bigIntId,
            timestamp: (bigIntId >> 22n) + this.#epoch,
            workerId: (bigIntId >> 17n) & 31n,
            processId: (bigIntId >> 12n) & 31n,
            increment: bigIntId & 4095n,
            epoch: this.#epoch,
        };
    }
    /**
     * Retrieves the timestamp field's value from a snowflake.
     * @param id The snowflake to get the timestamp value from.
     * @returns The UNIX timestamp that is stored in `id`.
     */
    timestampFrom(id) {
        return Number((BigInt(id) >> 22n) + this.#epoch);
    }
}
exports.Snowflake = Snowflake;
