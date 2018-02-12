/**
 * Created by Alex Bol on 3/7/2017.
 */
"use strict";

module.exports = function(Flatten) {
    /**
     * Class Box represent bounding box of the shape
     * @type {Box}
     */
    Flatten.Box = class Box {
        /**
         *
         * @param {number} xmin - minimal x coordinate
         * @param {number} ymin - minimal y coordinate
         * @param {number} xmax - maximal x coordinate
         * @param {number} ymax - maximal y coordinate
         */
        constructor(xmin=undefined, ymin=undefined, xmax=undefined, ymax=undefined) {
            /**
             * Minimal x coordinate
             * @type {number}
             */
            this.xmin = xmin;
            /**
             * Minimal y coordinate
             * @type {number}
             */
            this.ymin = ymin;
            /**
             * Maximal x coordinate
             * @type {number}
             */
            this.xmax = xmax;
            /**
             * Maximal y coordinate
             * @type {number}
             */
            this.ymax = ymax;
        }

        /**
         * Clones and returns new instance of box
         * @returns {Box}
         */
        clone() {
            return new Box(this.xmin, this.ymin, this.xmax, this.ymax);
        }

        /**
         * Property low need for interval tree interface
         * @returns {Point}
         */
        get low() {
            return new Flatten.Point(this.xmin, this.ymin);
        }

        /**
         * Property high need for interval tree interface
         * @returns {Point}
         */
        get high() {
            return new Flatten.Point(this.xmax, this.ymax);
        }

        /**
         * Property max returns the box itself !
         * @returns {Box}
         */
        get max() {
            return this.clone();
        }

        /**
         * Returns true if not intersected with other box
         * @param {Box} other_box - other box to test
         * @returns {boolean}
         */
        notIntersect(other_box) {
            return (
                this.xmax < other_box.xmin ||
                this.xmin > other_box.xmax ||
                this.ymax < other_box.ymin ||
                this.ymin > other_box.ymax
            );
        }

        /**
         * Returns true if intersected with other box
         * @param {Box} other_box - Query box
         * @returns {boolean}
         */
        intersect(other_box) {
            return !this.notIntersect(other_box);
        }

        /**
         * Returns new box merged with other box
         * @param {Box} other_box - Other box to merge with
         * @returns {Box}
         */
        merge(other_box) {
            return new Box(
                this.xmin === undefined ? other_box.xmin : Math.min(this.xmin, other_box.xmin),
                this.ymin === undefined ? other_box.ymin : Math.min(this.ymin, other_box.ymin),
                this.xmax === undefined ? other_box.xmax : Math.max(this.xmax, other_box.xmax),
                this.ymax === undefined ? other_box.ymax : Math.max(this.ymax, other_box.ymax)
            );
        }

        /**
         * Defines predicate "less than" between two boxes. Need for interval index
         * @param {Box} other_box - other box
         * @returns {boolean} - true if this box less than other box, false otherwise
         */
        less_than(other_box) {
            if (this.low.lessThan(other_box.low))
                return true;
            if (this.low.equalTo(other_box.low) && this.high.lessThan(other_box.high))
                return true;
            return false;
        }

        /**
         * Returns true if this box is equal to other box, false otherwise
         * @param {Box} other_box - query box
         * @returns {boolean}
         */
        equal_to(other_box) {
            return (this.low.equalTo(other_box.low) && this.high.equalTo(other_box.high));
        }

        output() {
            return this.clone();
        }

        maximal_val(box1, box2) {
            // return pt1.lessThan(pt2) ? pt2.clone() : pt1.clone();
            return box1.merge(box2);
        }

        val_less_than(pt1, pt2) {
            return pt1.lessThan(pt2);
        }

        /**
         * Set new values to the box object
         * @param {number} xmin - miminal x coordinate
         * @param {number} ymin - minimal y coordinate
         * @param {number} xmax - maximal x coordinate
         * @param {number} ymax - maximal y coordinate
         */
        set(xmin, ymin, xmax, ymax) {
            this.xmin = xmin;
            this.ymin = ymin;
            this.xmax = xmax;
            this.ymax = ymax;
        }
    };
};
