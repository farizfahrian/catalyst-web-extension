let contextMenuCreated = false;

// Unified context menu management
async function updateContextMenu(enabled) {
  try {
    // Always remove existing menu first
    await chrome.contextMenus.remove('generateFromSelection');
    contextMenuCreated = false;
  } catch (error) {
    // Menu didn't exist - this is expected
  }

  if (enabled) {
    try {
      await chrome.contextMenus.create({
        id: 'generateFromSelection',
        title: 'Generate with Content Catalyst',
        contexts: ['selection']
      });
      contextMenuCreated = true;
    } catch (error) {
      console.error("Error creating context menu:", error.message);
    }
  }
}

// Improved installation handler
chrome.runtime.onInstalled.addListener(async (details) => {
  const data = await chrome.storage.sync.get({ enableContextMenu: true });
  await updateContextMenu(data.enableContextMenu);
  
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'welcome.html' });
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
