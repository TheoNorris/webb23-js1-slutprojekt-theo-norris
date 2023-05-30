/* API Key */

const API = "6433f062887d37df6976294043a382d7";

/* City name or fail h1 */
const cityH1 = document.querySelector("#city-name");

/* Sets background image */

const mainimg = document.querySelector(".background-div");

mainimg.style.backgroundImage =
  "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/clear.jpg')";

const selectH1 = document.querySelector("#select-h1");

/* Selects form through DOM and saves into form const */

const form = document.querySelector("form");
const select = document.querySelector("select");

/* event listener to listen to when someone submits their city selection */

form.addEventListener("submit", userInput);

/* function that uses the input the user has taken to call on the api to get weathers information */

function userInput(event) {
  event.preventDefault();

  selectH1.style.display = "none";

  document.querySelector("#weather-prog-div").innerHTML = "";

  const input = document.querySelector("input");
  const city = input.value;

  cityH1.innerText = city;

  form.reset();

  const selectElement = document.querySelector("select");

  selectElement.selectedIndex = 0;

  /* saves api address in const */

  const weatherURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API}&units=metric`;

  /* collects weather api and converts it into object if the input is correct, otherwise gives information that the input is wrong */
  fetch(weatherURL)
    .then((response) => response.json())
    .then(searchWeatherInfo)
    .catch(handleError);
}

// Function to handle errors

function handleError(error) {
  cityH1.innerText = "City does not exist. Try again.";
}

/* function saves weather data into variables and then calls weather data using longitude and latitude. */
function searchWeatherInfo(weatherObj) {
  console.log(weatherObj[0].lat);

  latitude = weatherObj[0].lat;
  longitude = weatherObj[0].lon;

  /* Uses longitude and latitude variables to call on weather information */

  const weatherInfo = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;

  // Calls weather information and sends it to weather function

  fetch(weatherInfo)
    .then((response) => response.json())
    .then(giveWeatherInfo);

  // API address for weather prognosis

  const futureForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;

  // Collects information on hourly prognosis and sends it to prognosis function

  fetch(futureForecast)
    .then((response) => response.json())
    .then(futureForecastInfo);
}

/* function uses call api to provide user with weather information using calls to different html components and manipulating their inner texts, sources */

function giveWeatherInfo(weatherInfoObj) {
  // Saves h2 into a variable and saves temperature into variable

  const temp = document.querySelector("#temp");
  temp.innerText = "Temp: " + Math.round(weatherInfoObj.main.temp) + "°C";

  // Saves p into a variable and saves weather desription into variable

  const descriptionP = document.querySelector("#description-p");
  descriptionP.innerText = weatherInfoObj.weather[0].description;

  // Saves p into a variable and saves wind speed into variable

  const windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerText = weatherInfoObj.wind.speed + "m/s";

  // Saves image into a variable and saves weather icon into variable

  const weatherIcon = weatherInfoObj.weather[0].icon;
  const mainimg = document.querySelector(".background-div");

  const weatherImg = document.querySelector("#weather-icon");
  weatherImg.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  mainimg.style.backgroundImage =
    "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/clear.jpg')";

  // If statement that changes background image dependant on weather.

  if (weatherIcon.includes("01")) {
    mainimg.style.backgroundImage =
      "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/clear.jpg')";
  } else if (
    weatherIcon.includes("02") ||
    weatherIcon.includes("03") ||
    weatherIcon.includes("04")
  ) {
    mainimg.style.backgroundImage =
      "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/cloud.jpg')";
  } else if (weatherIcon.includes("09") || weatherIcon.includes("10")) {
    mainimg.style.backgroundImage =
      "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/rain.jpg')";
  } else if (weatherIcon.includes("11")) {
    mainimg.style.backgroundImage =
      "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/thunder.jpg')";
  } else if (weatherIcon.includes("13")) {
    mainimg.style.backgroundImage =
      "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/snow.jpg')";
  } else if (weatherIcon.includes("50")) {
    mainimg.style.backgroundImage =
      "linear-gradient(rgba(255,255,255, 0.5), rgba(0, 0, 0, 0.5)), url('assets/images/fog.jpg')";
  }
}

function futureForecastInfo(futureForecastInfoObj) {
  console.log("Check" + futureForecastInfoObj);

  const select = document.querySelector("#prognos");
  select.style.display = "inline";

  select.addEventListener("change", (event) => {
    const timePrognosis = event.target.value;

    console.log("time prognosis = " + timePrognosis);

    const progDiv = document.querySelector("#weather-prog-div");

    progDiv.style.display = "flex";

    const progH2 = document.createElement("h2");
    progDiv.appendChild(progH2);
    progH2.innerText = "Weather prognosis";

    // Clear existing content of progDiv
    progDiv.innerHTML = "";

    let progHour = 0;

    console.log("temp" + futureForecastInfoObj.list[0].main.temp);

    for (let i = 0; i < timePrognosis; i++) {
      progHour += 3;
      const hourDiv = document.createElement("div");
      progDiv.appendChild(hourDiv);
      hourDiv.style.display = "flex";
      hourDiv.style.flexDirection = "column";
      hourDiv.style.margin = "20px";

      const hourP = document.createElement("p");
      hourDiv.appendChild(hourP);
      hourP.innerText = progHour + "h";
      const temp = document.createElement("p");
      hourDiv.appendChild(temp);
      temp.innerText =
        Math.round(futureForecastInfoObj.list[i + 1].main.temp) + "°C";
      const hourImage = document.createElement("img");
      hourDiv.appendChild(hourImage);

      const hourWeatherIcon = futureForecastInfoObj.list[i + 1].weather[0].icon;

      console.log(hourWeatherIcon);

      hourImage.style.width = "100px";

      hourImage.src = `https://openweathermap.org/img/wn/${hourWeatherIcon}@2x.png`;
    }
  });
}
