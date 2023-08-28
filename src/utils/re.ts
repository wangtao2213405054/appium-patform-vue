const data = "{{ global 'name' ,min:1,max:2,change:'ws' |length|lower }}"

const pattern = /\{\{\s*([^\s|]+)\s+('[^']*')(?:\s*,\s*([^|]+))?\s*(?:\|([^%]+))*\s*(?:\|([^%]+))*\s*\}\}/

const matches = data.match(pattern)

let mapVar = null
let functionNameVar = null
const functionArgs = {}
let functionVar = []

if (matches) {
  mapVar = matches[1]
  functionNameVar = matches[2].slice(1, -1)

  // 匹配参数部分
  if (matches[3]) {
    const argsMatches = matches[3].trim().split(",")
    argsMatches.forEach((item) => {
      const [key, value] = item.split(":")
      functionArgs[key] = value.includes("'") ? value.replace(/'/g, "") : parseInt(value)
    })
  }

  // 匹配过滤器部分
  if (matches[4]) {
    functionVar = matches[4].trim().split("|")
  }
}

console.log("Map Variable:", mapVar)
console.log("Name Variable:", functionNameVar)
console.log("Function Args:", functionArgs)
console.log("Function Variable:", functionVar)
