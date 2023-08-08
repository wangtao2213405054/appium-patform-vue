import { EditorView } from "@codemirror/view"
import { Extension } from "@codemirror/state"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { tags as t } from "@lezer/highlight"

const chalky = "#ff79c6",
  coral = "#ffb86c",
  cyan = "#f8f8f2",
  invalid = "#414450", // 废弃
  ivory = "#f8f8f2", // 函数颜色
  stone = "#7d8799", // 注释颜色
  malibu = "#50fa7b", // 调用的函数
  sage = "#f1fa8c", // 字符串
  whiskey = "#ff5554", // 布尔值
  violet = "#ff79c6", // 关键字
  darkBackground = "#5da3f4",
  highlightBackground = "#44475b", // 光标行的高亮显示
  background = "#282a35", // 背景色
  tooltipBackground = "#414450", // 代码提示背景色
  selection = "#a2a8d7", // 选中代码后的颜色
  cursor = "#a2a8d7" // 光标颜色

export const color = {
  chalky,
  coral,
  cyan,
  invalid,
  ivory,
  stone,
  malibu,
  sage,
  whiskey,
  violet,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor
}
export const oneDarkTheme = EditorView.theme(
  {
    "&": {
      color: ivory,
      backgroundColor: background
    },

    ".cm-content": {
      caretColor: cursor
    },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },

    ".cm-panels": { backgroundColor: darkBackground, color: ivory },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f"
    },

    ".cm-activeLine": { backgroundColor: "#6699ff0b" },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847"
    },

    ".cm-gutters": {
      backgroundColor: background,
      color: stone,
      border: "none"
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd"
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: ivory
      }
    }
  },
  { dark: true }
)
export const oneDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: coral },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: ivory },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: chalky },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: cyan },
  { tag: [t.meta, t.comment], color: stone },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: stone, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: coral },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: [t.processingInstruction, t.string, t.inserted], color: sage },
  { tag: t.invalid, color: invalid }
])

export const BlueDark: Extension = [oneDarkTheme, syntaxHighlighting(oneDarkHighlightStyle)]
