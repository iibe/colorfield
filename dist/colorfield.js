'use strict';

class HSLA {
    constructor(h = 0, s = 0, l = 0, a = 0) {
        this.hue = h;
        this.saturation = s;
        this.lightness = l;
        this.alpha = a;
    }
    static stringify({ hue, saturation, lightness, alpha }) {
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    }
    static grayscale({ lightness, alpha }) {
        return `hsla(0, 0%, ${lightness}%, ${alpha})`;
    }
}
class Particle {
    constructor(x = 0, y = 0, hsla = new HSLA()) {
        this.x = x;
        this.y = y;
        this.hsla = hsla;
        this.previous = { x, y };
    }
}

/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.

 Copyright (c) 2022 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

// 
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;
// I'm really not sure why this | 0 (basically a coercion to int)
// is making this faster but I get ~5 million ops/sec more on the
// benchmarks across the board or a ~10% speedup.
const fastFloor = (x) => Math.floor(x) | 0;
// double seems to be faster than single or int's
// probably because most operations are in double precision
const grad3 = /*#__PURE__*/ new Float64Array([1, 1, 0,
    -1, 1, 0,
    1, -1, 0,
    -1, -1, 0,
    1, 0, 1,
    -1, 0, 1,
    1, 0, -1,
    -1, 0, -1,
    0, 1, 1,
    0, -1, 1,
    0, 1, -1,
    0, -1, -1]);
/**
 * Creates a 3D noise function
 * @param random the random function that will be used to build the permutation table
 * @returns {NoiseFunction3D}
 */
function createNoise3D(random = Math.random) {
    const perm = buildPermutationTable(random);
    // precalculating these seems to yield a speedup of over 15%
    const permGrad3x = new Float64Array(perm).map(v => grad3[(v % 12) * 3]);
    const permGrad3y = new Float64Array(perm).map(v => grad3[(v % 12) * 3 + 1]);
    const permGrad3z = new Float64Array(perm).map(v => grad3[(v % 12) * 3 + 2]);
    return function noise3D(x, y, z) {
        let n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        const s = (x + y + z) * F3; // Very nice and simple skew factor for 3D
        const i = fastFloor(x + s);
        const j = fastFloor(y + s);
        const k = fastFloor(z + s);
        const t = (i + j + k) * G3;
        const X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = x - X0; // The x,y,z distances from the cell origin
        const y0 = y - Y0;
        const z0 = z - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // X Y Z order
            else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // X Z Y order
            else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // Z X Y order
        }
        else { // x0<y0
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } // Z Y X order
            else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } // Y Z X order
            else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        const x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        // Calculate the contribution from the four corners
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0)
            n0 = 0.0;
        else {
            const gi0 = ii + perm[jj + perm[kk]];
            t0 *= t0;
            n0 = t0 * t0 * (permGrad3x[gi0] * x0 + permGrad3y[gi0] * y0 + permGrad3z[gi0] * z0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0)
            n1 = 0.0;
        else {
            const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]];
            t1 *= t1;
            n1 = t1 * t1 * (permGrad3x[gi1] * x1 + permGrad3y[gi1] * y1 + permGrad3z[gi1] * z1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0)
            n2 = 0.0;
        else {
            const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]];
            t2 *= t2;
            n2 = t2 * t2 * (permGrad3x[gi2] * x2 + permGrad3y[gi2] * y2 + permGrad3z[gi2] * z2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0)
            n3 = 0.0;
        else {
            const gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]];
            t3 *= t3;
            n3 = t3 * t3 * (permGrad3x[gi3] * x3 + permGrad3y[gi3] * y3 + permGrad3z[gi3] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
    };
}
/**
 * Builds a random permutation table.
 * This is exported only for (internal) testing purposes.
 * Do not rely on this export.
 * @private
 */
function buildPermutationTable(random) {
    const tableSize = 512;
    const p = new Uint8Array(tableSize);
    for (let i = 0; i < tableSize / 2; i++) {
        p[i] = i;
    }
    for (let i = 0; i < tableSize / 2 - 1; i++) {
        const r = i + ~~(random() * (256 - i));
        const aux = p[i];
        p[i] = p[r];
        p[r] = aux;
    }
    for (let i = 256; i < tableSize; i++) {
        p[i] = p[i - 256];
    }
    return p;
}

const octaves = 4;
const fallout = 0.5;
const n3d = createNoise3D();
function getNoise3D(x, y, z) {
    let amplitude = 1;
    let factor = 1;
    let sum = 0;
    for (let i = 1; i < octaves; i++) {
        amplitude *= fallout;
        sum += amplitude * (n3d(x * factor, y * factor, z * factor) + 1) * 0.5;
        factor *= 2;
    }
    return sum;
}

