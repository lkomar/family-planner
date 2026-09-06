import type { NoteColor } from "@/lib/generated/prisma/enums";

export const NOTE_COLOR_ORDER: NoteColor[] = [
  "YELLOW",
  "PINK",
  "EMERALD",
  "SKY",
  "PURPLE",
];

/** Card background/text/border — a decorative palette, independent of the brand theme. */
export const NOTE_COLOR_CARD_CLASSES: Record<NoteColor, string> = {
  YELLOW: "bg-yellow-100 text-yellow-900 border-yellow-200",
  PINK: "bg-pink-100 text-pink-900 border-pink-200",
  EMERALD: "bg-emerald-100 text-emerald-900 border-emerald-200",
  SKY: "bg-sky-100 text-sky-900 border-sky-200",
  PURPLE: "bg-purple-100 text-purple-900 border-purple-200",
};

/** Swatch shown in the color picker. */
export const NOTE_COLOR_SWATCH_CLASSES: Record<NoteColor, string> = {
  YELLOW: "bg-yellow-200",
  PINK: "bg-pink-200",
  EMERALD: "bg-emerald-200",
  SKY: "bg-sky-200",
  PURPLE: "bg-purple-200",
};
