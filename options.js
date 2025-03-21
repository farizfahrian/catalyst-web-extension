// options.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const apiKeyInput = document.getElementById('api-key');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const saveSettingsBtn = document.getElementById('save-settings');
    const statusMessage = document.getElementById('status-message');
    const floatButtonToggle = document.getElementById('float-button');
    const contextMenuToggle = document.getElementById('context-menu');
    const primaryLanguageSelect = document.getElementById('primary-language');
    
    // Load saved settings
    loadSettings();
    
    // Toggle API key visibility
    toggleVisibilityBtn.addEventListener('click', function() {
      if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleVisibilityBtn.querySelector('img').src = 'images/eye-off-icon.png';
      } else {
        apiKeyInput.type = 'password';
        toggleVisibilityBtn.querySelector('img').src = 'images/eye-icon.png';
      }
    });
    // Save settings button click handler
  saveSettingsBtn.addEventListener('click', function() {
    saveSettings();
  });
  
  // Function to load saved settings
  function loadSettings() {
    chrome.storage.sync.get([
      'apiKey',
      'showFloatingButton',
      'enableContextMenu',
      'primaryLanguage'
    ], function(data) {
      // Set API key
      if (data.apiKey) {
        apiKeyInput.value = data.apiKey;
      }
      
      // Set floating button toggle
      floatButtonToggle.checked = data.showFloatingButton !== false; // Default to true
      
      // Set context menu toggle
      contextMenuToggle.checked = data.enableContextMenu !== false; // Default to true
      
      // Set primary language
      if (data.primaryLanguage) {
        primaryLanguageSelect.value = data.primaryLanguage;
      }
    });
  }
  
  // Function to save settings
  function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    const showFloatingButton = floatButtonToggle.checked;
    const enableContextMenu = contextMenuToggle.checked;
    const primaryLanguage = primaryLanguageSelect.value;
    
    // Validate API key
    if (!apiKey) {
      showStatus('Harap masukkan kunci API', 'error');
      return;
    }
    
    // Save settings to chrome.storage.sync
    chrome.storage.sync.set({
      'apiKey': apiKey,
      'showFloatingButton': showFloatingButton,
      'enableContextMenu': enableContextMenu,
      'primaryLanguage': primaryLanguage
    }, function() {
      showStatus('Pengaturan berhasil disimpan!', 'success');
      
      // Apply context menu setting
      updateContextMenuState(enableContextMenu);
      
      // Apply floating button setting
      updateFloatingButtonState(showFloatingButton);
    });
  }
  
  // Function to show status message
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    
    // Clear message after 3 seconds
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 3000);
  }
  
  // Function to update context menu state
  function updateContextMenuState(enabled) {
    chrome.runtime.sendMessage({
      action: 'updateContextMenu',
      enabled: enabled
    });
  }
  
  // Function to update floating button state
  function updateFloatingButtonState(enabled) {
    chrome.tabs.query({}, function(tabs) {
      for (let tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateFloatingButton',
          enabled: enabled
        });
      }
    });
  }
});