// content.js
(function() {
    let activeElement = null;
    
    // Keep track of the most recently focused editable element
    document.addEventListener('focusin', function(e) {
      if (isEditableElement(e.target)) {
        activeElement = e.target;
      }
    });
    
    // Function to determine if an element is editable
    function isEditableElement(element) {
      return (
        element.tagName === 'TEXTAREA' || 
        element.tagName === 'INPUT' ||
        element.isContentEditable
      );
    }
    
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'insertContent') {
        insertContent(request.content);
        sendResponse({success: true});
      }
      return true;
    });
    
    // Function to insert content into the active element
    function insertContent(content) {
      if (!activeElement) {
        // No active element, show a floating notification
        showNotification('Pilih bidang teks terlebih dahulu sebelum menyisipkan konten.');
        return;
      }
      
      if (activeElement.isContentEditable) {
        // Handle contentEditable elements (like rich text editors)
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(content));
        } else {
          activeElement.innerHTML += content;
        }
      } else if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
        // Handle regular input elements
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        
        activeElement.value = 
          activeElement.value.substring(0, start) + 
          content + 
          activeElement.value.substring(end);
        
        // Trigger input event to notify the page of the change
        const event = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(event);
        
        // Set cursor position after the inserted text
        activeElement.selectionStart = activeElement.selectionEnd = start + content.length;
      }
      
      // Show success notification
      showNotification('Konten berhasil disisipkan!');
    }
    
    // Function to show a floating notification
    function showNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #FF5722;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      `;
      
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    }
    
    // Create floating button for quick access
    function createFloatingButton() {
      const button = document.createElement('div');
      button.innerHTML = `
        <div class="cc-catalyst-button">
          <img src="${chrome.runtime.getURL('assets/icon-48.png')}" alt="Creative Content Catalyst">
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
          background-color: #FF5722;
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
    
    // Initialize the floating button with a delay 
    // (to ensure page is fully loaded)
    setTimeout(createFloatingButton, 2000);
  })();