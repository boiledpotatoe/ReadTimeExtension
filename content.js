// content.js
function countWords() {
    // Get main content (exclude common non-content elements)
    const excludeSelectors = [
      'script', 'style', 'iframe', 'header', 'footer', 
      'nav', 'aside', '[role="complementary"]', '[role="advertisement"]'
    ].join(',');
    
    const content = document.body.cloneNode(true);
    const excludedElements = content.querySelectorAll(excludeSelectors);
    excludedElements.forEach(el => el.remove());
    
    // Get text content and count words
    const text = content.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_WORD_COUNT') {
      sendResponse({ wordCount: countWords() });
    }
  });