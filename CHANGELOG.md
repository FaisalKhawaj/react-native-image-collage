# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Pinch-to-zoom, pan, and double-tap zoom in the full-screen viewer via
  `viewerProps`:
  - `pinchToZoomEnabled` (default `true`)
  - `doubleTapToZoomEnabled` (default `true`)
  - `minScale` / `maxScale` / `doubleTapScale` (`/expo` entry)
- `ZoomableView` helper (React Native core `Animated` + `PanResponder` only —
  no gesture-handler / reanimated peers). Used by `ExpoImageViewer`.
- Docs: zoom props in README, `docs/api.md`, and `docs/examples.md`.

### Notes

- `/expo`: full pinch + pan + double-tap control (cross-platform).
- `/viewer`: uses `react-native-image-viewing` (pinch/pan built-in);
  `pinchToZoomEnabled={false}` disables double-tap zoom for that entry.

## [0.2.7] - 2026-08-08

### Fixed

- Single-image layout height: prefer measured container width over window width
  to avoid oversized tiles before `onLayout`.
- Clamp single-image aspect-based height ratios for more consistent feed sizing.

### Changed

- Restructured README into a landing page; added `docs/examples.md`,
  `docs/api.md`, `docs/screenshots.md`, and layout preview assets.

## [0.2.6] - 2026-08-07

### Fixed

- Collage tiles no longer render blank on **React Native 0.86+** (Expo SDK 57).
  RN removed `StyleSheet.absoluteFillObject`; the library now uses a shared
  absolute-fill helper that works on **0.72+** and **0.86+**.

### Changed

- Added `src/utils/absoluteFillStyle.ts` with `ABSOLUTE_FILL_STYLE` and helpers
  used by collage tiles and the default Expo image renderer.
- Documented React Native compatibility in the README.

## [0.2.5] - Previous release

See git history for earlier changes.
