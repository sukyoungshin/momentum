// login popup
const modal = document.querySelector('#poppup');
const loginForm = modal.querySelector('#loginform');
const loginInput = loginForm.querySelector('#loginform input[type="text"]');
const loginButton = loginForm.querySelector('#loginform button[type="submit"]');
const greeting = document.querySelector('#greeting');

const HIDDEN_KEY = 'hidden'; 
const ACTIVE_KEY= 'active';
const USERNAME_KEY = 'username';

function btnColorChange () {
  if (loginInput.value.length >= 1) {
    loginButton.classList.add(ACTIVE_KEY);
  } else {
    loginButton.classList.remove(ACTIVE_KEY);
  }
};

function paintGreetings(username) {
  const randomEmojis = ['😍','😎','😝','🎅','🖖','👋','🎄','✨','🍀', '🦄'];
  const emojiIndex = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
  greeting.innerText = `${username} ${emojiIndex}`;
};

function loginSubmitHandler(e) {
  e.preventDefault();
  modal.classList.add(HIDDEN_KEY);
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username); // localStorage에 유저이름 저장
  paintGreetings(username); // 입력받은 username 화면에 나타냄
};  

// 향후 방문을 위해 사용자 기본 설정 저장 (username)
const savedUserName = localStorage.getItem(USERNAME_KEY); 
if (savedUserName === null) {
  // if username didn't visit before, show the login modal
  modal.classList.remove(HIDDEN_KEY);
  loginInput.addEventListener('input', btnColorChange); 
  loginForm.addEventListener('submit', loginSubmitHandler); 
} else {
  // if username visited once, show users the greeting message
  modal.classList.add(HIDDEN_KEY);
  paintGreetings(savedUserName);
};

// random background color
function randomBgColor () {
  const colors = ["#ef5777","#9198e5", "#575fcf","#4bcffa","#0be881","#f53b57","#3c40c6","#00d8d6","#05c46b","#e66465","#d2dae2","#485460","#ffa801","#ffd32a"];
  const a = colors[Math.floor(Math.random() * colors.length)];
  const b = colors[Math.floor(Math.random() * colors.length)];

  if (a !== b) {
    // if the selected colors are different
    document.body.style.background = `linear-gradient(45deg, ${a}, ${b})`;
  } else {
    // if the selected colors are same, show the following (default)
    document.body.style.background = `linear-gradient(45deg, #e66465, #9198e5)`;
  }
};
window.addEventListener("load", randomBgColor());

// current time
function currentTimeHandler () {
  const date = document.querySelector('#date p');
  const time = document.querySelector('#time p');

  const today = new Date();
  const thisYear = today.getFullYear(); // 연도
  const thisDay = today.getDate(); // 날짜
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const dateIndex = today.getDay(); // 요일
  let thisDate = weekdays[dateIndex]; 

  const monthIndex = today.getMonth(); // 월
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let thisMonth = months[monthIndex]; // 현재 월
  
  date.innerText = `${thisMonth} ${thisDay}, ${thisYear} ( ${thisDate} )`;
  
  const currentTime = today.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: "numeric", 
    minute: "numeric"
  }); // time
  time.innerText = `${currentTime}`;
}
window.addEventListener("load", currentTimeHandler());
setInterval(currentTimeHandler, 1000);

// geolocation data-fetch (API)
function geoFindMe() {

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

  function handleGeoSuccess(position) {
    const API_KEY = 'ed17d8f6a50a842c1d4b16c020da9844'; 
    const { coords : { latitude : lat, longitude : lon } } = position;
    const urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const urlForecastWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;

    getCurrentWeather(urlCurrentWeather);// current weather
    getForecaseWeather(urlForecastWeather); // 7days forecast weather
  };

  function handleGeoFail() {
    alert('위치를 확인할 수 없습니다.');
  };

  if(!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    const city = document.querySelector('#city span:first-child');
    const weather = document.querySelector('#weather span');

    city.innerText = 'Loading...';
    weather.innerText = 'Loading...';
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoFail);
  }
};
geoFindMe();



// ✅ geo location 버튼누르면 위치 다시 불러오기 기능 추가
// const getLocationBtn = document.querySelector('#getLocation button[type="button"]');
// getLocationBtn.addEventListener('click', geoFindMe); 

// ✅ to do 체크해서 밑줄생긴상태 local storage에 저장하고 불러오는 기능
//  to do wrapper
const toDoForm = document.querySelector('#todo-form');
const toDoInput = toDoForm.querySelector('#todo-form input[type="text"]');
const toDoList = toDoForm.querySelector('#todo-list');
const TODOS_KEY = "todos";
let toDos = [];

