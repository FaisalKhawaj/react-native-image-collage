import React, { memo, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_LAYOUT_MAX_HEIGHT,
  DEFAULT_LAYOUT_MIN_HEIGHT,
  DEFAULT_MAX_VISIBLE_IMAGES,
  DEFAULT_PLACEHOLDER_COLOR,
  DEFAULT_SPACING,
} from "./constants";
import { useContainerWidth } from "./hooks/useContainerWidth";
import type {
  CollageImageRenderer,
  ImageCollageProps,
  ImagePriority,
} from "./types";
import { computeLayoutHeight } from "./utils/layoutHeight";
import {
  normalizeImages,
  resolveImagesWithAspectRatios,
} from "./utils/imageSources";
import { prefetchWithBestEffort } from "./utils/resolveDefaultImageRenderer";
import { createVisibleTilesPriority } from "./utils/collageImagePriority";
import { resolveDefaultImageRenderer } from "./utils/resolveDefaultImageRenderer";
import {
  collageLayoutStyles,
  getCollageLayoutStyle,
  renderCollageContent,
} from "./utils/renderCollageLayouts";

type SharedTileConfig = {
  onPress?: (index: number) => void;
  borderRadius: number;
  placeholderColor: string;
  getImagePriority?: (index: number) => ImagePriority;
  renderImage?: CollageImageRenderer;
};

export const ImageCollage = memo(function ImageCollage({
  images,
  height,
  width,
  horizontalInset = 0,
  borderRadius = DEFAULT_BORDER_RADIUS,
  spacing = DEFAULT_SPACING,
  maxVisibleImages = DEFAULT_MAX_VISIBLE_IMAGES,
  onImagePress,
  layoutMinHeight = DEFAULT_LAYOUT_MIN_HEIGHT,
  layoutMaxHeight = DEFAULT_LAYOUT_MAX_HEIGHT,
  placeholderColor = DEFAULT_PLACEHOLDER_COLOR,
  measureAspectRatios = true,
  getImagePriority,
  renderImage,
  style,
}: ImageCollageProps) {
  const effectiveMaxVisible = Math.max(1, maxVisibleImages);
  const effectiveRenderImage = renderImage ?? resolveDefaultImageRenderer();
  const effectiveGetImagePriority =
    getImagePriority ?? createVisibleTilesPriority(effectiveMaxVisible);
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [resolvedImages, setResolvedImages] = useState(normalizedImages);

  const { containerWidth, onLayout } = useContainerWidth({
    width,
    horizontalInset,
  });

  useEffect(() => {
    let cancelled = false;

    setResolvedImages(normalizedImages);

    if (!measureAspectRatios) {
      return;
    }

    const needsMeasurement = normalizedImages.some(
      (image) => image.aspectRatio == null,
    );

    if (!needsMeasurement) {
      return;
    }

    resolveImagesWithAspectRatios(normalizedImages).then((nextImages) => {
      if (!cancelled) {
        setResolvedImages(nextImages);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [measureAspectRatios, normalizedImages]);

  useEffect(() => {
    if (!normalizedImages.length) return;

    const uris = normalizedImages
      .map((image) => image.remoteUri)
      .filter((uri): uri is string => Boolean(uri));

    prefetchWithBestEffort(uris);
  }, [normalizedImages]);

  const layoutHeight = computeLayoutHeight({
    contentWidth: containerWidth,
    images: resolvedImages,
    height,
    layoutMinHeight,
    layoutMaxHeight,
  });

  const sharedTileConfig: SharedTileConfig = {
    onPress: onImagePress,
    borderRadius,
    placeholderColor,
    getImagePriority: effectiveGetImagePriority,
    renderImage: effectiveRenderImage,
  };

  if (!resolvedImages.length) {
    return null;
  }

  const count = resolvedImages.length;
  const { containerStyle, row } = getCollageLayoutStyle({
    count,
    maxVisibleImages: effectiveMaxVisible,
    layoutHeight,
    spacing,
    borderRadius,
  });

  return (
    <View
      onLayout={onLayout}
      style={[
        style,
        row ? collageLayoutStyles.row : undefined,
        containerStyle,
      ]}
    >
      {renderCollageContent({
        images: resolvedImages,
        layoutHeight,
        spacing,
        borderRadius,
        placeholderColor,
        maxVisibleImages: effectiveMaxVisible,
        onImagePress,
        renderImage: effectiveRenderImage,
        sharedTileConfig,
      })}
    </View>
  );
});
