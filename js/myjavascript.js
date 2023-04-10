//Code for changing themes
let themes = document.getElementById('floatingSelect');

themes.addEventListener('change', changeTheme);

function changeTheme() {
    let theme = themes.value;

    document.querySelector('body').style.backgroundImage = `url('./images/${theme}.jpg')`;

    let title = document.querySelector('h1');
    switch (theme) {
        case 'night':
            title.style.color = '#b5b3b3';
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
        document.querySelector('#weather-type').textContent = description.replace(description.charAt(0), description.charAt(0).toUpperCase());
        document.querySelector('#humidity').textContent = `Humidity: ${humidity}%`;
        document.querySelector('#wind-speed').textContent = `Wind speed: ${speed} km/h`;
    }
}

weather.fetchCurrentLocation();

document.querySelector('#search-box button').addEventListener('click', function() {
    let city = document.querySelector('#search-box input').value;
    weather.fetchWeather(city);
});

document.querySelector('#search-box input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        let city = document.querySelector('#search-box input').value;
        weather.fetchWeather(city);
    }
});


