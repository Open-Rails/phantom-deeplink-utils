Don't install or use this library yet; I'm just playing with build-packages right now.

Give it a few days, thanks everyone.

## Issues with our build process:

1. if you do an default import, like `import something from 'rollup-hello-world2'` the typescript compiler will think it's going to work, and even provide type definitions for the `something` object, such as `something.functionName() => void`, however at runtime this will completely fail because our library has no default exports. Honestly, I have no idea how to provide default exports, and I'm giving up on the idea entirely; in that case, any developer using the library's IDE should throw a clear error indicating that their is no default export, warning them ahead of time. Currently it does not do this.

2. For CJS imports done in Typescript (.ts files), the type-definitions are missing and are simply defined as 'any'. A CJS import is something like `const something = require('library-name')` or `const {functionName} = require('library-name')`. Interestingly enough, these type definitions are PRESENT for .js files doing the same identical import statement. How bizarre.

Scripts:
"postbuild": "echo {\"type\":\"commonjs\", \"types\":\"../../types/index.d.ts\"} | json > dist/cjs/package.json && echo {\"type\":\"module\", \"types\":\"../../types/index.d.ts\"} | json > dist/esm/package.json",

Note: for usability of the library, I believe it is slightly better to have named exports in the index.ts rather than wild-card \* exports. However it's not a huge difference.
