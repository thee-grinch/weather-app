document.addEventListener('DOMContentLoaded', () => {
  // Theme Configuration
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // DOM Elements
  const forecastResults = document.querySelector('.forecast-results');
  const forecastTabs = document.querySelectorAll('.forecast-tabs button');

  // Shared Location Functions
  async function getLocation() {
      return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  position => resolve(position.coords),
                  error => reject(error)
              );
          } else {
              reject(new Error('Geolocation not supported'));
          }
      });
  }

  // Data Fetching
  async function fetchWeatherData(endpoint, period = 'today') {
      try {
          const { latitude, longitude } = await getLocation();
          const response = await fetch(`/api/${endpoint}/${latitude},${longitude}?period=${period}`);
          return await response.json();
      } catch (error) {
          console.error(`Error fetching ${endpoint} data:`, error);
          throw error;
      }
  }

  // UI Updates
  function updateCurrentWeather(data) {
      const elements = {
          location: `📍 ${data.location.name}, ${data.location.region}, ${data.location.country}`,
          lastTimeUpdate: `Last updated: ${data.collected_at}`,
          temperature: `${data.temp_c}°C`,
          feelsLike: `Feels like: ${data.feels_like_c}°C`,
          conditionText: data.condition_text,
          forecastTime: `Forecast for ${data.next_hour_forecast.time}`,
          forecastConditionIcon: data.next_hour_forecast.condition.icon,
          forecastConditionTemp: `${data.next_hour_forecast.temp_c}°C`,
          pressure: `${data.pressure_mb} mb`,
          humidity: `${data.humidity}%`,
          wind: `${data.wind_kph} km/h`,
          visibility: `${data.visibility_km} km`,
          airQuality: data.air_quality.pm2_5
      };

      Object.entries(elements).forEach(([id, value]) => {
          const el = document.getElementById(id);
          if (el) el[id === 'forecastConditionIcon' ? 'src' : 'textContent'] = value;
      });
      const loading = document.getElementById('loading')
      loading.style.display = 'none'
      const content = document.getElementById('container')
        content.style.display = 'block'
  }

  function renderForecastData(data) {
      return data.map(day => `
          <div class="forecast-day">
              <div class="icon-holder">
                  <img src="${day.condition.icon}" alt="${day.condition.text}">
                  <div class="time-holder">
                      <div class="time">${day.time}</div>
                      <div class="condition">${day.condition.text}</div>
                  </div>
              </div>
              <div class="temp-holder">
                  <div class="temp">${day.temp_c}°C</div>
                  <div class="wind-humidity">
                      <div class="wind">Wind<span>${day.wind_kph} km/h</span></div>
                      <div class="humidity">Humidity<span>${day.humidity}%</span></div>
                  </div>
              </div>
          </div>
      `).join('');
  }
  function renderTenDayForecast(forecastData) {
    
    return forecastData.map(day => `
      <div class="forecast-day">
        <div class="date">${day.date}</div>
        <div class="icon-holder">
          <img src="${day.condition.icon}" alt="${day.condition.text}">
          <div class="condition">${day.condition.text}</div>
        </div>
        <div class="temp-holder">
          <div class="max-temp">Max: ${day.max_temp}°C</div>
          <div class="min-temp">Min: ${day.min_temp}°C</div>
        </div>
        <div class="astro-holder">
          <div class="sunrise">Sunrise: ${day.sunrise}</div>
          <div class="sunset">Sunset: ${day.sunset}</div>
        </div>
      </div>
    `).join('');
  }

  // Event Handlers
  function handleTabClick(period) {
    console.log("period", period);
    return async function () {  // Use a regular function here
      console.log('tab clicked', period);
      forecastTabs.forEach(b => b.classList.remove('tab-active'));
      this.classList.add('tab-active'); // 'this' now correctly refers to the button
  
      try {
        forecastResults.innerHTML = '<div class="loading">Loading...</div>';
        const { data } = await fetchWeatherData(`forecast`, period);
        if (period === '10-days') {
          console.log("10 days", data);
          forecastResults.innerHTML = renderTenDayForecast(data);
          return;
        } else {
          forecastResults.innerHTML = renderForecastData(data);
        }
      } catch {
        forecastResults.innerHTML = '<div class="error">Error loading forecast</div>';
      }
    };
  }
  
  // Initialization
  function initialize() {
      // Theme Setup
      body.setAttribute('data-theme', 'light');
      themeToggle.addEventListener('click', () => {
          body.setAttribute('data-theme', 
              body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
          );
      });

      // Load Initial Data
      (async () => {
          try {
              const currentData = await fetchWeatherData('current');
              updateCurrentWeather(currentData);
              
              const forecastData = await fetchWeatherData('forecast');
              forecastResults.innerHTML = renderForecastData(forecastData.data);
          } catch (error) {
              console.error('Initialization error:', error);
          }
      })();

      // Tab Navigation
      forecastTabs.forEach(button => {
          button.addEventListener('click', handleTabClick(button.dataset.period));
      });
  }

  initialize();
});


//login code
// auth.js
const API_BASE_URL = "/api";

// DOM Elements
const registerForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("signupBtn");
const protectedContent = document.getElementById("protected-content");
const userInfo = document.getElementById("user-info");
const errorMessage = document.getElementById("error-message");


// Toggle between Login and Signup
function toggleAuthForms() {
  const loginSection = document.getElementById("loginForm");
  const signupSection = document.getElementById("signupForm");

  if (loginSection && signupSection) {
    loginSection.classList.toggle("hidden");
    signupSection.classList.toggle("hidden");
  }
}

// Event Listeners for Toggle Buttons
if (loginBtn) {
  console.log("loginBtn", loginBtn);
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAuthForms();
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAuthForms();
  });
}
// Register User
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const userData = {
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password")
        };
        console.log("userData", userData);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Registration failed");
            }

            const data = await response.json();
            showMessage("Registration successful! Please login.", "success");
            registerForm.reset();
        } catch (error) {
            showMessage(error.message, "error");
        }
    });
}

// Login User
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get("username"),
            password: formData.get("password")
        };
        console.log("credentials", credentials);
        console.log(new URLSearchParams(credentials), "new URLSearchParams(credentials)");
        try {
            const response = await fetch(`${API_BASE_URL}/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(credentials)
     
              });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Login failed");
            }

            const { access_token } = await response.json();
            localStorage.setItem("access_token", access_token);
            window.location.href = "/";
            showMessage("Login successful!", "success");
            loadProtectedContent();
        } catch (error) {
            showMessage(error.message, "error");
        }
    });
}

// Load Protected Content
async function loadProtectedContent() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        showMessage("Please login to access this content", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        displayUserInfo(userData);
    } catch (error) {
        showMessage(error.message, "error");
        localStorage.removeItem("access_token");
    }
}

// Display User Info
function displayUserInfo(user) {
    if (protectedContent) {
        protectedContent.style.display = "block";
    }
    if (userInfo) {
        userInfo.innerHTML = `
            <p>Username: ${user.username}</p>
            <p>Email: ${user.email}</p>
        `;
    }
}

// Show Messages
function showMessage(message, type) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.className = type; // 'success' or 'error'
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 5000);
    }
}

// Check Authentication on Page Load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("access_token")) {
        loadProtectedContent();
    }
});

// Logout
function logout() {
    localStorage.removeItem("access_token");
    if (protectedContent) {
        protectedContent.style.display = "none";
    }
    if (userInfo) {
        userInfo.innerHTML = "";
    }
    showMessage("Logged out successfully", "success");
}
