const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2

const random = (low, high) => {
  return low + Math.random() * (high - low)
}

const elementData = (element) => {
  const rect = element.getBoundingClientRect()
  const x = rect.left + rect.width / 2 + window.scrollX
  const y = rect.top + rect.height / 2 + window.scrollY
  const moveX = centerX - x
  const moveY = centerY - y
  const increment = random(0.002, 0.01)
  const delay = random(0, 300)
  return {
    target: element,
    moveX: moveX,
    moveY: moveY,
    increment: increment,
    progress: 0,
    delay: delay,
    opacity: 1,
    scale: 1,
  }
}

const findEndChildren = () => {
  const elementsNodes = document.body.querySelectorAll("*")
  const elements = Array.from(elementsNodes)
  let result = []
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i]
    const children = element.querySelectorAll(":scope > *")
    if (Array.from(children).length === 0) {
      result.push(elementData(element))
    }
    //if (result.length === 10000) break
  }
  return result
}

let endChildren = findEndChildren()
let watchList = []

const animate = () => {
  for (let i = endChildren.length - 1; i >= 0; i--) {
    const element = endChildren[i]
    const { target, moveX, moveY, increment, progress, opacity, delay, scale } =
      element
    element.delay = delay - 1
    if (delay > 0) continue

    element.progress = progress + increment
    element.opacity = opacity - increment
    element.scale = scale - increment
    target.style.transform = `translateX(${moveX * progress}px) translateY(${
      moveY * progress
    }px)`
    target.style.opacity = opacity
    target.style.scale = scale

    if (element.progress >= 1) {
      endChildren.splice(i, 1)
      const parent = target.parentNode
      if (!parent) break
      parent.removeChild(target)
      if (watchList.find((item) => item === parent)) break
      watchList.push(parent)
    }
  }

  //if (endChildren.length === 0) endChildren = findEndChildren()

  for (let i = watchList.length - 1; i >= 0; i--) {
    const element = watchList[i]
    if (element.querySelectorAll(":scope > *").length === 0) {
      watchList.splice(i, 1)
      endChildren.push(elementData(element))
    }
  }
  window.requestAnimationFrame(animate)
}
animate()
