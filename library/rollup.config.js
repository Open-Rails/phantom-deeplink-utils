import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "lib/cjs",
      format: "cjs",
      exports: 'named',
      sourcemap: true,
    },
    {
      dir: "lib/esm",
      format: "esm",
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
  watch: {
    include: "src/**/*",
  },
};
