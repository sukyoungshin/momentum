import {
  CONSTANTS,
  colors,
  disneyQuotes,
  images,
  months,
  weekdays,
  randomEmojis,
} from "./utils.js";

window.addEventListener("load", init);
function init() {
  const { $toDoForm, $toggleSwitch, $thisYear } = getHTMLElements();

  /* LocalStorage 정보 불러오기 */
  getUserNameInLocalStorage();
  getToDosInLocalStorage();
  getCurrentThemeInLocalStorage();

  /* Set Interval */
  window.addEventListener("load", setChristMasCounter());
  window.addEventListener("load", setTodayAndTime());
  setInterval(setChristMasCounter, 1000);
  setInterval(setTodayAndTime, 1000 * 60);

  randomBgColor();
  changePopUpButtonColor();
  getFakeData();
  getRandomBackgroundInQuote();
  getRandomQuotes();
  geoFindMe();

  $toDoForm.addEventListener("submit", submitToDo);
  $toggleSwitch.addEventListener("change", switchTheme);
  $thisYear.innerText = new Date().getFullYear();
}

/** DOM Elements 선택 */
function getHTMLElements() {
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
function createGeoHTMLElements() {
  return {
    $city: document.querySelector("#city span:first-child"),
    $todayweather: document.querySelector("#weather span"),
    $weatherIconWrapper: document.querySelector("#weather"),
    $iconImg: document.createElement("img"),
  };
}
function createWeatherHTMLElements() {
  return {
    $weeklyWeatherWrapper: document.querySelector("#weekly-weather"),
    $div: document.createElement("div"),
    $span1: document.createElement("span"),
    $span2: document.createElement("span"),
    $iconImg: document.createElement("img"),
  };
}
function createTodoHTMLElements() {
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
function getConstants(item) {
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
      THEME_KEY: "theme-key",
      THEME: "theme",
      DARK: "dark",
      LIGHT: "light",
    };
  }

  return null;
}

/** 유저정보 반환 */
function getUserNameInLocalStorage() {
  const { $modal, $loginForm, $loginInput } = getHTMLElements();
  const { HIDDEN, USERNAME } = getConstants(CONSTANTS.LOGIN_POPUP);
  const savedUserName = localStorage.getItem(USERNAME);

  if (savedUserName === null) {
    $modal.classList.remove(HIDDEN);
    $loginInput.addEventListener("input", changePopUpButtonColor);
    $loginForm.addEventListener("submit", submitUserNameInPopUp);
  } else {
    $modal.classList.add(HIDDEN);
    setUserNameOnProfile(savedUserName);
  }
}

/** 팝업창 submit 버튼색상 변경 */
function changePopUpButtonColor() {
  const { $loginInput, $loginButton } = getHTMLElements();
  const { ACTIVE } = getConstants(CONSTANTS.LOGIN_POPUP);

  if ($loginInput.value.length >= 1) {
    $loginButton.classList.add(ACTIVE);
  } else {
    $loginButton.classList.remove(ACTIVE);
  }
}

/** 프로필 영역에 유저이름 나타냄 */
function setUserNameOnProfile(username) {
  const { $greeting } = getHTMLElements();

  const randomIndex = Math.floor(Math.random() * randomEmojis.length);
  const randomEmoji = randomEmojis[randomIndex];
  $greeting.innerText = `${username} ${randomEmoji}`;
}

/** 로그인버튼 제출 */
function submitUserNameInPopUp(e) {
  e.preventDefault();
  const { $modal, $loginInput } = getHTMLElements();
  const { HIDDEN, USERNAME } = getConstants(CONSTANTS.LOGIN_POPUP);

  $modal.classList.add(HIDDEN);
  const username = $loginInput.value;
  localStorage.setItem(USERNAME, username); // localStorage에 유저이름 저장
  setUserNameOnProfile(username); // 입력받은 username을 프로필에 나타냄
}

/** BODY 영역에 배경색상 지정 */
function randomBgColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const a = colors[randomIndex];
  const b = colors[randomIndex];

  if (a !== b) {
    return (document.body.style.background = `linear-gradient(45deg, ${a}, ${b})`);
  }
  return (document.body.style.background = `linear-gradient(45deg, #e66465, #9198e5)`);
}

