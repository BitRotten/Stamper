chrome.action.onClicked.addListener((tab) => {
    // Prevent running on restricted pages
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
        return;
    }

    // Inject the content script to show the UI
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});
