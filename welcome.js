// welcome.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const openSettingsBtn = document.getElementById('open-settings');
    const getStartedBtn = document.getElementById('get-started');
    
    // Open settings button click handler
    openSettingsBtn.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
    
    // Get started button click handler
    getStartedBtn.addEventListener('click', function() {
      // Close this tab and open the extension popup
      chrome.tabs.getCurrent(function(tab) {
        chrome.action.openPopup();
        chrome.tabs.remove(tab.id);
      });
    });
    
    // Check if API key is already set
    chrome.storage.sync.get('apiKey', function(data) {
      if (data.apiKey) {
        // API key is already set, update text accordingly
        document.querySelector('.setup-section ol li:nth-child(1)').innerHTML = `
          <h3>API Key Sudah Dikonfigurasi ✓</h3>
          <p>Anda sudah mengatur kunci API. Jika perlu mengubah, Anda dapat mengakses melalui pengaturan ekstensi.</p>
        `;
      }
    });
  });