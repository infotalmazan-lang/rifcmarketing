import { Font } from "@react-pdf/renderer";
import path from "path";

const fontsDir = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Cormorant Garamond",
  fonts: [
    { src: path.join(fontsDir, "CormorantGaramond-Light.ttf"), fontWeight: 300 },
    { src: path.join(fontsDir, "CormorantGaramond-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "CormorantGaramond-Bold.ttf"), fontWeight: 700 },
    { src: path.join(fontsDir, "CormorantGaramond-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
  ],
});

Font.register({
  family: "DM Sans",
  fonts: [
    { src: path.join(fontsDir, "DMSans-Light.ttf"), fontWeight: 300 },
    { src: path.join(fontsDir, "DMSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "DMSans-Medium.ttf"), fontWeight: 500 },
    { src: path.join(fontsDir, "DMSans-Bold.ttf"), fontWeight: 700 },
  ],
});

Font.register({
  family: "JetBrains Mono",
  fonts: [
    { src: path.join(fontsDir, "JetBrainsMono-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "JetBrainsMono-Medium.ttf"), fontWeight: 500 },
    { src: path.join(fontsDir, "JetBrainsMono-Bold.ttf"), fontWeight: 700 },
  ],
});

// Disable hyphenation for cleaner text
Font.registerHyphenationCallback((word) => [word]);
