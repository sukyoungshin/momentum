import { DisneyQuotes } from "./data.js";

export const BASE_URL = "./src/assets";

export const toDo = {
  id: 0,
  text: '',
}
export type ToDo = typeof toDo;


type ConstantKeys = keyof typeof constantKeys;
export const constantKeys = {
  LOGIN_POPUP: "LOGIN_POPUP",
  TODO: "TODO",
  DARK_MODE: "DARK_MODE",
} as const;

const constantObject = {
  LOGIN_POPUP: {
    HIDDEN: "hidden",
    ACTIVE: "active",
    USERNAME: "username",
  } as const,
  TODO: {
    TODOS: "todos",
  } as const,
  DARK_MODE: {
    THEME_KEY: "data-theme",
    THEME: "theme",
    DARK: "dark",
    LIGHT: "light",
  } as const
}

/** 필요한 상수 반환 */
export function getConstants<Key extends ConstantKeys>(key: Key): (typeof constantObject)[Key] {
  return constantObject[key];
}

/** DOM Elements 선택 */
export function getHTMLElements() {
  /* LOGIN POPUP */
  const $modal = document.querySelector<HTMLDivElement>("#poppup");
  const $loginForm = $modal?.querySelector<HTMLFormElement>("#loginform");
  const $loginInput = $loginForm?.querySelector<HTMLInputElement>('#loginform input[type="text"]');
  const $loginButton = $loginForm?.querySelector<HTMLButtonElement>(
    '#loginform button[type="submit"]'
  );
  const $greeting = document.querySelector<HTMLSpanElement>("#greeting");

  /* TIME */
  const $date = document.querySelector<HTMLParagraphElement>("#date p");
  const $time = document.querySelector<HTMLParagraphElement>("#time p");

  /* TO-DO */
  const $toDoForm = document.querySelector<HTMLFormElement>("#todo-form");
  const $toDoInput = $toDoForm?.querySelector<HTMLInputElement>('#todo-form input[type="text"]');
  const $toDoList = $toDoForm?.querySelector<HTMLUListElement>("#todo-list");

  /* D-DAY COUNTER */
  const $clockTitle = document.querySelector<HTMLElement>("#dday");

  /* RANDOM-QUOTE */
  const $randomImage = document.querySelector<HTMLElement>(".image-wrapper");
  const $quote = document.querySelector<HTMLSpanElement>("#random-image span:first-child");
  const $movie = document.querySelector<HTMLSpanElement>("#random-image span:last-child");

  /* DARK-MODE */
  const $toggleSwitch = document.querySelector<HTMLInputElement>("#checkbox");

  /* FOOTER */
  const $thisYear = document.querySelector<HTMLSpanElement>(".thisyear");

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
    $city: document.querySelector<HTMLSpanElement>("#city span:first-child"),
    $todayWeather: document.querySelector<HTMLSpanElement>("#weather span"),
    $weatherIconWrapper: document.querySelector<HTMLDivElement>("#weather"),
    $iconImg: document.createElement("img"),
  };
}

export function createWeatherHTMLElements() {
  return {
    $weeklyWeatherWrapper: document.querySelector<HTMLDivElement>("#weekly-weather"),
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

/** 랜덤 인덱스 생성 */
export function getRandomIndex(item: string[] | DisneyQuotes) {
  return Math.floor(Math.random() * item.length);
}
