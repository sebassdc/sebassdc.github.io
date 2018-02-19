import TOKENS from './tokens.js'

const isOperator = char => TOKENS.operators.map(e => e[0]).indexOf(char) > -1

export default str => {
  let tokens = []
  let current = 0
  
  mainloop:
  while (current < str.length) {
    let char = str[current]
    // console.log("Char: ", char)
    
    // Preproccesor directive
    if (char === "#") {
      let value = ''
      let position = current + 0 // copy the value
      while (char !== "\n") {
        if (current >= str.length) break mainloop
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
    else
    // NUMBERS
    if (/[0-9]/.test(char)) {
      let floatFlag = false
      let value = ""
      let position = current + 0 // copy the value
      while (
        (/[0-9]/.test(char) || char === ".")
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
    else
    // STRINGS
    if (char === '"') {
      let value = ''
      let position = current + 0 // copy the value
      char = str[++current] // Apertura de comillas
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
    else
    // IDENTIFIERS
    if (/[a-z]/i.test(char)) {
      let value = ''
      let position = current + 0 // copy the value
      do {
        value += char
        char = str[++current]
        if (current >= str.length) continue mainloop
      } while (/[a-z]|[A-Z]|_|[0-9]/.test(char));
      let type = (TOKENS.keywords.indexOf(value) > -1) ?
        'keyword' : 'identifier'
      tokens.push({
        value,
        type,
        position,
        offset: value.length,
      })
      continue
    }
    else
    // SEPARATORS
    if (TOKENS.separators.indexOf(char) > -1) {
      tokens.push({
        value: char,
        type: "separator",
        position: current,
        offset: 1,
      })
      current++
      continue
    }
    else
    // OPERATORS
    if (isOperator(char)) {
      let value = ""
      const position = current + 0;

      const isDouble = TOKENS.operators.indexOf(char + str[current + 1]) > -1
      if (isDouble) {
        value =  char + str[current + 1]
        current += 2
      } else {
        value = char + ""
        current++
      }
      tokens.push({
        value,
        type: "operator",
        position,
        offset: value.length,
      })
      current++
      continue
    }
    else
    // WHITESPACE
    if (/(\ )|(\n)|(\t)/g.test(char)) {
      current++
      continue
    }
    else {
      const err = Error(`Custom Lexical error, at position ${current}\n Unexpected token: ${char}`)
      console.log(err)
      return err
    }
  }
  return tokens
}