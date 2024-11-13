const fetchEmbedding = async (input) => {
  const url = "https://replicate-api-proxy.glitch.me/create_n_get/"
  const data = {
    version: "b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305",
    input: { text_batch: input },
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

const batch = ["hi", "no"]
const input = JSON.stringify(batch)
console.log(input)
fetchEmbedding(input)
