// popup.js
document.addEventListener('DOMContentLoaded', function() {
  // ----- Language Toggle Setup -----
  const langIDButton = document.getElementById('lang-id');
  const langENButton = document.getElementById('lang-en');

  // --- Translation Object ---
  const translations = {
    id: {
      headerTitle: "Creative Content Catalyst",
      promptPlaceholder: "Masukkan kata kunci, topik, atau konteks di sini...",
      contentSelectLabel: "Jenis Konten:",
      toneSelectLabel: "Tone:",
      generateBtnText: "Generate Konten",
      resultHeader: "Hasil",
      loadingText: "Sedang membuat konten...",
      historyHeader: "Riwayat",
      noHistory: "Tidak ada riwayat",
      settingsBtn: "Pengaturan",
      deleteAllBtn: "Hapus Semua",
      clickToCopy: "Klik untuk menyalin",
      copySuccessToast: "Disalin!",
      deleteHistoryTooltip: "Hapus Riwayat"
    },
    en: {
      headerTitle: "Creative Content Catalyst",
      promptPlaceholder: "Enter a keyword, topic, or context here...",
      contentSelectLabel: "Content Type:",
      toneSelectLabel: "Tone:",
      generateBtnText: "Generate Content",
      resultHeader: "Results",
      loadingText: "Generating content...",
      historyHeader: "History",
      noHistory: "No history",
      settingsBtn: "Settings",
      deleteAllBtn: "Delete All",
      clickToCopy: "Click to copy",
      copySuccessToast: "Copied!",
      deleteHistoryTooltip: "Delete History"
    }
  };

  // Option texts for the "content-select" dropdown
  const contentOptions = {
    id: {
      social: "Caption Media Sosial",
      blog: "Intro Blog",
      ad: "Iklan",
      product: "Deskripsi Produk"
    },
    en: {
      social: "Social Media Caption",
      blog: "Blog Intro",
      ad: "Ad Copy",
      product: "Product Description"
    }
  };

  // Option texts for the "tone-select" dropdown
  const toneOptions = {
    id: {
      professional: "Professional",
      casual: "Santai",
      persuasive: "Persuasif",
      informative: "Informatif"
    },
    en: {
      professional: "Professional",
      casual: "Casual",
      persuasive: "Persuasive",
      informative: "Informative"
    }
  };

  // Function to update UI elements based on the selected language
  function updateLanguageUI(language) {
    const headerTitleElem = document.querySelector('header h1');
    if (headerTitleElem) {
      headerTitleElem.textContent = translations[language].headerTitle;
    }
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
      promptInput.placeholder = translations[language].promptPlaceholder;
    }
    const contentSelectLabel = document.querySelector('label[for="content-select"]');
    if (contentSelectLabel) {
      contentSelectLabel.textContent = translations[language].contentSelectLabel;
    }
    const toneSelectLabel = document.querySelector('label[for="tone-select"]');
    if (toneSelectLabel) {
      toneSelectLabel.textContent = translations[language].toneSelectLabel;
    }
    const generateBtnText = document.querySelector('#generate-btn .btn-text');
    if (generateBtnText) {
      generateBtnText.textContent = translations[language].generateBtnText;
    }
    const resultHeader = document.querySelector('.result-header h2');
    if (resultHeader) {
      resultHeader.textContent = translations[language].resultHeader;
    }
    const loadingParagraph = document.querySelector('#loading-spinner p');
    if (loadingParagraph) {
      loadingParagraph.textContent = translations[language].loadingText;
    }
    const historyHeader = document.querySelector('.history-header h2');
    if (historyHeader) {
      historyHeader.textContent = translations[language].historyHeader;
    }
    const noHistoryElem = document.getElementById('no-history');
    if (noHistoryElem) {
      noHistoryElem.textContent = translations[language].noHistory;
    }
    const settingsBtnText = document.querySelector('#settings-btn span');
    if (settingsBtnText) {
      settingsBtnText.textContent = translations[language].settingsBtn;
    }
    const clearHistoryBtnText = document.querySelector('#clear-history');
    if (clearHistoryBtnText) {
      clearHistoryBtnText.textContent = translations[language].deleteAllBtn;
    }
    const contentSelectElem = document.getElementById('content-select');
    if (contentSelectElem) {
      for (let option of contentSelectElem.options) {
        const key = option.value;
        option.textContent = contentOptions[language][key];
      }
    }
    const toneSelectElem = document.getElementById('tone-select');
    if (toneSelectElem) {
      for (let option of toneSelectElem.options) {
        const key = option.value;
        option.textContent = toneOptions[language][key];
      }
    }
    const copyBtnImg = document.querySelector('#copy-btn img');
    if (copyBtnImg) {
        copyBtnImg.alt = translations[language].copySuccessToast;
        copyBtn.title = translations[language].clickToCopy;
    }
  }

  // Function to update active state and language setting
  function setActiveLanguage(language) {
    currentLanguage = language;
    if (language === 'id') {
      langIDButton.classList.add('active');
      langENButton.classList.remove('active');
    } else if (language === 'en') {
      langENButton.classList.add('active');
      langIDButton.classList.remove('active');
    }
    chrome.storage.sync.set({ primaryLanguage: language });
    chrome.runtime.sendMessage({ action: 'updateLanguage', language });
    updateLanguageUI(language);
    updateHistoryDisplay()
  }

  langIDButton.addEventListener('click', () => setActiveLanguage('id'));
  langENButton.addEventListener('click', () => setActiveLanguage('en'));
  chrome.storage.sync.get('primaryLanguage', (data) => {
    const language = data.primaryLanguage || 'en';
    setActiveLanguage(language);
  });

  
  let currentLanguage = 'en';
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateLanguage') {
      currentLanguage = request.language;
    }
  });

  // ----- Content Generation Setup -----
  const promptInput = document.getElementById('prompt-input');
  const contentSelect = document.getElementById('content-select');
  const toneSelect = document.getElementById('tone-select');
  const generateBtn = document.getElementById('generate-btn');
  const resultContent = document.getElementById('result-content');
  const copyBtn = document.getElementById('copy-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const loadingSpinner = document.getElementById('loading-spinner');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  const noHistoryElem = document.getElementById('no-history');

  // Initialize generation history
  let generationHistory = [];
  chrome.storage.local.get('generationHistory', (data) => {
    generationHistory = data.generationHistory || [];
    updateHistoryDisplay();
  });

  // Function to show a toast notification (fade in from bottom)
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    // Force reflow to start the transition
    window.getComputedStyle(toast).opacity;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 1500);
  }

  // Update history list display with copy and delete functionalities
  function updateHistoryDisplay() {
    // Use currentLanguage to set delete tooltip text
    historyList.innerHTML = generationHistory
      .map((item, index) => `
        <div class="history-item" data-index="${index}">
          <div class="hover-toast">${translations[currentLanguage].clickToCopy}</div>
          <div class="history-text">
            <div class="history-header">
              <div class="history-prompt">${item.prompt.length > 40 ? item.prompt.substring(0, 37) + '...' : item.prompt}</div>
              <button class="delete-history icon-btn" title="${translations[currentLanguage].deleteHistoryTooltip}">
                <img src="assets/trash.svg" alt="Delete">
              </button>
            </div>
            <div class="history-content">${item.content}</div>
            <div class="history-date">${new Date(item.timestamp).toLocaleString()}</div>
          </div>
        </div>
      `)
      .join('');
    
    clearHistoryBtn.style.display = generationHistory.length > 0 ? 'block' : 'none';
    if (historyList.children.length === 0) {
      noHistoryElem.classList.remove('hidden');
    } else {
      noHistoryElem.classList.add('hidden');
    }
    
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
      const index = item.getAttribute('data-index');
      // When clicking on the history item (except delete button), copy its content
      item.addEventListener('click', function(e) {
        if (e.target.closest('.delete-history')) return;
        
        const hoverToast = item.querySelector('.hover-toast');
        const content = generationHistory[index].content;
        
        navigator.clipboard.writeText(content).then(() => {
          // Add copied state
          item.classList.add('copied');
          hoverToast.textContent = translations[currentLanguage].copySuccessToast;
          
          // Reset after animation
          setTimeout(() => {
            item.classList.remove('copied');
            hoverToast.textContent = translations[currentLanguage].clickToCopy;
          }, 1500);
        });
      });
      // Delete button click handler
      const deleteBtn = item.querySelector('.delete-history');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          generationHistory.splice(index, 1);
          chrome.storage.local.set({ generationHistory }, updateHistoryDisplay);
        });
      }
    });
  }

  function preparePrompt(prompt, contentType, tone) {
    let contentPrompt = '';
    const instruction = "Langsung berikan jawaban akhir tanpa proses berpikir atau penjelasan. \
Jangan gunakan format apapun termasuk tag <think>. \
Langsung tulis konten yang diminta dalam bentuk final siap pakai.";
    
    switch (contentType) {
      case 'social':
        contentPrompt = `Buatkan caption media sosial yang menarik untuk topik: "${prompt}".`;
        break;
      case 'blog':
        contentPrompt = `Buatkan paragraf pembuka blog yang menarik tentang: "${prompt}".`;
        break;
      case 'ad':
        contentPrompt = `Buatkan teks iklan yang persuasif untuk: "${prompt}".`;
        break;
      case 'product':
        contentPrompt = `Buatkan deskripsi produk yang menarik untuk: "${prompt}".`;
        break;
    }
    
    let toneInstruction = '';
    switch (tone) {
      case 'professional':
        toneInstruction = ' Gunakan gaya bahasa profesional dan formal.';
        break;
      case 'casual':
        toneInstruction = ' Gunakan gaya bahasa santai dan ramah.';
        break;
      case 'persuasive':
        toneInstruction = ' Gunakan gaya bahasa persuasif yang membujuk pembaca.';
        break;
      case 'informative':
        toneInstruction = ' Gunakan gaya bahasa informatif dan edukatif.';
        break;
    }
    
    const languageInstruction = currentLanguage === 'id' 
      ? ' Konten untuk audiens Indonesia. Gunakan bahasa Indonesia yang baik dan benar.'
      : ' Content for international audience. Use proper English.';
    
    return instruction + ' ' + contentPrompt + toneInstruction + languageInstruction;
  }
  
  let apiKey = '';
  chrome.storage.sync.get('apiKey', function(data) {
    apiKey = data.apiKey || '';
  });
  
  generateBtn.addEventListener('click', function() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
      resultContent.textContent = currentLanguage === 'id'
        ? 'Harap masukkan prompt untuk menghasilkan konten.'
        : 'Please enter a prompt to generate content.';
      return;
    }
    
    if (!apiKey) {
      resultContent.textContent = currentLanguage === 'id'
        ? 'Kunci API belum dikonfigurasi. Klik "Pengaturan" untuk menambahkan kunci API.'
        : 'API key not configured. Click "Settings" to add your API key.';
      return;
    }
    
    loadingSpinner.classList.remove('hidden');
    resultContent.classList.add('hidden');
    
    const contentType = contentSelect.value;
    const tone = toneSelect.value;
    
    generateContent(prompt, contentType, tone);
  });
  
  async function generateContent(prompt, contentType, tone) {
    try {
      let fullPrompt = preparePrompt(prompt, contentType, tone);
      
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-r1",
          messages: [{"role": "user", "content": fullPrompt}],
          temperature: 0.6,
          top_p: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      const cleanedText = generatedText.replace(/<think>[\s\S]*?<\/think>/g, '')
                                       .replace(/\*\*Think:\*\*.*?\n\n/gs, '')
                                       .trim();
      
      resultContent.textContent = cleanedText;
      resultContent.classList.remove('hidden');
      loadingSpinner.classList.add('hidden');
      
      chrome.storage.local.set({
        'lastGenerated': {
          content: cleanedText,
          timestamp: Date.now()
        }
      });

      generationHistory.unshift({
        content: cleanedText,
        prompt: prompt,
        timestamp: Date.now(),
        type: contentType,
        tone: tone
      });
      
      if (generationHistory.length > 10) {
        generationHistory.pop();
      }
      
      chrome.storage.local.set({ generationHistory }, updateHistoryDisplay);
      
    } catch (error) {
      console.error('Error generating content:', error);
      resultContent.textContent = `Error: ${error.message}`;
      resultContent.classList.remove('hidden');
      loadingSpinner.classList.add('hidden');
    }
  }
  
  copyBtn.addEventListener('click', function() {
    const textToCopy = resultContent.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = `<img src="assets/copy-check.svg" alt="${translations[currentLanguage].copySuccessToast}">`;
        setTimeout(() => {
            copyBtn.innerHTML = `<img src="assets/copy.svg" alt="${translations[currentLanguage].clickToCopy}" 
                                   title="${translations[currentLanguage].clickToCopy}">`;
        }, 1500);
    });
});
  
  settingsBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  clearHistoryBtn.addEventListener('click', function() {
    generationHistory = [];
    chrome.storage.local.set({ generationHistory }, updateHistoryDisplay);
  });
});
