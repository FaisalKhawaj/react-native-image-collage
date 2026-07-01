import React, { memo, useMemo } from "react";
import { CollageWithViewer } from "../CollageWithViewer";
import type { ImageCollageWithViewerProps } from "../types";
import { createDefaultViewerRenderer } from "./ImageViewer";

export const ImageCollageWithViewer = memo(function ImageCollageWithViewer({
  viewerProps,
  renderViewer,
  onImagePress,
  ...collageProps
}: ImageCollageWithViewerProps) {
  const defaultRenderer = useMemo(
    () => createDefaultViewerRenderer(viewerProps),
    [viewerProps],
  );

  return (
    <CollageWithViewer
      {...collageProps}
      onImagePress={onImagePress}
      renderViewer={renderViewer ?? defaultRenderer}
    />
  );
});
