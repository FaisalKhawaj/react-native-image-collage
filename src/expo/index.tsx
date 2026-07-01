import React from "react";
import { ImageCollage as BaseImageCollage } from "../ImageCollage";
import type {
  ExpoImageCollageOptions,
  ImageCollageProps,
  ImageCollageWithViewerProps,
  ImagePriority,
} from "../types";
import { ImageCollageWithViewer as BaseImageCollageWithViewer } from "../viewer/ImageCollageWithViewer";
import { createExpoImageRenderer } from "./createExpoImageRenderer";

export { CollageImage, renderCollageImage } from "../CollageImage";
export { CollageTile } from "../CollageTile";
export { CollageWithViewer } from "../CollageWithViewer";
export { ImageCollage as ImageCollague } from "../ImageCollage";
export { ImageViewer, createDefaultViewerRenderer } from "../viewer/ImageViewer";
export { ImageCollageWithViewer as BaseImageCollageWithViewer } from "../viewer/ImageCollageWithViewer";

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
  ...props
}: ExpoCollageProps): ImageCollageProps {
  return {
    ...props,
    renderImage: renderImage ?? createExpoImageRenderer({ blurhash }),
    getImagePriority:
      getImagePriority ??
      ((index: number): ImagePriority =>
        index === 0 && prioritizeFirstImage ? "high" : "normal"),
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
  ...collageProps
}: ImageCollageWithViewerProps & ExpoImageCollageOptions) {
  return (
    <BaseImageCollageWithViewer
      {...buildExpoCollageProps({
        ...collageProps,
        blurhash,
        prioritizeFirstImage,
        renderImage,
        getImagePriority,
      })}
      viewerProps={viewerProps}
      renderViewer={renderViewer}
      onImagePress={onImagePress}
    />
  );
}
