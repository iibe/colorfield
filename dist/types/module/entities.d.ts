export declare class HSLA {
    /** Degree value. Hue is a degree on the color wheel from 0 to 360. 0 is red, 120 is green, and 240 is blue. */
    hue: number;
    /** Percentage value. Saturation can be described as the intensity of a color. 100% is pure color, no shades of gray. 50% is 50% gray, but you can still see the color. 0% is completely gray; you can no longer see the color. */
    saturation: number;
    /** Percentage value. The lightness of a color can be described as how much light you want to give the color, where 0% means no light (black), 50% means 50% light (neither dark nor light), and 100% means full lightness (white). */
    lightness: number;
    /** Number value. The alpha parameter is a number between 0.0 (fully transparent) and 1.0 (not transparent at all). */
    alpha: number;
    constructor(h?: number, s?: number, l?: number, a?: number);
    static stringify({ hue, saturation, lightness, alpha }: HSLA): string;
    static grayscale({ lightness, alpha }: HSLA): string;
}
export declare class Particle {
    x: number;
    y: number;
    hsla: HSLA;
    previous: {
        x: number;
        y: number;
    };
    constructor(x?: number, y?: number, hsla?: HSLA);
}
//# sourceMappingURL=entities.d.ts.map