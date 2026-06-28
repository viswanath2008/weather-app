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
