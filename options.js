document.addEventListener('DOMContentLoaded', function() {
  // DOM elements for options page
  const apiKeyInput = document.getElementById('api-key');
  const toggleVisibilityBtn = document.getElementById('toggle-visibility');
  const saveSettingsBtn = document.getElementById('save-settings');
  const statusMessage = document.getElementById('status-message');
  const floatButtonToggle = document.getElementById('float-button');
  const contextMenuToggle = document.getElementById('context-menu');
  const primaryLanguageSelect = document.getElementById('primary-language');

  // Translations object for options page
  const translations = {
    id: {
      headerTitle: "Pengaturan Creative Content Catalyst",
      apiConfigurationTitle: "Konfigurasi API",
      apiKeyLabel: "Kunci API",
      apiKeyPlaceholder: "Masukkan kunci API NVIDIA AI Anda",
      usageOptionsTitle: "Opsi Penggunaan",
      floatingButtonLabel: "Tombol Apung",
      floatingButtonDesc: "Tampilkan tombol apung pada situs untuk akses cepat",
      contextMenuLabel: "Menu Konteks",
      contextMenuDesc: "Aktifkan opsi menu klik kanan untuk teks yang dipilih",
      languagePreferencesTitle: "Preferensi Bahasa",
      primaryLanguageLabel: "Bahasa Utama",
      primaryLanguageDesc: "Bahasa yang digunakan untuk UI ekstensi dan konten yang dihasilkan",
      saveButtonText: "Simpan Semua Pengaturan",
      statusSaved: "Pengaturan disimpan!",
      errorEnterApiKey: "Harap masukkan kunci API",
      apiKeyHelpText: "Kunci API untuk mengakses NVIDIA AI API. Tidak memiliki kunci API? ",
      getApiKeyLink: "Dapatkan kunci di sini",
      showApiKeyTitle: "Tampilkan Kunci API"
    },
    en: {
      headerTitle: "Creative Content Catalyst Settings",
      apiConfigurationTitle: "API Configuration",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "Enter your NVIDIA AI API key",
      usageOptionsTitle: "Usage Options",
      floatingButtonLabel: "Floating Button",
      floatingButtonDesc: "Show floating button on websites for quick access",
      contextMenuLabel: "Context Menu",
      contextMenuDesc: "Enable right-click menu option for selected text",
      languagePreferencesTitle: "Language Preferences",
      primaryLanguageLabel: "Primary Language",
      primaryLanguageDesc: "Language used for extension UI and generated content",
      saveButtonText: "Save All Settings",
      statusSaved: "Settings saved!",
      errorEnterApiKey: "Please enter API key",
      apiKeyHelpText: "Your API key for accessing the NVIDIA AI API. Don't have an API key? ",
      getApiKeyLink: "Get the key here",
      showApiKeyTitle: "Show API Key"
    }
  };

  // Function to update UI texts on the Options page based on the selected language
  function updateLanguageUIOptions(language) {
    // Update header title
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
      headerTitle.textContent = translations[language].headerTitle;
    }
    // Update API Configuration section title (first h2)
    const apiSectionTitle = document.querySelectorAll('.settings-section h2')[0];
    if (apiSectionTitle) {
      apiSectionTitle.textContent = translations[language].apiConfigurationTitle;
    }

    const apiKeyHelpSmall = document.querySelector('.form-group small');
    if (apiKeyHelpSmall) {
      apiKeyHelpSmall.childNodes[0].textContent = translations[language].apiKeyHelpText;
      const helpLink = apiKeyHelpSmall.querySelector('a');
      if (helpLink) {
        helpLink.textContent = translations[language].getApiKeyLink;
      }
  }

    // Update toggle visibility button title
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    if (toggleVisibilityBtn) {
      toggleVisibilityBtn.title = translations[language].showApiKeyTitle;
    }

    // Update API Key label and input placeholder
    const apiKeyLabel = document.querySelector('label[for="api-key"]');
    if (apiKeyLabel) {
      apiKeyLabel.textContent = translations[language].apiKeyLabel;
    }
    if (apiKeyInput) {
      apiKeyInput.placeholder = translations[language].apiKeyPlaceholder;
    }
    // Update Usage Options section title (second h2)
    const usageSectionTitle = document.querySelectorAll('.settings-section h2')[1];
    if (usageSectionTitle) {
      usageSectionTitle.textContent = translations[language].usageOptionsTitle;
    }
    // Update Floating Button texts (first toggle group)
    const toggleGroups = document.querySelectorAll('.settings-section .toggle-form-group');
    if (toggleGroups.length >= 2) {
      const floatingGroup = toggleGroups[0];
      const floatingP = floatingGroup.querySelector('p');
      if (floatingP) {
        floatingP.textContent = translations[language].floatingButtonLabel;
      }
      const floatingSmall = floatingGroup.querySelector('small');
      if (floatingSmall) {
        floatingSmall.textContent = translations[language].floatingButtonDesc;
      }
      // Update Context Menu texts (second toggle group)
      const contextGroup = toggleGroups[1];
      const contextP = contextGroup.querySelector('p');
      if (contextP) {
        contextP.textContent = translations[language].contextMenuLabel;
      }
      const contextSmall = contextGroup.querySelector('small');
      if (contextSmall) {
        contextSmall.textContent = translations[language].contextMenuDesc;
      }
    }
    // Update Language Preferences section title (third h2)
    const languageSectionTitle = document.querySelectorAll('.settings-section h2')[2];
    if (languageSectionTitle) {
      languageSectionTitle.textContent = translations[language].languagePreferencesTitle;
    }
    // Update Primary Language label and description
    const primaryLanguageLabel = document.querySelector('label[for="primary-language"]');
    if (primaryLanguageLabel) {
      primaryLanguageLabel.textContent = translations[language].primaryLanguageLabel;
    }
    const languageFormGroup = primaryLanguageLabel ? primaryLanguageLabel.closest('.form-group') : null;
    if (languageFormGroup) {
      const smallElem = languageFormGroup.querySelector('small');
      if (smallElem) {
        smallElem.textContent = translations[language].primaryLanguageDesc;
      }
    }
    // Update Save button text
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
      saveBtn.textContent = translations[language].saveButtonText;
    }
  }

  // Load saved settings and update UI texts based on language
  function loadSettings() {
    chrome.storage.sync.get({
      apiKey: '',
      showFloatingButton: false,
      enableContextMenu: true,
      primaryLanguage: 'en'
    }, function(data) {
      apiKeyInput.value = data.apiKey;
      floatButtonToggle.checked = data.showFloatingButton;
      contextMenuToggle.checked = data.enableContextMenu;
      primaryLanguageSelect.value = data.primaryLanguage;
      // Update UI texts using the stored language
      updateLanguageUIOptions(data.primaryLanguage);
    });
  }

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

  // Function to save all settings
  function saveSettings() {
    const settings = {
      apiKey: apiKeyInput.value.trim(),
      showFloatingButton: floatButtonToggle.checked,
      enableContextMenu: contextMenuToggle.checked,
      primaryLanguage: primaryLanguageSelect.value
    };

    if (!settings.apiKey) {
      showStatus(translations[settings.primaryLanguage].errorEnterApiKey, 'error');
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
      
      showStatus(translations[settings.primaryLanguage].statusSaved, 'success');
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
  
  // Function to update floating button state
  function updateFloatingButtonState(enabled) {
    chrome.runtime.sendMessage({
      action: 'updateFloatingButton',
      enabled: enabled
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error updating floating button state:", chrome.runtime.lastError);
      }
    });
  }

  // Update UI texts when the language select is changed
  primaryLanguageSelect.addEventListener('change', function() {
    const newLanguage = primaryLanguageSelect.value;
    updateLanguageUIOptions(newLanguage);
    chrome.storage.sync.set({ primaryLanguage: newLanguage });
    chrome.runtime.sendMessage({
      action: 'updateLanguage',
      language: newLanguage
    });
  });

  // Load settings on startup
  loadSettings();
});
