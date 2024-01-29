import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

/** @type { import("rollup").RollupOptions } */
const library = {
  input: "./src/colorfield.ts",
  output: [
    {
      file: "./dist/colorfield.js",
      sourcemap: true,
      format: "cjs",
    },
    {
      file: "./dist/colorfield.esm.js",
      sourcemap: true,
      format: "esm",
    },
    {
      file: "./dist/colorfield.umd.js",
      sourcemap: true,
      format: "umd",
      name: "colorfield",
    },
    {
      file: "./dist/colorfield.amd.js",
      sourcemap: true,
      format: "amd",
    },
    {
      file: "./dist/colorfield.min.js",
      sourcemap: true,
      format: "cjs",
      plugins: [terser({ mangle: false })],
    },
    {
      file: "./dist/colorfield.min.esm.js",
      sourcemap: true,
      format: "esm",
      plugins: [terser({ mangle: false })],
    },
    {
      file: "./dist/colorfield.min.umd.js",
      sourcemap: true,
      format: "umd",
      name: "colorfield",
      plugins: [terser({ mangle: false })],
    },
    {
      file: "./dist/colorfield.min.amd.js",
      sourcemap: true,
      format: "amd",
      plugins: [terser({ mangle: false })],
    },
  ],
  plugins: [typescript(), nodeResolve()],
};

/** @type { import("rollup").RollupOptions[] } */
const website = [
  {
    input: "./src/static/index.ts",
    output: {
      file: "./static/scripts/index.js",
      sourcemap: false,
      format: "cjs",
      plugins: [terser()],
    },
    plugins: [
      typescript({ compilerOptions: { declaration: false } }),
      nodeResolve(),
    ],
  },
  {
    input: "./src/static/demo.ts",
    output: {
      file: "./static/scripts/demo.js",
      sourcemap: false,
      format: "cjs",
      plugins: [terser()],
    },
    plugins: [
      typescript({ compilerOptions: { declaration: false } }),
      nodeResolve(),
    ],
  },
];

/** @type { import("rollup").RollupOptions[] } */
export default [].concat(library, website);
