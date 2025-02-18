document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
    });

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