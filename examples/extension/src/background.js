/* eslint-disable no-undef */
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.id, {
    file: 'entry.js'
  })
})
