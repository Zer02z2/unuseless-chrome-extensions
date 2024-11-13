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
    console.log(parsedResponse)
  } catch (error) {
    console.log(error)
  }
}

const batch = ["hi", "no", "water"]
const length = batch.length
const input = JSON.stringify(batch)
console.log(input)
fetchEmbedding(input, length)
