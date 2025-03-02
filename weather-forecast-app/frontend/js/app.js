document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
    });
    // Fetch location data on document load
    async function fetchLocationData() {
      try {
      // Get the user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`/api/location/${latitude},${longitude}`);
        const data = await response.json();
        console.log('Location data:', data);
        // Process the location data as needed
        }, (error) => {
        console.error('Error getting location:', error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
      } catch (error) {
      console.error('Error fetching location data:', error);
      }
    }

    // Call the function to fetch location data
    fetchLocationData();
    // Forecast Tabs
    document.querySelectorAll('.forecast-tabs button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.tab-active').classList.remove('tab-active');
            button.classList.add('tab-active');
        });
    });

    // Initialize
    body.setAttribute('data-theme', 'light');
});

// Update script.js with API integration
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
  
    // Forecast Tabs Functionality
    const forecastResults = document.querySelector('.forecast-results');
    
    document.querySelectorAll('.forecast-tabs button').forEach(button => {
      button.addEventListener('click', async () => {
        // Remove active class from all buttons
        document.querySelectorAll('.forecast-tabs button').forEach(b => 
          b.classList.remove('tab-active'));
        
        // Add active class to clicked button
        button.classList.add('tab-active');
        
        // Get data period from button's dataset
        const period = button.dataset.period;
        
        try {
          // Show loading state
          forecastResults.innerHTML = '<div class="loading">Loading...</div>';
          
          // Fetch data from API
          const response = await fetch(`/api/forecast?period=${period}`);
          const data = await response.json();
          
          // Update results container
          forecastResults.innerHTML = renderForecastData(data);
        } catch (error) {
          forecastResults.innerHTML = 
            '<div class="error">Error loading forecast</div>';
        }
      });
    });
  
    // Example render function
    function renderForecastData(data) {
      return data.map(day => `
        <div class="forecast-day">
          <div class="date">${day.date}</div>
          <div class="temp-range">${day.minTemp}° - ${day.maxTemp}°</div>
          <div class="condition">${day.condition}</div>
        </div>
      `).join('');
    }
  });


  // Login page scripts
  // Authentication Toggle
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// Form Submission Handling
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your authentication logic here
        console.log('Form submitted:', e.target.id);
    });
});