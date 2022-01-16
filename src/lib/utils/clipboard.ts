/**
 * When the given elements is clicked by the user, the given text will be copied to clipboard.
 *
 * @param {HTMLElement} element
 * @param {CopyInfo} copyInfo
 *
 * @typedef CopyInfo
 * @property {() => string} getText
 * @property {() => void} success
 * @property {(reason: unknown) => void} error
 */

export type CopyInfo = {
  getText: () => string
  success: () => void
  error: (reason: unknown) => void
}

export function registerClipboard(element: HTMLElement, copyInfo: CopyInfo) {
  element.addEventListener('click', function () {
    copyTextToClipboard(copyInfo);
  });
}

// https://stackoverflow.com/a/30810322/7595472

/** @param {CopyInfo} copyInfo */
function fallbackCopyTextToClipboard(copyInfo: CopyInfo) {
  var textArea = document.createElement('textarea');
  textArea.value = copyInfo.getText();

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    setTimeout(function () {
      if (successful) {
        copyInfo.success();
      } else {
        copyInfo.error('unknown error');
      }
    }, 1);
  } catch (err) {
    setTimeout(function () {
      copyInfo.error(err);
    }, 1);
  }

  document.body.removeChild(textArea);
}
/** @param {CopyInfo} copyInfo */
export function copyTextToClipboard(copyInfo:CopyInfo) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(copyInfo.getText()).then(copyInfo.success, function () {
      // try the fallback in case `writeText` didn't work
      fallbackCopyTextToClipboard(copyInfo);
    });
  } else {
    fallbackCopyTextToClipboard(copyInfo);
  }
}

/**
 * Selects the text content of the given element.
 *
 * @param {Element} element
 */
function selectElementText(element) {
  // https://stackoverflow.com/a/20079910/7595472
  window.getSelection().selectAllChildren(element);
}

/**
 * Traverses up the DOM tree to find data attributes that override the default plugin settings.
 *
 * @param {Element} startElement An element to start from.
 * @returns {Settings} The plugin settings.
 * @typedef {Record<"copy" | "copy-error" | "copy-success" | "copy-timeout", string | number>} Settings
 */
type Settings = {
  'copy': string
  'copy-error': string
  'copy-success': string
  'copy-timeout': number | string
}
function getSettings(startElement) {
  /** @type {Settings} */
  var settings: Settings = {
    'copy': 'Copy',
    'copy-error': 'Press Ctrl+C to copy',
    'copy-success': 'Copied!',
    'copy-timeout': 5000
  };

  var prefix = 'data-prismjs-';
  for (var key in settings) {
    var attr = prefix + key;
    var element = startElement;
    while (element && !element.hasAttribute(attr)) {
      element = element.parentElement;
    }
    if (element) {
      settings[key] = element.getAttribute(attr);
    }
  }
  return settings;
}