import React, { useMemo } from "react";
import { ImageCollage as BaseImageCollage } from "../ImageCollage";
import { CollageWithViewer as BaseCollageWithViewer } from "../CollageWithViewer";
import type {
  ExpoImageCollageOptions,
  ImageCollageProps,
  ImageCollageWithViewerProps,
} from "../types";
import { DEFAULT_MAX_VISIBLE_IMAGES } from "../constants";
import { createExpoViewerRenderer, ExpoImageViewer } from "./ExpoImageViewer";
import { createExpoImageRenderer } from "./createExpoImageRenderer";
import { prefetchExpoImageUris } from "./prefetchExpoImages";
import { createVisibleTilesPriority } from "../utils/collageImagePriority";

export { CollageImage, renderCollageImage } from "../CollageImage";
export { CollageTile } from "../CollageTile";
export { CollageWithViewer } from "../CollageWithViewer";
export { ImageCollage as ImageCollague } from "../ImageCollage";
export { ImageViewer, createDefaultViewerRenderer } from "../viewer/ImageViewer";
export {
  ExpoImageViewer,
  createExpoViewerRenderer,
} from "./ExpoImageViewer";
export { prefetchExpoImageUris } from "./prefetchExpoImages";

export type {
  CollageImageInput,
  CollageImageRenderProps,
  CollageImageRenderer,
  CollageViewerRenderProps,
  CollageViewerRenderer,
  CollageWithViewerProps,
  ExpoImageCollageOptions,
  ImageCollageProps,
  ImageCollageWithViewerProps,
  ImagePriority,
  ImageViewerImage,
  ImageViewerProps,
  NormalizedCollageImage,
} from "../types";

export {
  ANDROID_RIPPLE,
  DEFAULT_BLURHASH,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_LAYOUT_MAX_HEIGHT,
  DEFAULT_LAYOUT_MIN_HEIGHT,
  DEFAULT_MAX_VISIBLE_IMAGES,
  DEFAULT_PLACEHOLDER_BG,
  DEFAULT_PLACEHOLDER_COLOR,
  DEFAULT_SPACING,
} from "../constants";

export {
  createExpoImageRenderer,
  expoImageRenderer,
} from "./createExpoImageRenderer";

type ExpoCollageProps = ImageCollageProps & ExpoImageCollageOptions;

function buildExpoCollageProps({
  blurhash,
  prioritizeFirstImage = true,
  renderImage,
  getImagePriority,
  maxVisibleImages,
  ...props
}: ExpoCollageProps): ImageCollageProps {
  const effectiveMaxVisible = Math.max(1, maxVisibleImages ?? DEFAULT_MAX_VISIBLE_IMAGES);

  return {
    ...props,
    maxVisibleImages,
    renderImage: renderImage ?? createExpoImageRenderer({ blurhash }),
    getImagePriority:
      getImagePriority ??
      createVisibleTilesPriority(effectiveMaxVisible, prioritizeFirstImage),
  };
}

export function ImageCollage(props: ExpoCollageProps) {
  return <BaseImageCollage {...buildExpoCollageProps(props)} />;
}

export function ImageCollageWithViewer({
  blurhash,
  prioritizeFirstImage,
  renderImage,
  getImagePriority,
  viewerProps,
  renderViewer,
  onImagePress,
  prefetchImages = prefetchExpoImageUris,
  ...collageProps
}: ImageCollageWithViewerProps & ExpoImageCollageOptions) {
  const defaultExpoViewer = useMemo(
    () => createExpoViewerRenderer(viewerProps),
    [viewerProps],
  );

  return (
    <BaseCollageWithViewer
      {...buildExpoCollageProps({
        ...collageProps,
        blurhash,
        prioritizeFirstImage,
        renderImage,
        getImagePriority,
      })}
      prefetchImages={prefetchImages}
      onImagePress={onImagePress}
      renderViewer={renderViewer ?? defaultExpoViewer}
    />
  );
}
