# react-native-image-collage

[![npm version](https://img.shields.io/npm/v/react-native-image-collage.svg)](https://www.npmjs.com/package/react-native-image-collage)
[![license](https://img.shields.io/npm/l/react-native-image-collage.svg)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/FaisalKhawaj/react-native-image-collage)](https://github.com/FaisalKhawaj/react-native-image-collage/issues)

Facebook / Instagram-style **image collage layouts** for React Native — automatic grids, `+N` overflow, and optional full-screen viewer.

Works with **React Native CLI** and **Expo**.

## Documentation

| | |
|--|--|
| **[Examples](./docs/examples.md)** | Layouts with screenshots + copy-paste usage |
| **[API](./docs/api.md)** | Props, entry points, types, exports |
| **[Screenshots guide](./docs/screenshots.md)** | How to capture & embed real device shots |
| **[Contributing](./CONTRIBUTING.md)** | Local setup & example app |

---

## Install

```bash
npm install react-native-image-collage
# or
yarn add react-native-image-collage
```

**Expo** (recommended for Expo apps):

```bash
npx expo install react-native-image-collage expo-image
```

**Optional viewer** (RN CLI / zoom gestures):

```bash
npm install react-native-image-viewing
```

---

## Quick start

```tsx
import { ImageCollage } from "react-native-image-collage";

<ImageCollage
  images={[
    { uri: "https://picsum.photos/206", aspectRatio: 1.5 },
    "https://picsum.photos/207",
    "https://picsum.photos/208",
  ]}
  spacing={4}
  borderRadius={12}
  onImagePress={(index) => console.log("Tapped", index)}
/>
```

Width is measured from the parent automatically. Height is derived from width and aspect ratio.

---

## Layouts

| Images | Layout |
|-------:|--------|
| **1** | Full width |
| **2** | Side by side |
| **3** | Large left, two stacked right |
| **4** | 2×2 grid |
| **5+** | Grid + `+N` on the last tile |

<p align="center">
  <img src="https://raw.githubusercontent.com/FaisalKhawaj/react-native-image-collage/main/docs/assets/layout-1.jpg" alt="1 image" width="48%" />
  <img src="https://raw.githubusercontent.com/FaisalKhawaj/react-native-image-collage/main/docs/assets/layout-2.jpg" alt="2 images" width="48%" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/FaisalKhawaj/react-native-image-collage/main/docs/assets/layout-3.jpg" alt="3 images" width="48%" />
  <img src="https://raw.githubusercontent.com/FaisalKhawaj/react-native-image-collage/main/docs/assets/layout-4.jpg" alt="4 images" width="48%" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/FaisalKhawaj/react-native-image-collage/main/docs/assets/layout-overflow.jpg" alt="Overflow +N" width="48%" />
</p>

More examples → **[docs/examples.md](./docs/examples.md)**

---

## Entry points

| Import | Requires | Use when |
|--------|----------|----------|
| `react-native-image-collage` | — | Default RN / Expo collage |
| `react-native-image-collage/viewer` | `react-native-image-viewing` | Zoomable viewer (pinch / pan / double-tap) |
| `react-native-image-collage/expo` | `expo-image` | Blurhash, caching, Expo viewer + pinch zoom |

```tsx
// Expo
import { ImageCollageWithViewer } from "react-native-image-collage/expo";

<ImageCollageWithViewer
  images={photoUrls}
  blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
  prioritizeFirstImage
  viewerProps={{
    pinchToZoomEnabled: true,
    doubleTapToZoomEnabled: true,
    minScale: 1,
    maxScale: 3,
    doubleTapScale: 2.5,
  }}
/>
```

---

## Props (cheat sheet)

### `ImageCollage`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `CollageImageInput[]` | **required** | URLs, sources, or `{ uri, aspectRatio }` |
| `onImagePress` | `(index: number) => void` | — | Tile press handler |
| `spacing` | `number` | `6` | Gap between tiles |
| `borderRadius` | `number` | `12` | Tile corner radius |
| `layoutMinHeight` | `number` | `200` | Min height |
| `layoutMaxHeight` | `number` | `520` | Max height |
| `maxVisibleImages` | `number` | `4` | Tiles before `+N` |
| `placeholderColor` | `string` | `#E8E8E8` | Loading background |
| `renderImage` | `CollageImageRenderer` | RN `Image` | Custom image renderer |
| `height` / `width` | `number` | auto | Optional fixed size |

### Viewer zoom (`viewerProps` on `ImageCollageWithViewer`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pinchToZoomEnabled` | `boolean` | `true` | Pinch + pan (`/expo`); gates double-tap on `/viewer` |
| `doubleTapToZoomEnabled` | `boolean` | `true` | Double-tap to zoom |
| `minScale` | `number` | `1` | Min scale (`/expo`) |
| `maxScale` | `number` | `3` | Max scale (`/expo`) |
| `doubleTapScale` | `number` | `2.5` | Double-tap scale (`/expo`) |

Full tables → **[docs/api.md](./docs/api.md)** · Examples → **[docs/examples.md](./docs/examples.md)**

---

## Compatibility

| | |
|--|--|
| React Native | `0.72+` (including **0.86+** / Expo SDK 57) |
| React | `18+` / `19+` |
| Expo | Optional `/expo` (`expo-image`) — pinch zoom uses core RN only |
| Viewer | Optional `/viewer` (`react-native-image-viewing`) |

Use **`0.2.6+`** for blank-tile fixes on React Native 0.86+. Pinch zoom lands in the next publish after `0.2.7` (see [CHANGELOG](./CHANGELOG.md)).

---
## Contributing

Issues and PRs welcome.

- Open an issue: https://github.com/FaisalKhawaj/react-native-image-collage/issues/new/choose
- Local setup: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## License

MIT
