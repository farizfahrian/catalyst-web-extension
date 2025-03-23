// welcome.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const openSettingsBtn = document.getElementById('open-settings');
    const getStartedBtn = document.getElementById('get-started');

    const translations = {
      id: {
        // Header
        welcomeTitle: "Selamat Datang di Creative Content Catalyst",
        tagline: "Solusi Kreatif untuk Konten Digital Indonesia",
        
        // Intro Section
        thankYou: "Terima kasih telah menginstal Creative Content Catalyst!",
        introText: "Ekstensi ini dirancang untuk membantu para kreator konten, pelaku UKM, manajer media sosial, dan pemasar digital di Indonesia membuat konten berkualitas tinggi dengan cepat dan mudah.",
        
        // Features Section
        featuresTitle: "Fitur Utama",
        feature1Title: "Konten Berbasis AI",
        feature1Desc: "Gunakan kekuatan AI untuk membuat caption media sosial, intro blog, deskripsi produk, dan teks iklan yang menarik.",
        feature2Title: "Integrasi Mulus",
        feature2Desc: "Bekerja langsung di platform penulisan favorit Anda - tambahkan konten ke editor media sosial, platform blog, dan lainnya dengan satu klik.",
        feature3Title: "Kustomisasi",
        feature3Desc: "Pilih gaya dan nada yang tepat untuk audiens Anda - profesional, santai, persuasif, atau informatif.",
        
        // Setup Section
        setupTitle: "Setup Cepat",
        setupStep1Title: "Dapatkan API Key",
        setupStep1Text: "Buat akun di NVIDIA AI API untuk mendapatkan kunci API Anda:",
        setupStep1Button: "Dapatkan API Key",
        setupStep2Title: "Konfigurasi Ekstensi",
        setupStep2Text: "Tambahkan kunci API Anda ke pengaturan ekstensi:",
        setupStep2Button: "Buka Pengaturan",
        setupStep3Title: "Mulai Membuat Konten",
        setupStep3Text: "Klik ikon ekstensi di toolbar atau gunakan tombol floating untuk mulai membuat konten!",
        
        // Tutorial Section
        tutorialTitle: "Contoh Penggunaan",
        tutorialStep1Title: "1. Masukkan Prompt",
        tutorialStep1Desc: "Masukkan kata kunci, topik, atau konteks untuk konten yang ingin Anda buat.",
        tutorialStep2Title: "2. Pilih Jenis Konten & Tone",
        tutorialStep2Desc: "Pilih jenis konten yang ingin dibuat dan tone yang sesuai dengan merek Anda.",
        tutorialStep3Title: "3. Generate & Tambahkan",
        tutorialStep3Desc: "Klik tombol Generate dan tambahkan hasilnya langsung ke halaman web Anda.",
        
        // CTA Section
        ctaTitle: "Siap untuk Meningkatkan Konten Digital Anda?",
        ctaButton: "Mulai Sekarang!",
        
        // Footer
        footerCopyright: "© 2025 Creative Content Catalyst",
        footerPrivacy: "Kebijakan Privasi",
        footerTerms: "Persyaratan Layanan",
        
        // API Status
        apiConfiguredTitle: "API Key Sudah Dikonfigurasi ✓",
        apiConfiguredText: "Anda sudah mengatur kunci API. Jika perlu mengubah, Anda dapat mengakses melalui pengaturan ekstensi.",
        indonesianLanguage: "Bahasa Indonesia",
        englishLanguage: "English",
        toggleVisibilityAlt: "Alihkan Visibilitas",
        footerText: "© 2025 Creative Content Catalyst v1.2.0"
      },
      en: {
        // Header
        welcomeTitle: "Welcome to Creative Content Catalyst",
        tagline: "Creative Solution for Digital Content",
        
        // Intro Section
        thankYou: "Thank you for installing Creative Content Catalyst!",
        introText: "This extension is designed to help content creators, SMEs, social media managers, and digital marketers create high-quality content quickly and easily.",
        
        // Features Section
        featuresTitle: "Key Features",
        feature1Title: "AI-Powered Content",
        feature1Desc: "Leverage AI to create engaging social media captions, blog intros, product descriptions, and ad copies.",
        feature2Title: "Seamless Integration",
        feature2Desc: "Work directly in your favorite writing platforms - add content to social media editors, blog platforms, and more with one click.",
        feature3Title: "Customization",
        feature3Desc: "Choose the perfect style and tone for your audience - professional, casual, persuasive, or informative.",
        
        // Setup Section
        setupTitle: "Quick Setup",
        setupStep1Title: "Get API Key",
        setupStep1Text: "Create an account at NVIDIA AI API to get your API key:",
        setupStep1Button: "Get API Key",
        setupStep2Title: "Configure Extension",
        setupStep2Text: "Add your API key to extension settings:",
        setupStep2Button: "Open Settings",
        setupStep3Title: "Start Creating Content",
        setupStep3Text: "Click the extension icon in toolbar or use floating button to start creating content!",
        
        // Tutorial Section
        tutorialTitle: "Usage Example",
        tutorialStep1Title: "1. Enter Prompt",
        tutorialStep1Desc: "Enter keywords, topics, or context for the content you want to create.",
        tutorialStep2Title: "2. Select Content Type & Tone",
        tutorialStep2Desc: "Choose content type and brand-appropriate tone.",
        tutorialStep3Title: "3. Generate & Add",
        tutorialStep3Desc: "Click Generate button and add results directly to your web page.",
        
        // CTA Section
        ctaTitle: "Ready to Enhance Your Digital Content?",
        ctaButton: "Get Started Now!",
        
        // Footer
        footerCopyright: "© 2025 Creative Content Catalyst",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Service",
        
        // API Status
        apiConfiguredTitle: "API Key Configured ✓",
        apiConfiguredText: "Your API key is already set up. You can update it in extension settings if needed.",
        indonesianLanguage: "Indonesian",
        englishLanguage: "English",
        toggleVisibilityAlt: "Toggle Visibility",
        footerText: "© 2025 Creative Content Catalyst v1.2.0"
      }
    };
  
    // Language toggle functionality
    const langIDButton = document.getElementById('lang-id');
    const langENButton = document.getElementById('lang-en');
    let currentLanguage = 'en';
  
    function updateLanguage(lang) {
      currentLanguage = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key];
      });
      
      // Update tutorial images
      document.querySelectorAll('.tutorial-image img').forEach((img, index) => {
        img.src = `images/tutorial-${index+1}-${lang}.png`;
      });
  
      // Update footer links
      document.querySelectorAll('footer a').forEach((link, index) => {
        link.href = index === 0 
          ? `https://www.contentcatalyst.id/privacy-${lang}`
          : `https://www.contentcatalyst.id/terms-${lang}`;
      });
    }
  
    langIDButton.addEventListener('click', () => {
      langIDButton.classList.add('active');
      langENButton.classList.remove('active');
      updateLanguage('id');
    });
  
    langENButton.addEventListener('click', () => {
      langENButton.classList.add('active');
      langIDButton.classList.remove('active');
      updateLanguage('en');
    });
  
    // Initial setup
    chrome.storage.sync.get('primaryLanguage', (data) => {
      const lang = data.primaryLanguage || 'en';
      updateLanguage(lang);
      document.querySelector(`#lang-${lang}`).classList.add('active');
    });
    
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
      const statusElement = document.querySelector('.setup-section ol li:nth-child(1)');
      if (data.apiKey) {
        statusElement.innerHTML = currentLanguage === 'id' 
          ? `<h3>API Key Sudah Dikonfigurasi ✓</h3>
             <p>Anda sudah mengatur kunci API...</p>`
          : `<h3>API Key Configured ✓</h3>
             <p>Your API key is already set up...</p>`;
      }
    });
  });