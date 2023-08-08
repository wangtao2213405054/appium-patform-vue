import { EditorView } from "@codemirror/view"
import { oneDark } from "@codemirror/theme-one-dark"

const normal = EditorView.theme({
  // 输入的字体颜色
  "&": {
    color: "#0149b6",
    backgroundColor: '#fdfdfd'
  },
  ".cm-content": {
    caretColor: "#f3f6fc",
  },
  // 激活序列的背景色
  ".cm-activeLineGutter": {
    backgroundColor: "#f5f5f5"
  },
  //光标的颜色
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#000000"
  },
  // 选中的状态
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#FFFFFF",
    color: '#303133'
  },
  // 左侧侧边栏的颜色
  ".cm-gutters": {
    backgroundColor: "#FFFFFF",
    color: "#909399", //侧边栏文字颜色
    border: "none"
  }
})

export { normal, oneDark as dark }
