const random = (low, high) => {
  return low + Math.random() * (high - low)
}

const elementData = (element, distanceToRoot) => {
  return {
    target: element,
    isEndChild: Array.from(element.querySelectorAll(":scope > *")).length === 0,
    distanceToRoot: distanceToRoot + 1,
  }
}

const findDataOfChildren = (element, distanceToRoot) => {
  const children = element.querySelectorAll(":scope > *")
  let result = []
  if (!children) return result
  const childrenArray = Array.from(children)
  childrenArray.forEach((child) => {
    const data = elementData(child, distanceToRoot + 1)
    result.push(data)
    const childrenData = findDataOfChildren(child, distanceToRoot + 1)
    result.push(...childrenData)
  })
  return result
}

const getFactor = async () => {
  const bulb = await chrome.storage.local.get("data")
  const data = bulb.data
  const value = Object.values(data)[0].value || 0
  const factor = map(value, 0, 100, 0, 1)
  return factor
}

const init = async () => {
  let globalFactor = 0
  let started = false

  const elementData = findDataOfChildren(document.body, 0)
  console.log(elementData)

  const maxDistance = elementData.reduce(
    (prev, next) => Math.max(prev, next.distanceToRoot),
    -Infinity
  )

  const start = () => {
    elementData.forEach((data) => {
      const { target, distanceToRoot } = data
      target.style.overflow = "visible"
      target.style.zIndex = `${distanceToRoot}`
    })
    //document.body.style.backgroundColor = "black"
    animate()
  }

  const updateShadow = (elementData, factor) => {
    elementData.forEach((data) => {
      const { target } = data
      const t = map(data.distanceToRoot, 0, maxDistance, 0, 1)
      const color = lerpColor(t)
      const shadowOpacity = map(factor, 0, 1, 0, 1)
      const brightness = map(data.distanceToRoot, 0, maxDistance, 0.5, 1)
      //target.style.boxShadow = `0px 0px 10px 5px rgba(50, 50, 50, ${shadowOpacity})`
      target.style.border = `solid 2px rgba(20, 20, 20, ${shadowOpacity})`
      // target.style.backgroundColor = `rgba(${color.r * brightness}, ${
      //   color.g * brightness
      // }, ${color.b * brightness}, ${shadowOpacity})`
    })
  }

  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === "dataChanged") {
      const value = map(message.value, 0, 100, 0, 1)
      globalFactor = value
      updateShadow(elementData, globalFactor)

      if (started === false) {
        start()
        started = true
      }
    }
  })

  const animate = () => {
    requestAnimationFrame(animate)

    elementData.forEach((data) => {
      const { target, distanceToRoot, isEndChild } = data
      const { top, bottom, left, right } = target.getBoundingClientRect()
      if (bottom >= 0 && top <= window.innerHeight) {
        const midY = (bottom + top) / 2
        const maxScale = 0.08 * globalFactor
        const baseDisplayY = window.innerHeight * 0.04 * globalFactor
        const baseDisplayX = window.innerWidth * 0.008 * globalFactor

        const scale = map(distanceToRoot, 0, maxDistance, 0, maxScale)

        const displaceY = map(
          midY,
          0,
          window.innerHeight,
          -baseDisplayY,
          baseDisplayY
        )
        const displaceXFactor = map(
          Math.abs((left + right) / 2 - window.innerWidth / 2),
          0,
          window.innerWidth / 2,
          0,
          1
        )
        const displaceXDirecton =
          (left + right) / 2 < window.innerWidth / 2 ? -1 : 1

        target.style.transform = `translateY(${displaceY}px) translateX(${
          baseDisplayX * displaceXFactor * displaceXDirecton
        }px) scale(${1 + scale})`

        if (isEndChild) {
          const opacity = map(distanceToRoot, 0, maxDistance, 0, 1)
          //target.style.opacity = `${opacity + (1 - globalFactor)}`
          //target.style.backgroundColor = "white"
        }
      }
    })
  }
}

const map = (value, min1, max1, min2, max2) => {
  const ratio = (value - min1) / max1
  return min2 + (max2 - min2) * ratio
}

const easeOut = (t) => {
  return 1 - Math.pow(1 - t, 3)
}

const lerpColor = (t) => {
  let r, g, b

  if (t < 0.25) {
    // Blut → Green
    r = 0.2
    g = map(t, 0, 0.25, 0.8, 1)
    b = map(t, 0, 0.25, 1, 0.3)
  } else if (t < 0.35) {
    // Green → Yellow
    r = map(t, 0.25, 0.35, 0.2, 1)
    g = 1
    b = 0.3
  } else if (t < 0.6) {
    // Yellow → Orange
    r = 1
    g = map(t, 0.35, 0.6, 1, 0.5)
    b = 0.3
  } else {
    // Green → Blue
    r = 1
    g = 0.5
    b = map(t, 0.6, 1, 0.3, 0.5)
  }
  r = map(r, 0, 1, 0, 255)
  g = map(g, 0, 1, 0, 255)
  b = map(b, 0, 1, 0, 255)
  return { r: r, g: g, b: b }
}

init()
