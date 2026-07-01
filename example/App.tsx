import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ImageCollage } from "react-native-image-collage";
import { ImageCollageWithViewer as ViewerCollage } from "react-native-image-collage/viewer";
import { ImageCollageWithViewer as ExpoCollage } from "react-native-image-collage/expo";

const SAMPLE_IMAGES = [
  {
    uri: "https://picsum.photos/seed/collage1/900/600",
    aspectRatio: 1.5,
  },
  {
    uri: "https://picsum.photos/seed/collage2/900/700",
    aspectRatio: 1.29,
  },
  {
    uri: "https://picsum.photos/seed/collage3/900/900",
    aspectRatio: 1,
  },
  {
    uri: "https://picsum.photos/seed/collage4/900/500",
    aspectRatio: 1.8,
  },
  {
    uri: "https://picsum.photos/seed/collage5/900/650",
    aspectRatio: 1.38,
  },
  {
    uri: "https://picsum.photos/seed/collage6/900/800",
    aspectRatio: 1.13,
  },
];

type Mode = "collage" | "viewer" | "expo";

export default function App() {
  const [imageCount, setImageCount] = useState(3);
  const [maxVisibleImages, setMaxVisibleImages] = useState(4);
  const [mode, setMode] = useState<Mode>("viewer");

  const images = useMemo(
    () => SAMPLE_IMAGES.slice(0, imageCount),
    [imageCount],
  );

  const overflowCount = Math.max(0, imageCount - maxVisibleImages);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>react-native-image-collage</Text>
        <Text style={styles.subheading}>Local dev playground</Text>

        <Section title="Mode">
          <Row>
            <Chip label="Collage only" active={mode === "collage"} onPress={() => setMode("collage")} />
            <Chip label="/viewer" active={mode === "viewer"} onPress={() => setMode("viewer")} />
            <Chip label="/expo" active={mode === "expo"} onPress={() => setMode("expo")} />
          </Row>
        </Section>

        <Section title="Images">
          <Row>
            <Button label="−" onPress={() => setImageCount((c) => Math.max(1, c - 1))} />
            <Text style={styles.value}>{imageCount} image{imageCount === 1 ? "" : "s"}</Text>
            <Button label="+" onPress={() => setImageCount((c) => Math.min(6, c + 1))} />
          </Row>
        </Section>

        <Section title="maxVisibleImages">
          <Row>
            <Button label="−" onPress={() => setMaxVisibleImages((v) => Math.max(1, v - 1))} />
            <Text style={styles.value}>{maxVisibleImages}</Text>
            <Button label="+" onPress={() => setMaxVisibleImages((v) => Math.min(4, v + 1))} />
          </Row>
          {overflowCount > 0 ? (
            <Text style={styles.hint}>Expect +{overflowCount} on the last visible tile</Text>
          ) : (
            <Text style={styles.hint}>No overflow badge at this count</Text>
          )}
        </Section>

        <Section title="Preview (padded card)">
          <View style={styles.card}>
            {mode === "collage" ? (
              <ImageCollage
                images={images}
                spacing={4}
                borderRadius={10}
                maxVisibleImages={maxVisibleImages}
                layoutMinHeight={160}
                layoutMaxHeight={360}
                onImagePress={(index) => console.log("onImagePress", index)}
              />
            ) : null}

            {mode === "viewer" ? (
              <ViewerCollage
                images={images}
                spacing={4}
                borderRadius={10}
                maxVisibleImages={maxVisibleImages}
                layoutMinHeight={160}
                layoutMaxHeight={360}
              />
            ) : null}

            {mode === "expo" ? (
              <ExpoCollage
                images={images}
                spacing={4}
                borderRadius={10}
                maxVisibleImages={maxVisibleImages}
                layoutMinHeight={160}
                layoutMaxHeight={360}
                prioritizeFirstImage
              />
            ) : null}
          </View>
        </Section>

        <Section title="Layouts reference">
          <Text style={styles.reference}>1 → full width</Text>
          <Text style={styles.reference}>2 → side by side</Text>
          <Text style={styles.reference}>3 → large left, two right</Text>
          <Text style={styles.reference}>4 → 2×2 grid</Text>
          <Text style={styles.reference}>5+ → grid + +N overflow</Text>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f2f2f7" },
  content: { padding: 16,paddingTop:80, paddingBottom: 40, gap: 8 },
  heading: { fontSize: 22, fontWeight: "800", color: "#111" },
  subheading: { fontSize: 14, color: "#666", marginBottom: 8 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#222" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  value: { fontSize: 16, fontWeight: "600", color: "#111" },
  hint: { fontSize: 13, color: "#666" },
  card: {
    backgroundColor: "#ececf1",
    borderRadius: 10,
    padding: 12,
  },
  reference: { fontSize: 13, color: "#444", lineHeight: 20 },
  button: {
    minWidth: 44,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ececf1",
    alignItems: "center",
  },
  chipActive: { backgroundColor: "#111" },
  chipText: { fontSize: 12, fontWeight: "600", color: "#333" },
  chipTextActive: { color: "#fff" },
});
