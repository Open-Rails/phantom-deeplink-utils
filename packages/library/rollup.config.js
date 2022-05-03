import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "rollup";
import json from '@rollup/plugin-json';
import dts from "rollup-plugin-dts";
import pkg from "./package.json"
import poly from "rollup-plugin-polyfill-node"


export default defineConfig(
  {
    input: "src/index.ts",
    output: [
      {
        dir: "lib/",
        format: "umd",
        sourcemap: true,
        exports: "named",
        name: "phantom-deeplink-utils"
      },
    ],
    plugins: [
      poly(),
      resolve({preferBuiltins: true}),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.build.json" }),
    ],
    watch: {
      include: "src/**/*",
    },
  },
  // {
  //   input: "lib/index.d.ts",
  //   output: [{ file: "lib/types/index.d.ts", format: "umd" }],
  //   plugins: [dts()],
  // }
);
