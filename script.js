// API Configuration
const API_KEY = 'b02eaab6bb2b04116ac838ebec409236';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Event Listeners
searchBtn.addEventListener('click', () => {
    handleSearch();
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main Search Handler
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading(true);
    hideError();
    hideWeather();

    try {
        console.log('Searching for city:', city);
        const weatherData = await getWeatherData(city);
        console.log('Weather data received:', weatherData);
        displayWeather(weatherData);
        cityInput.value = '';
    } catch (error) {
        console.error('Error in handleSearch:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fetch Weather Data
async function getWeatherData(city) {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    console.log('Making request to:', url);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Response status:', response.status);
        console.log('Response data:', data);
        
        if (!response.ok) {
            if (data.message === 'city not found') {
                throw new Error(`❌ City "${city}" not found. Please check spelling.`);
            }
            throw new Error(data.message || 'Failed to fetch weather data');
        }
        
        if (!data.main || !data.weather) {
            throw new Error('Invalid data received from API');
        }
        
        return data;
        
    } catch (error) {
        console.error('Fetch error:', error);
        if (error instanceof TypeError) {
            throw new Error('Network error - check your internet connection');
        }
        throw error;
    }
}

// Display Weather Data
function displayWeather(data) {
    try {
        const { name, sys, main, weather, wind, clouds, visibility } = data;
        
        if (!name || !sys || !main || !weather) {
            throw new Error('Missing required weather data');
        }

        const temp = Math.round(main.temp);
        const feelsLike = Math.round(main.feels_like);
        const description = weather[0].description;
        const humidity = main.humidity;
        const windSpeed = Math.round(wind.speed);
        const cloudiness = clouds.all;
        const pressure = main.pressure;
        const vis = Math.round(visibility / 1000);
        const country = sys.country;

        const html = `
            <div class="weather-info">
                <div class="city-name">📍 ${name}, ${country}</div>
                <div class="temperature">${temp}°C</div>
                <div class="weather-description">${description}</div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">🌡️ Feels Like</div>
                    <div class="detail-value">${feelsLike}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">💧 Humidity</div>
                    <div class="detail-value">${humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">💨 Wind Speed</div>
                    <div class="detail-value">${windSpeed} m/s</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">☁️ Clouds</div>
                    <div class="detail-value">${cloudiness}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">🔽 Pressure</div>
                    <div class="detail-value">${pressure} hPa</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">👁️ Visibility</div>
                    <div class="detail-value">${vis} km</div>
                </div>
            </div>
        `;

        weatherContainer.innerHTML = html;
        weatherContainer.classList.add('show');
        console.log('Weather displayed successfully');
        
    } catch (error) {
        console.error('Display error:', error);
        showError('Error displaying weather data: ' + error.message);
    }
}

// UI Helper Functions
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    console.log('Showing error:', message);
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

function hideWeather() {
    weatherContainer.classList.remove('show');
    weatherContainer.innerHTML = '';
}

// Log when page loads
console.log('Weather app loaded successfully');
console.log('API Key:', API_KEY ? 'Set' : 'Not set');
console.log('API URL:', API_BASE_URL);
