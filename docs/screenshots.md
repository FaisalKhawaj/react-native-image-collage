# Adding screenshots to the docs

Screenshots make the package look production-ready (same pattern as libraries like [react-native-popup-menu](https://github.com/instea/react-native-popup-menu/blob/HEAD/doc/examples.md)).

## Where files live

```
docs/
  assets/
    layout-1.jpg
    layout-2.jpg
    layout-3.jpg
    layout-4.jpg
    layout-overflow.jpg
  examples.md
  api.md
  screenshots.md
```

## Recommended workflow

### 1. Run the example app

```bash
npm run example
# or
cd example && npx expo start --clear
```

Open the iOS Simulator or Android emulator.

### 2. Capture each layout

In the playground:

1. Set **Images** to `1`, `2`, `3`, `4`, then `6`
2. Capture the **Preview** card only (crop chrome if needed)

| Layout | Suggested filename |
|--------|--------------------|
| 1 image | `docs/assets/layout-1.jpg` |
| 2 images | `docs/assets/layout-2.jpg` |
| 3 images | `docs/assets/layout-3.jpg` |
| 4 images | `docs/assets/layout-4.jpg` |
| 6 images (`+2`) | `docs/assets/layout-overflow.jpg` |

### 3. Capture tips

**iOS Simulator**

- `⌘ + S` saves a screenshot to the Desktop
- Or **File → Save Screen**

**Android emulator**

- Camera icon in the emulator toolbar

**Crop & compress**

- Keep width around **800–1200px**
- Prefer **JPG** (quality ~80) or compressed PNG
- Aim for **&lt; 300 KB** per image so GitHub / npm stay fast

```bash
# macOS: resize + jpeg
sips -Z 1200 shot.png --out docs/assets/layout-3.jpg
sips -s format jpeg -s formatOptions 80 docs/assets/layout-3.jpg
```

### 4. Reference in Markdown

**In `docs/` (GitHub):** relative paths work

```md
![Three images](./assets/layout-3.jpg)
```

**In root `README.md` (GitHub + npm):** use **absolute** raw URLs so images also render on [npmjs.com](https://www.npmjs.com/package/react-native-image-collage)

```md
![Three images](https://raw.githubusercontent.com/FaisalKhawaj/react-native-image-collage/main/docs/assets/layout-3.jpg)
```

> Relative image paths often **break on the npm website**. Absolute `raw.githubusercontent.com` URLs work on both GitHub and npm.

### 5. Commit & push

```bash
git add docs/assets docs/examples.md README.md
git commit -m "docs: add layout screenshots"
git push
```

After push, refresh the npm package page (or republish if you want the README update on npm).

## Optional: GIF for the viewer

For a “tap → fullscreen” demo:

1. Record the simulator (iOS: `⌘ + R` in Simulator, or QuickTime)
2. Convert to GIF (e.g. [Kap](https://getkap.co/), `ffmpeg`)
3. Save as `docs/assets/viewer-demo.gif`
4. Embed the same way as JPG screenshots

## Checklist

- [ ] Real device / simulator shots (not only mockups)
- [ ] Consistent crop, padding, and border radius across images
- [ ] Files under `docs/assets/`
- [ ] Absolute URLs in root `README.md`
- [ ] Relative paths in `docs/examples.md`
