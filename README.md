# 🌤 SkyPulse — Live Weather App

A beautiful, fully-featured weather app built with **vanilla HTML, CSS, and JavaScript**. No frameworks, no build tools — just open and run.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 **City Search** | Search any city in the world |
| 📍 **Geolocation** | One-click "use my location" |
| 🌡️ **Current Weather** | Temp, feels-like, humidity, wind, visibility |
| ⏱ **Hourly Forecast** | Next 24 hours (8 data points) |
| 📅 **5-Day Forecast** | Daily high/low + conditions |
| 🌬️ **Wind Compass** | Animated directional needle |
| 💧 **Humidity Gauge** | Animated SVG arc gauge |
| 🏭 **Air Quality Index** | AQI with colour-coded levels |
| 🌅 **Sunrise / Sunset** | Local times for the searched city |
| 🔆 **UV Index** | With severity label |
| 🌦 **Animated Sky** | Background changes with weather (rain, snow, storm, night, clear) |
| ⚡ **Lightning Effect** | Flickers during thunderstorm conditions |
| ❄️ **Snow / Rain Animation** | Particle effects matching real conditions |
| 🌙 **Night Mode** | Automatically switches to star-filled night sky |
| °C / °F | Instant unit toggle — no page reload |
| 💡 **Weather Facts** | Fun fact card relevant to current conditions |
| 🔄 **Auto-refresh** | Updates every 10 minutes |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |

---

## 🚀 Getting Started

### Step 1 — Get a Free API Key

1. Go to [openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a **free account**
3. Copy your API key from the dashboard (looks like `3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d`)
4. Keys activate within ~10 minutes of signing up

### Step 2 — Run the App

**Option A — Double click:**  
Just open `index.html` in any modern browser. No server needed!

**Option B — Local server (recommended):**
```bash
# Using Python
python3 -m http.server 8080
# Then open http://localhost:8080

# Using Node.js (npx)
npx serve .
```

### Step 3 — Enter Your API Key

When the app opens, a modal will prompt you for your OpenWeatherMap API key. Paste it in and click **Save & Start**. Your key is stored in `localStorage` and never leaves your browser.

---

## 📁 Project Structure

```
weather-app/
├── index.html      # App markup & layout
├── style.css       # All styles (glassmorphism, animations, responsive)
├── app.js          # All logic (API calls, rendering, animations)
└── README.md       # This file
```

---

## 🔌 APIs Used

| API | Endpoint | Purpose |
|---|---|---|
| OpenWeatherMap | `/data/2.5/weather` | Current conditions |
| OpenWeatherMap | `/data/2.5/forecast` | 5-day / 3-hourly forecast |
| OpenWeatherMap | `/data/2.5/air_pollution` | Air Quality Index |
| OpenWeatherMap | `/data/2.5/uvi` | UV Index |
| Browser Geolocation API | native | "Use my location" |

All are available on the **free tier** of OpenWeatherMap.

---

## 🎨 Design Highlights

- **Glassmorphism** cards with `backdrop-filter: blur`
- **Sky changes dynamically** with weather conditions
- **Animated clouds** drift across the background
- **Stars appear** at night with a twinkling effect
- **Rain particles** fall during rain/drizzle conditions
- **Snow flakes** flutter during snow conditions
- **Lightning flickers** during thunderstorm conditions
- **Typography**: DM Serif Display (headings) + Space Grotesk (body)

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome/Safari | ✅ Full |

---

## 🔒 Privacy

- Your API key is stored only in your browser's `localStorage`
- No data is sent to any third party other than OpenWeatherMap
- No analytics, no tracking, no cookies

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Credits

- Weather data by [OpenWeatherMap](https://openweathermap.org)
- Fonts by [Google Fonts](https://fonts.google.com)
- Icons: emoji (native OS)

---

*Built with ♥ using vanilla JS — no frameworks required.*
