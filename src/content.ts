// Scrape name/title/company from LinkedIn
function extractProfileInfo() {
  const title = document.querySelector('[data-field="experience_company_logo"] span')?.textContent?.trim();
  const company = getCurrentCompany();
  const rawName = document.querySelector('h1')?.textContent?.trim();
  
  if (!rawName) return;
  const name = cleanRawName(rawName);

  return { name, title, company } ;
}

function getCurrentCompany(): string | null {
  // Find all spans that match the class used in the experience item
  const experienceSpans = Array.from(
    document.querySelectorAll('a[data-field="experience_company_logo"] span.t-14.t-normal')
  );

  for (const span of experienceSpans) {
    const text = span.textContent?.trim();
    if (text && text.includes('·')) {
      // Return only the part before the dot
      return text.split('·')[0].trim();
    }
  }

  return null;
}

function cleanRawName(text: string): string {
  return text
    // Remove emojis
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u26FF]|\uFE0F|\u200D)+/g,
      ''
    )
    // Remove text inside (), [], or {}
    .replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, '')
    // Remove comma and everything after
    .replace(/,.*/, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

let lastUrl = location.href;

new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;

    if (currentUrl.includes("linkedin.com/in/")) {
      const profileData = extractProfileInfo();
      
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: "PROFILE_UPDATED", data: profileData });
      }, 250)
    } else {
      chrome.runtime.sendMessage({ type: "PROFILE_UPDATED", data: null });
    }
  }
}).observe(document, { subtree: true, childList: true });

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'getProfileInfo') {
      const isProfilePage = window.location.href.includes('linkedin.com/in/');
      if (!isProfilePage) return sendResponse(null);

      const data = extractProfileInfo();
      sendResponse(data);
    }
  }
);