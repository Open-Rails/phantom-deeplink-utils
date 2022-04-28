import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import replace from "@rollup/plugin-replace"
import pkg from "./package.json"

const config = {
    input: "temp/index.js",
}

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
]

const pureClass = {
    transform(code) {
        // Replace TS emitted @class function annotations with PURE so terser
        // can remove them
        return code.replace(/\/\*\* @class \*\//g, "/*@__PURE__*/")
    },
}

const umd = Object.assign({}, config, {
    output: {
        file: `dist/${pkg.name}.dev.js`,
        format: "umd",
        name: "Motion",
        exports: "named",
        globals: { react: "React" },
    },
    external: ["react", "react-dom"],
    plugins: [
        resolve(),
        replace({
            "process.env.NODE_ENV": JSON.stringify("development"),
            preventAssignment: true,
        }),
    ],
})

const umdProd = Object.assign({}, umd, {
    output: Object.assign({}, umd.output, {
        file: `dist/${pkg.name}.js`,
    }),
    plugins: [
        resolve(),
        replace({
            "process.env.NODE_ENV": JSON.stringify("production"),
            preventAssignment: true,
        }),
        pureClass,
        terser({ output: { comments: false } }),
    ],
})

const cjs = Object.assign({}, config, {
    input: ["temp/index.js"],
    output: {
        entryFileNames: `[name].js`,
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
    },
    plugins: [resolve()],
    external,
})

const esm = Object.assign({}, config, {
    input: ["temp/index.js"],
    output: {
        entryFileNames: "[name].mjs",
        format: "esm",
        exports: "named",
        preserveModules: true,
        dir: "dist/esm",
    },
    plugins: [resolve()],
    external,
})

// eslint-disable-next-line import/no-default-export
export default [umd, umdProd, cjs, esm]
