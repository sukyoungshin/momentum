/** DOM Elements 선택 */
export function getHTMLElements() {
  /* LOGIN POPUP */
  const $modal = document.querySelector("#poppup");
  const $loginForm = $modal.querySelector("#loginform");
  const $loginInput = $loginForm.querySelector('#loginform input[type="text"]');
  const $loginButton = $loginForm.querySelector(
    '#loginform button[type="submit"]'
  );
  const $greeting = document.querySelector("#greeting");

  /* TIME */
  const $date = document.querySelector("#date p");
  const $time = document.querySelector("#time p");

  /* TO-DO */
  const $toDoForm = document.querySelector("#todo-form");
  const $toDoInput = $toDoForm.querySelector('#todo-form input[type="text"]');
  const $toDoList = $toDoForm.querySelector("#todo-list");

  /* D-DAY COUNTER */
  const $clockTitle = document.querySelector("#dday");

  /* RANDOM-QUOTE */
  const $randomImage = document.querySelector(".image-wrapper");
  const $quote = document.querySelector("#random-image span:first-child");
  const $movie = document.querySelector("#random-image span:last-child");

  /* DARK-MODE */
  const $toggleSwitch = document.querySelector("#checkbox");

  /* FOOTER */
  const $thisYear = document.querySelector(".thisyear");

  return {
    $modal,
    $loginForm,
    $loginInput,
    $loginButton,
    $greeting,
    $date,
    $time,
    $toDoForm,
    $toDoInput,
    $toDoList,
    $clockTitle,
    $randomImage,
    $quote,
    $movie,
    $toggleSwitch,
    $thisYear,
  };
}

/** DOM Element 생성 */
export function createGeoHTMLElements() {
  return {
    $city: document.querySelector("#city span:first-child"),
    $todayWeather: document.querySelector("#weather span"),
    $weatherIconWrapper: document.querySelector("#weather"),
    $iconImg: document.createElement("img"),
  };
}

export function createWeatherHTMLElements() {
  return {
    $weeklyWeatherWrapper: document.querySelector("#weekly-weather"),
    $div: document.createElement("div"),
    $span1: document.createElement("span"),
    $span2: document.createElement("span"),
    $iconImg: document.createElement("img"),
  };
}

export function createTodoHTMLElements() {
  const $li = document.createElement("li");
  $li.classList.add("todo-list"); // li 클래스 부여

  const $checkbox = document.createElement("input");
  $checkbox.setAttribute("type", "checkbox");

  const $button = document.createElement("button");
  $button.setAttribute("type", "button");
  $button.innerText = "❌";

  return {
    $li,
    $checkbox,
    $label: document.createElement("label"),
    $span: document.createElement("span"),
    $button,
  };
}

/** 필요한 상수 반환 */
export function getConstants(item) {
  if (item === CONSTANTS.LOGIN_POPUP) {
    return {
      HIDDEN: "hidden",
      ACTIVE: "active",
      USERNAME: "username",
    };
  }

  if (item === CONSTANTS.TODO) {
    return {
      TODOS: "todos",
    };
  }

  if (item === CONSTANTS.DARK_MODE) {
    return {
      THEME_KEY: "data-theme",
      THEME: "theme",
      DARK: "dark",
      LIGHT: "light",
    };
  }

  return null;
}

/** 랜덤 인덱스 생성 */
export function getRandomIndex(item) {
  return Math.floor(Math.random() * item.length);
}
