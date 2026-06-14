/* ===========================
   SkyPulse — Weather App JS
   =========================== */

/* -------- State -------- */
let currentUnit = 'C';
let currentData = null;  // cached raw API data
let API_KEY = '';

/* -------- API Key Management -------- */
function loadApiKey() {
  API_KEY = localStorage.getItem('skypulse_api_key') || '';
  if (!API_KEY) {
    document.getElementById('apiModalOverlay').style.display = 'grid';
  } else {
    document.getElementById('apiModalOverlay').style.display = 'none';
  }
}

function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val || val.length < 20) {
    document.getElementById('apiKeyInput').style.borderColor = '#ff5050';
    return;
  }
  API_KEY = val;
  localStorage.setItem('skypulse_api_key', API_KEY);
  document.getElementById('apiModalOverlay').style.display = 'none';
}

/* -------- Utilities -------- */
const toC = k => (k - 273.15).toFixed(1);
const toF = k => ((k - 273.15) * 9 / 5 + 32).toFixed(1);

function displayTemp(kelvin) {
  return currentUnit === 'C' ? `${toC(kelvin)}°C` : `${toF(kelvin)}°F`;
}
function displayTempShort(kelvin) {
  return currentUnit === 'C' ? `${Math.round(+toC(kelvin))}°` : `${Math.round(+toF(kelvin))}°`;
}

function switchUnit(unit) {
  currentUnit = unit;
  document.getElementById('celsiusBtn').classList.toggle('active', unit === 'C');
  document.getElementById('fahrenheitBtn').classList.toggle('active', unit === 'F');
  if (currentData) renderAll(currentData);
}

function formatTime(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  return d.toUTCString().slice(17, 22);
}
function formatHour(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  const h = d.getUTCHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}${ampm}`;
}
function formatDay(unix) {
  const d = new Date(unix * 1000);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}
function localDateTime(offset) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const local = new Date(utc + offset * 1000);
  const date = local.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
  const time = local.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  return { date, time };
}

function msToBeaufort(speed) {
  if (speed < 0.5)  return 'Calm';
  if (speed < 1.6)  return 'Light Air';
  if (speed < 3.4)  return 'Light Breeze';
  if (speed < 5.5)  return 'Gentle Breeze';
  if (speed < 8.0)  return 'Moderate Breeze';
  if (speed < 10.8) return 'Fresh Breeze';
  if (speed < 13.9) return 'Strong Breeze';
  if (speed < 17.2) return 'High Wind';
  if (speed < 20.8) return 'Gale';
  return 'Storm';
}

function degToCompass(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function isNight(sunrise, sunset, offset) {
  const now = Math.floor(Date.now() / 1000);
  const localNow = now + offset;
  return localNow < sunrise + offset || localNow > sunset + offset;
}

/* -------- Weather Emoji & Theme -------- */
function weatherVisuals(id, isNightTime) {
  if (id >= 200 && id < 300) return { emoji: '⛈️', theme: 'storm', bg: 'var(--sky-storm)' };
  if (id >= 300 && id < 400) return { emoji: '🌦️', theme: 'rain',  bg: 'var(--sky-rain)'  };
  if (id >= 500 && id < 600) return { emoji: id >= 520 ? '🌧️' : '🌦️', theme: 'rain', bg: 'var(--sky-rain)' };
  if (id >= 600 && id < 700) return { emoji: '❄️', theme: 'snow',  bg: 'var(--sky-night)' };
  if (id >= 700 && id < 800) return { emoji: '🌫️', theme: '',     bg: 'var(--sky-rain)'  };
  if (id === 800) return isNightTime
    ? { emoji: '🌙', theme: 'night', bg: 'var(--sky-night)' }
    : { emoji: '☀️', theme: '',     bg: 'var(--sky-clear)'  };
  if (id === 801) return { emoji: '🌤️', theme: '',  bg: 'var(--sky-day)'   };
  if (id === 802) return { emoji: '⛅', theme: '',  bg: 'var(--sky-day)'   };
  if (id  >= 803) return { emoji: '☁️', theme: '',  bg: 'var(--sky-rain)'  };
  return { emoji: '🌡️', theme: '', bg: 'var(--sky-day)' };
}

function emojiForId(id) {
  return weatherVisuals(id, false).emoji;
}

/* -------- Sky Animations -------- */
function setupStars() {
  const layer = document.getElementById('starsLayer');
  if (layer.children.length) return;
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%; left:${Math.random()*100}%;
      animation-duration:${2 + Math.random() * 3}s;
      animation-delay:${Math.random() * 4}s;
    `;
    layer.appendChild(s);
  }
}
function setupRain() {
  const layer = document.getElementById('rainLayer');
  layer.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const d = document.createElement('div');
    d.className = 'raindrop';
    const h = 10 + Math.random() * 30;
    d.style.cssText = `
      left:${Math.random() * 100}%; top:${-h}px;
      height:${h}px;
      animation-duration:${0.5 + Math.random() * 0.8}s;
      animation-delay:${Math.random() * 2}s;
      opacity:${0.4 + Math.random() * 0.4};
    `;
    layer.appendChild(d);
  }
}
function setupSnow() {
  const layer = document.getElementById('snowLayer');
  layer.innerHTML = '';
  const flakes = ['❄','❅','❆','*'];
  for (let i = 0; i < 40; i++) {
    const f = document.createElement('div');
    f.className = 'snowflake';
    f.textContent = flakes[Math.floor(Math.random() * flakes.length)];
    f.style.cssText = `
      left:${Math.random() * 100}%;
      font-size:${8 + Math.random() * 14}px;
      animation-duration:${4 + Math.random() * 6}s;
      animation-delay:${Math.random() * 4}s;
      opacity:${0.5 + Math.random() * 0.5};
    `;
    layer.appendChild(f);
  }
}

