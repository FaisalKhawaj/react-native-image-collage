import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { DEFAULT_BLURHASH } from "../constants";
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
        style={[StyleSheet.absoluteFill, style]}
      />
    );
  };
}

/** Pre-built renderer using `expo-image` and the default blurhash. */
export const expoImageRenderer = createExpoImageRenderer();
