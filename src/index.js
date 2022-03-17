window.addEventListener('load', init);

function getElements() {
  /* LOGIN POPUP */
  const modal = document.querySelector('#poppup');
  const loginForm = modal.querySelector('#loginform');
  const loginInput = loginForm.querySelector('#loginform input[type="text"]');
  const loginButton = loginForm.querySelector('#loginform button[type="submit"]');
  const greeting = document.querySelector('#greeting');

  /* TIME */
  const date = document.querySelector('#date p');
  const time = document.querySelector('#time p');

  /* TO-DO */
  const toDoForm = document.querySelector('#todo-form');
  const toDoInput = toDoForm.querySelector('#todo-form input[type="text"]');
  const toDoList = toDoForm.querySelector('#todo-list');

  /* D-DAY COUNTER */
  const clockTitle = document.querySelector("#dday");

  /* RANDOM-QUOTE */
  const randomImage = document.querySelector('.image-wrapper');
  const quote = document.querySelector('#random-image span:first-child');
  const movie = document.querySelector('#random-image span:last-child');

  /* DARK-MODE */
  const toggleSwitch = document.querySelector('#checkbox');

  /* FOOTER */
  const thisyear = document.querySelector('.thisyear');

  return {
    modal, 
    loginForm, 
    loginInput, 
    loginButton, 
    greeting, 
    date, 
    time,
    toDoForm,
    toDoInput,
    toDoList,
    clockTitle,
    randomImage,
    quote,
    movie,
    toggleSwitch,
    thisyear
  };
};

function CONSTANTS() {
  /* LOGIN POPUP */
  const HIDDEN_KEY = 'hidden';
  const ACTIVE_KEY = 'active';
  const USERNAME_KEY = 'username';

  /* TO-DO */
  const TODOS_KEY = "todos";

  /* DARK MODE */
  const DATA_THEME = 'data-theme';
  const THEME_KEY = 'theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  return {
    HIDDEN_KEY, 
    ACTIVE_KEY, 
    USERNAME_KEY, 
    TODOS_KEY,
    DATA_THEME,
    THEME_KEY,
    DARK,
    LIGHT
  };
};

function init() {
  const  {
    modal, 
    loginForm, 
    loginInput, 
    loginButton, 
    greeting, 
    date, 
    time,
    toDoForm,
    toDoInput,
    toDoList,
    clockTitle,
    randomImage,
    quote,
    movie,
    toggleSwitch,
    thisyear
  } = getElements();
  
  /* LocalStorage 정보 불러오기 */
  getUserNameInLocalStorage()
  getToDosInLocalStorage();
  getCurrentThemeInLocalStorage();

  /* Set Interval */
  window.addEventListener("load", setChristMasCounter());
  window.addEventListener("load", currentTimeHandler());
  setInterval(setChristMasCounter, 1000);
  setInterval(currentTimeHandler, 1000*60);

  randomBgColor();
  btnColorChange();
  getFakeData();
  getRandomBackgroundInQuote();
  getRandomQuotes();
  geoFindMe();

  toDoForm.addEventListener('submit', submitToDoHandler);
  toggleSwitch.addEventListener('change', switchTheme); // parameter : false ?
  thisyear.innerText = new Date().getFullYear();
};

function getUserNameInLocalStorage() {
  const {modal, loginForm, loginInput} = getElements();
  const {HIDDEN_KEY, USERNAME_KEY} = CONSTANTS();
  const savedUserName = localStorage.getItem(USERNAME_KEY); 

  if (savedUserName === null) {
    modal.classList.remove(HIDDEN_KEY);
    loginInput.addEventListener('input', btnColorChange); 
    loginForm.addEventListener('submit', loginSubmitHandler); 
  } else {
    modal.classList.add(HIDDEN_KEY);
    paintGreetings(savedUserName);
  };
};

function btnColorChange () {
  const {loginInput, loginButton} = getElements();
  const {ACTIVE_KEY} = CONSTANTS();

  if (loginInput.value.length >= 1) {
    loginButton.classList.add(ACTIVE_KEY);
  } else {
    loginButton.classList.remove(ACTIVE_KEY);
  }
};

function paintGreetings(username) {
  const randomEmojis = [
    '😍',
    '😎',
    '😝',
    '🎅',
    '🖖',
    '👋',
    '🎄',
    '✨',
    '🍀', 
    '🦄'
  ];
  const randomIndex = Math.floor(Math.random() * randomEmojis.length);
  const randomEmoji = randomEmojis[randomIndex];
  greeting.innerText = `${username} ${randomEmoji}`;
};

function loginSubmitHandler(e) {
  e.preventDefault();
  const {modal, loginInput} = getElements();
  const {HIDDEN_KEY, USERNAME_KEY} = CONSTANTS();

  modal.classList.add(HIDDEN_KEY);
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username); // localStorage에 유저이름 저장
  paintGreetings(username); // 입력받은 username 화면에 나타냄
};  

