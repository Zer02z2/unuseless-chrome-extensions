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
console.log(textContents)

const batch = ["hi", "no", "water"]
const length = batch.length
const input = JSON.stringify(batch)

const getUmap = async () => {
  const umap = await fetchEmbedding(input, length)
  const map = umap.map((vector, index) => {
    return { sentence: batch[index], vector: vector }
  })
  console.log(map)
}

getUmap()
