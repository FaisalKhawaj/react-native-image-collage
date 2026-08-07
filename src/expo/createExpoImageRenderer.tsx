import React from "react";
import { Image } from "expo-image";
import type { ImageStyle, StyleProp } from "react-native";
import { DEFAULT_BLURHASH } from "../constants";
import { mergeAbsoluteFillStyle } from "../utils/absoluteFillStyle";
import type { CollageImageRenderer } from "../types";

type ExpoImageRendererOptions = {
  /** Set to `null` to disable the blurhash placeholder. */
  blurhash?: string | null;
};

export function createExpoImageRenderer(
  options: ExpoImageRendererOptions = {},
): CollageImageRenderer {
  const blurhash =
    options.blurhash === null ? undefined : (options.blurhash ?? DEFAULT_BLURHASH);

  return function ExpoCollageImage({
    source,
    remoteUri,
    priority,
    transition,
    style,
  }) {
    const recyclingKey = remoteUri ?? undefined;

    return (
      <Image
        source={source}
        recyclingKey={recyclingKey}
        cachePolicy="memory-disk"
        allowDownscaling
        priority={priority}
        {...(blurhash
          ? {
              placeholder: blurhash,
              placeholderContentFit: "cover" as const,
            }
          : {})}
        contentFit="cover"
        transition={transition}
        style={mergeAbsoluteFillStyle(style) as StyleProp<ImageStyle>}
      />
    );
  };
}

/** Pre-built renderer using `expo-image` and the default blurhash. */
export const expoImageRenderer = createExpoImageRenderer();
