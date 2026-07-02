import React, { memo, useMemo } from "react";
import { CollageWithViewer } from "../CollageWithViewer";
import type { ImageCollageWithViewerProps } from "../types";
import { resolveDefaultViewerRenderer } from "../utils/resolveDefaultImageRenderer";

export const ImageCollageWithViewer = memo(function ImageCollageWithViewer({
  viewerProps,
  renderViewer,
  onImagePress,
  ...collageProps
}: ImageCollageWithViewerProps) {
  const defaultRenderer = useMemo(
    () => renderViewer ?? resolveDefaultViewerRenderer(viewerProps),
    [renderViewer, viewerProps],
  );

  return (
    <CollageWithViewer
      {...collageProps}
      onImagePress={onImagePress}
      renderViewer={defaultRenderer}
    />
  );
});
