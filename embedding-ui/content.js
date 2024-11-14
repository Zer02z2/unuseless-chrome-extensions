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

function getRandomElements(arr, count) {
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
const textContents = textElements.map((element) =>
  element.innerText
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,!?-]/g, "")
    .replace(/\s([.,!?-])/g, "$1")
    .replace(/\s+/g, " ")
)
const filteredText = textContents.filter((text) => text.trim() !== "")
const chosenText = getRandomElements(filteredText, 10)

const getUmap = async () => {
  const length = chosenText.length
  const input = JSON.stringify(chosenText)
  const umap = await fetchEmbedding(input, length)
  const map = umap.map((vector, index) => {
    return { sentence: chosenText[index], vector: vector }
  })
  console.log(map)
}

getUmap()
