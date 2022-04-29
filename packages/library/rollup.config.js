import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import pkg from "./package.json"

export default defineConfig(
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/",
        format: "umd",
        sourcemap: true,
        exports: "named",
        name: "phantom-deeplink-utils"
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
  // {
  //   input: "dist/index.d.ts",
  //   output: [{ file: "dist/types/index.d.ts", format: "umd" }],
  //   plugins: [dts()],
  // }
);
