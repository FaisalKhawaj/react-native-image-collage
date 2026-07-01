import { Image, type ImageSourcePropType } from "react-native";
import type { CollageImageInput, NormalizedCollageImage } from "../types";

function cacheKeyForSource(source: ImageSourcePropType): string {
  if (typeof source === "number") {
    return `asset-${source}`;
  }

  if (typeof source === "object" && source) {
    if ("uri" in source && source.uri) {
      return source.uri;
    }

    if ("testUri" in source && typeof source.testUri === "string") {
      return source.testUri;
    }
  }

  return JSON.stringify(source);
}

export function getRemoteUri(
  source: ImageSourcePropType,
): string | undefined {
  if (typeof source === "number") {
    return Image.resolveAssetSource(source)?.uri;
  }

  if (typeof source === "object" && source && "uri" in source && source.uri) {
    return source.uri;
  }

  return undefined;
}

export function normalizeImageInput(
  input: CollageImageInput,
): NormalizedCollageImage | null {
  if (input == null || input === "") {
    return null;
  }

  if (typeof input === "string") {
    const source = { uri: input };
    return {
      source,
      aspectRatio: undefined,
      cacheKey: input,
      remoteUri: input,
    };
  }

  if (typeof input === "number") {
    const source = input;
    const resolved = Image.resolveAssetSource(source);
    const aspectRatio =
      resolved?.width && resolved?.height
        ? resolved.width / resolved.height
        : undefined;

    return {
      source,
      aspectRatio,
      cacheKey: cacheKeyForSource(source),
      remoteUri: resolved?.uri,
    };
  }

  if (typeof input === "object" && input != null && "uri" in input) {
    const uri = (input as { uri: unknown }).uri;
    if (typeof uri === "string") {
      const keys = Object.keys(input);
      const isUriDescriptor = keys.every(
        (key) => key === "uri" || key === "aspectRatio",
      );

      if (isUriDescriptor) {
        const aspectRatio =
          "aspectRatio" in input
            ? (input as { aspectRatio?: number }).aspectRatio
            : undefined;

        return {
          source: { uri },
          aspectRatio,
          cacheKey: uri,
          remoteUri: uri,
        };
      }
    }
  }

  const source = input as ImageSourcePropType;
  const remoteUri = getRemoteUri(source);

  return {
    source,
    aspectRatio: undefined,
    cacheKey: cacheKeyForSource(source),
    remoteUri,
  };
}

export function normalizeImages(
  images: CollageImageInput[] | null | undefined,
): NormalizedCollageImage[] {
  return (images ?? [])
    .map(normalizeImageInput)
    .filter((image): image is NormalizedCollageImage => image != null);
}

export function measureImageAspectRatio(
  image: NormalizedCollageImage,
): Promise<number> {
  if (image.aspectRatio != null) {
    return Promise.resolve(image.aspectRatio);
  }

  if (typeof image.source === "number") {
    const resolved = Image.resolveAssetSource(image.source);
    if (resolved?.width && resolved?.height) {
      return Promise.resolve(resolved.width / resolved.height);
    }

    return Promise.reject(new Error("Unable to resolve local image dimensions"));
  }

  const uri = getRemoteUri(image.source);
  if (!uri) {
    return Promise.reject(new Error("Unable to measure image without a URI"));
  }

  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve(width / height),
      reject,
    );
  });
}

export async function resolveImagesWithAspectRatios(
  images: NormalizedCollageImage[],
): Promise<NormalizedCollageImage[]> {
  return Promise.all(
    images.map(async (image) => {
      if (image.aspectRatio != null) {
        return image;
      }

      try {
        const aspectRatio = await measureImageAspectRatio(image);
        return { ...image, aspectRatio };
      } catch {
        return image;
      }
    }),
  );
}

export function toViewerImages(
  images: NormalizedCollageImage[],
): { uri: string }[] {
  return images
    .map((image) => {
      const uri = image.remoteUri ?? getRemoteUri(image.source);
      return uri ? { uri } : null;
    })
    .filter((image): image is { uri: string } => image != null);
}
