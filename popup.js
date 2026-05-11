let timestamps = [];

// Formats seconds into HH:MM:SS or MM:SS
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const formattedM = m.toString().padStart(2, '0');
    const formattedS = s.toString().padStart(2, '0');

    if (h > 0) {
        return `${h}:${formattedM}:${formattedS}`;
    }
    return `${formattedM}:${formattedS}`;
}

// Listen for "Capture" button click
document.getElementById('capture-btn').addEventListener('click', async () => {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Prevent running on restricted Chrome pages
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
        alert("Extensions cannot run on browser settings pages.");
        return;
    }

    try {
        // Execute a function directly on the current webpage
        const injectionResults = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // Look specifically for YouTube's video player, fallback to any standard video tag
                const video = document.querySelector('.html5-main-video') || document.querySelector('video');
                if (video) {
                    return video.currentTime;
                }
                return null; // Return null if no video is found
            }
        });

        // Get the result returned from the injected function
        const time = injectionResults[0].result;
        
        if (time !== null && time !== undefined) {
            addTimestamp(time);
        } else {
            alert("No playing video found. Ensure the video has started.");
        }
    } catch (error) {
        console.error("Injection error: ", error);
        alert("Could not fetch timestamp. Try refreshing the page.");
    }
});

function addTimestamp(timeInSeconds) {
    const id = Date.now(); // Unique ID for each entry
    timestamps.push({ id, time: timeInSeconds, note: '' });
    render();
}

function updateTime(id, delta) {
    const ts = timestamps.find(t => t.id === id);
    if (ts) {
        ts.time = Math.max(0, ts.time + delta); // Prevent negative time
        render();
    }
}

function updateNote(id, note) {
    const ts = timestamps.find(t => t.id === id);
    if (ts) {
        ts.note = note;
    }
}

// Updates the HTML view of timestamps
function render() {
    const list = document.getElementById('timestamp-list');
    list.innerHTML = '';
    
    timestamps.forEach(ts => {
        const div = document.createElement('div');
        div.className = 'timestamp-item';

        const timeDisplay = document.createElement('span');
        timeDisplay.className = 'time-display';
        timeDisplay.textContent = formatTime(ts.time);

        const minusBtn = document.createElement('button');
        minusBtn.className = 'tune-btn';
        minusBtn.textContent = '-1s';
        minusBtn.onclick = () => updateTime(ts.id, -1);

        const plusBtn = document.createElement('button');
        plusBtn.className = 'tune-btn';
        plusBtn.textContent = '+1s';
        plusBtn.onclick = () => updateTime(ts.id, 1);

        const noteInput = document.createElement('input');
        noteInput.className = 'note-input';
        noteInput.placeholder = 'Add note...';
        noteInput.value = ts.note;
        noteInput.oninput = (e) => updateNote(ts.id, e.target.value);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = () => {
            timestamps = timestamps.filter(t => t.id !== ts.id);
            render();
        };

        div.append(timeDisplay, minusBtn, plusBtn, noteInput, deleteBtn);
        list.appendChild(div);
    });
}

// Format and copy to clipboard
document.getElementById('copy-all-btn').addEventListener('click', () => {
    if (timestamps.length === 0) {
        alert("No timestamps to copy.");
        return;
    }

    const text = timestamps.map(ts => {
        const notePart = ts.note ? ` - ${ts.note}` : '';
        return `${formatTime(ts.time)}${notePart}`;
    }).join('\n');

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-all-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy for Comments', 2000);
    });
});
