import { createGeoHTMLElements, createWeatherHTMLElements } from "../common/utils.js";

/** Weather 및 위치정보 호출 */
export function fetchGeolocationAndWeather() {
  function getCurrentGeolocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
    } else {
      const $city = document.querySelector<HTMLSpanElement>("#city span:first-child");
      const $weather = document.querySelector<HTMLSpanElement>("#weather span");
      if (!$city || !$weather) return;

      $city.innerText = "Loading...";
      $weather.innerText = "Loading...";
      navigator.geolocation.getCurrentPosition(
        successGeolocation,
        failedGeolocation
      );
    }
  }
  getCurrentGeolocation();

  function fetchTodayWeather(url: string) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { $city, $todayWeather, $weatherIconWrapper, $iconImg } =
          createGeoHTMLElements();
        if (!$city || !$todayWeather) return;

        // data fetch
        const { country } = data.sys;
        const { name: cityName } = data;
        const { description: cityWeather } = data.weather[0];
        const { temp: cityTemperature } = data.main;
        const { icon } = data.weather[0]; // weather icon
        const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;
        $weatherIconWrapper?.append($iconImg);
        $iconImg.src = iconURL;
        $iconImg.setAttribute("alt", "오늘의 날씨");

        // data binding        
        $city.innerText = `${cityName}, ${country}`;
        $todayWeather.innerHTML = `${cityTemperature}℃ / ${cityWeather}`;
      });
  }

  function fetch7DaysWeather(url: string) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { daily } = data; // forecast daily data

        for (let i = 1; i < daily.length; i++) {
          const { $weeklyWeatherWrapper, $div, $span1, $span2, $iconImg } =
            createWeatherHTMLElements();
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
          $weeklyWeatherWrapper?.append($div);
        }
      });
  }

  function successGeolocation(position: { coords: { latitude: number; longitude: number; }; }) {
    const API_KEY = "ed17d8f6a50a842c1d4b16c020da9844";
    const {
      coords: { latitude: lat, longitude: lon },
    } = position;
    const urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const urlForecastWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;

    fetchTodayWeather(urlCurrentWeather); // current weather
    fetch7DaysWeather(urlForecastWeather); // 7days forecast weather
  }

  function failedGeolocation() {
    alert("위치 정보를 확인할 수 없습니다.");
  }
}
