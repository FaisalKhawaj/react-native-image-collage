import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Image } from "expo-image";
import type { CollageViewerRenderProps, ImageViewerProps } from "../types";
import { prefetchExpoImageUris } from "./prefetchExpoImages";

type ViewerPageProps = {
  uri: string;
  width: number;
  height: number;
};

const ViewerPage = memo(function ViewerPage({
  uri,
  width,
  height,
}: ViewerPageProps) {
  return (
    <View style={[styles.page, { width, height }]}>
      <Image
        source={{ uri }}
        style={{ width, height }}
        contentFit="contain"
        cachePolicy="memory-disk"
        recyclingKey={uri}
        priority="high"
        transition={0}
      />
    </View>
  );
});

export const ExpoImageViewer = memo(function ExpoImageViewer({
  images,
  visible,
  imageIndex = 0,
  onRequestClose,
  showCloseButton = true,
  showIndexFooter = true,
  closeButtonLabel = "Close",
}: ImageViewerProps) {
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList<string>>(null);
  const uris = useMemo(() => images.map((image) => image.uri), [images]);

  const safeIndex = useMemo(() => {
    if (!uris.length) return 0;
    return Math.min(Math.max(0, imageIndex), uris.length - 1);
  }, [imageIndex, uris.length]);

  const [pageIndex, setPageIndex] = useState(safeIndex);

  useEffect(() => {
    if (!uris.length) return;
    prefetchExpoImageUris(uris);
  }, [uris]);

  useEffect(() => {
    if (!visible || !uris.length) return;

    setPageIndex(safeIndex);
    requestAnimationFrame(() => {
      try {
        listRef.current?.scrollToIndex({ index: safeIndex, animated: false });
      } catch {
        /* ignore */
      }
    });
  }, [visible, safeIndex, uris.length]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setPageIndex(nextIndex);
    },
    [width],
  );

  if (!uris.length) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={false}
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={[styles.root, { width, height }]}>
        <FlatList
          ref={listRef}
          data={uris}
          horizontal
          pagingEnabled
          bounces={uris.length > 1}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, index) => `${uri}-${index}`}
          initialScrollIndex={safeIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item }) => (
            <ViewerPage uri={item} width={width} height={height} />
          )}
        />

        {showCloseButton ? (
          <View pointerEvents="box-none" style={styles.header}>
            <Pressable onPress={onRequestClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>{closeButtonLabel}</Text>
            </Pressable>
          </View>
        ) : null}

        {showIndexFooter && uris.length > 1 ? (
          <View pointerEvents="box-none" style={styles.footer}>
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {pageIndex + 1} / {uris.length}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
});

export function createExpoViewerRenderer(
  viewerProps?: Omit<
    ImageViewerProps,
    "images" | "visible" | "imageIndex" | "onRequestClose"
  >,
) {
  return function ExpoViewerRenderer(props: CollageViewerRenderProps) {
    return <ExpoImageViewer {...viewerProps} {...props} />;
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  page: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 50,
    right: 12,
    zIndex: 2,
  },
  closeBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  counter: {
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    color: "#fff",
    fontWeight: "700",
  },
});
