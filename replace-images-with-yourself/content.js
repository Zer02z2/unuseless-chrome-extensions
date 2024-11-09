const elementsNodes = document.body.querySelectorAll("*")
const elements = Array.from(elementsNodes)

const findImg = (elementsArr) => {
  let result = []
  const imgs = elementsArr.filter(
    (element) => element instanceof HTMLImageElement
  )
  result = [...result, ...imgs]
  const shadowDoms = elementsArr.filter((element) => element.shadowRoot)
  if (shadowDoms.length > 0) {
    shadowDoms.forEach((shadowDom) => {
      const shadowElements = Array.from(shadowDom.querySelectorAll("*"))
      const shadowImgs = findImg(shadowElements)
      result = [...result, ...shadowImgs]
    })
  }
  return result
}

const imgElements = findImg(elements)

console.log(imgElements)

const createCapture = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    return stream
  } catch (error) {
    console.log("Video init failed.")
  }
}

const init = async () => {
  const stream = await createCapture()
  if (!stream) return
  imgElements.forEach((element) => {
    const video = document.createElement("video")
    video.srcObject = stream
    video.play()

    const parent = element.parentElement
    const rect = parent.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    video.width = width
    video.height = height
    parent.appendChild(video)
    parent.removeChild(element)
  })
}

init()
