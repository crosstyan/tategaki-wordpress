import { browser } from '$app/env'
// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios


export const setTheme = (themeName: ThemeName) => {
  if (browser){
    // https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = (themeName == "auto") ? ((isDark) ? 'dark' : 'light') : themeName
    document.documentElement.setAttribute("data-theme", theme)
  }}
export function iOS():boolean {
  if(browser){
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  } else {
    return false
  }
}

/// tailwind css
export function addStyle(elem: HTMLElement, tagName: string, style: string) {
  const styles = style.split(" ")
  Array.from(elem.getElementsByTagName(tagName)).forEach((elem) => {
    elem.classList.add(...styles)
  })
}

// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec:number):string {
  return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// https://developer.mozilla.org/en-US/docs/Web/API/crypto_property
export function generateHex (len:number):string {
  const arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

// Fixed length of 5
export function generateRandomFixedLengthString():string {
  return Math.random().toString(36).substr(2, 5)
}

export const doNothing = () => {
  // do nothing
}

export type FetchFunction = (url:string, options?:RequestInit) => Promise<Response>