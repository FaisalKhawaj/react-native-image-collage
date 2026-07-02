import type { ReactElement } from "react";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

export type ImagePriority = "low" | "normal" | "high";

/** Remote URL, RN image source, or object with optional aspect ratio. */
export type CollageImageInput =
  | string
  | ImageSourcePropType
  | {
      uri: string;
      aspectRatio?: number;
    };

export type NormalizedCollageImage = {
  source: ImageSourcePropType;
  aspectRatio?: number;
  cacheKey: string;
  remoteUri?: string;
};

export type CollageImageRenderProps = {
  source: ImageSourcePropType;
  remoteUri?: string;
  style?: StyleProp<ImageStyle>;
  priority?: ImagePriority;
  transition: number;
};

export type CollageImageRenderer = (
  props: CollageImageRenderProps,
) => ReactElement;

export type ImageViewerImage = {
  uri: string;
};

export type CollageViewerRenderProps = {
  images: ImageViewerImage[];
  visible: boolean;
  imageIndex: number;
  onRequestClose: () => void;
};

export type CollageViewerRenderer = (
  props: CollageViewerRenderProps,
) => ReactElement | null;

export type ImageCollageProps = {
  images: CollageImageInput[] | null | undefined;
  /** Fixed layout height; when omitted, height is derived from container width. */
  height?: number;
  /** Explicit container width; when omitted, width is measured via `onLayout`. */
  width?: number;
  /**
   * @deprecated Prefer automatic `onLayout` sizing. Subtracted from screen width
   * only before the container has been measured.
   */
  horizontalInset?: number;
  borderRadius?: number;
  spacing?: number;
  /**
   * Maximum tiles to show. When there are more images, the last visible tile
   * displays a `+N` overlay for the remaining count.
   *
   * @example `maxVisibleImages={3}` with 4 images → 3-tile layout, third tile shows `+1`
   * @example `maxVisibleImages={4}` with 5 images → 2×2 grid, fourth tile shows `+1`
   */
  maxVisibleImages?: number;
  onImagePress?: (index: number) => void;
  layoutMinHeight?: number;
  layoutMaxHeight?: number;
  placeholderColor?: string;
  /** Measure missing aspect ratios before rendering. */
  measureAspectRatios?: boolean;
  /** Optional per-tile loading priority (used by custom renderers such as expo-image). */
  getImagePriority?: (index: number) => ImagePriority;
  /** Custom image renderer. Defaults to React Native `Image`. */
  renderImage?: CollageImageRenderer;
  style?: StyleProp<ViewStyle>;
};

export type CollageWithViewerProps = ImageCollageProps & {
  renderViewer: CollageViewerRenderer;
  onImagePress?: (index: number) => void;
  /**
   * Prefetch full-resolution images for the viewer while the collage is visible.
   * Helps the viewer open without a loading flash. @default true
   */
  prefetchViewerImages?: boolean;
  /** Override prefetch strategy (e.g. `expo-image` prefetch on the `/expo` entry). */
  prefetchImages?: (uris: string[]) => void;
};

export type ImageViewerProps = {
  images: ImageViewerImage[];
  visible: boolean;
  imageIndex?: number;
  onRequestClose: () => void;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen";
  showCloseButton?: boolean;
  showIndexFooter?: boolean;
  closeButtonLabel?: string;
};

export type ImageCollageWithViewerProps = Omit<ImageCollageProps, "onImagePress"> & {
  viewerProps?: Omit<
    ImageViewerProps,
    "images" | "visible" | "imageIndex" | "onRequestClose"
  >;
  /** Override the built-in `react-native-image-viewing` viewer. */
  renderViewer?: CollageViewerRenderer;
  onImagePress?: (index: number) => void;
};

/** Expo-only collage options (`react-native-image-collage/expo`). */
export type ExpoImageCollageOptions = {
  /** Set to `null` to disable the blurhash placeholder. */
  blurhash?: string | null;
  prioritizeFirstImage?: boolean;
  /** Override prefetch strategy. Defaults to `expo-image` prefetch. */
  prefetchImages?: (uris: string[]) => void;
};
