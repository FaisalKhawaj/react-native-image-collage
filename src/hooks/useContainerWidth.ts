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

  return {
    containerWidth,
    onLayout,
    isMeasured: measuredWidth != null,
  };
}
