"use strict";

import Flatten from '../flatten';

/**
 * Class representing a ray.
 * @type {Ray}
 */
export class Ray {
    /**
     * Ray may be constructed by setting start point and a normal vector
     * Ray goes to the right direction with respect to the normal vector
     * If normal vector is omitted ray is considered horizontal (normal vector is (0,1))
     * If started point is omitted, ray is started at zero point
     * @param {Point} pt - start point
     * @param {Vector} norm - normal vector
     */
    constructor(...args) {
        this.pt = new Flatten.Point();
        this.norm = new Flatten.Vector(0,1);

        if (args.length == 0) {
            return;
        }

        if (args.length >= 1 && args[0] instanceof Flatten.Point) {
            this.pt = args[0].clone();
        }

        if (args.length === 1) {
            return;
        }

        if (args.length == 2 && args[1] instanceof Flatten.Vector) {
            this.norm = args[1].clone();
            return;
        }

        // if (args.length == 2 && typeof (args[0]) == "number" && typeof (args[1]) == "number") {
        //     this.pt = new Flatten.Point(args[0], args[1]);
        //     return;
        // }

        throw Flatten.Errors.ILLEGAL_PARAMETERS;
    }

    /**
     * Returns copied instance of the ray object
     * @returns {Ray}
     */
    clone() {
        return new Ray(this.pt);
    }

    /**
     * Slope of the ray - angle in radians between ray and axe x from 0 to 2PI
     * @returns {number} - slope of the line
     */
    get slope() {
        let vec = new Flatten.Vector(this.norm.y, -this.norm.x);
        return vec.slope;
    }

    /**
     * Returns half-infinite bounding box of the ray
     * @returns {Box} - bounding box
     */
    get box() {
        let slope = this.slope;
        return new Flatten.Box(
            slope > Math.PI/2 && slope < 3*Math.PI/2 ? Number.NEGATIVE_INFINITY : this.pt.x,
            slope >= 0 && slope <= Math.PI ? this.pt.y : Number.NEGATIVE_INFINITY,
            slope >= Math.PI/2 && slope <= 3*Math.PI/2 ? this.pt.x : Number.POSITIVE_INFINITY,
            slope >= Math.PI && slope <= 2*Math.PI || slope == 0 ? this.pt.y : Number.POSITIVE_INFINITY
        )
    }

    /**
     * Return ray start point
     * @returns {Point} - ray start point
     */
    get start() {
        return this.pt;
    }

    /**
     * Returns true if point belongs to ray
     * @param {Point} pt Query point
     * @returns {boolean}
     */
    contains(pt) {
        if (this.pt.equalTo(pt)) {
            return true;
        }
        /* Ray contains point if vector to point is orthogonal to the line normal vector
            and cross product from vector to point is positive */
        let vec = new Flatten.Vector(this.pt, pt);
        return Flatten.Utils.EQ_0(this.norm.dot(vec)) && Flatten.Utils.GE(vec.cross(this.norm),0);
    }

    /**
     * Returns array of intersection points between ray and segment or arc
     * @param {Segment|Arc} - Shape to intersect with ray
     * @returns {Array} array of intersection points
     */
    intersect(shape) {
        if (shape instanceof Flatten.Segment) {
            return this.intersectRay2Segment(this, shape);
        }

        if (shape instanceof Flatten.Arc) {
            return this.intersectRay2Arc(this, shape);
        }
    }

    intersectRay2Segment(ray, segment) {
        let ip = [];

        if (ray.box.not_intersect(segment.box)) {
            return ip;
        }

        let line = new Flatten.Line(ray.start, ray.norm);
        let ip_tmp = line.intersect(segment);

        for (let pt of ip_tmp) {
            // if (Flatten.Utils.GE(pt.x, ray.start.x)) {
            if (ray.contains(pt)) {
                ip.push(pt);
            }
        }

        /* If there were two intersection points between line and ray,
        and now there is exactly one left, it means ray starts between these points
        and there is another intersection point - start of the ray */
        if (ip_tmp.length == 2 && ip.length == 1 && ray.start.on(line)) {
            ip.push(ray.start);
        }

        return ip;
    }

    intersectRay2Arc(ray, arc) {
        let ip = [];

        if (ray.box.not_intersect(arc.box)) {
            return ip;
        }

        let line = new Flatten.Line(ray.start, ray.norm);
        let ip_tmp = line.intersect(arc);

        for (let pt of ip_tmp) {
            // if (Flatten.Utils.GE(pt.x, ray.start.x)) {
            if (ray.contains(pt)) {
                ip.push(pt);
            }
        }
        return ip;
    }
};

Flatten.Ray = Ray;

export const ray = (...args) => new Flatten.Ray(...args);
Flatten.ray = ray;
