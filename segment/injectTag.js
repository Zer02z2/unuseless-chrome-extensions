window.trustedTypes.createPolicy("default", {
  // Mediapipe requires these for loading
  createScriptURL: (string) => string,
  createScript: (script) => script,
})

const contentScript = document.createElement("script")
contentScript.src = chrome.extension.getURL("content.js")
;(document.head || document.documentElement).appendChild(contentScript)
