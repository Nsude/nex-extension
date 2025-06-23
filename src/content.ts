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
  const experienceSpans = Array.from(
    document.querySelectorAll('a[data-field="experience_company_logo"] span.t-14.t-normal')
  );

  const flagWords = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  for (const wrapperSpan of experienceSpans) {
    const ariaSpan = wrapperSpan.querySelector('span[aria-hidden="true"]');
    const text = ariaSpan?.textContent?.trim();
    if (!text) continue;

    const lowerText = text.toLowerCase();

    const isDate = flagWords.some((month) => lowerText.includes(month));
    if (isDate) continue;

    if (text.includes("·")) {
      return text.split("·")[0].trim();
    }

    return text;
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

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'getProfileInfo') {
      const isProfilePage = window.location.href.includes('linkedin.com/in/');
      if (!isProfilePage) return sendResponse(null);

      const data = extractProfileInfo();
      sendResponse(data);
    }
  }
);