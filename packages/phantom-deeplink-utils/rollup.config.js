import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

export default defineConfig(
  {
    input: "src/index.ts",
    output: [
      // {
      //   dir: "dist/cjs",
      //   format: "cjs",
      //   sourcemap: true,
      // },
      // {
      //   dir: "dist/esm",
      //   format: "module",
      //   sourcemap: true,
      // },
      // {
      //   dir: "dist/iife",
      //   format: "iife",
      //   sourcemap: true,
      //   name:"PhantomDeepLinkingUtils"
      // },
      {
        dir: "dist/bundle",
        format: "umd",
        sourcemap: true,
        name:"PhantomDeepLinkingUtils"
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.build.json" }),
    ],
    watch: {
      include: "src/**/*",
    },
  },
  {
    input: "dist/bundle/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "umd" }],
    plugins: [dts()],
  }
);
