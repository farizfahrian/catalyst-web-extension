// Fixed background.js
let contextMenuCreated = false;

// Function to manage context menu
function updateContextMenu(enabled) {
  if (enabled && !contextMenuCreated) {
    chrome.contextMenus.create({
      id: 'generateFromSelection',
      title: 'Generate with Content Catalyst',
      contexts: ['selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error creating context menu:", chrome.runtime.lastError);
        return;
      }
      contextMenuCreated = true;
    });
  } else if (!enabled && contextMenuCreated) {
    chrome.contextMenus.remove('generateFromSelection', () => {
      if (chrome.runtime.lastError) {
        console.error("Error removing context menu:", chrome.runtime.lastError);
        return;
      }
      contextMenuCreated = false;
    });
  }
}

// Handle initial setup
chrome.runtime.onInstalled.addListener((details) => {
  // Initialize context menu based on stored settings
  chrome.storage.sync.get({
    enableContextMenu: true
  }, (data) => {
    updateContextMenu(data.enableContextMenu);
  });
  
  // Show welcome page on fresh install
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'welcome.html'
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'generateFromSelection') {
    // Store selected text and open popup
    chrome.storage.local.set({
      'selectedText': info.selectionText
    }, () => {
      chrome.action.openPopup();
    });
  }
});

// Handle messages from options page and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle context menu updates
  if (request.action === 'updateContextMenu') {
    updateContextMenu(request.enabled);
    sendResponse({success: true});
  } 
  // Handle popup open requests
  else if (request.action === 'openPopup') {
    chrome.action.openPopup();
    sendResponse({success: true});
  }
  // Handle floating button state updates
  else if (request.action === 'updateFloatingButton') {
    // Forward to all content scripts
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateFloatingButton',
          enabled: request.enabled
        }).catch(() => {
          // Tab might not have content script loaded - this is expected
        });
      }
    });
    sendResponse({success: true});
  }
  // Handle language updates
  else if (request.action === 'updateLanguage') {
    // Store language setting
    chrome.storage.sync.set({
      primaryLanguage: request.language
    });
    sendResponse({success: true});
  }
  
  // Keep the messaging channel open for asynchronous responses
  return true;
});