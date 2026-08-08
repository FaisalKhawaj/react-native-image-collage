import type { NormalizedCollageImage } from "../types";

/** While remote aspect ratio is loading — matches common feed default (square). */
const SINGLE_IMAGE_LOADING_RATIO = 1;

/** Clamp single-image height so portrait/landscape posts look consistent across devices. */
const SINGLE_IMAGE_MIN_HEIGHT_RATIO = 0.75;
const SINGLE_IMAGE_MAX_HEIGHT_RATIO = 1.25;

function heightRatioForImageCount(count: number) {
  if (count <= 1) return SINGLE_IMAGE_LOADING_RATIO;
  if (count === 2) return 0.75;
  if (count === 3) return 0.9;
  if (count === 4) return 1.0;
  return 1.05;
}

function clampSingleImageHeightRatio(ratio: number): number {
  return Math.min(
    SINGLE_IMAGE_MAX_HEIGHT_RATIO,
    Math.max(SINGLE_IMAGE_MIN_HEIGHT_RATIO, ratio),
  );
}

function averageAspectRatio(images: NormalizedCollageImage[]): number | undefined {
  const ratios = images
    .map((image) => image.aspectRatio)
    .filter((ratio): ratio is number => ratio != null && ratio > 0);

  if (!ratios.length) {
    return undefined;
  }

  return ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
}

export function computeLayoutHeight({
  contentWidth,
  images,
  height,
  layoutMinHeight,
  layoutMaxHeight,
}: {
  contentWidth: number;
  images: NormalizedCollageImage[];
  height?: number;
  layoutMinHeight: number;
  layoutMaxHeight: number;
}): number {
  if (height != null) {
    return Math.max(layoutMinHeight, Math.min(height, layoutMaxHeight));
  }

  const count = images.length;
  let ratio = heightRatioForImageCount(count);

  if (count === 1 && images[0]?.aspectRatio) {
    ratio = clampSingleImageHeightRatio(1 / images[0].aspectRatio);
  } else if (count === 2) {
    const averageRatio = averageAspectRatio(images);
    if (averageRatio) {
      ratio = 1 / averageRatio;
    }
  }

  const computedHeight = Math.round(contentWidth * ratio);
  return Math.max(layoutMinHeight, Math.min(computedHeight, layoutMaxHeight));
}
