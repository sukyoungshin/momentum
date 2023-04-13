import { constantKeys, getConstants, getHTMLElements } from "../common/utils.js";
export function updateBrowserTheme() {
    const { $toggleSwitch } = getHTMLElements();
    if (!$toggleSwitch)
        return;
    $toggleSwitch.addEventListener("change", switchBrowserTheme);
}
/** Theme기능 (dark모드) */
export function switchBrowserTheme(e) {
    const { THEME_KEY, THEME, DARK, LIGHT } = getConstants(constantKeys.DARK_MODE);
    const isDarkMode = e.currentTarget.checked;
    if (isDarkMode) {
        document.documentElement.setAttribute(THEME_KEY, DARK);
        localStorage.setItem(THEME, DARK);
    }
    else {
        document.documentElement.setAttribute(THEME_KEY, LIGHT);
        localStorage.setItem(THEME, LIGHT);
    }
}
