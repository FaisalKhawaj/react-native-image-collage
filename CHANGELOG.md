# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