let lightningInterval = null;
function startLightning() {
  if (lightningInterval) return;
  const el = document.getElementById('lightning');
  lightningInterval = setInterval(() => {
    if (Math.random() < 0.25) {
      el.style.opacity = '0.7';
      setTimeout(() => { el.style.opacity = '0.2'; }, 80);
      setTimeout(() => { el.style.opacity = '0';   }, 200);
    }
  }, 3000);
}
function stopLightning() {
  clearInterval(lightningInterval);
  lightningInterval = null;
}

function applyTheme(weatherId, nightTime) {
  const vis = weatherVisuals(weatherId, nightTime);
  const bg  = document.getElementById('skyBg');
  const starsL = document.getElementById('starsLayer');
  const rainL  = document.getElementById('rainLayer');
  const snowL  = document.getElementById('snowLayer');

  document.body.className = '';
  bg.style.background = vis.bg;

  starsL.style.opacity = vis.theme === 'night' ? '1' : '0';
  rainL.style.opacity  = vis.theme === 'rain'  || vis.theme === 'storm' ? '1' : '0';
  snowL.style.opacity  = vis.theme === 'snow'  ? '1' : '0';

  if (vis.theme === 'storm') startLightning();
  else stopLightning();

  if (vis.theme === 'night') setupStars();
  if (vis.theme === 'rain' || vis.theme === 'storm') setupRain();
  if (vis.theme === 'snow') setupSnow();
}

/* -------- Weather Facts -------- */
const FACTS = [
  "Lightning is 5× hotter than the surface of the Sun — reaching 30,000 Kelvin!",
  "A single cloud can weigh more than 500,000 kg, yet floats because the air below is denser.",
  "Antarctica is technically a desert — it receives less rainfall than the Sahara.",
  "Wind chill can make -10°C feel like -20°C due to increased heat loss from skin.",
  "The highest recorded temperature on Earth was 56.7°C in Death Valley, California (1913).",
  "Raindrops are not teardrop-shaped — they're actually spherical, or shaped like hamburger buns at larger sizes.",
  "A cubic mile of fog contains less than a gallon of water, spread across billions of droplets.",
  "The fastest wind gust ever recorded reached 408 km/h during Cyclone Olivia in 1996.",
  "Snow is always white — even colored snow (red/green) is just snow with microscopic algae.",
  "Humidity makes hot days feel hotter because sweat cannot evaporate as easily.",
  "The smell of rain (petrichor) is caused by geosmin, produced by soil bacteria.",
  "Hailstones have been found as large as grapefruits, capable of denting cars and breaking bones.",
];

function getWeatherFact(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return FACTS[0];
  if (weatherId >= 500 && weatherId < 600) return FACTS[10];
  if (weatherId >= 600 && weatherId < 700) return FACTS[8];
  return FACTS[Math.floor(Math.random() * FACTS.length)];
}

/* -------- AQI -------- */
function aqiInfo(aqi) {
  const levels = [
    { label:'Good',      color:'#00e676', desc:'Air quality is great — perfect for outdoor activities.' },
    { label:'Fair',      color:'#c6e040', desc:'Acceptable quality; minor concern for sensitive groups.' },
    { label:'Moderate',  color:'#ff9800', desc:'Sensitive individuals should limit prolonged outdoor exertion.' },
    { label:'Poor',      color:'#f44336', desc:'Everyone may begin to experience adverse health effects.' },
    { label:'Very Poor', color:'#9c27b0', desc:'Health alert — everyone should avoid outdoor activities.' },
  ];
  return levels[Math.min(aqi - 1, 4)];
}

