// Global declarations for shared LinkedIn scraping functions
declare global {
  function extractProfileInfo(): { name: string; title: string | null; company: string | null } | undefined;
  function getCurrentCompanyType2(): string | null;
  function getCurrentTitleType2(): string | null;
  function getCurrentCompanyType1(): string | null;
  function cleanRawName(text: string): string;
  function detectProfileType(): 1 | 2 | null;
  function isElemFirstChildTypeSpan(elem: Element | null): boolean | undefined;
  function checkElem():boolean;
  function runAfterLoad(callback: () => void):void;
  const linkedInExperinceParentClass: string;
}

(() => {
  // Implementation
  const linkedInExperinceParentClass = 'a[data-field="experience_company_logo"]:not(.pvs-entity__image-container--outline-offset)';
  
  (globalThis as any).linkedInExperinceParentClass = linkedInExperinceParentClass;
  
  (globalThis as any).extractProfileInfo = function() {
    const type = detectProfileType();
    const rawName = document.querySelector('h1')?.textContent?.trim();
    if (!rawName) return;
  
    const name = cleanRawName(rawName);
    let company: string | null = null;
    let title: string | null = null;
    const link = window.location.href;
  
    if (type === 1) {
      // type1: legacy style experience list i.e those without bullet points for the work experience itself
      company = getCurrentCompanyType1();
      title = document.querySelector(`${linkedInExperinceParentClass} span`)?.textContent?.trim() || null;
  
    } else if (type === 2) {
      // type1: list style experence lists with bullet points
      company = getCurrentCompanyType2();
      title = getCurrentTitleType2();
    }
  
    return { name, title, company, link };
  };
  
  // type 1 title
  (globalThis as any).getCurrentCompanyType2 = function(): string | null {
    const anchor = document.querySelector(linkedInExperinceParentClass);
    if (!anchor) return null;
  
    const span = anchor.querySelector('span[aria-hidden="true"]');
    return span?.textContent?.trim() || null;
  };
  
  // type 2 title 
  (globalThis as any).getCurrentTitleType2 = function(): string | null {
    const anchor = document.querySelector(linkedInExperinceParentClass);
    if (!anchor) return null;
  
    // Get the next sibling (the container with role history details)
    const nextSection = anchor.parentElement?.nextElementSibling;
    if (!nextSection) return null;
  
    // Look for the first title span inside it
    const titleSpan = nextSection.querySelector('div.t-bold span[aria-hidden="true"]');
    return titleSpan?.textContent?.trim() || null;
  };
  
  // get company type 1
  (globalThis as any).getCurrentCompanyType1 = function(): string | null {
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
  };
  
  // clean raw name
  (globalThis as any).cleanRawName = function(text: string): string {
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
  };
  
  // detects the profile type 1 | 2
  (globalThis as any).detectProfileType = function(): 1 | 2 | null {
    const anchors = document.querySelectorAll(linkedInExperinceParentClass);
  
    if (!anchors) return null;
  
    for (const anchor of anchors) {
      const childrenCount = anchor.children.length;
      const nextElem = anchor.parentElement?.nextElementSibling || null;
      const isSpan = isElemFirstChildTypeSpan(nextElem);
  
      // type 1
      if (
        childrenCount >= 4 || 
        (childrenCount <= 3 && !nextElem) || 
        (nextElem && !isSpan)
      ) return 1;
      // type 2
      if (childrenCount <= 3 && nextElem) return 2;
    }
  
    return null;
  };
  
  (globalThis as any).isElemFirstChildTypeSpan = function(elem: Element | null) {
    if (!elem) return;
  
    // <ul> <li> <span>
    const ulLiSpan = elem.querySelector('ul li:first-child')?.firstElementChild?.tagName.toLowerCase();
  
    let isSpan = ulLiSpan === 'span' ? true : false;
  
    return isSpan;
  };

  (globalThis as any).checkElem = function () {
    return !!document.querySelector(`${linkedInExperinceParentClass} span`);
  };

  // run check every 200ms
  // if it exist clearinterval and run function
  // also set a timeout timer to terminate the operation 
  (globalThis as any).runAfterLoad = function (callback: () => void) {
    const loadStart = Date.now();

    const checkInterval = setInterval(() => {
      if (checkElem()) {
        clearInterval(checkInterval);
        callback();
      }

      if (Date.now() - loadStart > 10000) {
        clearInterval(checkInterval);
        console.warn("Error loading profile for autosave");
      }
    }, 200)
  };

})();