import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PanResponderGestureState,
} from "react-native";

export type ZoomableViewProps = {
  width: number;
  height: number;
  children: React.ReactNode;
  /** Enable pinch-to-zoom and pan. @default true */
  pinchToZoomEnabled?: boolean;
  /** Double-tap toggles between 1x and `doubleTapScale`. @default true */
  doubleTapToZoomEnabled?: boolean;
  /** Minimum zoom scale. @default 1 */
  minScale?: number;
  /** Maximum zoom scale. @default 3 */
  maxScale?: number;
  /** Scale applied on double-tap when zoomed in. @default 2.5 */
  doubleTapScale?: number;
  /** Called when zoom scale crosses above/below 1 (lets parent disable paging). */
  onZoomActiveChange?: (isZoomed: boolean) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distance(
  a: { pageX: number; pageY: number },
  b: { pageX: number; pageY: number },
) {
  const dx = a.pageX - b.pageX;
  const dy = a.pageY - b.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Cross-platform pinch + pan + double-tap zoom.
 * Uses only React Native core APIs (Animated + PanResponder) so it works on
 * RN 0.72–0.86+ and Expo without extra native peers.
 */
export const ZoomableView = memo(function ZoomableView({
  width,
  height,
  children,
  pinchToZoomEnabled = true,
  doubleTapToZoomEnabled = true,
  minScale = 1,
  maxScale = 3,
  doubleTapScale = 2.5,
  onZoomActiveChange,
}: ZoomableViewProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const scaleValue = useRef(1);
  const translateXValue = useRef(0);
  const translateYValue = useRef(0);

  const pinchStartDistance = useRef(0);
  const pinchStartScale = useRef(1);
  const panStartX = useRef(0);
  const panStartY = useRef(0);
  const isPinching = useRef(false);
  const lastTapAt = useRef(0);
  const layoutSize = useRef({ width, height });

  useEffect(() => {
    layoutSize.current = { width, height };
  }, [width, height]);

  const setZoomedFlag = useCallback(
    (nextScale: number) => {
      onZoomActiveChange?.(nextScale > 1.01);
    },
    [onZoomActiveChange],
  );

  const clampTranslation = useCallback(
    (nextScale: number, x: number, y: number) => {
      const { width: w, height: h } = layoutSize.current;
      const maxX = Math.max(0, ((nextScale - 1) * w) / 2);
      const maxY = Math.max(0, ((nextScale - 1) * h) / 2);
      return {
        x: clamp(x, -maxX, maxX),
        y: clamp(y, -maxY, maxY),
      };
    },
    [],
  );

  const animateTo = useCallback(
    (nextScale: number, x: number, y: number) => {
      const clampedScale = clamp(nextScale, minScale, maxScale);
      const clamped = clampTranslation(clampedScale, x, y);

      scaleValue.current = clampedScale;
      translateXValue.current = clamped.x;
      translateYValue.current = clamped.y;
      setZoomedFlag(clampedScale);

      Animated.parallel([
        Animated.spring(scale, {
          toValue: clampedScale,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }),
        Animated.spring(translateX, {
          toValue: clamped.x,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }),
        Animated.spring(translateY, {
          toValue: clamped.y,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }),
      ]).start();
    },
    [
      clampTranslation,
      maxScale,
      minScale,
      scale,
      setZoomedFlag,
      translateX,
      translateY,
    ],
  );

  const resetZoom = useCallback(() => {
    animateTo(minScale, 0, 0);
  }, [animateTo, minScale]);

  useEffect(() => {
    if (!pinchToZoomEnabled) {
      resetZoom();
    }
  }, [pinchToZoomEnabled, resetZoom]);

  const handleDoubleTap = useCallback(() => {
    if (!doubleTapToZoomEnabled || !pinchToZoomEnabled) {
      return;
    }

    if (scaleValue.current > 1.05) {
      animateTo(minScale, 0, 0);
    } else {
      const target = clamp(doubleTapScale, minScale, maxScale);
      animateTo(target, 0, 0);
    }
  }, [
    animateTo,
    doubleTapScale,
    doubleTapToZoomEnabled,
    maxScale,
    minScale,
    pinchToZoomEnabled,
  ]);

  const panResponder = useMemo(() => {
    if (!pinchToZoomEnabled) {
      return PanResponder.create({});
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (
        _event,
        gesture: PanResponderGestureState,
      ) => {
        if (isPinching.current) {
          return true;
        }
        if (scaleValue.current > 1.01) {
          return Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2;
        }
        return false;
      },
      onPanResponderTerminationRequest: () => scaleValue.current <= 1.01,
      onPanResponderGrant: (event: GestureResponderEvent) => {
        const touches = event.nativeEvent.touches;
        const now = Date.now();

        if (touches.length === 1 && doubleTapToZoomEnabled) {
          if (now - lastTapAt.current < 280) {
            handleDoubleTap();
            lastTapAt.current = 0;
          } else {
            lastTapAt.current = now;
          }
        }

        if (touches.length >= 2) {
          isPinching.current = true;
          pinchStartDistance.current = distance(touches[0], touches[1]);
          pinchStartScale.current = scaleValue.current;
        } else {
          panStartX.current = translateXValue.current;
          panStartY.current = translateYValue.current;
        }
      },
      onPanResponderMove: (event: GestureResponderEvent, gesture) => {
        const touches = event.nativeEvent.touches;

        if (touches.length >= 2) {
          isPinching.current = true;
          const currentDistance = distance(touches[0], touches[1]);
          if (pinchStartDistance.current <= 0) {
            pinchStartDistance.current = currentDistance;
            pinchStartScale.current = scaleValue.current;
            return;
          }

          const nextScale = clamp(
            (pinchStartScale.current * currentDistance) /
              pinchStartDistance.current,
            minScale,
            maxScale,
          );
          scaleValue.current = nextScale;
          scale.setValue(nextScale);
          setZoomedFlag(nextScale);

          const clamped = clampTranslation(
            nextScale,
            translateXValue.current,
            translateYValue.current,
          );
          translateXValue.current = clamped.x;
          translateYValue.current = clamped.y;
          translateX.setValue(clamped.x);
          translateY.setValue(clamped.y);
          return;
        }

        if (scaleValue.current > 1.01) {
          const nextX = panStartX.current + gesture.dx;
          const nextY = panStartY.current + gesture.dy;
          const clamped = clampTranslation(scaleValue.current, nextX, nextY);
          translateX.setValue(clamped.x);
          translateY.setValue(clamped.y);
        }
      },
      onPanResponderRelease: (_event, gesture) => {
        if (isPinching.current) {
          isPinching.current = false;
          pinchStartDistance.current = 0;
          animateTo(
            scaleValue.current,
            translateXValue.current,
            translateYValue.current,
          );
          return;
        }

        if (scaleValue.current > 1.01) {
          const nextX = panStartX.current + gesture.dx;
          const nextY = panStartY.current + gesture.dy;
          animateTo(scaleValue.current, nextX, nextY);
        }
      },
      onPanResponderTerminate: () => {
        isPinching.current = false;
        pinchStartDistance.current = 0;
        animateTo(
          scaleValue.current,
          translateXValue.current,
          translateYValue.current,
        );
      },
    });
  }, [
    animateTo,
    clampTranslation,
    doubleTapToZoomEnabled,
    handleDoubleTap,
    maxScale,
    minScale,
    pinchToZoomEnabled,
    scale,
    setZoomedFlag,
    translateX,
    translateY,
  ]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width: w, height: h } = event.nativeEvent.layout;
    layoutSize.current = { width: w, height: h };
  }, []);

  return (
    <View
      style={[styles.root, { width, height }]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={[
          styles.content,
          {
            width,
            height,
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});
