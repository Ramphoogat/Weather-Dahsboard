document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'f3b72e1cc9c945fea3e105639252506';
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const weatherContainer = document.getElementById('weather-container');
    const historyList = document.getElementById('history-list');

    let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    let map;
    let markers = [];
    let mapInitialized = false;
    let userLocation = null; // Store user's current location

    const getWeatherData = async (city) => {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            displayWeather(data);
            addToHistory(city);
            addWeatherToMap(data);
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            weatherContainer.innerHTML = `<p>Could not find weather data for "${city}". Please try another city.</p>`;
        }
    };

    const displayWeather = (data) => {
        const { location, current, forecast } = data;

        const currentWeatherHTML = `
            <div class="current-weather">
                <h2>${location.name}, ${location.country}</h2>
                <div class="details">
                    <img src="https:${current.condition.icon}" alt="${current.condition.text}">
                    <div class="temp">${Math.round(current.temp_c)}°C</div>
                    <div class="info">
                        <p><strong>Condition:</strong> ${current.condition.text}</p>
                        <p><strong>Humidity:</strong> ${current.humidity}%</p>
                        <p><strong>Wind:</strong> ${current.wind_kph} kph</p>
                    </div>
                </div>
            </div>
        `;

        const forecastHTML = forecast.forecastday.map(day => `
            <div class="forecast-card">
                <h4>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</h4>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <div class="temp">${Math.round(day.day.maxtemp_c)}°C</div>
            </div>
        `).join('');

        weatherContainer.innerHTML = `${currentWeatherHTML}<div class="forecast-container">${forecastHTML}</div>`;
    };

    const addToHistory = (city) => {
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
            renderHistory();
        }
    };

    const renderHistory = () => {
        historyList.innerHTML = '';
        searchHistory.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => getWeatherData(city));
            historyList.appendChild(li);
        });
    };

    const handleSearch = () => {
        const cityName = cityInput.value.trim();
        if (cityName) {
            getWeatherData(cityName);
            cityInput.value = '';
        } else {
            alert('Please enter a city name.');
        }
    };

    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    const initializeMap = () => {
        if (!mapInitialized) {
            map = L.map('weather-map').setView([40.7128, -74.0060], 4);
            
            // Define base layers
            const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            });
            
            const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri, Maxar, Earthstar Geographics, and the GIS User Community',
                maxZoom: 19
            });
            
            // Add default layer
            streetMap.addTo(map);
            
            // Create layer control
            const baseLayers = {
                "Street Map": streetMap,
                "Satellite": satelliteMap
            };
            
            L.control.layers(baseLayers, null, {
                position: 'bottomright'
            }).addTo(map);
            
            // Add rotation functionality
            initializeRotation();
            
            mapInitialized = true;
            loadNearbyWeather();
        }
    };

    const addWeatherToMap = (data) => {
        if (!mapInitialized) return;
        
        const { location, current } = data;
        const lat = location.lat;
        const lon = location.lon;

        clearMarkers();

        const weatherIcon = L.divIcon({
            html: `
                <div class="weather-marker">
                    <img src="https:${current.condition.icon}" alt="${current.condition.text}" style="width: 40px; height: 40px;">
                    <div class="weather-temp">${Math.round(current.temp_c)}°C</div>
                </div>
            `,
            className: 'custom-weather-marker',
            iconSize: [60, 80],
            iconAnchor: [30, 40]
        });

        const marker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);
        
        const popupContent = `
            <div class="weather-popup">
                <h3>${location.name}, ${location.country}</h3>
                <img src="https:${current.condition.icon}" alt="${current.condition.text}">
                <p><strong>${Math.round(current.temp_c)}°C</strong></p>
                <p>${current.condition.text}</p>
                <p><strong>Humidity:</strong> ${current.humidity}%</p>
                <p><strong>Wind:</strong> ${current.wind_kph} kph</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
        
        // Apply current rotation to new marker after it's rendered
        setTimeout(() => {
            if (marker._icon && currentBearing !== 0) {
                marker._icon.style.transform = `rotate(${-currentBearing}deg)`;
            }
        }, 100);

        map.setView([lat, lon], 8);
    };

    const clearMarkers = () => {
        if (!mapInitialized) return;
        
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];
    };

    const loadNearbyWeather = async () => {
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };
            
            navigator.geolocation.getCurrentPosition(async (position) => {
                const exactLat = position.coords.latitude;
                const exactLon = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                
                try {
                    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${exactLat},${exactLon}`);
                    if (response.ok) {
                        const data = await response.json();
                        // Pass exact coordinates to use for marker positioning
                        addCurrentLocationToMap(data, exactLat, exactLon, accuracy);
                    }
                } catch (error) {
                    console.error('Failed to fetch location weather:', error);
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                // Fallback to default location
                console.log('Using default location due to geolocation error');
            }, options);
        }
    };

    const addCurrentLocationToMap = (data, exactLat, exactLon, accuracy) => {
        if (!mapInitialized) return;
        
        const { location, current } = data;
        
        // Use exact GPS coordinates instead of API location coordinates
        const lat = exactLat || location.lat;
        const lon = exactLon || location.lon;
        
        // Store user location for the locate button
        userLocation = { lat, lon, accuracy };
        
        const currentLocationIcon = L.divIcon({
            html: `
                <div class="current-location-marker-circle">
                    <div class="location-pulse"></div>
                    <div class="location-center">
                        <img src="https:${current.condition.icon}" alt="${current.condition.text}" class="weather-icon-circle">
                        <div class="weather-temp-circle">${Math.round(current.temp_c)}°</div>
                    </div>
                </div>
            `,
            className: 'custom-current-location-marker',
            iconSize: [80, 80],
            iconAnchor: [40, 40]
        });

        const marker = L.marker([lat, lon], { icon: currentLocationIcon }).addTo(map);
        
        // Add accuracy circle if available
        if (accuracy && accuracy < 1000) {
            const accuracyCircle = L.circle([lat, lon], {
                radius: accuracy,
                color: '#2575fc',
                fillColor: '#2575fc',
                fillOpacity: 0.1,
                weight: 2,
                opacity: 0.5
            }).addTo(map);
            markers.push(accuracyCircle);
        }
        
        const popupContent = `
            <div class="weather-popup">
                <h3>📍 Your Exact Location</h3>
                <p>${location.name}, ${location.country}</p>
                <p><small>Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}</small></p>
                ${accuracy ? `<p><small>Accuracy: ±${Math.round(accuracy)}m</small></p>` : ''}
                <img src="https:${current.condition.icon}" alt="${current.condition.text}">
                <p><strong>${Math.round(current.temp_c)}°C</strong></p>
                <p>${current.condition.text}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
        
        // Apply current rotation to new marker after it's rendered
        setTimeout(() => {
            if (marker._icon && currentBearing !== 0) {
                marker._icon.style.transform = `rotate(${-currentBearing}deg)`;
            }
        }, 100);
        
        // Auto-center map on user location with smooth animation
        const zoomLevel = accuracy && accuracy < 100 ? 16 : accuracy && accuracy < 500 ? 14 : 12;
        map.flyTo([lat, lon], zoomLevel, {
            animate: true,
            duration: 2
        });
    };

    // Map rotation functionality
    let currentBearing = 0;
    let isRotating = false;
    let rotationStartPoint = null;
    
    const initializeRotation = () => {
        const mapContainer = document.querySelector('.map-container');
        const rotationIndicator = document.getElementById('rotation-indicator');
        const mapElement = document.getElementById('weather-map');
        
        // Initialize tilePane rotation setup when map is ready
        map.whenReady(() => {
            const tilesPane = map.getPane('tilePane');
            if (tilesPane) {
                tilesPane.style.transformOrigin = 'center center';
            }
        });
        
        // Show rotation indicator when Ctrl is held
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && !rotationIndicator.classList.contains('show')) {
                rotationIndicator.classList.add('show');
                mapContainer.classList.add('rotation-mode');
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (!e.ctrlKey) {
                rotationIndicator.classList.remove('show');
                mapContainer.classList.remove('rotation-mode');
                isRotating = false;
            }
        });
        
        // Mouse events for rotation
        mapElement.addEventListener('mousedown', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                isRotating = true;
                rotationStartPoint = { x: e.clientX, y: e.clientY };
                mapContainer.classList.add('rotation-mode');
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isRotating && e.ctrlKey && rotationStartPoint && map) {
                e.preventDefault();
                
                const deltaX = e.clientX - rotationStartPoint.x;
                const rotationAmount = deltaX * 0.8; // Adjust sensitivity
                
                currentBearing += rotationAmount;
                
                // Normalize bearing to 0-360 degrees
                currentBearing = ((currentBearing % 360) + 360) % 360;
                
                // Apply rotation to tilePane for geographical rotation
                const tilesPane = map.getPane('tilePane');
                if (tilesPane) {
                    tilesPane.style.transform = `rotate(${currentBearing}deg)`;
                }
                
                // Update all existing markers to counter-rotate so they stay upright
                updateMarkerRotations();
                
                rotationStartPoint = { x: e.clientX, y: e.clientY };
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isRotating) {
                isRotating = false;
                rotationStartPoint = null;
            }
        });
    };
    
    const updateMarkerRotations = () => {
        // Counter-rotate all markers so they remain upright
        markers.forEach(marker => {
            if (marker._icon) {
                marker._icon.style.transform = `rotate(${-currentBearing}deg)`;
            }
        });
    };
    
    const resetRotation = () => {
        currentBearing = 0;
        const tilesPane = map.getPane('tilePane');
        if (tilesPane) {
            tilesPane.style.transition = 'transform 0.5s ease';
            tilesPane.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                tilesPane.style.transition = '';
                updateMarkerRotations();
            }, 500);
        }
    };

    // Map toggle functionality
    const mapToggleBtn = document.getElementById('map-toggle-btn');
    const mapOverlay = document.getElementById('map-overlay');
    const mapCloseBtn = document.getElementById('map-close-btn');
    const locateBtn = document.getElementById('locate-btn');
    const resetRotationBtn = document.getElementById('reset-rotation-btn');

    const openMap = () => {
        mapOverlay.classList.remove('hidden');
        if (!mapInitialized) {
            setTimeout(() => {
                initializeMap();
                // Force map to resize after overlay is visible
                if (map) {
                    map.invalidateSize();
                }
            }, 100);
        } else if (map) {
            // Resize map when overlay becomes visible
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    };

    const closeMap = () => {
        mapOverlay.classList.add('hidden');
    };

    // Locate button functionality
    const goToUserLocation = () => {
        if (userLocation && mapInitialized && map) {
            const zoomLevel = userLocation.accuracy && userLocation.accuracy < 100 ? 16 : 
                             userLocation.accuracy && userLocation.accuracy < 500 ? 14 : 12;
            
            map.flyTo([userLocation.lat, userLocation.lon], zoomLevel, {
                animate: true,
                duration: 1.5
            });
        } else if (!userLocation) {
            // If no stored location, try to get current location again
            loadNearbyWeather();
        }
    };

    mapToggleBtn.addEventListener('click', openMap);
    mapCloseBtn.addEventListener('click', closeMap);
    locateBtn.addEventListener('click', goToUserLocation);
    resetRotationBtn.addEventListener('click', resetRotation);
    
    // Close map when clicking outside the map container
    mapOverlay.addEventListener('click', (e) => {
        if (e.target === mapOverlay) {
            closeMap();
        }
    });

    // Close map with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mapOverlay.classList.contains('hidden')) {
            closeMap();
        }
    });

    // Initial render of search history
    renderHistory();
});
