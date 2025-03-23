// content.js
(function() {
    let floatingButton = null;

    function handleFloatingButtonState(enabled) {
        if (enabled && !floatingButton) {
            createFloatingButton();
        } else if (!enabled && floatingButton) {
            floatingButton.remove();
            floatingButton = null;
        }
    }

    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'updateFloatingButton') {
            handleFloatingButtonState(request.enabled);
        }
        return true;
    });

    // Initialize with stored setting
    chrome.storage.sync.get(['showFloatingButton'], (data) => {
        if (data.showFloatingButton !== false) {
            setTimeout(createFloatingButton, 2000);
        }
    });

    // Add this message listener at the top
    chrome.runtime.onMessage.addListener(function(request) {
      if (request.action === 'updateFloatingButton') {
        const button = document.querySelector('.cc-catalyst-button');
        if (button) {
          button.style.display = request.enabled ? 'block' : 'none';
        }
      }
      return true;
    });
    
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'insertContent') {
        insertContent(request.content);
        sendResponse({success: true});
      }
      return true;
    });
    
    // Create floating button for quick access
    function createFloatingButton() {
      const button = document.createElement('div');
      button.innerHTML = `
        <div class="cc-catalyst-button">
          <img src="${chrome.runtime.getURL('assets/Catalyst-nobg.png')}" alt="Creative Content Catalyst">
        </div>
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        .cc-catalyst-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #F8FAFC;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }
        .cc-catalyst-button:hover {
          transform: scale(1.1);
        }
        .cc-catalyst-button img {
          width: 24px;
          height: 24px;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(button);
      
      // Add click event to open popup
      button.addEventListener('click', function() {
        chrome.runtime.sendMessage({action: 'openPopup'});
      });
    }
  })();