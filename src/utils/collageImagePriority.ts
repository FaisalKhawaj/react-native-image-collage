import type { ImagePriority } from "../types";

/** High priority for every tile visible in the collage grid (not only index 0). */
export function createVisibleTilesPriority(
  maxVisibleImages: number,
  enabled = true,
): (index: number) => ImagePriority {
  const visibleCount = Math.max(1, maxVisibleImages);

  return (index: number) => {
    if (!enabled) return "normal";
    return index < visibleCount ? "high" : "normal";
  };
}
