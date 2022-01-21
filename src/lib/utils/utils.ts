// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
export function iOS():boolean {
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
}

/// tailwind css
export function addStyle(elem: HTMLElement, tagName: string, style: string) {
  const styles = style.split(" ")
  Array.from(elem.getElementsByTagName(tagName)).forEach((elem) => {
    elem.classList.add(...styles)
  })
}