import React, { memo, useCallback } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  type ImageSourcePropType,
} from "react-native";
import { renderCollageImage } from "./CollageImage";
import { ANDROID_RIPPLE } from "./constants";
import type {
  CollageImageRenderer,
  ImagePriority,
} from "./types";

type CollageTileProps = {
  source: ImageSourcePropType;
  remoteUri?: string;
  index: number;
  onPress?: (index: number) => void;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
  priority?: ImagePriority;
  placeholderColor: string;
  renderImage?: CollageImageRenderer;
  transition?: number;
};

export const CollageTile = memo(function CollageTile({
  source,
  remoteUri,
  index,
  onPress,
  borderRadius,
  style,
  priority = "normal",
  placeholderColor,
  renderImage,
  transition,
}: CollageTileProps) {
  const handlePress = useCallback(() => onPress?.(index), [onPress, index]);

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={ANDROID_RIPPLE}
      style={[
        style,
        styles.tile,
        { borderRadius, backgroundColor: placeholderColor },
      ]}
    >
      <View style={styles.imageContainer} collapsable={false}>
        {renderCollageImage(
          {
            source,
            remoteUri,
            priority,
            transition: transition ?? (Platform.OS === "android" ? 80 : 150),
          },
          renderImage,
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tile: { overflow: "hidden", minHeight: 0, minWidth: 0 },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