function randomBgColor () {
  const colors = [
    "#ef5777",
    "#9198e5", 
    "#575fcf",
    "#4bcffa",
    "#0be881",
    "#f53b57",
    "#3c40c6",
    "#00d8d6",
    "#05c46b",
    "#e66465",
    "#d2dae2",
    "#485460",
    "#ffa801",
    "#ffd32a"
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  const a = colors[randomIndex];
  const b = colors[randomIndex];

  if (a !== b) {
    return document.body.style.background = `linear-gradient(45deg, ${a}, ${b})`;
  } 
  return document.body.style.background = `linear-gradient(45deg, #e66465, #9198e5)`;
};

// current time
function currentTimeHandler () {
  const {date, time} = getElements(); 
  const {thisYear, thisMonth, thisDate, thisDay} = getTodayInformation();
  const currentTime = getCurrentTime();

  date.innerText = `${thisMonth} ${thisDay}, ${thisYear} ( ${thisDate} )`;
  time.innerText = `${currentTime}`;
}

function getTodayInformation() {
  const today = new Date();
  const thisYear = today.getFullYear(); // 연도

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = today.getMonth(); 
  const thisMonth = months[monthIndex]; // 월

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const dayIndex = today.getDay();
  const thisDate = weekdays[dayIndex]; // 요일

  const thisDay = today.getDate(); // 날짜

  return {thisYear, thisMonth, thisDate, thisDay};
};

function getCurrentTime() {
  const today = new Date();
  const currentTime = today.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: "numeric", 
    minute: "numeric"
  }); 
  return currentTime;
};

// Weather API
function geoFindMe() {

  function getCurrentGeolocation() {
    if(!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
    } else {
      const city = document.querySelector('#city span:first-child');
      const weather = document.querySelector('#weather span');
  
      city.innerText = 'Loading...';
      weather.innerText = 'Loading...';
      navigator.geolocation.getCurrentPosition(
        getSuccessGeolocation, 
        getFailedGeolocation
      );
    }
  };
  getCurrentGeolocation();

  function getCurrentWeather(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        // DOM element
        const city = document.querySelector('#city span:first-child');
        const todayweather = document.querySelector('#weather span');
        const weatherIconWrapper = document.querySelector('#weather');
        const iconImg = document.createElement('img');
      
        // data fetch
        const { country } = data.sys; // country
        const { name: cityname } = data; // city name
        const { description: cityweather } = data.weather[0]; // weather
        const { temp: citytemp } = data.main; // temp
        const { icon } = data.weather[0]; // weather icon
        const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
        weatherIconWrapper.append(iconImg);
        iconImg.src = iconURL;
        iconImg.setAttribute('alt', '오늘의 날씨'); 
        
        // data binding
        city.innerText = `${cityname}, ${country}`; // 도시이름 출력
        todayweather.innerHTML = `${citytemp}℃ / ${cityweather}`; // 오늘날씨 출력
      } 
    );
  }

  function getForecaseWeather(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
      const { daily } = data; // forecast daily data
      
      for (let i = 1; i < daily.length; i++) {
        const { main : weeklyWeather, icon } = daily[i].weather[0]; // weeklyWeather: 날씨 , icon: 아이콘
        const weeklyWeatherWrapper = document.querySelector('#weekly-weather');
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const iconImg = document.createElement('img');
        const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
        iconImg.src = iconURL;
        iconImg.setAttribute('alt', '이번주 날씨'); 

        const today = new Date();
        const month = today.getMonth() + 1; 
        const weeklyDate = today.getDate() + i; // 날짜

        // ✅ 수정필요
        const weeklyDay = today.getDay() + i - 1; // 요일

        span1.innerText = `${month}/${weeklyDate}`;
        span2.innerText = `${weeklyWeather}`;

        div.append(span1);
        div.append(span2);
        div.append(iconImg);
        weeklyWeatherWrapper.append(div);
      }

    })
  }

  function getSuccessGeolocation(position) {
    const API_KEY = 'ed17d8f6a50a842c1d4b16c020da9844'; 
    const { coords : { latitude : lat, longitude : lon } } = position;
    const urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const urlForecastWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;

    getCurrentWeather(urlCurrentWeather);// current weather
    getForecaseWeather(urlForecastWeather); // 7days forecast weather
  };

  function getFailedGeolocation() {
    alert('위치 정보를 확인할 수 없습니다.');
  };

};

//  TO DO
let toDos = [];
function saveToDos () {
  const {TODOS_KEY} = CONSTANTS();
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos)); 
};

function deleteToDoHandler (e) {
  const li = e.target.parentElement;
  li.remove();    
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id, 10));
  saveToDos();
};

function addToDoHandler (newToDo) {
  const {toDoList} = getElements();
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const span = document.createElement('span');
  const button = document.createElement('button');
  const randomId = Math.floor(Math.random() * 1000);

  // 속성값 부여
  checkbox.setAttribute('type', 'checkbox');
  button.setAttribute('type', 'button');

  // id 및 클래스명 부여
  li.id = newToDo.id; // li에 id값 부여
  li.classList.add('todo-list'); // li 클래스 부여
  label.setAttribute('for', `${randomId}`); // checkbox와 label 연동
  checkbox.id = randomId;

  span.innerText = newToDo.text;
  button.innerText = '❌';
  button.addEventListener('click', deleteToDoHandler);

  // li 태그 안에 DOM 요소들 넣고
  li.append(checkbox);
  li.append(label);
  li.append(span);
  li.append(button);
  toDoList.append(li);
};

