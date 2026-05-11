# ⏱️ Stamper Pro (Chromium Extension)
[ Made using AI ]

Stamper Pro is a modern, floating Chrome Extension designed for content creators, students, and avid livestream watchers. It allows you to instantly capture timestamps from any playing video (like YouTube or local browser files), fine-tune them, add notes, and copy perfectly formatted lists for comment sections.

## ✨ Features

* **🪟 Floating Glassmorphism UI:** A sleek, draggable overlay that lives directly on the webpage so you don't have to switch tabs or open popups.
* **🎯 Precision Fine-tuning:** Missed the exact moment? Use the `-1s` and `+1s` buttons to adjust the timestamp perfectly.
* **⏭️ Jump-to-Time:** Click any generated timestamp in your list to instantly seek the video to that exact moment.
* **⌨️ Smart Input Handling:** Safely type your notes without accidentally triggering YouTube hotkeys (like the spacebar pausing your video).
* **📋 One-Click Copy:** Copies your entire list in a clean `MM:SS - Note` format, ready to be pasted into the YouTube comments box.
* **📱 Touch & Mobile Friendly:** Fully responsive design that shrinks on smaller screens and supports touch-dragging for mobile browsers like Kiwi.

## 🚀 Installation

Because this extension is not yet published on the Chrome Web Store, you can install it locally in "Developer Mode".

1. **Download or Clone this repository** to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing this extension's files.
6. Pin the extension to your Chrome toolbar for easy access!

## 🛠️ How to Use

1. Open any webpage with a video (e.g., YouTube) or drag an `.mp4` file into a Chrome tab.
2. Click the **Stamper Pro** extension icon in your toolbar.
3. A floating window will appear. You can drag it anywhere on the screen by clicking and holding the header.
4. Click **+ Capture Timestamp** to log the current video time.
5. Add an optional note in the text box.
6. Click **📋 Copy for Comments** and paste it wherever you need!

## 📂 File Structure

* `manifest.json` - The configuration file required by Chrome.
* `background.js` - Runs silently, listening for the extension icon click to inject the UI.
* `content.js` - Contains the UI rendering, drag logic, and video interaction logic.
* `icon.svg` - The vector icon for the extension.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
