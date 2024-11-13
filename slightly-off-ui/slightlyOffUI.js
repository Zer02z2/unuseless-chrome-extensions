const random = (low, high) => {
  return low + Math.random() * (high - low)
}

const elementsNodes = document.body.querySelectorAll("*")
const elements = Array.from(elementsNodes)

elements.forEach((element) => {
  const scale = element.style.scale ? element.style.scale : 1
  const factor = random(0.95, 1.05)
  const newScale = scale * factor
  element.style.scale = newScale

  const translateX = `${Math.floor(random(-5, 5))}px`
  const translateY = `${Math.floor(random(-5, 5))}px`
  element.style.transform = `translateX(${translateX}) translateY(${translateY})`
})