/* -------- UV Index -------- */
function uvLabel(uv) {
  if (uv <= 2)  return `${uv} (Low)`;
  if (uv <= 5)  return `${uv} (Moderate)`;
  if (uv <= 7)  return `${uv} (High)`;
  if (uv <= 10) return `${uv} (Very High)`;
  return `${uv} (Extreme)`;
}

/* -------- Gauge Animation -------- */
function animateGauge(pct) {
  const total = 220;
  const fill = document.getElementById('gaugeFill');
  const text = document.getElementById('gaugeText');
  const offset = total - (total * pct / 100);
  fill.setAttribute('stroke-dashoffset', offset);
  text.textContent = pct + '%';
}

/* -------- Render All -------- */
function renderAll(data) {
  const { current, forecast, aqi } = data;
  const offset = current.timezone;
  const { date, time } = localDateTime(offset);
  const night = isNight(current.sys.sunrise, current.sys.sunset, offset);
  const vis   = weatherVisuals(current.weather[0].id, night);

  // Apply sky theme
  applyTheme(current.weather[0].id, night);

  // Hero
  document.getElementById('cityName').textContent    = current.name;
  document.getElementById('countryName').textContent = current.sys.country;
  document.getElementById('localDate').textContent   = date;
  document.getElementById('localTime').textContent   = time;
  document.getElementById('weatherEmoji').textContent = vis.emoji;
  document.getElementById('tempBig').textContent      = currentUnit === 'C' ? toC(current.main.temp) : toF(current.main.temp);
  document.getElementById('tempUnitLabel').textContent = `°${currentUnit}`;
  document.getElementById('conditionText').textContent = current.weather[0].description;
  document.getElementById('feelsLike').textContent     = displayTemp(current.main.feels_like);
  document.getElementById('humidity').textContent      = `${current.main.humidity}%`;
  document.getElementById('windSpeed').textContent     = `${(current.wind.speed * 3.6).toFixed(1)} km/h`;
  document.getElementById('visibility').textContent    = `${(current.visibility / 1000).toFixed(1)} km`;

  // Stats
  document.getElementById('sunrise').textContent   = formatTime(current.sys.sunrise, offset);
  document.getElementById('sunset').textContent    = formatTime(current.sys.sunset, offset);
  document.getElementById('pressure').textContent  = `${current.main.pressure} hPa`;
  document.getElementById('cloudCover').textContent = `${current.clouds.all}%`;
  document.getElementById('uvIndex').textContent    = uvLabel(Math.round(data.uv || 0));
  document.getElementById('windDir').textContent    = degToCompass(current.wind.deg || 0);

  // Compass
  const compassDeg = current.wind.deg || 0;
  document.getElementById('compassNeedle').style.transform = `rotate(${compassDeg}deg)`;
  document.getElementById('windInfoText').textContent =
    `${(current.wind.speed * 3.6).toFixed(1)} km/h  —  ${msToBeaufort(current.wind.speed)}`;

  // Gauge
  animateGauge(current.main.humidity);

  // Hourly (next 8 items = 24h)
  const hourlyEl = document.getElementById('hourlyScroll');
  hourlyEl.innerHTML = '';
  const now = Math.floor(Date.now() / 1000);
  forecast.list.slice(0, 8).forEach((h, i) => {
    const isNow = i === 0;
    const card = document.createElement('div');
    card.className = 'hour-card' + (isNow ? ' now' : '');
    card.innerHTML = `
      <div class="hour-time">${isNow ? 'Now' : formatHour(h.dt, offset)}</div>
      <div class="hour-emoji">${emojiForId(h.weather[0].id)}</div>
      <div class="hour-temp">${displayTempShort(h.main.temp)}</div>
      <div class="hour-rain">💧${Math.round((h.pop || 0) * 100)}%</div>
    `;
    hourlyEl.appendChild(card);
  });

  // 5-Day Forecast (daily grouped)
  const dayMap = {};
  forecast.list.forEach(item => {
    const key = formatDay(item.dt);
    if (!dayMap[key]) dayMap[key] = { items: [], id: item.weather[0].id, desc: item.weather[0].description };
    dayMap[key].items.push(item);
  });
  const forecastEl = document.getElementById('forecastGrid');
  forecastEl.innerHTML = '';
  Object.entries(dayMap).slice(0, 5).forEach(([day, info]) => {
    const temps = info.items.map(i => i.main.temp);
    const hi = Math.max(...temps), lo = Math.min(...temps);
    const row = document.createElement('div');
    row.className = 'forecast-row';
    row.innerHTML = `
      <span class="fc-day">${day}</span>
      <span class="fc-icon">${emojiForId(info.id)}</span>
      <span class="fc-desc">${info.desc}</span>
      <span class="fc-temp">
        <span class="hi">${displayTempShort(hi)}</span>
        <span class="lo">${displayTempShort(lo)}</span>
      </span>
    `;
    forecastEl.appendChild(row);
  });

  // AQI
  if (aqi && aqi.list && aqi.list[0]) {
    const aqiVal = aqi.list[0].main.aqi;
    const info = aqiInfo(aqiVal);
    document.getElementById('aqiNumber').textContent = aqiVal;
    document.getElementById('aqiLabel').textContent  = info.label;
    document.getElementById('aqiLabel').style.color  = info.color;
    document.getElementById('aqiDesc').textContent   = info.desc;
    // Move marker
    const pct = ((aqiVal - 1) / 4) * 100;
    document.getElementById('aqiFill').style.left = `calc(${pct}% - 6px)`;
  }

  // Fact
  document.getElementById('factText').textContent = getWeatherFact(current.weather[0].id);

  // Last updated
  document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
}

