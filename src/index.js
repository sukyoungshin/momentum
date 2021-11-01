// login popup
const modal = document.querySelector('#poppup');
const loginForm = modal.querySelector('#loginform');
const loginInput = loginForm.querySelector('#loginform input[type="text"]');
const loginButton = loginForm.querySelector('#loginform button[type="submit"]');
const greeting = document.querySelector('#greeting');

const HIDDEN = 'hidden'; 
const ACTIVE= 'active';
const USERNAME = 'username';

function loginSubmitHandler(e) {
  e.preventDefault();
  modal.classList.add(HIDDEN);
  const username = loginInput.value;
  localStorage.setItem(USERNAME, username); // localStorage에 유저이름 저장
  paintGreetings(username);
};  

function paintGreetings(username) {
  greeting.innerText = `${username}!`;
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
loginInput.addEventListener('input', loginInputHandler);


// date-wrapper
function HandleCurrentTime () {
  const date = document.querySelector('#date p');
  const time = document.querySelector('#time p');

  const today = new Date(); // 오늘 날짜
  const toDateString = today.toDateString(); // date
  date.innerText = toDateString;
  
  const currentTime = today.toLocaleTimeString('ko-KR', { 
    hour12: true, 
    hour: "numeric", 
    minute: "numeric"
  }); // time
  time.innerText = currentTime;
}
window.addEventListener("load", HandleCurrentTime());
setInterval(HandleCurrentTime, 1000);

// weather
function onGeoSuccess(position) {
  const API_KEY = '6e908cf7ecc925726e41331827f8ede6'; // ed17d8f6a50a842c1d4b16c020da9844
  const { coords : { latitude : lat, longitude : lon } } = position;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    const city = document.querySelector('#weather p:first-of-type');
    const weather = document.querySelector('#weather p:last-of-type');

    const { name: cityname } = data; // city name
    const { main: cityweather } = data.weather[0]; // weather
    const { temp: citytemp } = data.main; // temp

    city.innerText = cityname;
    weather.innerText = `${citytemp}℃ / ${cityweather}`;
    } 
  );
};
function onGeoError() {
  alert('Can\'t find you. No weather for you.');
};

navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);


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
const clockTitle = document.querySelector(".dday-wrapper p:last-of-type");

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

const quote = document.querySelector('#quote span:first-of-type');
const movie = document.querySelector('#quote span:last-of-type');

const INDEX = Math.floor(Math.random() * disneyQuotes.length); // 0 ~ 명언갯수만큼
const todaysQuote = disneyQuotes[INDEX];

quote.innerText = todaysQuote.quote;
movie.innerText = todaysQuote.movie;

// 🎄 random image
const images = ['christmas0.jpg', 'christmas1.jpg', 'christmas2.jpg'];
const chosenImages = images[Math.floor(Math.random() * images.length)];
const randomImage = document.createElement('img'); // <img /> created
randomImage.src = `./src/${chosenImages}`;

// const imageWrapper = document.querySelector('.image-wrapper');
// imageWrapper.append(randomImage);

// footer
const thisyear = document.querySelector('.thisyear');
thisyear.innerText = new Date().getFullYear();