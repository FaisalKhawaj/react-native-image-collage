import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

/**
 * Explicit absolute-fill box. Safe for `StyleSheet.create()` on all supported
 * React Native versions (including 0.86+, where `absoluteFillObject` was removed).
 */
export const ABSOLUTE_FILL_STYLE: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/**
 * Returns a parent-filling absolute style.
 *
 * - **RN 0.86+**: `StyleSheet.absoluteFillObject` is undefined; explicit edges are required.
 * - **RN 0.72–0.85**: `absoluteFill` / `absoluteFillObject` exist but registered styles
 *   are awkward inside `StyleSheet.create()`; explicit edges remain the stable choice.
 */
export function getAbsoluteFillStyle(): ViewStyle {
  return ABSOLUTE_FILL_STYLE;
}

/**
 * Prefer RN's registered absolute fill for **inline** image styles when the runtime
 * exposes it; otherwise use {@link ABSOLUTE_FILL_STYLE}.
 */
export function getInlineAbsoluteFillStyle(): ViewStyle {
  const sheet = StyleSheet as typeof StyleSheet & {
    absoluteFill?: ViewStyle;
    absoluteFillObject?: ViewStyle;
  };

  return sheet.absoluteFill ?? sheet.absoluteFillObject ?? ABSOLUTE_FILL_STYLE;
}

export function mergeAbsoluteFillStyle(
  style?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  const fill = getInlineAbsoluteFillStyle();
  return style ? [fill, style] : fill;
}

/** @deprecated Use {@link ABSOLUTE_FILL_STYLE} */
export const ABSOLUTE_FILL = ABSOLUTE_FILL_STYLE;
