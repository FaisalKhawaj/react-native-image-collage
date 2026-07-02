import { prefetchImageUris } from "../utils/imageSources";

/** Prefetch URIs with `expo-image` when available, otherwise RN `Image.prefetch`. */
export function prefetchExpoImageUris(uris: string[]): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Image } = require("expo-image") as typeof import("expo-image");

    for (const uri of uris) {
      if (!uri) continue;
      try {
        void Image.prefetch(uri);
      } catch {
        /* ignore */
      }
    }
  } catch {
    prefetchImageUris(uris);
  }
}
