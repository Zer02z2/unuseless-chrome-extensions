const fetchEmbedding = async (input, length) => {
  const url = "http://localhost:3001/undnet/textUmap"
  const data = {
    text_batch: input,
    length: length,
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }
  try {
    console.log("start fetching")
    const response = await fetch(url, options)
    const parsedResponse = await response.json()
    return parsedResponse
  } catch (error) {
    console.log(error)
  }
}

const getRandomElements = (arr, count) => {
  const array = [...arr]

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.slice(0, count)
}

const elementsNodes = document.body.querySelectorAll("*")
const elements = Array.from(elementsNodes)

const textElements = elements.filter((element) => {
  const childNodes = element.childNodes
  return Array.from(childNodes).some(
    (child) =>
      child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== ""
  )
})
const textMap = textElements.map((element) => {
  const text = element.innerText
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,!?-]/g, "")
    .replace(/\s([.,!?-])/g, "$1")
    .replace(/\s+/g, " ")
  return { element: element, text: text }
})
const filteredTextMap = textMap.filter((item) => item.text.trim() !== "")
const chosenTextMap = getRandomElements(filteredTextMap, 100)

const init = async () => {
  const length = chosenTextMap.length
  const input = JSON.stringify(chosenTextMap.map((item) => item.text))
  const umap = await fetchEmbedding(input, length)
  if (!umap) return

  const map = umap.map((vector, index) => {
    return { src: chosenTextMap[index], vector: vector }
  })
  const padding = 200
  const fullHeight = document.body.scrollHeight - padding * 2
  const fullWidth = document.body.scrollWidth - padding * 2

  const newElements = map.map((instance) => {
    const element = instance.src.element
    console.log(element)
    const rect = element.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const x = instance.vector[0] * fullWidth + padding - width / 2
    const y = instance.vector[1] * fullHeight + padding - height / 2
    element.style.position = "absolute"
    element.style.display = "block"
    element.style.width = width
    element.style.height = height
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    const clone = element.cloneNode(true)
    return clone
  })

  elements.forEach((div) => div.remove())
  document.body.style.position = "relative"
  newElements.forEach((element) => {
    document.body.appendChild(element)
  })
}

init()
