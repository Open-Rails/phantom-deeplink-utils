## Intro

With Phantom version v22.04.01, Phantom Labs introduced deeplinking for its mobile-app, which allows dapp-developers to communicate with the Phantom mobile-app via a redirect flow rather than through provider-injection.

https://phantom.app/blog/introducing-phantom-deeplinks

Previously dapps could only communicate with Phantom-wallet via provider-inject; Phantom wallet is a browser-extension that injects a window.solana object into the user's web-browser. However, because browser extensions are not available on mobile browsers, Phantom built a mobile-browser into their mobile-app. This meant that end-users could only use a dapp on their phone by visiting it from within their Phantom wallet.

With deeplinking however, we can now build redirection flows for dapp <-> wallet communication. This means users can visit any dapp on their regular mobile web-browser, and the dapp can communicate with Phantom's mobile wallet using a redirection flow.

For the end-user, every time a Phantom method is called, the user will go from Mobile-Dapp -> Phantom Mobile -> Mobile-Dapp.

For the developer, all they need to do is install this library, call an initialization function, and they're good to go. This library creates a simulated window.solana object, which your dapp can call as if their were a browser-extension installed.

The only problem for developers is that it may break your SPA (single page application); every redirect loop acts as a browser-refresh, which means any state your web-app is storing in memory will be erased. This library stores its state in local-storage.

## Issues to fix with our build process:

1. if you do an default import, like `import something from 'rollup-hello-world2'` the typescript compiler will think it's going to work, and even provide type definitions for the `something` object, such as `something.functionName() => void`, however at runtime this will completely fail because our library has no default exports. However, this oddly works for .js files but not for .ts files, which is very confusing to me. It might be something I'm doing wrong for the typescript compiler that's importing the file.

2. It would be better if the types were exported to /dist/types rather than /dist/, but for some reason rollup seems hell-bent on exporting types to /dist/ and ignoring the tsconfig.json file.

3. For some reason 'yarn publish' inside of /library no longer works. npm publish works, and yarn publish used to work, but now it fails for unknown reasons.

4. TSconfig does not like how src/index is importing files for some reason https://stackoverflow.com/questions/60029058/project-must-list-all-files-or-use-an-include-pattern we are running into the same problem. It might be related to composite: true in tsconfig.json, however turning this on or off hasn't seemed to help at all.

## To Do:

1. We should probably add this into our library build: https://www.npmjs.com/package/rollup-plugin-polyfill-node

2. Can we request what browser we get redirected to? Because if our local-storage is stored on Google Chrome, and then Phantom redirects us from Chrome to Safari... obiously we won't be able to read that local storage lol.

3. In the demo app, we have to use some of our global window declrations and some ts-ignore stuff; ideally we shouldn't have to use any of that. The global window solana object should be declared in the library itself.

4. Our library is exporting a react hook. I don't know if we need this or not. What if someone wants to use it outside of react; what is the best way to structure this export, so that it's not included in that user's bundle when they use our library and not use that hook? (Tree shaking.) Should they import it using some path like 'our-library-name/react' for example?

Note: for usability of the library, I believe it is slightly better to have named exports in the index.ts rather than wild-card \* exports. However it's not a huge difference.

Scripts:
"postbuild": "echo {\"type\":\"commonjs\", \"types\":\"../../types/index.d.ts\"} | json > dist/cjs/package.json && echo {\"type\":\"module\", \"types\":\"../../types/index.d.ts\"} | json > dist/esm/package.json",
