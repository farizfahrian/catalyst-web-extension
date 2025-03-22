// popup.js
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
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
  const noHistory = document.getElementById('no-history');

  // Initialize history
  let generationHistory = [];

  // Load history
  chrome.storage.local.get('generationHistory', (data) => {
    generationHistory = data.generationHistory || [];
    updateHistoryDisplay();
  });

  function updateHistoryDisplay() {
    historyList.innerHTML = generationHistory
      .map((item, index) => `
        <div class="history-item" data-index="${index}">
          <div class="history-prompt">${item.prompt.substring(0, 40)}...</div>
          <div class="history-content">${item.content}</div>
          <div class="history-date">${new Date(item.timestamp).toLocaleString()}</div>
        </div>
      `)
      .join('');
    
    clearHistoryBtn.style.display = generationHistory.length > 0 ? 'block' : 'none';
    if (historyList.children.length === 0) {
      noHistory.classList.remove('hidden');
    } else {
      noHistory.classList.add('hidden');
    }
  }

  let currentLanguage = 'id';

  // Load language preference
  chrome.storage.sync.get(['primaryLanguage'], (data) => {
    currentLanguage = data.primaryLanguage || 'id';
  });

  // Listen for language updates
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateLanguage') {
        currentLanguage = request.language;
    }
  }); 

  // Modify preparePrompt function
  function preparePrompt(prompt, contentType, tone) {
    // ... existing contentPrompt and toneInstruction code ...

    // Language instruction
    const languageInstruction = currentLanguage === 'id' 
      ? ' Konten untuk audiens Indonesia. Gunakan bahasa Indonesia yang baik dan benar.'
      : ' Content for international audience. Use proper English.';

    return contentPrompt + toneInstruction + languageInstruction;
  }
  
  // Load saved API key (if available)
  // let apiKey = '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';
  let apiKey = '';
  chrome.storage.sync.get('apiKey', function(data) {
    apiKey = data.apiKey || '';
  });
  
  // Generate content button click handler
  generateBtn.addEventListener('click', function() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
      resultContent.textContent = 'Harap masukkan prompt untuk menghasilkan konten.';
      return;
    }
    
    if (!apiKey) {
      resultContent.textContent = 'Kunci API belum dikonfigurasi. Klik "Pengaturan" untuk menambahkan kunci API.';
      return;
    }
    
    // Show loading spinner
    loadingSpinner.classList.remove('hidden');
    resultContent.classList.add('hidden');
    
    // Prepare the content request
    const contentType = contentSelect.value;
    const tone = toneSelect.value;
    
    generateContent(prompt, contentType, tone);
  });
  
  // Function to generate content via API
  async function generateContent(prompt, contentType, tone) {
    try {
      // Prepare the prompt based on content type and tone
      let fullPrompt = preparePrompt(prompt, contentType, tone);
      
      // Make API request
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
      
      // Display the result
      resultContent.textContent = cleanedText;
      resultContent.classList.remove('hidden');
      loadingSpinner.classList.add('hidden');
      
      // Save this content to local storage for later use
      chrome.storage.local.set({
        'lastGenerated': {
          content: cleanedText,
          timestamp: Date.now()
        }
      });

      // Update generation history
      generationHistory.unshift({
        content: cleanedText,
        prompt: prompt,
        timestamp: Date.now(),
        type: contentType,
        tone: tone
      });
      
      // Keep only last 10 items
      if (generationHistory.length > 10) {
        generationHistory.pop();
      }
      
      // Save updated history
      chrome.storage.local.set({ generationHistory }, () => {
        updateHistoryDisplay();
      });
      
    } catch (error) {
      console.error('Error generating content:', error);
      resultContent.textContent = `Error: ${error.message}`;
      resultContent.classList.remove('hidden');
      loadingSpinner.classList.add('hidden');
    }
  }

  // Function to prepare the prompt based on content type and tone
  function preparePrompt(prompt, contentType, tone) {
    let contentPrompt = '';
    const instruction = "Langsung berikan jawaban akhir tanpa proses berpikir atau penjelasan. \
    Jangan gunakan format apapun termasuk tag <think>. \
    Langsung tulis konten yang diminta dalam bentuk final siap pakai.";
    
    // Content type specific instructions
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
    
    // Add tone instructions
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
    
    // Targeted for Indonesian audience
    return instruction + ' ' + contentPrompt + toneInstruction + ' Konten untuk audiens Indonesia. Gunakan bahasa Indonesia yang baik dan benar';
  }
  
  // Copy button click handler
  copyBtn.addEventListener('click', function() {
    const textToCopy = resultContent.textContent;
    navigator.clipboard.writeText(textToCopy).then(function() {
      // Temporarily change the button text to indicate success
      copyBtn.innerHTML = '<img src="assets/copy-check.svg" alt="Copied">';
      setTimeout(function() {
        copyBtn.innerHTML = '<img src="assets/copy.svg" alt="Copy" title="Copy to clipboard">';
      }, 1500);
    });
  });
  
  // Settings button click handler
  settingsBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});