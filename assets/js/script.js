const API = "6433f062887d37df6976294043a382d7";

// City name or fail h1
const cityH1 = document.querySelector("#city-name");

const mainimg = document.querySelector(".background-div");

const selectH1 = document.querySelector("#select-h1");

const form = document.querySelector("form");
const select = document.querySelector("select");

// event listener to listen to when someone submits their city selection

form.addEventListener("submit", userInput);

// function that uses the input the user has taken to call on the api to get city's longitude and latitude

function userInput(event) {
  event.preventDefault();

  selectH1.style.display = "none";

  document.querySelector("#weather-prog-div").innerHTML = "";

  const input = document.querySelector("input");
  const city = input.value;

  form.reset();

  const selectElement = document.querySelector("select");

  selectElement.selectedIndex = 0;

  const longLatURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API}&units=metric`;

  fetch(longLatURL)
    .then((response) => {
      return response.json();
    })
    .then(searchLongLatInfo)
    .catch(handleError);
}

function handleError(error) {
  cityH1.innerText = "Something went wrong, Please try again later!";
}

// function saves latitude and longitude into variables and then calls weather data using variables.

function searchLongLatInfo(longLatObj) {
  if (longLatObj[0] == undefined) {
    cityH1.innerText = "City does not exist. Try again!";
  } else {
    cityH1.innerText = longLatObj[0].name;

    latitude = longLatObj[0].lat;
    longitude = longLatObj[0].lon;

    const weatherInfoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;

    fetch(weatherInfoURL)
      .then((response) => response.json())
      .then(giveWeatherInfo);

    const futureForecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;

    // Collects information on hourly prognosis and sends it to prognosis function

    fetch(futureForecastURL)
      .then((response) => response.json())
      .then(futureForecastInfo);
  }
}

/* Function that uses api information to give user weather details */

function giveWeatherInfo(weatherInfoObj) {
  const tempP = document.querySelector("#temp");
  tempP.innerText = "Temp: " + Math.round(weatherInfoObj.main.temp) + "°C";

  const descriptionP = document.querySelector("#description-p");
  descriptionP.innerText = weatherInfoObj.weather[0].description;

  const windSpeedP = document.querySelector("#wind-speed");
  windSpeedP.innerText = weatherInfoObj.wind.speed + "m/s";

  const weatherIcon = weatherInfoObj.weather[0].icon;
  const mainimg = document.querySelector(".background-div");

  const weatherImg = document.querySelector("#weather-icon");
  weatherImg.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

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

// Function that gives future weather prognosis

function futureForecastInfo(futureForecastInfoObj) {
  const select = document.querySelector("#prognos");
  select.style.display = "inline";

  // Event listener that listens to when user chooses hourly prognosis

  select.addEventListener("change", (event) => {
    const timePrognosis = event.target.value;

    const progDiv = document.querySelector("#weather-prog-div");

    // CSS is used here in order to display div

    progDiv.style.display = "flex";

    progDiv.innerHTML = "";

    let progHour = 0;

    // For loop to loop through API information and create weather prognosis selected by user

    for (let i = 0; i < timePrognosis; i++) {
      progHour += 3;

      const hourDiv = document.createElement("div");
      progDiv.appendChild(hourDiv);
      hourDiv.classList.add("hour-div");

      const hourP = document.createElement("p");
      hourDiv.appendChild(hourP);
      hourP.innerText = progHour + "h";
      hourP.classList.add("hour-p");

      const tempP = document.createElement("p");
      hourDiv.appendChild(tempP);

      tempP.innerText =
        Math.round(futureForecastInfoObj.list[i + 1].main.temp) + "°C";

      const hourImage = document.createElement("img");
      hourDiv.appendChild(hourImage);

      const hourWeatherIcon = futureForecastInfoObj.list[i + 1].weather[0].icon;

      hourImage.classList.add("hour-image");

      hourImage.src = `https://openweathermap.org/img/wn/${hourWeatherIcon}@2x.png`;
    }
  });
}
