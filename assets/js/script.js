const apiKey = '87a91f3a099377c012e0dad58f463a7d'; // Replace with your OpenWeather API key
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        getCityCoordinates(city);
    }
});

function getCityCoordinates(city) {
    fetch(`${apiBaseUrl}/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            getWeatherData(lat, lon);
            saveCityToHistory(city);
        })
        .catch(error => console.error('Error:', error));
}

function getWeatherData(lat, lon) {
    fetch(`${apiBaseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.list[0]);
            displayForecast(data.list);
        })
        .catch(error => console.error('Error:', error));
}

function displayCurrentWeather(weather) {
    const weatherInfo = `
        <h3>${weather.dt_txt}</h3>
        <img src="https://openweathermap.org/img/w/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
        <p>Temperature: ${Math.round(weather.main.temp - 273.15)}°C</p>
        <p>Humidity: ${weather.main.humidity}%</p>
        <p>Wind Speed: ${weather.wind.speed} m/s</p>
    `;
    document.getElementById('current-weather-info').innerHTML = weatherInfo;
}

function displayForecast(forecast) {
    let forecastHtml = '';
    for (let i = 0; i < forecast.length; i += 8) { // Every 8th entry is the next day
        const weather = forecast[i];
        forecastHtml += `
            <div class="forecast-day">
                <h4>${weather.dt_txt}</h4>
                <img src="https://openweathermap.org/img/w/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
                <p>Temperature: ${Math.round(weather.main.temp - 273.15)}°C</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind Speed: ${weather.wind.speed} m/s</p>
            </div>
        `;
    }
    document.getElementById('forecast-info').innerHTML = forecastHtml;
}

function saveCityToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateHistoryList();
    }
}

function updateHistoryList() {
    const historyList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const listElement = document.getElementById('history-list');
    listElement.innerHTML = historyList.map(city => `<li onclick="getCityCoordinates('${city}')">${city}</li>`).join('');
}

// Initialize search history on page load
updateHistoryList();
