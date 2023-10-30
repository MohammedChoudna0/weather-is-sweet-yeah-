var apiKey = '4ac922fbb80b818412473ff51a5be5d0';

function getCoordinates(city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=50&appid=' + apiKey;
    return new Promise(function(resolve, reject) {
        $.get(apiUrl, function(data) {
            if (data && data.length > 0) {
                resolve(data[0]);
            } else {
                reject('No se han encontrado información de '+ city);
            }
        });
    });
}

function getWeather(longitude, latitude) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=' + apiKey;
    return new Promise(function(resolve, reject) {
        $.get(apiUrl, function(data) {
            if (data) {
                resolve(data);
            } else {
                reject('No se ha podido obtener la información del tiempo para las coordenadas proporcionadas.');
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
        console.error(error);
    }
}


// Datos de ejemplo
var data = [
  { city: 'Washington' }, // Estados Unidos
  { city: 'London' }, // Reino Unido
  { city: 'Paris' }, // Francia
  { city: 'Berlin' }, // Alemania
  { city: 'Tokyo' }, // Japón
  { city: 'Beijing' }, // China
  { city: 'Moscow' }, // Rusia
  { city: 'Canberra' }, // Australia
  { city: 'Ottawa' }, // Canadá
  { city: 'Brasília' }, // Brasil
  { city: 'Cairo' }, // Egipto
  { city: 'Rome' }, // Italia
  { city: 'Mexico City' }, // México
  { city: 'Madrid' } // España
];


  
  $(function() {
    var container = $('.items-container .row');
    
    $.each(data, function(index, item) {

        getWeatherByCity(item.city).then(weatherInfo => {
            var tempCelsius = (weatherInfo.main.temp - 273.15).toFixed(1);
            var windSpeedKmh = (weatherInfo.wind.speed * 3.6).toFixed(1);
            var humidity = (weatherInfo.main.humidity);
            var icon = weatherInfo.weather[0].icon;
            console.log(icon)

            var image;

            switch (icon) {
                case '01d':
                    image = '01d';
                    break;
                case '01n':
                  image = '01n';
                  break;

                case '02d':
                case '03d':
                case '04d':
                    image = '02d';
                    break;
                case '02n':
                case '03n':
                case '04n':
                  image = '02n';
                  break;
                case '10d':
                case '09d':
                    image = '10d';
                    break;
                case '10n':
                case '09n':
                  image = '10n';
                  break;
                case '11d':
                    image = '11d';
                    break;
                case '11n':
                  image = '11n';
                  break;
                case '13d':
                    image = '13d';
                    break;
                case '13n':
                  image = '13n';
                  break;
                default:
                    image = 'default'; // Reemplaza 'default' con el nombre de tu imagen predeterminada
            }

            console.log(item.city);
            // Aquí puedes usar tempCelsius y windSpeedKmh
            var element = `<div class="col-12 col-md-6 col-lg-4 " id="${item.city}">
      <div
        class="item row my-3 justify-content-center mx-auto "
      >
        <div class="col-5 text-center m-0 p-0">
          <picture>
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
                <picture>
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
              <picture>
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
              <picture>
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
      
      $("#" + item.city).on('click', function() {
        console.log(item.city);
      });
        });
    });
  });

  $('#location-form').on('submit', function(event) {
    event.preventDefault();
    var location = $(this).find('#location-input').val();
    getWeatherByCity(location).then(weatherInfo => {
            console.log(weatherInfo)
            // Actualiza la página con los nuevos datos
            $('.cityName').text(weatherInfo.name);
            $('.description').text(weatherInfo.weather[0].description);
            $('.temperature').text(Math.round(weatherInfo.main.temp - 273.15) + '°C'); // Convierte la temperatura de Kelvin a Celsius
            $('.humidity').text(weatherInfo.main.humidity + '%');
            $('.wind').text(weatherInfo.wind.speed + 'm/s');
            $('.sunrise').text(new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})); 
            $('.sunset').text(new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            $('.direction').text(weatherInfo.wind.deg + '°');
            $('.visibility').text(weatherInfo.visibility / 1000 + ' km');
            let weatherIcon = weatherInfo.weather[0].icon;
            $('.picture source[type="image/avif"]').attr('srcset', `build/img/${weatherIcon}.avif`);
            $('.picture source[type="image/webp"]').attr('srcset', `build/img/${weatherIcon}.webp`);
            $('.picture img').attr('src', `build/img/${weatherIcon}.png`);
            


            
     });

    console.log('Formulario enviado');
  });
  

  // $(function() {
  //   var container = $('.items-container .row');
    
  //   $.each(data, function(index, item) {

  //       getWeatherByCity(item.city).then(weatherInfo => {
  //           var tempCelsius = (weatherInfo.main.temp - 273.15).toFixed(1);
  //           var windSpeedKmh = (weatherInfo.wind.speed * 3.6).toFixed(1);
  //           var humidity = (weatherInfo.main.humidity);
  //           var icon = weatherInfo.weather[0].icon;
  //           console.log(icon)

            
           
  //     container.append(element);
  //       });
  //   });
  // });

  
  