// Improved options.js
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
      toggleVisibilityBtn.querySelector('img').src = 'assets/eye-off.svg';
      toggleVisibilityBtn.title = "Hide API Key";
    } else {
      apiKeyInput.type = 'password';
      toggleVisibilityBtn.querySelector('img').src = 'assets/eye.svg';
      toggleVisibilityBtn.title = "Show API Key";
    }
  });

  // Save settings button click handler
  saveSettingsBtn.addEventListener('click', saveSettings);

  // Function to load saved settings
  function loadSettings() {
    chrome.storage.sync.get({
      apiKey: '',
      showFloatingButton: false,
      enableContextMenu: true,
      primaryLanguage: 'id'
    }, function(data) {
      apiKeyInput.value = data.apiKey;
      floatButtonToggle.checked = data.showFloatingButton;
      contextMenuToggle.checked = data.enableContextMenu;
      primaryLanguageSelect.value = data.primaryLanguage;
    });
  }

  // Function to save all settings
  function saveSettings() {
    const settings = {
      apiKey: apiKeyInput.value.trim(),
      showFloatingButton: floatButtonToggle.checked,
      enableContextMenu: contextMenuToggle.checked,
      primaryLanguage: primaryLanguageSelect.value
    };

    if (!settings.apiKey) {
      showStatus('Please enter API key', 'error');
      return;
    }

    // Save to storage first
    chrome.storage.sync.set(settings, () => {
      // Then update context menu
      updateContextMenuState(settings.enableContextMenu);
      
      // Update floating button across all tabs
      updateFloatingButtonState(settings.showFloatingButton);
      
      // Update language preference globally
      chrome.runtime.sendMessage({
        action: 'updateLanguage',
        language: settings.primaryLanguage
      });
      
      showStatus('Settings saved!', 'success');
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
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error updating context menu:", chrome.runtime.lastError);
      }
    });
  }
  
  // Function to update floating button state - fixed version
  function updateFloatingButtonState(enabled) {
    // First, update the global setting in background script
    chrome.runtime.sendMessage({
      action: 'updateFloatingButton',
      enabled: enabled
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error updating floating button state:", chrome.runtime.lastError);
      }
    });
  }
});