/* -------- Fetch Weather -------- */
async function fetchWeather(cityOverride) {
  if (!API_KEY) {
    document.getElementById('apiModalOverlay').style.display = 'grid';
    return;
  }

  const city = cityOverride || document.getElementById('cityInput').value.trim();
  if (!city) return;

  showLoader();
  hideError();

  try {
    // Current weather
    const curRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`
    );
    if (!curRes.ok) throw new Error(curRes.status === 404 ? 'City not found.' : 'API error. Check your key.');
    const cur = await curRes.json();

    const { lat, lon } = cur.coord;

    // Forecast
    const fcRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const fc = await fcRes.json();

    // AQI
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const aqiData = await aqiRes.json();

    // UV Index (OneCall if available, else estimate)
    let uv = 0;
    try {
      const uvRes = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const uvData = await uvRes.json();
      uv = uvData.value || 0;
    } catch (_) { uv = 0; }

    currentData = { current: cur, forecast: fc, aqi: aqiData, uv };
    renderAll(currentData);
    showWeather();
    document.getElementById('cityInput').value = cur.name;

  } catch (err) {
    showError(err.message || 'Something went wrong. Try again.');
    hideLoader();
  }
}

/* -------- Geolocation -------- */
async function getLocation() {
  if (!API_KEY) {
    document.getElementById('apiModalOverlay').style.display = 'grid';
    return;
  }
  if (!navigator.geolocation) {
    showError('Geolocation not supported by your browser.');
    return;
  }
  showLoader();
  hideError();
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude: lat, longitude: lon } = pos.coords;
    try {
      const curRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!curRes.ok) throw new Error('Could not get weather for your location.');
      const cur = await curRes.json();
      document.getElementById('cityInput').value = cur.name;
      await fetchWeather(cur.name);
    } catch (err) {
      showError(err.message);
      hideLoader();
    }
  }, () => {
    showError('Location access denied. Please search manually.');
    hideLoader();
  });
}

function quickSearch(city) {
  document.getElementById('cityInput').value = city;
  fetchWeather(city);
}

/* -------- UI State Helpers -------- */
function showLoader()  {
  document.getElementById('loader').classList.add('show');
  document.getElementById('weatherMain').style.display = 'none';
  document.getElementById('welcomeState').style.display = 'none';
}
function hideLoader()  { document.getElementById('loader').classList.remove('show'); }
function showWeather() {
  hideLoader();
  document.getElementById('weatherMain').style.display = 'block';
  document.getElementById('welcomeState').style.display = 'none';
}
function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  document.getElementById('errorToast').classList.add('show');
  setTimeout(() => document.getElementById('errorToast').classList.remove('show'), 5000);
}
function hideError()   { document.getElementById('errorToast').classList.remove('show'); }

/* -------- Init -------- */
loadApiKey();

// Auto-refresh every 10 min
setInterval(() => {
  if (currentData) {
    const city = document.getElementById('cityInput').value.trim();
    if (city) fetchWeather(city);
  }
}, 10 * 60 * 1000);
