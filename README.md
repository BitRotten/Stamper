# ⏱️ Stamper Pro (Chrome Extension)

Stamper Pro is a premium, floating Chrome Extension designed for content creators, students, and avid livestream watchers. It allows you to instantly capture timestamps from any playing video (like YouTube or local browser files), fine-tune them, add notes, and copy perfectly formatted lists for comment sections.

## ✨ Key Features

* **🪟 Floating Glassmorphism UI:** A sleek, draggable overlay that lives directly on the webpage. No more switching tabs or losing popups.
* **💾 Smart Auto-Save (Persistence):** Automatically saves your timestamps to Chrome's local storage. If you refresh the page or come back tomorrow, your list for that specific video will still be there!
* **🔄 YouTube SPA Support:** Seamlessly handles YouTube's dynamic page loading. Click a new video on YouTube, and Stamper Pro automatically loads a fresh list while keeping your old list safely saved.
* **🎯 Precision Fine-tuning:** Missed the exact moment? Use the `-2s` and `+2s` buttons to adjust your timestamps perfectly.
* **⏭️ Jump-to-Time:** Click any generated timestamp in your list to instantly seek the video to that exact moment.
* **⌨️ Smart Input Handling:** Safely type your notes without accidentally triggering YouTube hotkeys (like the spacebar pausing your video).
* **📋 One-Click Copy:** Copies your entire list in a clean `MM:SS - Note` format, ready to be pasted into the YouTube comments box.
* **📱 Touch & Mobile Friendly:** Fully responsive design that shrinks on smaller screens and supports touch-dragging for mobile browsers.

## 🚀 Installation (Developer Mode)

Because this extension is not yet published on the Chrome Web Store, you can install it locally in a few quick steps:

1. **Download or Clone this repository** to your local machine and extract it to a folder.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing this extension's files.
6. Pin the extension to your Chrome toolbar for easy access!

## 🛠️ How to Use

1. Open any webpage with a video (e.g., YouTube) or drag an `.mp4` file into a Chrome tab.
2. Click the **Stamper Pro** extension icon in your toolbar.
3. A floating window will appear. You can drag it anywhere on the screen by clicking and holding the top title bar.
4. Click **+ Capture Timestamp** to log the current video time.
5. Add an optional note in the text box.
6. Click **📋 Copy for Comments** and paste it wherever you need!
7. *Tip:* Use the **Clear** button in the top left to wipe the list for the current video.

## 📂 File Structure

* `manifest.json` - The configuration file required by Chrome (v3).
* `background.js` - Runs silently, listening for the extension icon click to inject the UI.
* `content.js` - Contains the UI rendering, drag logic, storage management, and video interaction logic.
* `icon.png` - The custom icon for the extension.
* `index.html` - A fully coded, dark-mode landing page you can host to easily share the extension with friends!

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
