import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { renderCollageImage } from "../CollageImage";
import { CollageTile } from "../CollageTile";
import { ANDROID_RIPPLE } from "../constants";
import type {
  CollageImageRenderer,
  ImagePriority,
  NormalizedCollageImage,
} from "../types";

type SharedTileConfig = {
  onPress?: (index: number) => void;
  borderRadius: number;
  placeholderColor: string;
  getImagePriority?: (index: number) => ImagePriority;
  renderImage?: CollageImageRenderer;
};

type RenderCollageContentOptions = {
  images: NormalizedCollageImage[];
  layoutHeight: number;
  spacing: number;
  borderRadius: number;
  placeholderColor: string;
  maxVisibleImages: number;
  onImagePress?: (index: number) => void;
  renderImage?: CollageImageRenderer;
  sharedTileConfig: SharedTileConfig;
};

function renderTile(
  image: NormalizedCollageImage,
  index: number,
  shared: SharedTileConfig,
  style?: StyleProp<ViewStyle>,
  priority?: ImagePriority,
  transition?: number,
) {
  return (
    <CollageTile
      key={`${image.cacheKey}-${index}`}
      source={image.source}
      remoteUri={image.remoteUri}
      index={index}
      onPress={shared.onPress}
      borderRadius={shared.borderRadius}
      placeholderColor={shared.placeholderColor}
      renderImage={shared.renderImage}
      priority={priority ?? shared.getImagePriority?.(index) ?? "normal"}
      transition={transition}
      style={style}
    />
  );
}

function renderOverflowTile({
  image,
  tileIndex,
  overflowCount,
  borderRadius,
  placeholderColor,
  onImagePress,
  renderImage,
}: {
  image: NormalizedCollageImage;
  tileIndex: number;
  overflowCount: number;
  borderRadius: number;
  placeholderColor: string;
  onImagePress?: (index: number) => void;
  renderImage?: CollageImageRenderer;
}) {
  return (
    <Pressable
      onPress={() => onImagePress?.(tileIndex)}
      android_ripple={ANDROID_RIPPLE}
      style={[
        styles.overflowTile,
        styles.flexTile,
        {
          borderRadius,
          backgroundColor: placeholderColor,
        },
      ]}
    >
      {renderCollageImage(
        {
          source: image.source,
          remoteUri: image.remoteUri,
          priority: "normal",
          transition: 0,
        },
        renderImage,
      )}
      {overflowCount > 0 && (
        <View pointerEvents="none" style={styles.overflowOverlay}>
          <Text style={styles.overflowText}>{`+${overflowCount}`}</Text>
        </View>
      )}
    </Pressable>
  );
}

function resolveVisibleLayout(count: number, maxVisibleImages: number) {
  const hasOverflow = count > maxVisibleImages;
  const visibleCount = hasOverflow ? maxVisibleImages : count;
  const overflowCount = hasOverflow ? count - maxVisibleImages : 0;
  const overflowTileIndex = visibleCount - 1;

  return {
    hasOverflow,
    visibleCount,
    overflowCount,
    overflowTileIndex,
  };
}

function renderSingleLayout(
  images: NormalizedCollageImage[],
  options: RenderCollageContentOptions,
  layout: ReturnType<typeof resolveVisibleLayout>,
) {
  const { layoutHeight, sharedTileConfig } = options;
  const image = images[0];

  if (layout.hasOverflow) {
    return renderOverflowTile({
      image,
      tileIndex: 0,
      overflowCount: layout.overflowCount,
      borderRadius: options.borderRadius,
      placeholderColor: options.placeholderColor,
      onImagePress: options.onImagePress,
      renderImage: options.renderImage,
    });
  }

  return renderTile(image, 0, sharedTileConfig, { height: layoutHeight });
}

function renderTwoLayout(
  images: NormalizedCollageImage[],
  options: RenderCollageContentOptions,
  layout: ReturnType<typeof resolveVisibleLayout>,
) {
  const { sharedTileConfig } = options;

  return (
    <>
      {renderTile(images[0], 0, sharedTileConfig, styles.flexTile)}
      {layout.hasOverflow ? (
        renderOverflowTile({
          image: images[1],
          tileIndex: 1,
          overflowCount: layout.overflowCount,
          borderRadius: options.borderRadius,
          placeholderColor: options.placeholderColor,
          onImagePress: options.onImagePress,
          renderImage: options.renderImage,
        })
      ) : (
        renderTile(images[1], 1, sharedTileConfig, styles.flexTile)
      )}
    </>
  );
}

