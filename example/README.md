# Example app

Local Expo playground for `react-native-image-collage`. **Not published to npm.**

## Run

From the package root (recommended):

```bash
npm run example
```

Or manually:

```bash
npm run build          # from package root — required before first run
cd example
npm install
npx expo start --clear
```

Press `i` (iOS simulator), `a` (Android emulator), or scan the QR code with **Expo Go SDK 54**.

## What it tests

- `ImageCollage` (default entry)
- `react-native-image-collage/viewer` (full-screen gallery)
- `react-native-image-collage/expo` (expo-image + blurhash)
- Image count (1–6) and `maxVisibleImages` / `+N` overflow

## Troubleshooting

### `private properties are not supported`

Expo enables `transform.engine=hermes`, which defaults Babel to the `hermes-stable` profile. That profile assumes Hermes can run native private fields (`#foo`), but the Hermes build in Expo Go still rejects them. React Native 0.81 ships private-field syntax in files like `DOMRectReadOnly.js`.

The example `babel.config.js` forces `unstable_transformProfile: "default"` so those fields are transpiled. After pulling this fix, clear Metro’s cache:

```bash
cd example
npx expo start --clear
```

The example `metro.config.js` also:

- blocks the library’s `node_modules` (dev deps)
- disables strict `package.json` exports resolution
- points imports at the built `dist/` output

Always run `npm run build` in the package root after changing library source.

### Expo Go version mismatch

The example uses **Expo SDK 54**. Update Expo Go on your device to match, or use an iOS/Android simulator.

### Stale cache

```bash
cd example
rm -rf .expo node_modules
npm install
npx expo start --clear
```
