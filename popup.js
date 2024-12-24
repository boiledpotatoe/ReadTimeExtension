document.addEventListener('DOMContentLoaded', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }
  
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const excludeSelectors = [
            'script', 'style', 'iframe', 'header', 'footer', 
            'nav', 'aside', '[role="complementary"]', '[role="advertisement"]'
          ].join(',');
          
          const content = document.body.cloneNode(true);
          const excludedElements = content.querySelectorAll(excludeSelectors);
          excludedElements.forEach(el => el.remove());
          
          const text = content.textContent || '';
          const words = text.trim().split(/\s+/).filter(word => word.length > 0);
          return words.length;
        }
      });
  
      if (!results || !results[0]) {
        throw new Error('Failed to get word count');
      }
  
      const wordCount = results[0].result;
      const minutes = Math.max(1, Math.round(wordCount / 200)); 
      
      const readingTimeDiv = document.getElementById('readingTime');
      readingTimeDiv.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
        </svg>
        Reading time
        <div class="time">${minutes} minute${minutes === 1 ? '' : 's'}</div>
        <div class="word-count">${wordCount.toLocaleString()} words</div>
      `;
  
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('readingTime').textContent = 'Unable to calculate reading time';
    }
  });
  