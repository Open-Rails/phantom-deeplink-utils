Don't install or use this library yet; I'm just playing with build-packages right now.

Give it a few days, thanks everyone.

## Issues with our build process:

1. if you do an default import, like `import something from 'rollup-hello-world2'` the typescript compiler will think it's going to work, and even provide type definitions for the `something` object, such as `something.functionName() => void`, however at runtime this will completely fail because our library has no default exports. However, this oddly works for .js files but not for .ts files, which is very confusing to me. It might be something I'm doing wrong for the typescript compiler that's importing the file.

2. It would be better if the types were exported to /dist/types rather than /dist/, but for some reason rollup seems hell-bent on exporting types to /dist/ and ignoring the tsconfig.json file.

3. For some reason 'yarn publish' inside of /library no longer works. npm publish works, and yarn publish used to work, but now it fails for unknown reasons.

Note: for usability of the library, I believe it is slightly better to have named exports in the index.ts rather than wild-card \* exports. However it's not a huge difference.

Scripts:
"postbuild": "echo {\"type\":\"commonjs\", \"types\":\"../../types/index.d.ts\"} | json > dist/cjs/package.json && echo {\"type\":\"module\", \"types\":\"../../types/index.d.ts\"} | json > dist/esm/package.json",
