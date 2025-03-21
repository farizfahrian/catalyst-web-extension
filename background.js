// background.js
// Initialize context menu items
chrome.runtime.onInstalled.addListener(function() {
    // Create context menu for text selection
    chrome.contextMenus.create({
      id: 'generateFromSelection',
      title: 'Generate with Content Catalyst',
      contexts: ['selection']
    });
    
    // Show welcome page on installation
    chrome.runtime.onInstalled.addListener(function(details) {
      if (details.reason === 'install') {
        chrome.tabs.create({
          url: 'welcome.html'
        });
      }
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === 'generateFromSelection') {
      // Open popup with the selected text pre-filled
      chrome.storage.local.set({
        'selectedText': info.selectionText
      }, function() {
        chrome.action.openPopup();
      });
    }
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'openPopup') {
      chrome.action.openPopup();
    }
    return true;
  });