function saveToDos () {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos)); 
};

function deleteToDoHandler (e) {
  const li = e.target.parentElement;
  li.remove();    
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
  saveToDos();
};

function addToDoHandler (newToDo) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const span = document.createElement('span');
  const button = document.createElement('button');
  const randomId = Math.floor(Math.random() * 1000); // 매번 새로운 id명 생성하여 부여

  // 속성값 부여
  checkbox.setAttribute('type', 'checkbox');
  button.setAttribute('type', 'button');

  // id 및 클래스명 부여
  li.id = newToDo.id; // li에 id값 부여
  li.classList.add('todo-list'); // li 클래스 부여
  label.setAttribute('for', `${randomId}`); // checkbox와 label 연동
  checkbox.id = `${randomId}`; 

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
  const newToDoObj = {
    id : Date.now(),
    text : toDoInput.value
  }
  toDos.push(newToDoObj);
  addToDoHandler(newToDoObj);
  saveToDos();
  toDoInput.value = '';
};

toDoForm.addEventListener('submit', submitToDoHandler);

// 향후 방문을 위해 사용자 기본 설정 저장 (todo))
const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(addToDoHandler);
};

// ✅ dummy text data-fetch (API)  ==> news Data 받아오고 싶은데
// cors 이슈란 https://evan-moon.github.io/2020/05/21/about-cors/
// cors를 해결하기 위한 방법
// - 서버에서 처리를 하는 방법이 제일 편하다
// - 클라이언트 단에서 프록시를 이용해 해결할 수는 있다.
// - cra면 패키지 제이슨 파일에 프록시 주소 쓰고 api요청하면 그 주소로 요청을 한다.
// 바닐라JS인데 가능할까요? 데브서버를 띄우면 가능하긴한데 그 상황이면 엔진엑스 두고 그거 통해서 리버스 프록시 쓰는게 더 편할꺼같긴 하네요

// proxy 설정하기 (proxy뜻 : 대리인, 경유서버같은거에요 요청 고대로 전달해주는거)
// - 밸로퍼트 : https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html
// - https://gist.github.com/jesperorb/6ca596217c8dfba237744966c2b5ab1e
function getFakeData() {
  const posts = 'posts'; // query
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
getFakeData();

// christmas d-day counter
const clockTitle = document.querySelector("#dday");

function xMasCounter() {
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

  // automatic logic for every christmas's counting
  if (today.getMonth() === 11 && today.getDate >= 25) {
    theDay.setFullYear(theDay.getFullYear() + 1);
  }

  clockTitle.innerText = `${days}d ${hoursConvert}h ${minutesConvert}m ${secondsConvert}s`;
};
window.addEventListener("load", xMasCounter());
setInterval(xMasCounter, 1000);

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

// random bgimage for 'quote' section
const randomImage = document.querySelector('.image-wrapper');
const images = ['christmas0.jpg', 'christmas1.jpg', 'christmas2.jpg', 'christmas3.jpg'];
const chosenImages = images[Math.floor(Math.random() * images.length)];
randomImage.style = `background-image: url(./src/${chosenImages})`;

// random quote
const quote = document.querySelector('#random-image span:first-child');
const movie = document.querySelector('#random-image span:last-child');

const INDEX = Math.floor(Math.random() * disneyQuotes.length); // 0 ~ 명언갯수만큼
const todaysQuote = disneyQuotes[INDEX];

quote.innerText = todaysQuote.quote;
movie.innerText = todaysQuote.movie;

// ✅ music player



// Theme기능 (dark모드)
// 토글 스위치의 확인 및 확인 해제
const toggleSwitch = document.querySelector('#checkbox');
const DATA_THEME = 'data-theme';
const THEME_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute(DATA_THEME, DARK);
    localStorage.setItem(THEME_KEY, DARK);
  } else {
    document.documentElement.setAttribute(DATA_THEME, LIGHT);
    localStorage.setItem(THEME_KEY, LIGHT);
  }
};
toggleSwitch.addEventListener('change', switchTheme); // parameter : false ?

// 향후 방문을 위해 사용자 기본 설정 저장 (theme)
const currentTheme = localStorage.getItem(THEME_KEY);
if (currentTheme) {
  document.documentElement.setAttribute(DATA_THEME, currentTheme);

  if (currentTheme === DARK) {
    toggleSwitch.checked = true;
  }
};

// footer
const thisyear = document.querySelector('.thisyear');
thisyear.innerText = new Date().getFullYear();