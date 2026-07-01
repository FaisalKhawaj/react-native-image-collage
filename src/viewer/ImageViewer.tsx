import React, { memo } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import ImageView from "react-native-image-viewing";
import type { CollageViewerRenderProps, ImageViewerProps } from "../types";

export const ImageViewer = memo(function ImageViewer({
  images,
  visible,
  imageIndex = 0,
  onRequestClose,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
  presentationStyle = "fullScreen",
  showCloseButton = true,
  showIndexFooter = true,
  closeButtonLabel = "Close",
}: ImageViewerProps) {
  if (!visible) {
    return null;
  }

  return (
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={onRequestClose}
      presentationStyle={presentationStyle}
      swipeToCloseEnabled={swipeToCloseEnabled}
      doubleTapToZoomEnabled={doubleTapToZoomEnabled}
      HeaderComponent={
        showCloseButton
          ? () => (
              <View
                style={{
                  position: "absolute",
                  top: Platform.OS === "android" ? 12 : 50,
                  right: 12,
                }}
              >
                <Pressable
                  onPress={onRequestClose}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.45)",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {closeButtonLabel}
                  </Text>
                </Pressable>
              </View>
            )
          : undefined
      }
      FooterComponent={
        showIndexFooter
          ? ({ imageIndex: currentIndex }) =>
              images.length > 1 ? (
                <View
                  style={{
                    position: "absolute",
                    bottom: 16,
                    alignSelf: "center",
                    backgroundColor: "rgba(0,0,0,0.35)",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {currentIndex + 1} / {images.length}
                  </Text>
                </View>
              ) : null
          : undefined
      }
    />
  );
});

export function createDefaultViewerRenderer(
  viewerProps?: Omit<
    ImageViewerProps,
    "images" | "visible" | "imageIndex" | "onRequestClose"
  >,
) {
  return function DefaultViewerRenderer(props: CollageViewerRenderProps) {
    return <ImageViewer {...viewerProps} {...props} />;
  };
}
