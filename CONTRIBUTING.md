# Contributing

Thanks for your interest in `react-native-image-collage`!

## Report issues

Open an issue on GitHub:

**https://github.com/FaisalKhawaj/react-native-image-collage/issues/new/choose**

Include React Native / Expo version, platform, steps to reproduce, and screenshots for layout bugs.

## Local setup

```bash
git clone https://github.com/FaisalKhawaj/react-native-image-collage.git
cd react-native-image-collage
npm install
npm run build
npm run typecheck
```

## Example app (manual testing)

An Expo playground lives in `example/`. It is **not** published to npm.

```bash
npm run example
# or
cd example && npm install && npx expo start --clear
```

Use the on-screen controls to change image count, `maxVisibleImages`, and entry point (`/viewer`, `/expo`).

### Troubleshooting Metro / Hermes

If you see `private properties are not supported`:

```bash
cd example && npx expo start --clear
```

The example `babel.config.js` forces `unstable_transformProfile: "default"` so React Native private web APIs transpile correctly for Hermes.

Ensure **Expo Go matches SDK 54** on a physical device.

## Link into another app

```bash
npm install /path/to/react-native-image-collage
```

Run `npm run build` in the package root after changing library source.

## Pull requests

PRs are welcome. For larger changes, open an issue first so we can align on the approach.
