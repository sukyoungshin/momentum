import { constantKeys, BASE_URL, getHTMLElements, createGeoHTMLElements, createWeatherHTMLElements, createTodoHTMLElements, getConstants, getRandomIndex, } from "./utils.js";
import { colors, disneyQuotes, images, months, weekdays, randomEmojis, } from "./data.js";
window.addEventListener("load", init);
function init() {
    const { $toDoForm, $toggleSwitch } = getHTMLElements();
    if (!$toDoForm || !$toggleSwitch)
        return;
    /* LocalStorage 정보 불러오기 */
    getLocalStorageUserName();
    getLocalStorageToDos();
    getLocalStorageBrowserTheme();
    /* 크리스마스 카운터 및 날짜정보 */
    setChristMasCounter();
    setTodayInformationAndTime();
    /* Set Interval */
    setInterval(setChristMasCounter, 1000);
    setInterval(setTodayInformationAndTime, 1000 * 60);
    changePopUpButtonColor();
    changeBodyBackgroundColor();
    fetchFakePosts();
    changeQuoteBackgroundImage();
    fetchRandomQuotes();
    fetchGeolocationAndWeather();
    updateThisYear();
    $toDoForm.addEventListener("submit", submitToDo);
    $toggleSwitch.addEventListener("change", switchBrowserTheme);
}
/** 현재연도 업데이트 (footer) */
function updateThisYear() {
    const { $thisYear } = getHTMLElements();
    if (!!$thisYear) {
        $thisYear.innerText = String(new Date().getFullYear());
    }
}
/** LocalStorage에서 유저정보 반환 */
function getLocalStorageUserName() {
    const { $modal, $loginForm, $loginInput } = getHTMLElements();
    if (!$modal || !$loginForm || !$loginInput)
        return;
    const { HIDDEN, USERNAME } = getConstants(constantKeys.LOGIN_POPUP);
    const savedUserName = localStorage.getItem(USERNAME);
    if (savedUserName === null) {
        $modal.classList.remove(HIDDEN);
        $loginInput.addEventListener("input", changePopUpButtonColor);
        $loginForm.addEventListener("submit", submitUserNameInPopUp);
    }
    else {
        $modal.classList.add(HIDDEN);
        setUserNameOnProfile(savedUserName);
    }
}
/** 팝업창 submit 버튼색상 변경 */
function changePopUpButtonColor() {
    const { $loginInput, $loginButton } = getHTMLElements();
    if (!$loginInput || !$loginButton)
        return;
    const { ACTIVE } = getConstants(constantKeys.LOGIN_POPUP);
    if ($loginInput.value.length >= 1) {
        $loginButton === null || $loginButton === void 0 ? void 0 : $loginButton.classList.add(ACTIVE);
    }
    else {
        $loginButton === null || $loginButton === void 0 ? void 0 : $loginButton.classList.remove(ACTIVE);
    }
}
/** 프로필 영역에 유저이름 나타냄 */
function setUserNameOnProfile(username) {
    const { $greeting } = getHTMLElements();
    if (!$greeting)
        return;
    const index = getRandomIndex(randomEmojis);
    const randomEmoji = randomEmojis[index];
    $greeting.innerText = `${username} ${randomEmoji}`;
}
/** 로그인버튼 제출 */
function submitUserNameInPopUp(e) {
    e.preventDefault();
    const { $modal, $loginInput } = getHTMLElements();
    if (!$modal || !$loginInput)
        return;
    const { HIDDEN, USERNAME } = getConstants(constantKeys.LOGIN_POPUP);
    $modal.classList.add(HIDDEN);
    const username = $loginInput.value;
    localStorage.setItem(USERNAME, username); // localStorage에 유저이름 저장
    setUserNameOnProfile(username); // 입력받은 username을 프로필에 나타냄
}
/** BODY 영역에 배경색상 지정 */
function changeBodyBackgroundColor() {
    const index = getRandomIndex(colors);
    const left = colors[index];
    const right = colors[index];
    if (left !== right) {
        return (document.body.style.background = `linear-gradient(45deg, ${left}, ${right})`);
    }
    return (document.body.style.background = `linear-gradient(45deg, #e66465, #9198e5)`);
}
/** 현재 시간과 날짜를 셋팅 */
function setTodayInformationAndTime() {
    const { $date, $time } = getHTMLElements();
    if (!$date || !$time)
        return;
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
/** Weather 및 위치정보 호출 */
function fetchGeolocationAndWeather() {
    function getCurrentGeolocation() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
        }
        else {
            const $city = document.querySelector("#city span:first-child");
            const $weather = document.querySelector("#weather span");
            if (!$city || !$weather)
                return;
            $city.innerText = "Loading...";
            $weather.innerText = "Loading...";
            navigator.geolocation.getCurrentPosition(successGeolocation, failedGeolocation);
        }
    }
    getCurrentGeolocation();
    function fetchTodayWeather(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
            const { $city, $todayWeather, $weatherIconWrapper, $iconImg } = createGeoHTMLElements();
            if (!$city || !$todayWeather)
                return;
            // data fetch
            const { country } = data.sys;
            const { name: cityName } = data;
            const { description: cityWeather } = data.weather[0];
            const { temp: cityTemperature } = data.main;
            const { icon } = data.weather[0]; // weather icon
            const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
            $weatherIconWrapper === null || $weatherIconWrapper === void 0 ? void 0 : $weatherIconWrapper.append($iconImg);
            $iconImg.src = iconURL;
            $iconImg.setAttribute("alt", "오늘의 날씨");
            // data binding        
            $city.innerText = `${cityName}, ${country}`;
            $todayWeather.innerHTML = `${cityTemperature}℃ / ${cityWeather}`;
        });
    }
    function fetch7DaysWeather(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
            const { daily } = data; // forecast daily data
            for (let i = 1; i < daily.length; i++) {
                const { $weeklyWeatherWrapper, $div, $span1, $span2, $iconImg } = createWeatherHTMLElements();
                const { main: weeklyWeather, icon } = daily[i].weather[0];
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
                $weeklyWeatherWrapper === null || $weeklyWeatherWrapper === void 0 ? void 0 : $weeklyWeatherWrapper.append($div);
            }
        });
    }
    function successGeolocation(position) {
        const API_KEY = "ed17d8f6a50a842c1d4b16c020da9844";
        const { coords: { latitude: lat, longitude: lon }, } = position;
        const urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const urlForecastWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;
        fetchTodayWeather(urlCurrentWeather); // current weather
        fetch7DaysWeather(urlForecastWeather); // 7days forecast weather
    }
    function failedGeolocation() {
        alert("위치 정보를 확인할 수 없습니다.");
    }
}
const toDo = {
    id: 0,
    text: '',
};
/** TO DO */
let toDos = [];
function saveToDos() {
    const { TODOS } = getConstants(constantKeys.TODO);
    localStorage.setItem(TODOS, JSON.stringify(toDos));
}
function deleteToDo(e) {
    const target = e.currentTarget;
    const li = target.parentElement;
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id, 10));
    saveToDos();
}
function addToDo(newToDo) {
    const { $toDoList } = getHTMLElements();
    const { $li, $checkbox, $label, $span, $button } = createTodoHTMLElements();
    const randomId = Math.floor(Math.random() * 1000);
    // id 및 클래스명 부여
    $li.id = String(newToDo.id); // li에 id값 부여
    $label.setAttribute("for", `${randomId}`); // checkbox와 label 연동
    $checkbox.id = `${randomId}`;
    $span.innerText = newToDo.text;
    $button.addEventListener("click", deleteToDo);
    $li.append($checkbox);
    $li.append($label);
    $li.append($span);
    $li.append($button);
    $toDoList === null || $toDoList === void 0 ? void 0 : $toDoList.append($li);
}
function resetToDoInput($input) {
    $input.value = "";
}
function submitToDo(e) {
    e.preventDefault();
    const { $toDoInput } = getHTMLElements();
    if (!$toDoInput)
        return;
    const newToDo = {
        id: Date.now(),
        text: $toDoInput === null || $toDoInput === void 0 ? void 0 : $toDoInput.value,
    };
    toDos.push(newToDo);
    addToDo(newToDo);
    saveToDos();
    resetToDoInput($toDoInput);
}
function getLocalStorageToDos() {
    const { TODOS } = getConstants(constantKeys.TODO);
    const savedToDos = localStorage.getItem(TODOS);
    if (savedToDos !== null) {
        const parsedToDos = JSON.parse(savedToDos);
        toDos = parsedToDos;
        parsedToDos.forEach(addToDo);
    }
}
/** API 호출 (fake posts) */
function fetchFakePosts() {
    const posts = "posts"; // queryParameter
    const url = `https://jsonplaceholder.typicode.com/${posts}`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
        const $ul = document.querySelector("#dummy ul");
        // FIXME
        json.map((item) => {
            const { title } = item;
            const $li = document.createElement("li");
            $li.innerText += `${title}`;
            $ul === null || $ul === void 0 ? void 0 : $ul.append($li);
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
    if (!$clockTitle)
        return;
    const { theDay, todayDecember, todayDate, days, hoursConvert, minutesConvert, secondsConvert, } = getChristMasInformation();
    // automatic logic for every christmas's counting
    if (todayDecember === 11 && todayDate >= 25) {
        theDay.setFullYear(theDay.getFullYear() + 1);
    }
    $clockTitle.innerText = `${days}d ${hoursConvert}h ${minutesConvert}m ${secondsConvert}s`;
}
/** Random Quote */
function fetchRandomQuotes() {
    const { $quote, $movie } = getHTMLElements();
    if (!$quote || !$movie)
        return;
    const index = getRandomIndex(disneyQuotes);
    const selectedQuote = disneyQuotes[index];
    $quote.innerText = selectedQuote.quote;
    $movie.innerText = selectedQuote.movie;
}
function changeQuoteBackgroundImage() {
    const { $randomImage } = getHTMLElements();
    if (!$randomImage)
        return;
    const index = getRandomIndex(images);
    const selectedImage = images[index];
    $randomImage.style.backgroundImage = `url(${BASE_URL}/${selectedImage})`;
}
/** Theme기능 (dark모드) */
function switchBrowserTheme(e) {
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
function getLocalStorageBrowserTheme() {
    const { $toggleSwitch } = getHTMLElements();
    if (!$toggleSwitch)
        return;
    const { THEME_KEY, THEME, DARK } = getConstants(constantKeys.DARK_MODE);
    const currentTheme = localStorage.getItem(THEME);
    if (!!currentTheme) {
        document.documentElement.setAttribute(THEME_KEY, currentTheme);
    }
    if (currentTheme === DARK) {
        $toggleSwitch.checked = true;
    }
}