function renderThreeLayout(
  images: NormalizedCollageImage[],
  options: RenderCollageContentOptions,
  layout: ReturnType<typeof resolveVisibleLayout>,
) {
  const { spacing, sharedTileConfig } = options;

  return (
    <>
      {renderTile(images[0], 0, sharedTileConfig, styles.flexTile)}
      <View style={[styles.flexColumn, { gap: spacing }]}>
        {renderTile(images[1], 1, sharedTileConfig, styles.flexTile)}
        {layout.hasOverflow ? (
          renderOverflowTile({
            image: images[2],
            tileIndex: 2,
            overflowCount: layout.overflowCount,
            borderRadius: options.borderRadius,
            placeholderColor: options.placeholderColor,
            onImagePress: options.onImagePress,
            renderImage: options.renderImage,
          })
        ) : (
          renderTile(images[2], 2, sharedTileConfig, styles.flexTile)
        )}
      </View>
    </>
  );
}

function renderGridLayout(
  images: NormalizedCollageImage[],
  options: RenderCollageContentOptions,
  layout: ReturnType<typeof resolveVisibleLayout>,
) {
  const { spacing, sharedTileConfig } = options;
  const topRow = images.slice(0, 2);
  const bottomLeft = images[2];
  const bottomRight = images[3];

  return (
    <>
      <View style={[styles.row, { flex: 1, gap: spacing }]}>
        {topRow.map((image, index) =>
          renderTile(image, index, sharedTileConfig, styles.flexTile),
        )}
      </View>
      <View style={[styles.row, { flex: 1, gap: spacing }]}>
        {bottomLeft
          ? renderTile(bottomLeft, 2, sharedTileConfig, styles.flexTile)
          : null}
        {bottomRight ? (
          layout.hasOverflow ? (
            renderOverflowTile({
              image: bottomRight,
              tileIndex: 3,
              overflowCount: layout.overflowCount,
              borderRadius: options.borderRadius,
              placeholderColor: options.placeholderColor,
              onImagePress: options.onImagePress,
              renderImage: options.renderImage,
            })
          ) : (
            renderTile(bottomRight, 3, sharedTileConfig, styles.flexTile)
          )
        ) : null}
      </View>
    </>
  );
}

export function renderCollageContent(options: RenderCollageContentOptions) {
  const { images, maxVisibleImages } = options;
  const count = images.length;
  const layout = resolveVisibleLayout(count, maxVisibleImages);
  const visibleImages = images.slice(0, layout.visibleCount);

  if (layout.visibleCount === 1) {
    return renderSingleLayout(visibleImages, options, layout);
  }

  if (layout.visibleCount === 2) {
    return renderTwoLayout(visibleImages, options, layout);
  }

  if (layout.visibleCount === 3) {
    return renderThreeLayout(visibleImages, options, layout);
  }

  return renderGridLayout(visibleImages, options, layout);
}

export function getCollageLayoutStyle({
  count,
  maxVisibleImages,
  layoutHeight,
  spacing,
  borderRadius,
}: {
  count: number;
  maxVisibleImages: number;
  layoutHeight: number;
  spacing: number;
  borderRadius: number;
}) {
  const { visibleCount } = resolveVisibleLayout(count, maxVisibleImages);

  if (visibleCount === 1) {
    return {
      containerStyle: {
        height: layoutHeight,
        borderRadius,
        overflow: "hidden" as const,
      },
      row: false,
    };
  }

  if (visibleCount === 2 || visibleCount === 3) {
    return {
      containerStyle: {
        height: layoutHeight,
        gap: spacing,
      },
      row: true,
    };
  }

  return {
    containerStyle: {
      height: layoutHeight,
      gap: spacing,
      overflow: "hidden" as const,
      minHeight: 0,
    },
    row: false,
  };
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", overflow: "hidden", minHeight: 0, width: "100%" },
  flexTile: { flex: 1, flexBasis: 0, minWidth: 0, minHeight: 0 },
  flexColumn: { flex: 1, flexBasis: 0, minWidth: 0, minHeight: 0 },
  overflowTile: { overflow: "hidden", minHeight: 0, minWidth: 0 },
  overflowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  overflowText: { color: "#fff", fontSize: 24, fontWeight: "800" },
});

export { styles as collageLayoutStyles };
