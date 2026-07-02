import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { ImageCollage } from "./ImageCollage";
import type { CollageWithViewerProps } from "./types";
import {
  normalizeImages,
  toViewerImages,
} from "./utils/imageSources";
import {
  prefetchWithBestEffort,
  resolveDefaultImageRenderer,
} from "./utils/resolveDefaultImageRenderer";
import { createVisibleTilesPriority } from "./utils/collageImagePriority";

export const CollageWithViewer = memo(function CollageWithViewer({
  images,
  renderViewer,
  onImagePress,
  prefetchViewerImages = true,
  prefetchImages = prefetchWithBestEffort,
  ...collageProps
}: CollageWithViewerProps) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewerImages = useMemo(
    () => toViewerImages(normalizeImages(images)),
    [images],
  );

  useEffect(() => {
    if (!prefetchViewerImages || !viewerImages.length) {
      return;
    }

    prefetchImages(viewerImages.map((image) => image.uri));
  }, [images, prefetchImages, prefetchViewerImages, viewerImages]);

  const openViewerAt = useCallback(
    (index: number) => {
      onImagePress?.(index);
      setViewerIndex(index);
      setViewerVisible(true);
    },
    [onImagePress],
  );

  const closeViewer = useCallback(() => {
    setViewerVisible(false);
  }, []);

  if (!viewerImages.length) {
    return null;
  }

  return (
    <View>
      <ImageCollage
        images={images}
        onImagePress={openViewerAt}
        {...collageProps}
      />
      {renderViewer({
        images: viewerImages,
        visible: viewerVisible,
        imageIndex: viewerIndex,
        onRequestClose: closeViewer,
      })}
    </View>
  );
});
