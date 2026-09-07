/**
 * Syntax theme for MDX code blocks.
 *
 * Stock min-light was tried first and did not hold up on this page for two
 * reasons, one of them a defect rather than a matter of taste:
 *
 *   1. Its comment colour (#c2c3c5) sits at 1.76:1 against white — far below
 *      the 4.5:1 WCAG AA threshold. Comments are often the line in a snippet
 *      that carries the explanation, and they were the hardest thing to read.
 *
 *   2. Its keywords are #D32F2F, a saturated red, with a bright blue and a
 *      strong green alongside. On a page whose entire palette is near-black
 *      ink, grey-violet muted text and pale lavender, five lines of code were
 *      the loudest thing on the screen.
 *
 * So the hues are kept — a reader still gets keyword/string/comment apart at
 * a glance — but pulled toward the site's own register: roughly half the
 * saturation, and every colour at 5:1 or better on the white block surface.
 * Comments are literally the site's `--muted`.
 *
 * To go back to stock, set `theme: "min-light"` in MdxContent.tsx.
 */

const INK = "#0A0A0B"; // --ink
const MUTED = "#6B6B7A"; // --muted

export const codeTheme = {
  name: "myellelab-light",
  type: "light",
  colors: {
    "editor.background": "#FFFFFF",
    "editor.foreground": INK,
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: MUTED, fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: "#5B4B8A" },
    },
    {
      scope: ["string", "string.quoted", "punctuation.definition.string"],
      settings: { foreground: "#3D6B52" },
    },
    {
      scope: ["constant", "constant.numeric", "constant.language"],
      settings: { foreground: "#2F5D8C" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
      ],
      settings: { foreground: "#6E4E7C" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: INK },
    },
    {
      scope: ["punctuation", "keyword.operator", "meta.brace"],
      settings: { foreground: "#4A4A57" },
    },
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#5B4B8A" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#6E4E7C" },
    },
  ],
} as const;
