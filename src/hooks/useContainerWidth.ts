import { useCallback, useState } from "react";
import { useWindowDimensions, type LayoutChangeEvent } from "react-native";

export function useContainerWidth({
  width,
  horizontalInset = 0,
}: {
  width?: number;
  horizontalInset?: number;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0) {
      setMeasuredWidth(nextWidth);
    }
  }, []);

  const fallbackWidth = Math.max(0, windowWidth - horizontalInset);
  const containerWidth = width ?? measuredWidth ?? fallbackWidth;
  /** Prefer an explicit width or onLayout measurement for height math (avoids window-width overshoot). */
  const layoutContentWidth =
    width ?? (measuredWidth != null ? measuredWidth : 0);

  return {
    containerWidth,
    layoutContentWidth,
    onLayout,
    isMeasured: measuredWidth != null,
  };
}
