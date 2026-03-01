import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const jetBrains = loadJetBrains("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const FONT_FAMILIES = {
  sans: inter.fontFamily,
  mono: jetBrains.fontFamily,
};
