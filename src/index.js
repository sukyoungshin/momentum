// login popup
const modal = document.querySelector('#poppup');
const loginForm = modal.querySelector('#loginform');
const loginInput = loginForm.querySelector('#loginform input[type="text"]');
const loginButton = loginForm.querySelector('#loginform button[type="submit"]');
const greeting = document.querySelector('#greeting');

const HIDDEN = 'hidden'; 
const ACTIVE= 'active';
const USERNAME = 'username';

function paintGreetings(username) {
  const randomEmojis = ['😍','😎','😝','🎅','🖖','👋','🎄','✨','🍀', '🦄'];
  const emojiIndex = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];

  greeting.innerText = `${username} ${emojiIndex}`;
};

const savedUserName = localStorage.getItem(USERNAME); 
if (savedUserName === null) {
  // show the form
  modal.classList.remove(HIDDEN);
  loginForm.addEventListener('submit', loginSubmitHandler);
} else {
  //show the greeting
  modal.classList.add(HIDDEN);
  paintGreetings(savedUserName);
};

function loginInputHandler () {
  if (loginInput.value.length >= 1) {
    loginButton.classList.add(ACTIVE);
  } else {
    loginButton.classList.remove(ACTIVE);
  }
};

function loginSubmitHandler(e) {
  e.preventDefault();
  modal.classList.add(HIDDEN);
  const username = loginInput.value;
  localStorage.setItem(USERNAME, username); // localStorage에 유저이름 저장
  paintGreetings(username);
};  

loginInput.addEventListener('input', loginInputHandler);


// random background color
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

// date-wrapper
function HandleCurrentTime () {
  const date = document.querySelector('#date p');
  const time = document.querySelector('#time p');

  const today = new Date();
  const thisYear = today.getFullYear(); // 연도

  const thisDay = today.getDay(); // 날짜


  const dateIndex = today.getDate(); // 요일
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
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
window.addEventListener("load", HandleCurrentTime());
setInterval(HandleCurrentTime, 1000);

// weather
function geoFindMe() {

  function onGeoSuccess(position) {
    const API_KEY = '6e908cf7ecc925726e41331827f8ede6'; // ed17d8f6a50a842c1d4b16c020da9844
    const { coords : { latitude : lat, longitude : lon } } = position;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const city = document.querySelector('#city span:first-child');
        const weather = document.querySelector('#weather p');
      
        const { country } = data.sys; // country
        const { name: cityname } = data; // city name
        const { main: cityweather } = data.weather[0]; // weather
        const { temp: citytemp } = data.main; // temp
    
        city.innerText = `${cityname}, ${country} `;
        weather.innerText = `${citytemp}℃ / ${cityweather}`;
      } 
    );
  };

  function onGeoError() {
    alert('위치를 확인할 수 없습니다.');
  };

  if(!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    const city = document.querySelector('#city span:first-child');
    const weather = document.querySelector('#weather p');

    city.innerText = 'Loading...';
    weather.innerText = 'Loading...';
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  }

};
geoFindMe(); // 위치불러오기 (브라우저 오픈되었을때)

// ✅ 수정필요
// const getLocationBtn = document.querySelector('#getLocation button[type="button"]');
// getLocationBtn.addEventListener('click', geoFindMe); // 버튼눌러서 위치 다시 불러오기

//  to do wrapper
const toDoForm = document.querySelector('#todo-form');
const toDoInput = toDoForm.querySelector('#todo-form input[type="text"]');
const toDoList = toDoForm.querySelector('#todo-list');
const TODOS = "todos";
let toDos = [];

function saveToDos () {
  localStorage.setItem(TODOS, JSON.stringify(toDos)); 
};

function deleteToDoHandler (e) {
  const li = e.target.parentElement;
  li.remove();    
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
  saveToDos();
};

function addToDoHandler (newToDo) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  
  li.id = newToDo.id;
  span.innerText = newToDo.text;
  button.innerText = '❌';
  button.addEventListener('click', deleteToDoHandler);

  li.classList.add('todo-list');
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

const savedToDos = localStorage.getItem(TODOS);
console.log(savedToDos);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(addToDoHandler);
}

// d day counter
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

  if (today.getMonth() === 11 && today.getDate >= 25) {
    theDay.setFullYear(theDay.getFullYear() + 1);
  }

  clockTitle.innerText = `${days}d ${hoursConvert}h ${minutesConvert}m ${secondsConvert}s`;
}
window.addEventListener("load", xMasCounter());
setInterval(xMasCounter, 1000);


// random quote
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

// random image (background)
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

// footer
const thisyear = document.querySelector('.thisyear');
thisyear.innerText = new Date().getFullYear();

const toggleSwitch = document.querySelector('#checkbox');
function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}
toggleSwitch.addEventListener('change', switchTheme, false);