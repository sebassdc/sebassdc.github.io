
const tokenizer = str => {
  let tokens = []
  let current = 0
  
  mainloop:
  while (current < str.length) {
    console.log('flagwhile')
    let char = str[current]
    
    // Preproccesor directive
    if (char === "#") {
      let value = ''
      let position = current + 0 // copy the value
      while (char !== "\n") {
        if (current >= str.length) continue mainloop
        value += char
        char = str[++current]
      }
      tokens.push({
        type: 'preprocesor-directive',
        position,
        offset: value.length,
        value,
      })
      char = str[++current]
      continue
    }

    // NUMBERS
    const NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let floatFlag = false
      let value = ""
      let position = current + 0 // copy the value
      while (
        (NUMBERS.test(char) || char === ".")
      ) {
        if (char === ".") {
          if (floatFlag) {
            break;
          }
          floatFlag = true
        }

        value += char;
        char = str[++current]
      }
      tokens.push({
        type: 'number',
        position,
        offset: value.length,
        value
      })
      continue
    }

    // STRINGS
    if (char === '"') {
      let value = ''
      let position = current + 0 // copy the value
      char = str[++current]
      while (char !== '"') {
        value += char
        char = str[++current]
        if (current >= str.length) break mainloop;
      }
      char = str[++current]
      tokens.push({
        type: 'string',
        position,
        offset: value.length,
        value,
      })
      continue
    }

    // NAMES
    const LETTERS = /[a-z]/i
    if (LETTERS.test(char)) {
      let value = ''
      let position = current + 0 // copy the value
      do {
        value += char
        char = str[++current]
        if (current >= str.length) continue mainloop
      } while (/[a-z]|[A-Z]|_|[0-9]/.test(char));
      let type = (TOKENS.keywords.indexOf(value) > 0) ?
        'keyword' : 'name'
      tokens.push({
        type,
        position,
        offset: value.length,
        value
      })
      continue
    }

    // SEPARATORS
    if (TOKENS.separators.indexOf(char) > 0) {
      tokens.push({
        value: char,
        type: "separator",
        position: current,
        offset: 1,
      })
      current++
      continue
    }

    current++
  }
  return tokens
}

const updateLexicalView = (view, doc) => {
  const tokens = tokenizer(doc.getValue())
  view.innerHTML = JSON.stringify(tokens, null, 2).replace("<", "&lt")
}
// Codemirror initialization
const editor_container = document.getElementById("editor-container")

const code = CodeMirror(editor_container, {
  value: `#include <stdio.h>
main () {
  int a, b, suma;
  scanf("%d", &a);
  scanf("%d", &b);
  suma = a + b;
  printf("La suma es:%d", suma);
}
  `,
  mode: 'clike',
  lineNumbers: true,
  theme: "one-dark"
})


const out = document.getElementById("tokens")

updateLexicalView(out, code)

code.on("change", doc => {
  updateLexicalView(out, doc)
})