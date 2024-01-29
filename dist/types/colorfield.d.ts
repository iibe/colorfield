interface Configuration {
    /** Color mode. */
    colorMode: "hsla" | "grayscale";
    /** Color saturation. Value from 0 to 1. */
    colorIntensityMix: number;
    /** Color lightness. Value from 0 to 1. */
    colorLightnessMix: number;
    /** Color alpha channel. Value from 0 to 1. */
    colorOpacityMix: number;
    /** Number of frames to render. The higher the number, the longer the animation will take. Determined by chance. */
    frameRange: [number, number];
    /** Number of particles. The smaller number, the lower the computational cost. Value from 500 to 1000. */
    particleNumber: number;
    /** Base number. The higher value, the greater the distance between lines (the wider stripes). Should be within [500; 1000] range. */
    base: number;
    /** Step number. Value from 5 to 10. */
    step: number;
    /** Z-axis offset step. The higher higher, the faster curves direction will changes. Should be within [0.0005; 0.01] range. */
    zOffsetStep: number;
}
export default class Colorfield {
    static dpr: number;
    static range(min: number, max: number): number;
    private options;
    private canvas;
    private ctx;
    private frame;
    private colorize;
    private particles;
    private zOffset;
    constructor(selector: string, options?: Partial<Configuration>);
    private validate;
    private setCanvasDrawingBuffer;
    private setParticleProps;
    private rerender;
    private render;
    get self(): Colorfield;
    get config(): Configuration;
}
export {};
//# sourceMappingURL=colorfield.d.ts.map