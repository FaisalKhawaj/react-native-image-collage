export { ImageCollage } from "./ImageCollage";
export { CollageWithViewer } from "./CollageWithViewer";
export { CollageImage, renderCollageImage } from "./CollageImage";
export { CollageTile } from "./CollageTile";

/** @deprecated Use `ImageCollage` instead. Kept for backwards compatibility. */
export { ImageCollage as ImageCollague } from "./ImageCollage";

export type {
  CollageImageInput,
  CollageImageRenderProps,
  CollageImageRenderer,
  CollageViewerRenderProps,
  CollageViewerRenderer,
  CollageWithViewerProps,
  ImageCollageProps,
  ImagePriority,
  NormalizedCollageImage,
} from "./types";

export {
  DEFAULT_PLACEHOLDER_COLOR,
  DEFAULT_PLACEHOLDER_BG,
  DEFAULT_SPACING,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_LAYOUT_MIN_HEIGHT,
  DEFAULT_LAYOUT_MAX_HEIGHT,
  DEFAULT_MAX_VISIBLE_IMAGES,
  ANDROID_RIPPLE,
} from "./constants";

export {
  normalizeImageInput,
  normalizeImages,
  measureImageAspectRatio,
  resolveImagesWithAspectRatios,
  toViewerImages,
  getRemoteUri,
} from "./utils/imageSources";

export { computeLayoutHeight } from "./utils/layoutHeight";
export { useContainerWidth } from "./hooks/useContainerWidth";
