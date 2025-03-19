const updateMessage = (data, value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return
    tabs.forEach((tab) => {
      data[tab.id] = { value: value }
      console.log(data)
      chrome.storage.local.set({ data: data })
      chrome.tabs.sendMessage(tab.id, { action: "dataChanged", value: value })
    })
  })
}

const init = async () => {
  const slider = document.getElementById("slider")
  if (!slider) return

  const data = {}

  const readCurrentValue = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) return
      const tab = tabs[0]
      const id = tab.id
      console.log(id)
      const bulb = await chrome.storage.local.get("data")
      const data = bulb.data
      slider.value = data[tab.id].value || 0
    })
  }
  await readCurrentValue()

  slider.addEventListener("input", (event) => {
    console.log(slider.value)
    updateMessage(data, slider.value)
  })
}

await init()
