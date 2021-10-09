const DEG180_OVER_PI = 180 / Math.PI
var Transform = /** @class */ (function () {
    function Transform(m) {
        if (m === void 0) { m = [1, 0, 0, 1, 0, 0]; }
        this.dirty = false;
        this.m = (m && [parseFloat(m[0]), parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4]), parseFloat(m[5])]) || [1, 0, 0, 1, 0, 0];
    }
    Transform.prototype.reset = function () {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    };
    /**
     * Copy Konva.Transform object
     * @method
     * @name Konva.Transform#copy
     * @returns {Konva.Transform}
     * @example
     * const tr = shape.getTransform().copy()
     */
    Transform.prototype.copy = function () {
        return new Transform(this.m);
    };
    Transform.prototype.copyInto = function (tr) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    };
    /**
     * Transform point
     * @method
     * @name Konva.Transform#point
     * @param {Object} point 2D point(x, y)
     * @returns {Object} 2D point(x, y)
     */
    Transform.prototype.point = function (point) {
        var m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5],
        };
    };
    /**
     * Apply translation
     * @method
     * @name Konva.Transform#translate
     * @param {Number} x
     * @param {Number} y
     * @returns {Konva.Transform}
     */
    Transform.prototype.translate = function (x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    };
    /**
     * Apply scale
     * @method
     * @name Konva.Transform#scale
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    Transform.prototype.scale = function (sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    };
    /**
     * Apply rotation
     * @method
     * @name Konva.Transform#rotate
     * @param {Number} rad  Angle in radians
     * @returns {Konva.Transform}
     */
    Transform.prototype.rotate = function (rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    };
    /**
     * Returns the translation
     * @method
     * @name Konva.Transform#getTranslation
     * @returns {Object} 2D point(x, y)
     */
    Transform.prototype.getTranslation = function () {
        return {
            x: this.m[4],
            y: this.m[5],
        };
    };
    /**
     * Apply skew
     * @method
     * @name Konva.Transform#skew
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    Transform.prototype.skew = function (sx, sy) {
        var m11 = this.m[0] + this.m[2] * sy;
        var m12 = this.m[1] + this.m[3] * sy;
        var m21 = this.m[2] + this.m[0] * sx;
        var m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    };
    /**
     * Transform multiplication
     * @method
     * @name Konva.Transform#multiply
     * @param {Konva.Transform} matrix
     * @returns {Konva.Transform}
     */
    Transform.prototype.multiply = function (matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    };
    /**
     * Invert the matrix
     * @method
     * @name Konva.Transform#invert
     * @returns {Konva.Transform}
     */
    Transform.prototype.invert = function () {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    };
    /**
     * return matrix
     * @method
     * @name Konva.Transform#getMatrix
     */
    Transform.prototype.getMatrix = function () {
        return this.m;
    };
    /**
     * set to absolute position via translation
     * @method
     * @name Konva.Transform#setAbsolutePosition
     * @returns {Konva.Transform}
     * @author ericdrowell
     */
    Transform.prototype.setAbsolutePosition = function (x, y) {
        var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
        return this.translate(xt, yt);
    };
    /**
     * convert transformation matrix back into node's attributes
     * @method
     * @name Konva.Transform#decompose
     * @returns {Konva.Transform}
     */
    Transform.prototype.decompose = function () {
        var a = this.m[0];
        var b = this.m[1];
        var c = this.m[2];
        var d = this.m[3];
        var e = this.m[4];
        var f = this.m[5];
        var delta = a * d - b * c;
        var result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };
        // Apply the QR-like decomposition.
        if (a != 0 || b != 0) {
            var r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = (a * c + b * d) / delta;
            result.skewY = 0;
        }
        else if (c != 0 || d != 0) {
            var s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s;
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = (a * c + b * d) / delta;
        }
        result.rotation = this._getRotation(result.rotation);
        return result;
    };
    Transform.prototype._getRotation = function (rad) {
        return rad * DEG180_OVER_PI
    }
    return Transform;
}());

// export default Transform