function submitToDoHandler (e) {
  e.preventDefault();
  const {toDoInput} = getElements();
  const newToDo = {
    id : Date.now(),
    text : toDoInput.value,
  }
  toDos.push(newToDo);
  addToDoHandler(newToDo);
  saveToDos();
  toDoInput.value = '';
};

function getToDosInLocalStorage() {
  const {TODOS_KEY} = CONSTANTS();
  const savedToDos = localStorage.getItem(TODOS_KEY);

  if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(addToDoHandler);
  };
};

// API
function getFakeData() {
  const posts = 'posts'; // queryParameter
  const url = `https://jsonplaceholder.typicode.com/${posts}`;

  fetch(url)
  .then(response => response.json())
  .then(json => {
    const dummy = document.querySelector('#dummy ul');
    
    json.map((item) => {
      const { title } = item;
      const li = document.createElement('li');
      li.innerText += `${title}`;
      dummy.append(li);
    })

  })
};

// christmas d-day counter
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
  return {theDay, todayDecember, todayDate, days, hoursConvert, minutesConvert, secondsConvert};
};

function setChristMasCounter() {
  const {clockTitle} = getElements();
  const {theDay, todayDecember, todayDate, days, hoursConvert, minutesConvert, secondsConvert} = getChristMasInformation();

  // automatic logic for every christmas's counting
  if (todayDecember === 11 && todayDate >= 25) {
    theDay.setFullYear(theDay.getFullYear() + 1);
  }
  clockTitle.innerText = `${days}d ${hoursConvert}h ${minutesConvert}m ${secondsConvert}s`;
};

// random quote & image 
const disneyQuotes = [
  {
    quote: 'Because when I look at you, I can feel it. And I look at you and I’m home.',
    movie: 'Dory, Finding Nemo'
  },
  {
    quote: 'Can you feel the love tonight? You needn’t look too far. Stealing through the night’s uncertainties, love is where they are.',
    movie: 'The Lion King',
  },
  {
    quote: 'Love is putting someone else’s needs before yours.',
    movie: 'Olaf, Frozen',
  },
  {
    quote: 'Remember you\'re the one who can fill the world with sunshine.',
    movie: 'Snow White, Snow White and the Seven Dwarfs',
  },
  {
    quote: 'All at once everything looks different, now that I see you.',
    movie: 'Rapunzel, Tangled',
  },
  {
    quote: 'You must not let anyone define your limits because of where you come from. Your only limit is your soul.',
    movie: 'Gusteau, Ratatouille',
  },
  {
    quote: 'Life is a journey to be experienced, not a problem to be solved.',
    movie: 'Pooh, Winnie the Pooh',
  },
  {
    quote: 'The past can hurt. But the way I see it, you can either run from it, or learn from it.',
    movie: 'Rafiki, The Lion King',
  },
  {
    quote: 'No matter how your heart is grieving, if you keep on believing, the dream that you wish will come true.',
    movie: 'Cinderella, Cinderella',
  },
  {
    quote: 'You are braver than you believe, stronger than you seem, and smarter than you think.',
    movie: 'Christopher Robin, Winnie the Pooh',
  }
];

function getRandomBackgroundInQuote() {
  const {randomImage} = getElements();
  const images = ['christmas0.jpg', 'christmas1.jpg', 'christmas2.jpg', 'christmas3.jpg'];
  const randomIndex = Math.floor(Math.random() * images.length);
  const chosenImages = images[randomIndex];
  randomImage.style = `background-image: url(./src/${chosenImages})`;
};

function getRandomQuotes() {
  const {quote, movie} = getElements();
  const quoteIndex = Math.floor(Math.random() * disneyQuotes.length);
  const todaysQuote = disneyQuotes[quoteIndex];
  
  quote.innerText = todaysQuote.quote;
  movie.innerText = todaysQuote.movie;
};

// Theme기능 (dark모드)
function switchTheme(e) {
  const {DATA_THEME, THEME_KEY, DARK, LIGHT} = CONSTANTS();
  const DARK_MODE = e.target.checked;

  if (DARK_MODE) {
    document.documentElement.setAttribute(DATA_THEME, DARK);
    localStorage.setItem(THEME_KEY, DARK);
  } else {
    document.documentElement.setAttribute(DATA_THEME, LIGHT);
    localStorage.setItem(THEME_KEY, LIGHT);
  }
};

function getCurrentThemeInLocalStorage() {
  const {toggleSwitch} = getElements();
  const {DATA_THEME, THEME_KEY, DARK} = CONSTANTS();
  const currentTheme = localStorage.getItem(THEME_KEY);

  if (currentTheme) {
    document.documentElement.setAttribute(DATA_THEME, currentTheme);  
  }
  if (currentTheme === DARK) {
    toggleSwitch.checked = true;
  }

};
