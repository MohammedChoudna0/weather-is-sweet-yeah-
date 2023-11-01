var apiKey = "4ac922fbb80b818412473ff51a5be5d0";

function getCoordinates(city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=50&appid=" +
    apiKey;
  return new Promise(function (resolve, reject) {
    $.get(apiUrl, function (data) {
      if (data && data.length > 0) {
        resolve(data[0]);
        $(".error").hide();
      } else {
        reject("No se ha encontrado información de " + city);
        $(".bigItem-container").hide();
        $(".forecast-container").hide();
        $(".error").show();

        return ;

      }
    });
  });
}

function getWeather(longitude, latitude) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey;
  return new Promise(function (resolve, reject) {
    $.get(apiUrl, function (data) {
      if (data) {
        resolve(data);
      } else {
        reject(
          "No se ha podido obtener la información del tiempo para las coordenadas proporcionadas."
        );
      }
    });
  });
}

async function getWeatherByCity(city) {
  try {
    let coordinates = await getCoordinates(city);
    let weatherInfo = await getWeather(coordinates.lon, coordinates.lat);
    return weatherInfo;
  } catch (error) {
    console.log(error);
  }
}

// Datos de ejemplo
var data = [
  { city: "Washington" }, 
  { city: "London" }, 
  { city: "Paris" }, 
  { city: "Berlin" }, 
  { city: "Tokyo" }, 
  { city: "Beijing" }, 
  { city: "Moscow" }, 
  { city: "Canberra" }, 
  { city: "Ottawa" }, 
  { city: "Brasília" }, 
  { city: "Cairo" }, 
  { city: "Rome" }, 
  { city: "Mexico City" }, 
  { city: "Madrid" }, 
];

