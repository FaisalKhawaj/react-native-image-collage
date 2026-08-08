# API

Complete reference for components, props, and entry points.

---

## Entry points

| Import | Requires | Best for |
|--------|----------|----------|
| `react-native-image-collage` | — | RN CLI, Expo, custom setups |
| `react-native-image-collage/viewer` | `react-native-image-viewing` | Zoomable full-screen viewer |
| `react-native-image-collage/expo` | `expo-image` | Blurhash, caching, built-in Expo viewer |

```tsx
import { ImageCollage } from "react-native-image-collage";
import { ImageCollageWithViewer } from "react-native-image-collage/viewer";
import { ImageCollageWithViewer as ExpoCollage } from "react-native-image-collage/expo";
```

---

## `ImageCollage`

Core collage component. Import from `react-native-image-collage` or `react-native-image-collage/expo`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `CollageImageInput[] \| null \| undefined` | **required** | Image URLs, sources, or `{ uri, aspectRatio }` |
| `onImagePress` | `(index: number) => void` | — | Fired when a tile is tapped (0-based index) |
| `spacing` | `number` | `6` | Gap between tiles (px) |
| `borderRadius` | `number` | `12` | Corner radius of each tile |
| `layoutMinHeight` | `number` | `200` | Minimum collage height |
| `layoutMaxHeight` | `number` | `520` | Maximum collage height |
| `height` | `number` | auto | Fixed height; otherwise derived from width / aspect ratio |
| `width` | `number` | measured | Explicit width; otherwise measured via `onLayout` |
| `maxVisibleImages` | `number` | `4` | Max tiles before `+N` on the last visible tile |
| `placeholderColor` | `string` | `#E8E8E8` | Background while images load |
| `measureAspectRatios` | `boolean` | `true` | Measure missing aspect ratios before render |
| `renderImage` | `CollageImageRenderer` | RN `Image` | Custom image component |
| `getImagePriority` | `(index) => ImagePriority` | — | Per-tile priority (`'low' \| 'normal' \| 'high'`) |
| `style` | `StyleProp<ViewStyle>` | — | Container style |
| `horizontalInset` | `number` | `0` | **Deprecated.** Fallback inset before first measure |

### Layout rules

| Visible tiles | Layout |
|--------------:|--------|
| 1 | Full width |
| 2 | Side by side |
| 3 | Large left, two stacked right |
| 4 | 2×2 grid |

When `images.length > maxVisibleImages`, the last visible tile shows `+(images.length − maxVisibleImages)`.

---

## `ImageCollageWithViewer`

Collage + built-in full-screen viewer.

- **`/viewer`** → uses `react-native-image-viewing`
- **`/expo`** → uses built-in `ExpoImageViewer` + `expo-image`

Accepts **all `ImageCollage` props**, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onImagePress` | `(index: number) => void` | — | Called before the viewer opens |
| `viewerProps` | `object` | — | Forwarded to the built-in viewer |
| `renderViewer` | `CollageViewerRenderer` | built-in | Replace the default viewer |

### `viewerProps` — `/viewer`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `swipeToCloseEnabled` | `boolean` | `true` | Swipe down to close |
| `doubleTapToZoomEnabled` | `boolean` | `true` | Double-tap to zoom |
| `presentationStyle` | `string` | `'fullScreen'` | iOS modal presentation |
| `showCloseButton` | `boolean` | `true` | Close button |
| `showIndexFooter` | `boolean` | `true` | `1 / N` footer |
| `closeButtonLabel` | `string` | `'Close'` | Close button label |

### `viewerProps` — `/expo`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCloseButton` | `boolean` | `true` | Close button |
| `showIndexFooter` | `boolean` | `true` | `1 / N` footer (hidden for 1 image) |
| `closeButtonLabel` | `string` | `'Close'` | Close button label |

> `/expo` does **not** support `swipeToCloseEnabled` or `doubleTapToZoomEnabled`.

---

## `CollageWithViewer`

