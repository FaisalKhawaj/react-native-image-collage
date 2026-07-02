import React, { memo } from "react";
import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  ImageStyle,
  type ImageSourcePropType,
} from "react-native";
import type { CollageImageRenderProps, CollageImageRenderer } from "./types";

export const CollageImage = memo(function CollageImage({
  source,
  style,
  transition = Platform.OS === "android" ? 80 : 150,
}: CollageImageRenderProps) {
  return (
    <Image
      source={source}
      resizeMode="cover"
      fadeDuration={transition}
      style={[{ width: "100%", height: "100%" }, style]}
    />
  );
});

export function renderCollageImage(
  props: CollageImageRenderProps,
  renderImage?: CollageImageRenderer,
  style?: StyleProp<ImageStyle>,
) {
  const imageProps = style ? { ...props, style } : props;

  if (renderImage) {
    return renderImage(imageProps);
  }

  return <CollageImage {...imageProps} />;
}

export type { ImageSourcePropType };
