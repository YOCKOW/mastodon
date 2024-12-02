/**
 * YOCKOW's Customization
 */
(() => {
  console.info("Welcome to YOCKOW's Mastodon Server!");
  console.log("Enabling YOCKOW's Customization...");

  const isLocal: boolean = ((hostname: string): boolean => {
    return (/^(localhost|.+\.local)$/i).test(hostname);
  })(window.location.hostname);
  const debugLog = isLocal ? (message: any, ...others: any[]): void => {
    console.debug(message, ...others);
  } : (_: any): void => {};

  const customizeHTML = (element: HTMLElement): void =>  {
    const __removeNoReferrer = (element: HTMLElement): void => {
      const relValues = element.getAttribute("rel")?.split(/\s+/);
      if (relValues) {
        const filtered = relValues.filter((rel) => { rel.toLowerCase() != "noreferrer" });
        if (filtered.length == 0) {
          element.removeAttribute("rel");
        } else {
          element.setAttribute("rel", filtered.join(" "));
        }
        debugLog("Removed 'noreferrer' rel value: ", element);
      }
    };

    const __changeTargetFromBlankToTop = (element: HTMLElement): void => {
      const targetValue = element.getAttribute("target");
      if (targetValue?.toLowerCase() == "_blank") {
        element.setAttribute("target", "_top");
        debugLog("Changed target value to '_top': ", element);
      }
    };

    // Recursively...
    for (let child of element.children) {
      if (child instanceof HTMLElement) {
        customizeHTML(child);
      }
    }
    __removeNoReferrer(element);
    __changeTargetFromBlankToTop(element);
  };

  // Initialize
  (() => {
    const initialize = (): void => {
      debugLog("Customizing <body>...");
      customizeHTML(document.body);

      const newObserver = new MutationObserver((mutations, observer) => {
        for (const mutationRecord of mutations) {
          if (mutationRecord.target instanceof HTMLElement) {
            customizeHTML(mutationRecord.target);
          }
        }
      });
      newObserver.observe(document.body, {
        attributes: true,
        characterData: false,
        childList: true,
        subtree: true,
      })
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initialize);
    } else {
      initialize();
    }
  })()
})();
