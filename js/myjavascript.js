//Code for changing themes
let themes = document.getElementById('themes-select');

themes.addEventListener('change', changeTheme);

function changeTheme() {
    let theme = themes.value;

    document.querySelector('body').style.backgroundImage = `url('./images/${theme}.jpg')`;

    let title = document.querySelector('h1');
    switch (theme) {
        case 'night':
            title.style.color = '#838282';
            break;
        case 'rain':
            title.style.color = '#571b1b';
            break;
        case 'snow':
            title.style.color = '#d62626';
            break;
        default:
            title.style.color = '#000000';
    }
}

//Code for API calls
let weather = {
    apiKey: '313097412ec7cf1c389789e14abbfa99',
    fetchCurrentLocation: function() {
        let geo;
        navigator.geolocation.getCurrentPosition(position => {
            geo = position;
            let lat = geo.coords.latitude;
            let long = geo.coords.longitude;

            fetch('http://api.openweathermap.org/geo/1.0/reverse?lat=' + lat + '&lon=' + long + '&limit=1&appid=' + this.apiKey)
                .then(res => res.json())
                .then(data => {
                    let { name } = data[0];
                    this.fetchWeather(name);
                });
        });
    },
    fetchWeather: function(city) {
        fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + this.apiKey)
            .then(res => res.json())
            .then(data => this.displayWeather(data));
    },
    displayWeather: function(data) {
        let { name } = data;
        let { icon, description } = data.weather[0];
        let { temp, humidity } = data.main;
        let { speed } = data.wind;
        document.querySelector('#location').textContent = `Weather in ${name}`;
        document.querySelector('#temperature').textContent = `${temp.toFixed(0)} \u00B0C`;
        document.querySelector('#icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.querySelector('#weather-type').textContent = description;
        document.querySelector('#humidity').textContent = `Humidity: ${humidity}%`;
        document.querySelector('#wind-speed').textContent = `Wind speed: ${speed} km/h`;
        
        document.querySelector('#loading').style.display = 'none';
        document.querySelector('#weather-details-box').classList.remove('not-displayed');
    },
    fetchWeatherForecast: function(city) {
        fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=' + this.apiKey)
            .then(res => res.json())
            .then(data => this.displayWeatherForecast(data));
    },
    displayWeatherForecast: function(data) {
        let { list } = data;

        let currentDate = new Date().toString();
        let startIndex, startDate;
        for (let i = 0; i < 9; i++) {
            if (list[i]['dt_txt'].slice(8, 10) > currentDate.slice(8, 10)) {
                startIndex = i;
                startDate = list[i]['dt_txt'];
                break;
            }
        }

        document.querySelector('#weather-forecast-box').innerHTML = '';

        for (let i = startIndex; i < 24 + startIndex; i++) {
            let stepWeatherBox = document.createElement('div');
            stepWeatherBox.classList.add('weather-forecast-3h-step');

            let day = new Date(list[i].dt * 1000).toString().slice(0, 3);

            stepWeatherBox.innerHTML = `
                <div class='bordered'>
                    <p class='days'>${this.getWeekDay(day)}<span>${list[i].dt_txt.slice(11, 16)}</span></p>
                    <div class='temp-box'>
                        <h3 class='temperature'>${list[i].main.temp.toFixed(0)} \u00B0C</h3>
                        <img class='icon' src='https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png' alt='an icon describing the weather'>
                    </div>
                    <p class='weather-type'>${list[i].weather[0].description}</p>
                    <p class='humidity'>Humidity: ${list[i].main.humidity}%</p>
                    <p class='wind-speed'>Wind&nbsp;Speed:&nbsp;${list[i].wind.speed}&nbsp;km/h</p>
                </div>
            `
            document.querySelector('#weather-forecast-box').appendChild(stepWeatherBox);
        }

        let city = document.querySelector('#search-box input').value;
        this.fetchWeather(city);
        
        document.querySelector('#current-weather-box').classList.add('not-displayed');
    },
    getWeekDay: function(day) {
        switch(day) {
            case 'Mon': 
                return 'Monday';
            case 'Tue': 
                return 'Tuesday';
            case 'Wed': 
                return 'Wednesday';
            case 'Thu': 
                return 'Thursday';
            case 'Fri': 
                return 'Friday';
            case 'Sat': 
                return 'Saturday';
            default:
                return 'Sunday';
        }
    },
    searchWeather: function() {
        let steps = document.querySelectorAll('.weather-forecast-3h-step').length;
        if (steps) {
            this.fetchWeatherForecast(document.querySelector('#search-box input').value);
        }
        this.fetchWeather(document.querySelector('#search-box input').value);
    },
    addFavorites: function(city) {
        let option = document.createElement('option');
        option.textContent = `${city}`;
        option.setAttribute('value', `${city}`);

        let favorites = document.querySelectorAll('#favorites-select option');
        let bool = false;
        for (let i = 0; i < favorites.length; i++) {
            if(favorites[i].textContent === city) {
                bool = true;
            }
        }

        if (!bool) {
            document.querySelector('#favorites-select').appendChild(option);
        }
    },
    chooseFavorites: function(favorite) {
        let steps = document.querySelectorAll('.weather-forecast-3h-step').length;

        if (steps) {
            this.fetchWeatherForecast(favorite);
            document.querySelector('#search-box input').value = favorite;
        }
        this.fetchWeather(favorite);
        document.querySelector('#search-box input').value = favorite;
    }
}

weather.fetchCurrentLocation();

document.querySelector('#search-box button').addEventListener('click', function() {
    weather.searchWeather();
});

document.querySelector('#search-box input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        weather.searchWeather();
    }
});

document.querySelector('button#current-weather').addEventListener('click', function() {
    let city = document.querySelector('#location').textContent.toString().slice(11);
    weather.fetchWeather(city);
    document.querySelector('#weather-forecast-box').innerHTML = '';
    document.querySelector('#current-weather-box').classList.remove('not-displayed');
});

document.querySelector('button#weather-forecast').addEventListener('click', function() {
    let city = document.querySelector('#location').textContent.toString().slice(11);
    weather.fetchWeatherForecast(city);
    document.querySelector('#weather-forecast-box').style.display = 'flex';
});

document.querySelector('#favorites-box button').addEventListener('click', function() {
    let city = document.querySelector('#location').textContent.toString().slice(11);
    weather.addFavorites(city);
});

let favorites = document.querySelector('#favorites-select')

favorites.addEventListener('change', function() {
    let favorite = favorites.value;
    weather.chooseFavorites(favorite);
});
