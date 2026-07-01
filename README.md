# react-native-image-collage

[![npm version](https://img.shields.io/npm/v/react-native-image-collage.svg)](https://www.npmjs.com/package/react-native-image-collage)
[![GitHub issues](https://img.shields.io/github/issues/FaisalKhawaj/react-native-image-collage)](https://github.com/FaisalKhawaj/react-native-image-collage/issues)

An easy-to-use collage layout component for React Native — similar to how **Facebook / Instagram show images in a post**.

Supports **1 to N images**, automatic layouts, `+N` overflow badges, optional full-screen viewer, and works with **React Native CLI** and **Expo**.

```bash
npm install react-native-image-collage
# or
yarn add react-native-image-collage
```

---

## Table of contents

- [Quick start](#quick-start)
- [Layouts](#layouts)
- [Use cases](#use-cases)
  - [Single image](#1-single-image)
  - [Two images](#2-two-images-side-by-side)
  - [Three images](#3-three-images-facebook-style)
  - [Four images](#4-four-images-2×2-grid)
  - [Five or more images (+N overflow)](#5-five-or-more-images-n-overflow)
  - [Custom overflow count](#6-custom-overflow-count)
  - [Tap to open handler](#7-tap-to-open-handler)
  - [Collage + built-in full-screen viewer](#8-collage--built-in-full-screen-viewer)
  - [Collage + your own gallery](#9-collage--your-own-gallery)
  - [Expo with blurhash & caching](#10-expo-with-blurhash--caching)
  - [Custom image component (FastImage, etc.)](#11-custom-image-component-fastimage-etc)
  - [Local images (require)](#12-local-images-require)
  - [Images with aspect ratio](#13-images-with-aspect-ratio)
  - [Inside a card or padded container](#14-inside-a-card-or-padded-container)
- [Entry points](#entry-points)
- [Props](#props)
- [Image input formats](#image-input-formats)
- [Exports](#exports)
- [Contributing & issues](#contributing--issues)
- [License](#license)

---

## Quick start

```tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { ImageCollage } from "react-native-image-collage";

const images = [
  {
    uri: "https://picsum.photos/206",
    aspectRatio: 1.5,
  },
  "https://picsum.photos/207",
  "https://picsum.photos/208",
];

export default function PostImages() {
  return (
    <View style={styles.container}>
      <ImageCollage
        images={images}
        spacing={2}
        borderRadius={8}
        layoutMinHeight={180}
        layoutMaxHeight={400}
        onImagePress={(index) => console.log("Tapped image", index)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
});
```

> Width is measured from the parent container automatically. Height is computed from width and image count (or aspect ratio when available).

---

## Layouts

| Images | Layout |
|--------|--------|
| **1** | Full-width single image |
| **2** | Side by side |
| **3** | One large left, two stacked right (Facebook style) |
| **4** | 2×2 grid |
| **5+** | 2×2 grid with `+N` on the last visible tile |

```
1 image          2 images         3 images              4 images
┌──────────┐     ┌────┬────┐     ┌────┬────┐          ┌────┬────┐
│          │     │    │    │     │    │ 2  │          │ 1  │ 2  │
│    1     │     │ 1  │ 2  │     │ 1  ├────┤          ├────┼────┤
│          │     │    │    │     │    │ 3  │          │ 3  │ 4  │
└──────────┘     └────┴────┘     └────┴────┘          └────┴────┘

5+ images (default maxVisibleImages=4)
┌────┬────┐
│ 1  │ 2  │
├────┼────┤
│ 3  │+2  │  ← 4th tile shows last image with +2 overlay (6 total)
└────┴────┘
```

---

## Use cases

### 1. Single image

```tsx
<ImageCollage
  images={[
    {
      uri: "https://picsum.photos/205",
      aspectRatio: 1.5,
    },
  ]}
  spacing={2}
/>
```

When `aspectRatio` is provided (or measured), height adapts to the image proportions.

---

### 2. Two images (side by side)

```tsx
<ImageCollage
  images={[
    "https://picsum.photos/200",
    "https://picsum.photos/201",
  ]}
  spacing={2}
/>
```

---

### 3. Three images (Facebook style)

```tsx
<ImageCollage images={photoUrls} spacing={2} borderRadius={8} />
```

One image on the left, two stacked on the right — the classic social feed layout.

---

### 4. Four images (2×2 grid)

```tsx
<ImageCollage images={photoUrls} spacing={2} />
```

---

### 5. Five or more images (+N overflow)

By default, up to **4 tiles** are shown. Extra images are indicated with a `+N` badge on the last tile.

```tsx
// 6 images → shows 4 tiles, last tile displays "+2"
<ImageCollage images={sixPhotoUrls} />
```

| Total images | What you see |
|--------------|--------------|
| 5 | 2×2 grid, `+1` on 4th tile |
| 6 | 2×2 grid, `+2` on 4th tile |
| 10 | 2×2 grid, `+6` on 4th tile |

---

### 6. Custom overflow count

Use `maxVisibleImages` to control how many tiles appear before the `+N` badge.

```tsx
// 4 images → 3-tile layout, "+1" on the 3rd tile
<ImageCollage images={photoUrls} maxVisibleImages={3} />

// 3 images → 2-tile row, "+1" on the 2nd tile
<ImageCollage images={photoUrls} maxVisibleImages={2} />
```

| Total images | `maxVisibleImages` | Result |
|--------------|-------------------|--------|
| 4 | `3` | 3-tile layout, `+1` on 3rd tile |
| 5 | `4` | 2×2 grid, `+1` on 4th tile (default) |
| 6 | `4` | 2×2 grid, `+2` on 4th tile |
| 3 | `2` | 2-tile row, `+1` on 2nd tile |

Formula: **`+N = totalImages - maxVisibleImages`**

---

### 7. Tap to open handler

```tsx
<ImageCollage
  images={photoUrls}
  onImagePress={(index) => {
    // index = 0-based position of the tapped tile
    navigation.navigate("PhotoDetail", { index });
  }}
/>
```

---

### 8. Collage + built-in full-screen viewer

Opens a zoomable full-screen gallery when a tile is tapped.

```bash
npm install react-native-image-viewing
```

```tsx
import { ImageCollageWithViewer } from "react-native-image-collage/viewer";

<ImageCollageWithViewer
  images={photoUrls}
  spacing={2}
  borderRadius={8}
  viewerProps={{
    swipeToCloseEnabled: true,
    doubleTapToZoomEnabled: true,
    showCloseButton: true,
    showIndexFooter: true,
    closeButtonLabel: "Close",
  }}
/>
```

---

### 9. Collage + your own gallery

Bring your own lightbox / gallery component.

```tsx
import { CollageWithViewer } from "react-native-image-collage";

<CollageWithViewer
  images={photoUrls}
  spacing={2}
  renderViewer={({ images, visible, imageIndex, onRequestClose }) => (
    <MyGallery
      uris={images.map((img) => img.uri)}
      visible={visible}
      initialIndex={imageIndex}
      onClose={onRequestClose}
    />
  )}
/>
```

---

### 10. Expo with blurhash & caching

Uses `expo-image` for better performance, disk caching, and blurhash placeholders.

```bash
npx expo install react-native-image-collage expo-image
```

```tsx
import { ImageCollageWithViewer } from "react-native-image-collage/expo";

<ImageCollageWithViewer
  images={photoUrls}
  spacing={2}
  blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
  prioritizeFirstImage
/>
```

> `blurhash` and `prioritizeFirstImage` are only available on the `/expo` entry.

---

### 11. Custom image component (FastImage, etc.)

```tsx
import { ImageCollage } from "react-native-image-collage";
import FastImage from "react-native-fast-image";

<ImageCollage
  images={photoUrls}
  renderImage={({ source, style }) => (
    <FastImage
      source={source}
      style={style}
      resizeMode={FastImage.resizeMode.cover}
    />
  )}
/>
```

---

### 12. Local images (require)

```tsx
<ImageCollage
  images={[
    require("./assets/photo1.png"),
    require("./assets/photo2.png"),
  ]}
/>
```

---

### 13. Images with aspect ratio

Pass `aspectRatio` to skip network measurement and get accurate height faster.

```tsx
const images = [
  { uri: "https://picsum.photos/208", aspectRatio: 1.91 },
  { uri: "https://picsum.photos/206", aspectRatio: 1 },
  { uri: "https://picsum.photos/204", aspectRatio: 0.75 },
];

<ImageCollage images={images} />
```

If `aspectRatio` is omitted, remote and local images are measured automatically (`measureAspectRatios` defaults to `true`).

---

### 14. Inside a card or padded container

The collage measures its **parent width** via `onLayout` — no need to pass screen width manually.

```tsx
<View style={{ paddingHorizontal: 16 }}>
  <ImageCollage images={photoUrls} spacing={2} />
</View>
```

Optional overrides:

```tsx
// Fixed width
<ImageCollage images={photoUrls} width={320} />

// Fixed height
<ImageCollage images={photoUrls} height={280} />
```

---

## Entry points

| Import | Requires | Best for |
|--------|----------|----------|
| `react-native-image-collage` | Nothing extra | RN CLI, Expo, custom setups |
| `react-native-image-collage/viewer` | `react-native-image-viewing` | Built-in full-screen viewer |
| `react-native-image-collage/expo` | `expo-image` | Blurhash, caching, priority loading |

---

## Props

### `ImageCollage`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `CollageImageInput[]` | **required** | Array of image URLs, sources, or `{ uri, aspectRatio }` objects |
| `onImagePress` | `(index: number) => void` | — | Called when a tile is tapped. Receives the 0-based image index |
| `spacing` | `number` | `6` | Gap between tiles (px) |
| `borderRadius` | `number` | `12` | Corner radius of each tile |
| `layoutMinHeight` | `number` | `200` | Minimum collage height |
| `layoutMaxHeight` | `number` | `520` | Maximum collage height |
| `height` | `number` | auto | Fixed height. When omitted, height is computed from container width |
| `width` | `number` | measured | Explicit container width. When omitted, measured from parent via `onLayout` |
| `maxVisibleImages` | `number` | `4` | Max tiles before `+N` overflow badge on the last tile |
| `placeholderColor` | `string` | `#E8E8E8` | Background color behind tiles while images load |
| `measureAspectRatios` | `boolean` | `true` | Automatically measure images when `aspectRatio` is not provided |
| `renderImage` | `CollageImageRenderer` | RN `Image` | Custom image component (FastImage, expo-image, etc.) |
| `getImagePriority` | `(index) => 'low' \| 'normal' \| 'high'` | — | Per-tile load priority hint for custom renderers |
| `style` | `ViewStyle` | — | Style applied to the collage container |
| `horizontalInset` | `number` | `0` | **Deprecated.** Fallback screen inset before first layout measure |

---

### `ImageCollageWithViewer`  
Import from `react-native-image-collage/viewer`

Accepts **all `ImageCollage` props**, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onImagePress` | `(index: number) => void` | — | Called when a tile is tapped, before the viewer opens |
| `viewerProps` | `object` | — | Props passed to the built-in viewer (see below) |
| `renderViewer` | `CollageViewerRenderer` | built-in | Replace the default full-screen viewer |

#### `viewerProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `swipeToCloseEnabled` | `boolean` | `true` | Swipe down to close |
| `doubleTapToZoomEnabled` | `boolean` | `true` | Double-tap to zoom |
| `presentationStyle` | `string` | `'fullScreen'` | iOS modal style |
| `showCloseButton` | `boolean` | `true` | Show close button header |
| `showIndexFooter` | `boolean` | `true` | Show `1 / N` index footer |
| `closeButtonLabel` | `string` | `'Close'` | Close button text |

---

### `CollageWithViewer`  
Import from `react-native-image-collage`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `renderViewer` | `CollageViewerRenderer` | **required** | Your gallery / lightbox component |
| `onImagePress` | `(index: number) => void` | — | Called when a tile is tapped, before viewer opens |

Plus all `ImageCollage` props.

---

### `ImageViewer` (standalone)  
Import from `react-native-image-collage/viewer`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `{ uri: string }[]` | **required** | Images for the viewer |
| `visible` | `boolean` | **required** | Whether the viewer is open |
| `onRequestClose` | `() => void` | **required** | Called when viewer should close |
| `imageIndex` | `number` | `0` | Initially displayed image |
| `swipeToCloseEnabled` | `boolean` | `true` | Swipe down to close |
| `doubleTapToZoomEnabled` | `boolean` | `true` | Double-tap to zoom |
| `presentationStyle` | `string` | `'fullScreen'` | iOS modal style |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `showIndexFooter` | `boolean` | `true` | Show index footer |
| `closeButtonLabel` | `string` | `'Close'` | Close button label |

---

### Expo-only props  
Import from `react-native-image-collage/expo`

Available on `ImageCollage` and `ImageCollageWithViewer`:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blurhash` | `string` | built-in default | Blurhash placeholder while images load |
| `prioritizeFirstImage` | `boolean` | `true` | Load the first image with high priority |

---

## Image input formats

`images` accepts any of the following per item:

```tsx
// 1. URL string
"https://picsum.photos/200"

// 2. Object with optional aspect ratio (recommended for network images)
{ uri: "https://picsum.photos/201", aspectRatio: 1.5 }

// 3. React Native image source (local require, headers, etc.)
require("./photo.png")
{ uri: "https://example.com/photo.jpg", headers: { Authorization: "..." } }
```

---

## Exports

### Components

| Component | Entry |
|-----------|-------|
| `ImageCollage` | `.` / `/expo` |
| `CollageTile` | `.` |
| `CollageImage` | `.` |
| `CollageWithViewer` | `.` |
| `ImageCollageWithViewer` | `/viewer` / `/expo` |
| `ImageViewer` | `/viewer` |

### Utilities

```tsx
import {
  normalizeImages,
  resolveImagesWithAspectRatios,
  toViewerImages,
  getRemoteUri,
  computeLayoutHeight,
  useContainerWidth,
  createExpoImageRenderer,       // /expo only
  createDefaultViewerRenderer,   // /viewer only
} from "react-native-image-collage";
```

### Constants

```tsx
import {
  DEFAULT_SPACING,           // 6
  DEFAULT_BORDER_RADIUS,     // 12
  DEFAULT_LAYOUT_MIN_HEIGHT, // 200
  DEFAULT_LAYOUT_MAX_HEIGHT, // 520
  DEFAULT_MAX_VISIBLE_IMAGES,// 4
  DEFAULT_PLACEHOLDER_COLOR, // #E8E8E8
} from "react-native-image-collage";
```

---

## Contributing & issues

Found a bug or want to contribute? See the [contributing guide on GitHub](https://github.com/FaisalKhawaj/react-native-image-collage/blob/main/CONTRIBUTING.md) for local setup and the example app.

**Open an issue:** https://github.com/FaisalKhawaj/react-native-image-collage/issues/new/choose

When reporting a bug, include your React Native / Expo version, platform, and steps to reproduce.

---

## License

MIT
