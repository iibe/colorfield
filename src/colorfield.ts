import { HSLA, Particle } from "./module/entities";
import getNoise3D from "./module/n3d";

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

type TypeFilter<T, TargetType = any, Include = true> = {
  [K in keyof T]: T[K] extends TargetType
    ? Include extends true
      ? K
      : never
    : Include extends true
      ? never
      : K;
}[keyof T];

export default class Colorfield {
  static dpr: number = window.devicePixelRatio || 1;

  static range(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private options: Configuration = {
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

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frame: {
    midpoint: { x: number; y: number };
    count: number;
    limit: number;
  };

  private colorize: (instance: HSLA) => string;

  private particles: Particle[] = [];
  private zOffset: number = 0;

  constructor(selector: string, options: Partial<Configuration> = {}) {
    if (!document.querySelector(selector)) {
      throw new Error(`#${selector} is not found`);
    }

    this.options = { ...this.options, ...options };

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

    this.canvas = document.querySelector(selector) as HTMLCanvasElement;
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.setCanvasDrawingBuffer();
    this.ctx = this.canvas.getContext("2d")!;
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

  private validate(
    key: TypeFilter<Configuration, number>,
    min: number,
    max: number,
  ): void {
    if (!(min <= this.options[key] && this.options[key] <= max)) {
      throw new Error(`Error: this.config.${key} value from ${min} to ${max}]`);
    }
  }
  private setCanvasDrawingBuffer(): void {
    const cssWidth = this.canvas.clientWidth;
    const cssHeight = this.canvas.clientHeight;

    // DisplayPixelSize = round(CssPixelSize * DevicePixelRatio);
    const displayWidth = Math.round(cssWidth * Colorfield.dpr);
    const displayHeight = Math.round(cssHeight * Colorfield.dpr);

    // if the drawing buffer size (i.e. how many pixels in canvas) is different from canvas display size (i.e. how many device pixels in canvas), then adjust it
    if (
      this.canvas.width !== displayWidth ||
      this.canvas.height !== displayHeight
    ) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }
  }

  private setParticleProps(particle: Particle): void {
    particle.x = particle.previous.x = this.canvas.width * Math.random();
    particle.y = particle.previous.y = this.canvas.height * Math.random();

    const atan2 = Math.atan2(
      this.frame.midpoint.y - particle.y,
      this.frame.midpoint.x - particle.x,
    );

    particle.hsla.hue = (atan2 * 180) / Math.PI; // rotate color wheel
    particle.hsla.saturation = 100 * this.options.colorIntensityMix;
    particle.hsla.lightness = 50 * this.options.colorLightnessMix;
    particle.hsla.alpha = 0;
  }

  private rerender(): void {
    this.setCanvasDrawingBuffer();
    this.ctx = this.canvas.getContext("2d")!;
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
    } else {
      this.frame.count = 0;
      this.frame.limit = Colorfield.range(...this.options.frameRange);
    }
  }

  private render(): void {
    if (this.frame.count > this.frame.limit) {
      return;
    }

    this.frame.count++;

    for (let i = 0; i < this.options.particleNumber; i++) {
      const particle: Particle = this.particles[i];

      particle.previous.x = particle.x;
      particle.previous.y = particle.y;

      const noise: number = getNoise3D(
        (particle.x / this.options.base) * 1.75,
        (particle.y / this.options.base) * 1.75,
        this.zOffset,
      );

      const angle: number = Math.PI * 6 * noise;
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

      if (
        particle.x < 0 ||
        particle.y < 0 ||
        particle.x > this.canvas.width ||
        particle.y > this.canvas.height
      ) {
        this.setParticleProps(particle);
      }
    }

    this.zOffset += this.options.zOffsetStep;

    window.requestAnimationFrame(this.render.bind(this));
  }

  get self(): Colorfield {
    return this;
  }

  get config(): Configuration {
    return this.options;
  }
}