class Colorfield {
    static range(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    constructor(selector, options = {}) {
        this.options = {
            colorMode: "hsla",
            colorIntensityMix: 1,
            colorLightnessMix: 1,
            colorOpacityMix: 1,
            frameRange: [250, 500],
            particleNumber: 1000,
            base: 1000,
            step: 5,
            zOffsetStep: 0.001,
        };
        this.particles = [];
        this.zOffset = 0;
        if (!document.querySelector(selector)) {
            throw new Error(`#${selector} is not found`);
        }
        this.options = Object.assign(Object.assign({}, this.options), options);
        this.validate("colorIntensityMix", 0, 1);
        this.validate("colorLightnessMix", 0, 1);
        this.validate("colorOpacityMix", 0, 1);
        this.validate("particleNumber", 500, 1000);
        this.validate("base", 500, 1000);
        this.validate("step", 5, 10);
        this.validate("zOffsetStep", 0.0005, 0.01);
        switch (this.options.colorMode) {
            case "hsla":
                this.colorize = HSLA.stringify;
                break;
            case "grayscale":
                this.colorize = HSLA.grayscale;
                break;
            default:
                this.colorize = HSLA.stringify;
                break;
        }
        this.canvas = document.querySelector(selector);
        this.canvas.style.display = "block";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.setCanvasDrawingBuffer();
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 0.3;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.frame = {
            midpoint: {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
            },
            count: 0,
            limit: Colorfield.range(...this.options.frameRange),
        };
        for (let index = 0; index < this.options.particleNumber; index++) {
            this.particles[index] = new Particle();
            this.setParticleProps(this.particles[index]);
        }
        this.render();
        window.addEventListener("resize", () => {
            this.rerender();
        });
        this.canvas.addEventListener("click", () => {
            this.rerender();
        });
    }
    validate(key, min, max) {
        if (!(min <= this.options[key] && this.options[key] <= max)) {
            throw new Error(`Error: this.config.${key} value from ${min} to ${max}]`);
        }
    }
    setCanvasDrawingBuffer() {
        const cssWidth = this.canvas.clientWidth;
        const cssHeight = this.canvas.clientHeight;
        // DisplayPixelSize = round(CssPixelSize * DevicePixelRatio);
        const displayWidth = Math.round(cssWidth * Colorfield.dpr);
        const displayHeight = Math.round(cssHeight * Colorfield.dpr);
        // if the drawing buffer size (i.e. how many pixels in canvas) is different from canvas display size (i.e. how many device pixels in canvas), then adjust it
        if (this.canvas.width !== displayWidth ||
            this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }
    setParticleProps(particle) {
        particle.x = particle.previous.x = this.canvas.width * Math.random();
        particle.y = particle.previous.y = this.canvas.height * Math.random();
        const atan2 = Math.atan2(this.frame.midpoint.y - particle.y, this.frame.midpoint.x - particle.x);
        particle.hsla.hue = (atan2 * 180) / Math.PI; // rotate color wheel
        particle.hsla.saturation = 100 * this.options.colorIntensityMix;
        particle.hsla.lightness = 50 * this.options.colorLightnessMix;
        particle.hsla.alpha = 0;
    }
    rerender() {
        this.setCanvasDrawingBuffer();
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 0.3;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.frame.midpoint = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        };
        if (this.frame.count > this.frame.limit) {
            this.frame.count = 0;
            this.frame.limit = Colorfield.range(...this.options.frameRange);
            this.render();
        }
        else {
            this.frame.count = 0;
            this.frame.limit = Colorfield.range(...this.options.frameRange);
        }
    }
    render() {
        if (this.frame.count > this.frame.limit) {
            return;
        }
        this.frame.count++;
        for (let i = 0; i < this.options.particleNumber; i++) {
            const particle = this.particles[i];
            particle.previous.x = particle.x;
            particle.previous.y = particle.y;
            const noise = getNoise3D((particle.x / this.options.base) * 1.75, (particle.y / this.options.base) * 1.75, this.zOffset);
            const angle = Math.PI * 6 * noise;
            particle.x += Math.cos(angle) * this.options.step;
            particle.y += Math.sin(angle) * this.options.step;
            if (particle.hsla.alpha < 1) {
                particle.hsla.alpha += 0.003 * this.options.colorOpacityMix;
            }
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.colorize(particle.hsla);
            this.ctx.moveTo(particle.previous.x, particle.previous.y);
            this.ctx.lineTo(particle.x, particle.y);
            this.ctx.stroke();
            if (particle.x < 0 ||
                particle.y < 0 ||
                particle.x > this.canvas.width ||
                particle.y > this.canvas.height) {
                this.setParticleProps(particle);
            }
        }
        this.zOffset += this.options.zOffsetStep;
        window.requestAnimationFrame(this.render.bind(this));
    }
    get self() {
        return this;
    }
    get config() {
        return this.options;
    }
}
Colorfield.dpr = window.devicePixelRatio || 1;

module.exports = Colorfield;
//# sourceMappingURL=colorfield.js.map