$(function () {
  var container = $(".items-container .row");

  $.each(data, function (index, item) {
    getWeatherByCity(item.city)
      .then((weatherInfo) => {
        var tempCelsius = (weatherInfo.main.temp - 273.15).toFixed(1);
        var windSpeedKmh = (weatherInfo.wind.speed * 3.6).toFixed(1);
        var humidity = weatherInfo.main.humidity;
        var icon = weatherInfo.weather[0].icon;
        console.log(icon);

        var image = getWeatherImage(icon);

        console.log(item.city);
        // Aquí puedes usar tempCelsius y windSpeedKmh
        var element = `<div class="col-12 col-md-6 col-lg-4 " id="${item.city}">
      <div
        class="item row my-3 justify-content-center mx-auto "
      >
        <div class="col-5 text-center m-0 p-0">
          <picture >
            <source
              srcset="build/img/${image}.avif"
              type="image/avif"
            />
            <source
              srcset="build/img/${image}.webp"
              type="image/webp"
            />
            <img
              loading="lazy"
              src="build/img/${image}.png"
              alt="Icon cloudy"
            />
          </picture>
        </div>
        <div class="col-7 text-center">
        <p class="p-0 m-0 text-start ">${item.city}</p>
        <div class="row justify-content-between">
            <div class="col-4">
              <div>
                <p class="item-info">${windSpeedKmh} km/h</p>
                <picture class="icon">
                  <source
                    srcset="build/img/icon-wind.avif"
                    type="image/avif"
                  />
                  <source
                    srcset="build/img/icon-wind.webp"
                    type="image/webp"
                  />
                  <img
                    class="item-icon"
                    loading="lazy"
                    src="build/img/icon-wind.png"
                    alt="Icon wind"
                  />
                </picture>
              </div>
            </div>
            <div class="col-4">
              <p class="item-info">${humidity}  <br>     %</p>
              <picture class="icon">
                <source
                  srcset="build/img/icon-humidity.avif"
                  type="image/avif"
                />
                <source
                  srcset="build/img/icon-humidity.webp"
                  type="image/webp"
                />
                <img
                  class="item-icon"
                  loading="lazy"
                  src="build/img/icon-humidity.png"
                  alt="Icon humidity"
                />
              </picture>
            </div>
            <div class="col-4">
              <p class="item-info">${tempCelsius}<br> Cº</p>
              <picture class="icon">
                <source
                  srcset="build/img/temperature.avif"
                  type="image/avif"
                />
                <source
                  srcset="build/img/temperature.webp"
                  type="image/webp"
                />
                <img
                  class="item-icon"
                  loading="lazy"
                  src="build/img/temperature.png"
                  alt="Icon temperature"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>`;
        container.append(element);

        $("#" + item.city).on("click", function () {
          updateWeatherInfo(item.city);
          updateForecastInfo(item.city);
          $(".bigItem-container").show();
          $(".items-container").hide();
        });
      })

  });

  $("#location-form").on("submit", function (event) {
    event.preventDefault();
    var location = $("#location-input").val();
    console.log(location);
    updateWeatherInfo(location);
    updateForecastInfo(location);
  });
  
  $("#location-button").on("click", function () {
    if (navigator.geolocation) {
      $("#loader").show();
      $(".items-container").hide();

      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        console.log("Latitud: " + lat + ", Longitud: " + lon);
        updateWeatherInfoByCoordinates(lat, lon).then(updateForecastInfoByCoordinates(lat,lon)).then(() => {
          // Oculta el loader una vez que se completa la llamada AJAX
          $("#loader").hide();
          $(".error").hide();
          $(".bigItem-container").show();

        });
        // Aquí puedes hacer una solicitud a una API de clima con la latitud y longitud
      });
    } else {
      console.log("Geolocalización no es soportada por este navegador.");
    }
  });
  
  function updateWeatherInfo(location) {
    getWeatherByCity(location).then((weatherInfo) => {

      console.log(weatherInfo);
      if (!weatherInfo){
          console.log("Weather info es indefined !!");
          return;
      }
      // Update the page with the new data
      $(".cityName").text(weatherInfo.name);
      $(".description").text(weatherInfo.weather[0].description);
      $(".temperature").text(Math.round(weatherInfo.main.temp - 273.15) + "°C"); // Convert temperature from Kelvin to Celsius
      $(".humidity").text(weatherInfo.main.humidity + "%");
      $(".wind").text(weatherInfo.wind.speed + "m/s");
      $(".sunrise").text(
        new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      $(".sunset").text(
        new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      $(".direction").text(weatherInfo.wind.deg + "°");
      $(".visibility").text(weatherInfo.visibility / 1000 + " km");
      var weatherIcon = getWeatherImage(weatherInfo.weather[0].icon);
      $('.picture source[type="image/avif"]').attr(
        "srcset",
        `build/img/${weatherIcon}.avif`
      );
      $('.picture source[type="image/webp"]').attr(
        "srcset",
        `build/img/${weatherIcon}.webp`
      );
      $(".picture img").attr("src", `build/img/${weatherIcon}.png`);
      weatherIcon = "";
    });
  }
  

  function updateWeatherInfoByCoordinates(lat, lon) {
    return new Promise((resolve, reject) => {
      getWeather(lon, lat).then((weatherInfo) => {
        console.log(weatherInfo);
        // Update the page with the new data
        $(".cityName").text(weatherInfo.name);
        $(".description").text(weatherInfo.weather[0].description);
        $(".temperature").text(Math.round(weatherInfo.main.temp - 273.15) + "°C"); // Convert temperature from Kelvin to Celsius
        $(".humidity").text(weatherInfo.main.humidity + "%");
        $(".wind").text(weatherInfo.wind.speed + "m/s");
        $(".sunrise").text(
          new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        $(".sunset").text(
          new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        $(".direction").text(weatherInfo.wind.deg + "°");
        $(".visibility").text(weatherInfo.visibility / 1000 + " km");
        var weatherIcon = getWeatherImage(weatherInfo.weather[0].icon);
        $('.picture source[type="image/avif"]').attr(
          "srcset",
          `build/img/${weatherIcon}.avif`
        );
        $('.picture source[type="image/webp"]').attr(
          "srcset",
          `build/img/${weatherIcon}.webp`
        );
        $(".picture img").attr("src", `build/img/${weatherIcon}.png`);
        weatherIcon = "";
      });
      resolve();
    });
  }
  

  
  function getWeatherImage(icon) {
    var image;
    switch (icon) {
      case "01d":
        image = "01d";
        break;
      case "01n":
        image = "01n";
        break;
      case "02d":
      case "03d":
      case "04d":
        image = "02d";
        break;
      case "02n":
      case "03n":
      case "04n":
        image = "02n";
        break;
      case "10d":
      case "09d":
        image = "10d";
        break;
      case "10n":
      case "09n":
        image = "10n";
        break;
      case "11d":
        image = "11d";
        break;
      case "11n":
        image = "11n";
        break;
      case "13d":
        image = "13d";
        break;
      case "13n":
        image = "13n";
        break;
      case "50d":
      case "50n":
        image = "50d";
      default:
        image = "default";
    }
    return image;
  }
  function getForecast(lat, lon) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: apiUrl,
        type: "GET",
        success: function(data) {
          resolve(data);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  }
  

  function updateForecastInfo(location) {
    getCoordinates(location)
      .then(coordinates => getForecast(coordinates.lat, coordinates.lon))
      .then(data => {
        if (!data){
          console.log("There is no forecast !!");
          return;
      }
        // 'data.list' es un array que contiene los pronósticos para los próximos 5 días cada 3 horas
        var forecasts = data.list;
        // Filtramos los pronósticos para obtener uno por día
        var dailyForecasts = forecasts.filter((forecast, index) => index % 8 === 0);
  
        // Vaciamos el contenedor de pronóstico
        $(".forecast-container .row").empty();
        
        // Creamos un nuevo div para cada pronóstico diario
        dailyForecasts.forEach((forecast, index) => {
          var date = new Date(forecast.dt * 1000);  // La fecha del pronóstico
          var temperature = Math.round(forecast.main.temp - 273.15); 
          var weatherIcon = forecast.weather[0].icon;  // El icono del tiempo
          var image = getWeatherImage(weatherIcon)
          var forecastDiv = `
          <div class="col-12 col-md border day${index + 1} d-flex flex-column justify-content-center align-items-center">
          <p>${date.toDateString()}</p>
          <picture>
            <source srcset="build/img/${image}.avif" type="image/avif">
            <source srcset="build/img/${image}.webp" type="image/webp">
            <img loading="lazy" src="build/img/${image}.jpg" alt="">
          </picture>

          <p class="fw-bold">${temperature} °C</p>
          </div>
          `;
          $(".forecast-container").show();
          // Añadimos el div al contenedor de pronóstico
          $(".forecast-container .row").append(forecastDiv);
        });
      })
      .catch(error => {
        console.error(error);  // Aquí puedes manejar los errores
      });
  }

  function updateForecastInfoByCoordinates(lat, lon) {
    getForecast(lat, lon)
      .then(data => {
        if (!data){
          console.log("There is no forecast !!");
          return;
      }
        console.log("Ha entrado");
        // 'data.list' es un array que contiene los pronósticos para los próximos 5 días cada 3 horas
        var forecasts = data.list;
  
        // Filtramos los pronósticos para obtener uno por día
        var dailyForecasts = forecasts.filter((forecast, index) => index % 8 === 0);
  
        // Vaciamos el contenedor de pronóstico
        $(".forecast-container .row").empty();
  
        // Creamos un nuevo div para cada pronóstico diario
        dailyForecasts.forEach((forecast, index) => {
          console.log("Ha en "+ index);

          var date = new Date(forecast.dt * 1000);  // La fecha del pronóstico
          var temperature = Math.round(forecast.main.temp - 273.15); 
          var weatherIcon = forecast.weather[0].icon;  // El icono del tiempo
          var image = getWeatherImage(weatherIcon)
          var forecastDiv = `
          <div class="col-12 col-md border day${index + 1} d-flex flex-column justify-content-center align-items-center">
          <p>${date.toDateString()}</p>

          <picture>
            <source srcset="build/img/${image}.avif" type="image/avif">
            <source srcset="build/img/${image}.webp" type="image/webp">
            <img loading="lazy" src="build/img/${image}.jpg" alt="">
          </picture>
          <p class="fw-bold">${temperature} °C</p>
          </div>
        
          `;
          $(".forecast-container").show();
          // Añadimos el div al contenedor de pronóstico
          $(".forecast-container .row").append(forecastDiv);
        });
      })
      .catch(error => {
        console.error(error);  // Aquí puedes manejar los errores
      });
}

  
  
  
});

