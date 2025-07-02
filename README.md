# Weather Dashboard 🌤️

A modern, interactive weather dashboard that provides current weather information and 5-day forecasts with an integrated map view. Built with vanilla JavaScript, HTML, and CSS.

## Features ✨

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **5-Day Forecast**: View upcoming weather predictions
- **Interactive Map**: Explore weather on a rotatable map with satellite and street view options
- **Location Detection**: Automatically detect and display weather for your current location
- **Search History**: Keep track of previously searched cities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Map Rotation**: Rotate the map view using Ctrl + Drag for different perspectives

## Prerequisites 📋

Before running this project, you'll need:

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An active internet connection
- A WeatherAPI key (instructions below)

## Getting Started 🚀

### Step 1: Get Your API Key

1. Visit [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Navigate to your dashboard to get your API key
4. Copy the API key for the next step

### Step 2: Configure the API Key

1. Open the `script.js` file in your project
2. Find line 2 where it says:
   ```javascript
   const API_KEY = 'f3b72e1cc9c945fea3e10563925250612';
   ```
3. Replace the existing API key with your own:
   ```javascript
   const API_KEY = 'your_api_key_here';
   ```

### Step 3: Run the Application

1. **Option A: Direct File Opening**
   - Simply double-click the `index.html` file
   - It will open in your default web browser

2. **Option B: Local Server (Recommended)**
   - If you have Python installed:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -SimpleHTTPServer 8000
     ```
   - Open your browser and go to `http://localhost:8000`

3. **Option C: Live Server Extension**
   - If using VS Code, install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

## How to Use 📖

### Basic Weather Search

1. **Search for a City**
   - Type a city name in the search box
   - Click the "Search" button or press Enter
   - View current weather and 5-day forecast

2. **Use Search History**
   - Previously searched cities appear below the weather data
   - Click on any city name to quickly get its weather again

### Interactive Map Features

1. **Open the Map**
   - Click the map button (🗺️) in the top-right corner
   - The map overlay will appear with your current location (if permission granted)

2. **Map Controls**
   - **Close Map**: Click the × button or press Escape key
   - **Go to Location**: Click the 📍 button to center on your location
   - **Reset Rotation**: Click the 🧭 button to reset map orientation
   - **Layer Control**: Use the satellite button to switch between street and satellite views

3. **Map Rotation**
   - Hold Ctrl key and drag on the map to rotate the view
   - The rotation indicator will appear when Ctrl is held
   - Weather markers stay upright while the map rotates
   - Use the reset button to return to normal orientation

4. **Location Features**
   - The app will request location permission on first use
   - Your exact location is marked with a pulsing circle
   - Weather data is fetched for your precise GPS coordinates
   - Accuracy circle shows the precision of your location

## File Structure 📁

```
Weather Dashboard/
│
├── index.html          # Main HTML structure
├── script.js           # JavaScript functionality
├── style.css           # Styling and animations
└── README.md          # This documentation file
```

## Technologies Used 🛠️

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with glassmorphism effects
- **JavaScript (ES6+)**: Interactive functionality
- **Leaflet.js**: Interactive maps
- **WeatherAPI**: Weather data source
- **OpenStreetMap**: Map tiles
- **Google Fonts**: Poppins font family

## Key Features Explained 🔍

### Weather Data
- Current conditions including temperature, humidity, and wind speed
- 5-day forecast with daily high temperatures
- Weather icons for visual representation

### Map Integration
- Street view and satellite imagery options
- Rotatable map with Ctrl + Drag functionality
- Precise GPS location detection
- Weather markers with popup information
- Smooth animations and transitions

### User Experience
- Glassmorphism design with blur effects
- Responsive layout for all screen sizes
- Keyboard shortcuts (Enter for search, Escape to close map)
- Visual feedback for all interactions
- Search history persistence using localStorage

## Browser Support 🌐

This application works on all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting 🔧

### Common Issues

1. **Weather data not loading**
   - Check your API key is correctly set in `script.js`
   - Ensure you have an active internet connection
   - Verify the city name is spelled correctly

2. **Location not detected**
   - Allow location permission when prompted
   - Check if location services are enabled in your browser
   - Try manually searching for your city

3. **Map not displaying**
   - Ensure JavaScript is enabled in your browser
   - Check console for any error messages
   - Try refreshing the page

### Error Messages

- **"Could not find weather data"**: The city name wasn't recognized
- **Location permission errors**: Allow location access in browser settings

## API Usage 📊

This application uses the WeatherAPI.com service:
- **Free tier**: 1 million calls per month
- **Rate limit**: 1 request per second
- **Data includes**: Current weather, forecasts, location data

## Contributing 🤝

Feel free to contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is open source and available under the MIT License.

## Acknowledgments 🙏

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Maps powered by [Leaflet](https://leafletjs.com/) and [OpenStreetMap](https://www.openstreetmap.org/)
- Icons and fonts from Google Fonts
- Glassmorphism design inspiration from modern UI trends

---

**Enjoy exploring the weather with your new dashboard!** 🌈
