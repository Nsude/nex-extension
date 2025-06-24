// Scrape name/title/company from LinkedIn
const linkedInExperinceParentClass = 'a[data-field="experience_company_logo"]:not(.pvs-entity__image-container--outline-offset)'

function extractProfileInfo() {
  const type = detectProfileType();
  const rawName = document.querySelector('h1')?.textContent?.trim();
  if (!rawName) return;

  const name = cleanRawName(rawName);
  let company: string | null = null;
  let title: string | null = null;

  if (type === 1) {
    // type1: legacy style experience list i.e those without bullet points for the work experience itself
    company = getCurrentCompanyType1();
    title = document.querySelector(`${linkedInExperinceParentClass} span`)?.textContent?.trim() || null;

  } else if (type === 2) {
    // type1: list style experence lists with bullet points
    company = getCurrentCompanyType2();
    title = getCurrentTitleType2();
  }

  return { name, title, company };
}

function getCurrentCompanyType2(): string | null {
  const anchor = document.querySelector(linkedInExperinceParentClass);
  if (!anchor) return null;

  const span = anchor.querySelector('span[aria-hidden="true"]');
  return span?.textContent?.trim() || null;
}


function getCurrentTitleType2(): string | null {
  const anchor = document.querySelector(linkedInExperinceParentClass);
  if (!anchor) return null;

  // Get the next sibling (the container with role history details)
  const nextSection = anchor.parentElement?.nextElementSibling;
  if (!nextSection) return null;

  // Look for the first title span inside it
  const titleSpan = nextSection.querySelector('div.t-bold span[aria-hidden="true"]');
  return titleSpan?.textContent?.trim() || null;
}


function getCurrentCompanyType1(): string | null {
  const experienceSpans = Array.from(
    document.querySelectorAll(`${linkedInExperinceParentClass} span.t-14.t-normal`)
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

function detectProfileType(): 1 | 2 | null {
  const anchors = document.querySelectorAll(linkedInExperinceParentClass);

  if (!anchors) return null;

  for (const anchor of anchors) {
    const childrenCount = anchor.children.length;
    // for profiles where the company location isn't specified
    const nextElem = anchor.parentElement?.nextElementSibling;

    if (childrenCount >= 4 || (childrenCount <= 3 && !nextElem) ) return 1;
    if (childrenCount <= 3) return 2;
  }

  return null;
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