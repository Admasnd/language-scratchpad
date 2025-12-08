// TODO research which things strict mode treats as an error
'use strict';

const textarea = document.getElementById('lang-input-text');
const resetBtn = document.getElementById('lang-input-reset');
const storageKey = 'textareaContent';
let saveTimeout;

// Load saved content when page loads
window.addEventListener('load', function() {
    const savedContent = localStorage.getItem(storageKey);
    if (savedContent) {
        textarea.textContent = savedContent;
    }
    // Register service worker if functionality is available
    navigator?.serviceWorker.register('/sw.js');
});

// Save content to localStorage whenever user types
textarea.addEventListener('input', function(e) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem(storageKey, e.target.textContent);
    }, 500); // Save 500ms after user stops typing
});

// Clear localStorage when reset is clicked
resetBtn.addEventListener('click', function() {
    localStorage.removeItem(storageKey);
});
