// TODO research which things strict mode treats as an error
'use strict';

const textarea = document.getElementById('lang-input-text');
const resetBtn = document.getElementById('lang-input-reset');
const storageKey = 'textareaContent';
let saveTimeout;

function writeTextToStorage(text) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem(storageKey, text);
    }, 500); // Save 500ms after user stops typing
}

function storeHashText() {
    const hash = window.location.hash;
    if (hash.startsWith('#')) {
        textarea.textContent += decodeURI(hash.substring(1));
        writeTextToStorage(textarea.textContent);
    }
}

// Load saved content when page loads
window.addEventListener('load', function() {
    const savedContent = localStorage.getItem(storageKey);
    if (savedContent) {
        textarea.textContent = savedContent;
    }
    // Register service worker if functionality is available
    navigator?.serviceWorker.register('/sw.js');
    // add text received with hash fragment on initial load
    storeHashText();
});

// add text received with hash fragment when hash fragment changes
window.addEventListener('hashchange', function() {
    storeHashText();
});

// Save content to localStorage whenever user types
textarea.addEventListener('input', function(e) {
    writeTextToStorage(e.target.value);
});

// Clear localStorage when reset is clicked
// Reset button deletes textarea
resetBtn.addEventListener('click', function() {
    // persist reset by also removing text from storage
    localStorage.removeItem(storageKey);
    // also remove text last received through url hash fragment so it is not re-stored on refresh
    window.location.hash = '';
    // refresh page
    window.location.reload();
});
