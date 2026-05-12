// We attach our app to the 'window' object so we can refresh data without re-injecting the UI
if (!window.stamperProInitialized) {
    window.stamperProInitialized = true;
    
    // 1. Build the Modern Container UI
    const container = document.createElement('div');
    container.id = 'livestream-stamper-overlay';
    
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        max-width: calc(100vw - 40px);
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        z-index: 999999;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #0f172a;
        display: flex;
        flex-direction: column;
        max-height: 60vh;
        transition: opacity 0.2s ease-in-out;
    `;

    container.innerHTML = `
        <div id="lso-header" style="background: rgba(248, 250, 252, 0.6); padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,0.05); border-radius: 16px 16px 0 0; display:flex; justify-content:space-between; align-items:center; cursor: grab; user-select: none;">
            <div style="display:flex; gap: 15px; align-items:center;">
                <strong style="margin:0; font-size:15px; display:flex; align-items:center; gap:6px;">⏱️ Stamper Pro</strong>
                <button id="lso-clear-btn" style="background:none; border:1px solid #fca5a5; cursor:pointer; font-size:12px; padding:4px 8px; border-radius:6px; color:#ef4444; font-weight:600;" title="Clear All">Clear</button>
            </div>
            <button id="lso-close-btn" style="background:none; border:none; cursor:pointer; font-size:18px; padding:0; line-height:1; color:#64748b;" title="Close">✖</button>
        </div>
        
        <div style="padding: 16px; overflow-y: auto; flex-grow: 1; display:flex; flex-direction:column; gap:12px;">
            <div id="lso-list" style="display:flex; flex-direction:column; gap:8px; flex-grow: 1;"></div>
            
            <div style="display:flex; flex-direction:column; gap:8px; margin-top: auto;">
                <button id="lso-capture-btn" style="padding: 12px; cursor: pointer; background: #0f172a; color: white; border: none; border-radius: 10px; font-weight: 600; font-size:14px; box-shadow: 0 4px 6px rgba(15, 23, 42, 0.2); transition: transform 0.1s;">+ Capture Timestamp</button>
                <button id="lso-copy-btn" style="display: none; padding: 12px; cursor: pointer; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 600; font-size:14px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">📋 Copy for Comments</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // 2. Dragging Logic
    const header = document.getElementById('lso-header');
    let isDragging = false;
    let offsetX, offsetY;

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        header.style.cursor = 'grabbing';
        const rect = container.getBoundingClientRect();
        container.style.width = rect.width + 'px';
        container.style.bottom = 'auto';
        container.style.right = 'auto';
        container.style.left = rect.left + 'px';
        container.style.top = rect.top + 'px';
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
    };

    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });

    header.addEventListener('touchstart', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, {passive: false});

    const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;
        container.style.left = `${clientX - offsetX}px`;
        container.style.top = `${clientY - offsetY}px`;
    };

    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY), {passive: false});

    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'grab';
        }
    };

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // 3. State & App Logic
    window.stamperPro = {
        timestamps: [],
        pageKey: '',

        // Runs every time you open the extension to fetch the correct video's data
        initForCurrentPage: function() {
            try {
                // Safely extract just the base video URL, ignoring timestamps like &t=5s
                let url = new URL(window.location.href);
                let cleanUrl = url.origin + url.pathname;
                if (url.searchParams.has('v')) {
                    cleanUrl += '?v=' + url.searchParams.get('v'); // Keep YouTube Video ID
                }
                this.pageKey = 'stamper_' + cleanUrl;
            } catch(e) {
                this.pageKey = 'stamper_' + window.location.href; // Fallback
            }
            
            // Load this specific video's timestamps
            chrome.storage.local.get([this.pageKey], (result) => {
                this.timestamps = result[this.pageKey] || [];
                this.render();
            });
        },

        saveData: function() {
            if (this.timestamps.length > 0) {
                chrome.storage.local.set({ [this.pageKey]: this.timestamps });
            } else {
                chrome.storage.local.remove(this.pageKey); // Clean up empty lists
            }
        },

        formatTime: function(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const formattedM = m.toString().padStart(2, '0');
            const formattedS = s.toString().padStart(2, '0');
            return h > 0 ? `${h}:${formattedM}:${formattedS}` : `${formattedM}:${formattedS}`;
        },

        render: function() {
            const list = document.getElementById('lso-list');
            const copyBtn = document.getElementById('lso-copy-btn');
            list.innerHTML = '';
            
            this.timestamps.sort((a, b) => a.time - b.time);
            copyBtn.style.display = this.timestamps.length > 0 ? 'block' : 'none';

            this.timestamps.forEach(ts => {
                const row = document.createElement('div');
                row.style.cssText = "display:flex; align-items:center; gap:6px; background: rgba(0,0,0,0.03); padding:8px; border-radius:8px; border:1px solid rgba(0,0,0,0.05);";

                const timeDisplay = document.createElement('span');
                timeDisplay.style.cssText = "font-weight:700; font-family: ui-monospace, monospace; width:55px; font-size:13px; color:#2563eb; cursor:pointer;";
                timeDisplay.textContent = this.formatTime(ts.time);
                timeDisplay.onclick = () => {
                    const video = document.querySelector('.html5-main-video') || document.querySelector('video');
                    if (video) video.currentTime = ts.time;
                };

                const btnStyle = "cursor:pointer; padding:4px; background:#e2e8f0; border:none; border-radius:4px; font-weight:700; color:#334155; font-size:11px; width:28px;";
                
                const minusBtn = document.createElement('button');
                minusBtn.style.cssText = btnStyle; 
                minusBtn.textContent = '-2s'; 
                minusBtn.onclick = () => { ts.time = Math.max(0, ts.time - 2); this.render(); this.saveData(); };

                const plusBtn = document.createElement('button');
                plusBtn.style.cssText = btnStyle; 
                plusBtn.textContent = '+2s'; 
                plusBtn.onclick = () => { ts.time += 2; this.render(); this.saveData(); };

                const noteInput = document.createElement('input');
                noteInput.style.cssText = "flex-grow:1; padding:6px; border:1px solid #cbd5e1; border-radius:6px; color:#0f172a; font-size:13px; background:white;";
                noteInput.placeholder = 'Note...';
                noteInput.value = ts.note;
                noteInput.oninput = (e) => { ts.note = e.target.value; this.saveData(); };
                
                noteInput.onkeydown = (e) => e.stopPropagation();
                noteInput.onkeyup = (e) => e.stopPropagation();
                noteInput.onkeypress = (e) => e.stopPropagation();

                const deleteBtn = document.createElement('button');
                deleteBtn.style.cssText = "cursor:pointer; padding:4px 8px; background:#fee2e2; color:#ef4444; border:none; border-radius:4px; font-size:12px;";
                deleteBtn.textContent = '✖';
                deleteBtn.onclick = () => { this.timestamps = this.timestamps.filter(t => t.id !== ts.id); this.render(); this.saveData(); };

                row.append(timeDisplay, minusBtn, plusBtn, noteInput, deleteBtn);
                list.appendChild(row);
            });
            list.scrollTop = list.scrollHeight;
        }
    };

    // 4. Button Listeners
    document.getElementById('lso-close-btn').addEventListener('click', () => {
        container.style.display = 'none';
    });

    document.getElementById('lso-clear-btn').addEventListener('click', () => {
        if(confirm("Clear all timestamps?")) {
            window.stamperPro.timestamps = [];
            window.stamperPro.render();
            chrome.storage.local.remove(window.stamperPro.pageKey);
        }
    });

    document.getElementById('lso-capture-btn').addEventListener('click', () => {
        const video = document.querySelector('.html5-main-video') || document.querySelector('video');
        if (video) {
            window.stamperPro.timestamps.push({ id: Date.now(), time: video.currentTime, note: '' });
            window.stamperPro.render();
            window.stamperPro.saveData();
        } else {
            alert("No playing video found on this page.");
        }
    });

    document.getElementById('lso-copy-btn').addEventListener('click', (e) => {
        if (window.stamperPro.timestamps.length === 0) return;
        const text = window.stamperPro.timestamps.map(ts => `${window.stamperPro.formatTime(ts.time)}${ts.note ? ` - ${ts.note}` : ''}`).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const btn = e.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            btn.style.background = '#16a34a'; 
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#2563eb';
            }, 2000);
        });
    });

    // Initialize for the first time
    window.stamperPro.initForCurrentPage();

} else {
    // If the overlay is already injected, but the user clicked the extension icon again
    // We re-check the URL to see if they changed videos, load that data, and show the window
    window.stamperPro.initForCurrentPage();
    const container = document.getElementById('livestream-stamper-overlay');
    container.style.display = (container.style.display === 'none') ? 'flex' : 'none';
}
