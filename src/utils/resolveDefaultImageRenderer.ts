import type { CollageImageRenderer } from "../types";
import { prefetchImageUris } from "./imageSources";

let cachedExpoRenderer: CollageImageRenderer | undefined | false = false;

/** Use `expo-image` automatically when the optional peer dependency is installed. */
export function resolveDefaultImageRenderer(): CollageImageRenderer | undefined {
  if (cachedExpoRenderer !== false) {
    return cachedExpoRenderer || undefined;
  }

  try {
    const { createExpoImageRenderer } =
      require("../expo/createExpoImageRenderer") as typeof import("../expo/createExpoImageRenderer");
    cachedExpoRenderer = createExpoImageRenderer();
  } catch {
    cachedExpoRenderer = undefined;
  }

  return cachedExpoRenderer;
}

export function prefetchWithBestEffort(uris: string[]): void {
  if (!uris.length) return;

  try {
    const { prefetchExpoImageUris } =
      require("../expo/prefetchExpoImages") as typeof import("../expo/prefetchExpoImages");
    prefetchExpoImageUris(uris);
    return;
  } catch {
    /* fall through */
  }

  prefetchImageUris(uris);
}

export function resolveDefaultViewerRenderer(
  viewerProps?: Record<string, unknown>,
) {
  try {
    const { createExpoViewerRenderer } =
      require("../expo/ExpoImageViewer") as typeof import("../expo/ExpoImageViewer");
    return createExpoViewerRenderer(viewerProps as never);
  } catch {
    const { createDefaultViewerRenderer } =
      require("../viewer/ImageViewer") as typeof import("../viewer/ImageViewer");
    return createDefaultViewerRenderer(viewerProps as never);
  }
}
