import tokenizer from './tokenizer.js'

const initialCode =
`#include <stdio.h>
main () {
  int a, b, suma;
  scanf("%d", &a);
  scanf("%d", &b);
  suma = a + b;
  printf("La suma es:%d", suma);
}
`

const updateLexicalView = (view, doc) => {
  const tokens = tokenizer(doc.getValue())
  view.innerHTML = JSON.stringify(tokens, null, 2).replace("<", "&lt")
}
// Codemirror initialization
const editor_container = document.getElementById("editor-container")
const code = CodeMirror(editor_container, {
  value: initialCode,
  mode: 'clike',
  lineNumbers: true,
  theme: "one-dark"
})



const out = document.getElementById("tokens")

updateLexicalView(out, code)

code.on("change", doc => {
  updateLexicalView(out, doc)
})