/** 현재 시간과 날짜를 셋팅 */
function setTodayAndTime() {
  const { $date, $time } = getHTMLElements();
  const { year, month, date, day } = getCurrentDate();
  const time = getCurrentTime();

  $date.innerText = `${month} ${day}, ${year} ( ${date} )`;
  $time.innerText = `${time}`;
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear(); // 연도

  const monthIndex = today.getMonth();
  const month = months[monthIndex]; // 월

  const dayIndex = today.getDay();
  const date = weekdays[dayIndex]; // 요일

  const day = today.getDate(); // 날짜

  return { year, month, date, day };
}

function getCurrentTime() {
  const today = new Date();
  const time = today.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  return time;
}

/** Weather API */
function geoFindMe() {
  function getCurrentGeolocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
    } else {
      const $city = document.querySelector("#city span:first-child");
      const $weather = document.querySelector("#weather span");

      $city.innerText = "Loading...";
      $weather.innerText = "Loading...";
      navigator.geolocation.getCurrentPosition(
        getSuccessGeolocation,
        getFailedGeolocation
      );
    }
  }
  getCurrentGeolocation();

  function getCurrentWeather(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { $city, $todayweather, $weatherIconWrapper, $iconImg } =
          createGeoHTMLElements();

        // data fetch
        const { country } = data.sys; // country
        const { name: cityname } = data; // city name
        const { description: cityweather } = data.weather[0]; // weather
        const { temp: citytemp } = data.main; // temp
        const { icon } = data.weather[0]; // weather icon
        const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
        $weatherIconWrapper.append($iconImg);
        $iconImg.src = iconURL;
        $iconImg.setAttribute("alt", "오늘의 날씨");

        // data binding
        $city.innerText = `${cityname}, ${country}`; // 도시이름 출력
        $todayweather.innerHTML = `${citytemp}℃ / ${cityweather}`; // 오늘날씨 출력
      });
  }

  function getForecastWeather(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { daily } = data; // forecast daily data

        for (let i = 1; i < daily.length; i++) {
          const { $weeklyWeatherWrapper, $div, $span1, $span2, $iconImg } =
            createWeatherHTMLElements(); // HTML elements 생성
          const { main: weeklyWeather, icon } = daily[i].weather[0]; // weeklyWeather: 날씨 , icon: 아이콘
          const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;

          $iconImg.src = iconURL;
          $iconImg.setAttribute("alt", "이번주 날씨");

          const today = new Date();
          const month = today.getMonth() + 1;
          const weeklyDate = today.getDate() + i; // 날짜

          // ✅ 수정필요
          const weeklyDay = today.getDay() + i - 1; // 요일

          $span1.innerText = `${month}/${weeklyDate}`;
          $span2.innerText = `${weeklyWeather}`;

          $div.append($span1);
          $div.append($span2);
          $div.append($iconImg);
          $weeklyWeatherWrapper.append($div);
        }
      });
  }

  function getSuccessGeolocation(position) {
    const API_KEY = "ed17d8f6a50a842c1d4b16c020da9844";
    const {
      coords: { latitude: lat, longitude: lon },
    } = position;
    const urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const urlForecastWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;

    getCurrentWeather(urlCurrentWeather); // current weather
    getForecastWeather(urlForecastWeather); // 7days forecast weather
  }

  function getFailedGeolocation() {
    alert("위치 정보를 확인할 수 없습니다.");
  }
}

/** TO DO */
let toDos = [];
function saveToDos() {
  const { TODOS } = getConstants(CONSTANTS.TODO);
  localStorage.setItem(TODOS, JSON.stringify(toDos));
}

function deleteToDo(e) {
  const li = e.target.parentElement;
  li.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id, 10));
  saveToDos();
}

function addToDo(newToDo) {
  const { $toDoList } = getHTMLElements();
  const { $li, $checkbox, $label, $span, $button } = createTodoHTMLElements();
  const randomId = Math.floor(Math.random() * 1000);

  // id 및 클래스명 부여
  $li.id = newToDo.id; // li에 id값 부여
  $label.setAttribute("for", `${randomId}`); // checkbox와 label 연동
  $checkbox.id = randomId;

  $span.innerText = newToDo.text;
  $button.addEventListener("click", deleteToDo);

  // li 태그 안에 DOM 요소들 넣고
  $li.append($checkbox);
  $li.append($label);
  $li.append($span);
  $li.append($button);
  $toDoList.append($li);
}

