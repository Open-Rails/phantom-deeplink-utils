## TO DO:

1. files that are being exported to lib/esm need to have their file-types added, so it's `export * from './hello-world.js';` rather than just `/hello-world`.

2. ESM files need to have default exports. Otherwise we can't do something like `import something from 'phantom-deeplink-utils'`. It will throw an error unless we destructure the import like `import {whatever} from 'phantom-deeplink-utils'`.

3. We need to test `yarn link` and get it functional; this creates a 'symlink'. Ideally, we should be able to make changes to the /library folder and then have that imported as a dependency and used in the /demo folder. I'm not sure if this works currently? We could simply just do like `import from ../parent-directory/library/lib/stuff` but that would be bad form. We could also just use the literal published npm package, but then we wouldn't be able to test it prior to publishing it (lol lol lol).