Bring your own gallery. Import from `.` or `/expo`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `renderViewer` | `CollageViewerRenderer` | **required** | Your lightbox / gallery |
| `onImagePress` | `(index: number) => void` | — | Called before viewer opens |
| `prefetchViewerImages` | `boolean` | `true` | Prefetch full-size images |
| `prefetchImages` | `(uris: string[]) => void` | platform default | Override prefetch |

Plus all `ImageCollage` props.

```tsx
renderViewer={({ images, visible, imageIndex, onRequestClose }) => (
  <MyGallery
    uris={images.map((i) => i.uri)}
    visible={visible}
    initialIndex={imageIndex}
    onClose={onRequestClose}
  />
)}
```

---

## `ImageViewer` / `ExpoImageViewer`

Standalone viewers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `{ uri: string }[]` | **required** | Images to display |
| `visible` | `boolean` | **required** | Open state |
| `onRequestClose` | `() => void` | **required** | Close handler |
| `imageIndex` | `number` | `0` | Initial index |
| `showCloseButton` | `boolean` | `true` | Close button |
| `showIndexFooter` | `boolean` | `true` | Index footer |
| `closeButtonLabel` | `string` | `'Close'` | Close label |

`/viewer` also: `swipeToCloseEnabled`, `doubleTapToZoomEnabled`, `presentationStyle`.

---

## Expo-only props

Available on `ImageCollage` / `ImageCollageWithViewer` from `/expo`:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blurhash` | `string \| null` | built-in | Placeholder; pass `null` to disable |
| `prioritizeFirstImage` | `boolean` | `true` | High priority on the first visible tile |
| `prefetchImages` | `(uris: string[]) => void` | `expo-image` prefetch | Viewer prefetch override |

---

## Types

```tsx
type CollageImageInput =
  | string
  | ImageSourcePropType
  | { uri: string; aspectRatio?: number };

type ImagePriority = "low" | "normal" | "high";

type CollageImageRenderer = (props: CollageImageRenderProps) => ReactElement;

type CollageViewerRenderer = (
  props: CollageViewerRenderProps,
) => ReactElement | null;
```

---

## Exports

### Components

| Component | Entry |
|-----------|-------|
| `ImageCollage` | `.` / `/expo` |
| `CollageWithViewer` | `.` / `/expo` |
| `ImageCollageWithViewer` | `/viewer` / `/expo` |
| `ImageViewer` | `/viewer` |
| `ExpoImageViewer` | `/expo` |
| `CollageTile` | `.` / `/expo` |
| `CollageImage` | `.` / `/expo` |

### Utilities

```tsx
import {
  normalizeImages,
  resolveImagesWithAspectRatios,
  toViewerImages,
  getRemoteUri,
  computeLayoutHeight,
  useContainerWidth,
} from "react-native-image-collage";

import { createDefaultViewerRenderer } from "react-native-image-collage/viewer";

import {
  createExpoImageRenderer,
  expoImageRenderer,
  createExpoViewerRenderer,
  prefetchExpoImageUris,
} from "react-native-image-collage/expo";
```

### Constants

```tsx
import {
  DEFAULT_SPACING,            // 6
  DEFAULT_BORDER_RADIUS,      // 12
  DEFAULT_LAYOUT_MIN_HEIGHT,  // 200
  DEFAULT_LAYOUT_MAX_HEIGHT,  // 520
  DEFAULT_MAX_VISIBLE_IMAGES, // 4
  DEFAULT_PLACEHOLDER_COLOR,  // #E8E8E8
} from "react-native-image-collage";

import { DEFAULT_BLURHASH } from "react-native-image-collage/expo";
```

---

## Compatibility

| | Supported |
|--|-----------|
| React Native | `0.72+` (including `0.86+` / Expo SDK 57) |
| React | `18+` / `19+` |
| Expo | Optional `/expo` entry (`expo-image`) |
| Viewer | Optional `/viewer` peer (`react-native-image-viewing`) |

**RN 0.86 note:** `StyleSheet.absoluteFillObject` was removed. This library uses `ABSOLUTE_FILL_STYLE` so tiles render on both old and new RN. Use **`0.2.6+`** if tiles were blank on RN 0.86+.