function resetToDoInput($input) {
  $input.value = "";
}

function submitToDo(e) {
  e.preventDefault();
  const { $toDoInput } = getHTMLElements();
  const newToDo = {
    id: Date.now(),
    text: $toDoInput.value,
  };
  toDos.push(newToDo);
  addToDo(newToDo);
  saveToDos();
  resetToDoInput($toDoInput);
}

function getToDosInLocalStorage() {
  const { TODOS } = getConstants(CONSTANTS.TODO);
  const savedToDos = localStorage.getItem(TODOS);

  if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(addToDo);
  }
}

/** API 호출 (fake posts) */
function getFakeData() {
  const posts = "posts"; // queryParameter
  const url = `https://jsonplaceholder.typicode.com/${posts}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const $ul = document.querySelector("#dummy ul");

      json.map((item) => {
        const { title } = item;
        const $li = document.createElement("li");
        $li.innerText += `${title}`;
        $ul.append($li);
      });
    });
}

/** 크리스마스 d-day 카운터 */
function getChristMasInformation() {
  const today = new Date();
  const theDay = new Date(today.getFullYear(), 11, 25);
  const milliSecondsGap = theDay.getTime() - today.getTime();

  const days = Math.floor(milliSecondsGap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliSecondsGap / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((milliSecondsGap / (1000 * 60)) % 60);
  const seconds = Math.floor((milliSecondsGap / 1000) % 60);

  const hoursConvert = String(hours).padStart(2, "0");
  const minutesConvert = String(minutes).padStart(2, "0");
  const secondsConvert = String(seconds).padStart(2, "0");

  const todayDecember = today.getMonth(); // 11이면 12월
  const todayDate = today.getDate();
  return {
    theDay,
    todayDecember,
    todayDate,
    days,
    hoursConvert,
    minutesConvert,
    secondsConvert,
  };
}

function setChristMasCounter() {
  const { $clockTitle } = getHTMLElements();
  const {
    theDay,
    todayDecember,
    todayDate,
    days,
    hoursConvert,
    minutesConvert,
    secondsConvert,
  } = getChristMasInformation();

  // automatic logic for every christmas's counting
  if (todayDecember === 11 && todayDate >= 25) {
    theDay.setFullYear(theDay.getFullYear() + 1);
  }
  $clockTitle.innerText = `${days}d ${hoursConvert}h ${minutesConvert}m ${secondsConvert}s`;
}

/** Random Quote */
function getRandomBackgroundInQuote() {
  const { $randomImage } = getHTMLElements();

  const randomIndex = Math.floor(Math.random() * images.length);
  const chosenImages = images[randomIndex];
  $randomImage.style = `background-image: url(./src/${chosenImages})`;
}

function getRandomQuotes() {
  const { $quote, $movie } = getHTMLElements();
  const quoteIndex = Math.floor(Math.random() * disneyQuotes.length);
  const todaysQuote = disneyQuotes[quoteIndex];

  $quote.innerText = todaysQuote.quote;
  $movie.innerText = todaysQuote.movie;
}

/** Theme기능 (dark모드) */
function switchTheme(e) {
  const { THEME_KEY, THEME, DARK, LIGHT } = getConstants(CONSTANTS.DARK_MODE);
  const isDarkMode = e.target.checked;

  if (isDarkMode) {
    document.documentElement.setAttribute(THEME_KEY, DARK);
    localStorage.setItem(THEME, DARK);
  } else {
    document.documentElement.setAttribute(THEME_KEY, LIGHT);
    localStorage.setItem(THEME, LIGHT);
  }
}

function getCurrentThemeInLocalStorage() {
  const { $toggleSwitch } = getHTMLElements();
  const { THEME_KEY, THEME, DARK } = getConstants(CONSTANTS.DARK_MODE);
  const currentTheme = localStorage.getItem(THEME);

  if (!!currentTheme) {
    document.documentElement.setAttribute(THEME_KEY, currentTheme);
  }
  if (currentTheme === DARK) {
    $toggleSwitch.checked = true;
  }
}
