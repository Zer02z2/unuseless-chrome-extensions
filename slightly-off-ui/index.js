const init = async () => {
  const [tab] = await chrome.tabs.query({ active: true })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {},
  })
}

document.body.style.color = "blue"
console.log("hi")
