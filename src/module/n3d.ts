import type { NoiseFunction3D } from "simplex-noise";
import { createNoise3D } from "simplex-noise";

const octaves: number = 4;
const fallout: number = 0.5;
const n3d: NoiseFunction3D = createNoise3D();

export default function getNoise3D(x: number, y: number, z: number): number {
  let amplitude: number = 1;
  let factor: number = 1;

  let sum: number = 0;
  for (let i = 1; i < octaves; i++) {
    amplitude *= fallout;
    sum += amplitude * (n3d(x * factor, y * factor, z * factor) + 1) * 0.5;
    factor *= 2;
  }

  return sum;
}
