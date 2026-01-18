/**
 * YOCKOW's Customization
 */
/* eslint no-console: ["error", { allow: ["info", "debug"] }] */

console.info("Welcome to YOCKOW's Mastodon Server!");

const isLocal: boolean = ((hostname: string): boolean => {
  return /^(localhost|.+\.local)$/i.test(hostname);
})(window.location.hostname);
const debugLog = isLocal
  ? (message: string, ...others: object[]): void => {
      console.debug(message, ...others);
    }
  : (): void => {
      void 0;
    };

const customizeHTML = (element: HTMLElement): void => {
  const __removeNoReferrer = (element: HTMLElement): void => {
    const relValues = element.getAttribute('rel')?.split(/\s+/);
    if (relValues) {
      const filtered = relValues.filter((rel) => {
        return rel.toLowerCase() !== 'noreferrer';
      });
      if (relValues.length === filtered.length) {
        return;
      }
      if (filtered.length === 0) {
        element.removeAttribute('rel');
      } else {
        element.setAttribute('rel', filtered.join(' '));
      }
      debugLog("Removed 'noreferrer' rel value: ", element);
    }
  };

  const __changeTargetToTopIfNecessary = (element: HTMLElement): void => {
    const targetValue = element.getAttribute('target');
    const lowercasedTargetValue = targetValue?.toLocaleLowerCase();
    switch (lowercasedTargetValue) {
      case '_blank':
      case '_target': // Work around https://github.com/mastodon/mastodon/pull/34357
        element.setAttribute('target', '_top');
        debugLog(
          `Changed target value from '${targetValue}' to '_top': `,
          element,
        );
        break;
      default:
        break;
    }
  };

  // Recursively...
  for (const child of element.children) {
    if (child instanceof HTMLElement) {
      customizeHTML(child);
    }
  }
  __removeNoReferrer(element);
  __changeTargetToTopIfNecessary(element);
};

// Initialize
const initialize = (): void => {
  debugLog('Customizing <body>...');
  customizeHTML(document.body);

  const newObserver = new MutationObserver((mutations) => {
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
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

export const YOCKOW = {
  customizeHTML: customizeHTML,
};
