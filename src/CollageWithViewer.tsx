import React, { memo, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { ImageCollage } from "./ImageCollage";
import type { CollageWithViewerProps } from "./types";
import { normalizeImages, toViewerImages } from "./utils/imageSources";

export const CollageWithViewer = memo(function CollageWithViewer({
  images,
  renderViewer,
  onImagePress,
  ...collageProps
}: CollageWithViewerProps) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewerImages = useMemo(
    () => toViewerImages(normalizeImages(images)),
    [images],
  );

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
