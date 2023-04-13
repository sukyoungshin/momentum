import { updateChristMasCounter } from "./Calender/setChristmasCounter.js";
import { updateThisYear, updateTimeAndDate } from "./Calender/setTimeAndDate.js";
import { changeBodyBackgroundColor } from "./Page/BackgroundColor.js";
import { changePopUpButtonColor, updatePopUp } from "./PopUp/Button.js";
import { updateRandomQuote } from "./RandomQuote/getRandomQuote.js";
import { fetchFakePosts } from "./RandomPost/getRandomPost.js";
import { fetchGeolocationAndWeather } from "./GeolocationAndWeather/getGeolocationAndWeather.js";
import { updateBrowserTheme } from "./Page/BrowserTheme.js";
import { getLocalStorageToDos, updateToDo } from "./ToDo/getToDo.js";
import { constantKeys, getConstants, getHTMLElements } from "./common/utils.js";

window.addEventListener("load", init);

function init() {
  getLocalStorageUserName();
  getLocalStorageBrowserTheme();
  getLocalStorageToDos();
  updateToDo();
  updateBrowserTheme();

  updatePopUp();
  updateChristMasCounter();
  updateTimeAndDate();
  updateRandomQuote();

  changePopUpButtonColor();
  changeBodyBackgroundColor();
  fetchFakePosts();
  fetchGeolocationAndWeather();
  updateThisYear();
}

/** LocalStorage에서 유저정보 반환 */
function getLocalStorageUserName() {
  const { $modal, $loginForm, $loginInput } = getHTMLElements();
  if (!$modal || !$loginForm || !$loginInput) return;

  const { HIDDEN, USERNAME } = getConstants(constantKeys.LOGIN_POPUP);
  const savedUserName = localStorage.getItem(USERNAME);

  if (savedUserName === null) {
    $modal.classList.remove(HIDDEN);
  } else {
    $modal.classList.add(HIDDEN);
  }
}

/** 브라우저 테마 (dark모드) */
function getLocalStorageBrowserTheme() {
  const { $toggleSwitch } = getHTMLElements();
  if (!$toggleSwitch) return;

  const { THEME_KEY, THEME, DARK } = getConstants(constantKeys.DARK_MODE);
  const currentTheme = localStorage.getItem(THEME);

  if (!!currentTheme) {
    document.documentElement.setAttribute(THEME_KEY, currentTheme);
  }
  if (currentTheme === DARK) {
    $toggleSwitch.checked = true;
  }
}