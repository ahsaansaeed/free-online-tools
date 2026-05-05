import type { Metadata } from "next";
import ColorPickerClient from "./ColorPickerClient";

export const metadata: Metadata = {
  title: "Free Color Picker & Palette Generator Online | ToolBox",
  description:
    "Extract colors from images or generate custom color palettes. Get exact HEX, RGB, and HSL values instantly. Free online color tool.",
  keywords: "color picker, image color extractor, color palette generator, hex to rgb",
};

export default function ColorPickerPage() {
  return <ColorPickerClient />;
}
