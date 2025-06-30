const apiKey = "f7f976931d7c814c412b0b2514935540";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    const { coord, name, sys, weather, main, wind, clouds } = data;

    const iconMap = {
      Clear: "clear.png",
      Clouds: "cloud.png",
      Rain: "snow.png",
      Drizzle: "snow.png",
      Thunderstorm: "snow.png"
    };
    const iconName = iconMap[weather[0].main] || "clear.png";
    document.getElementById("weatherIcon").src = `assets/${iconName}`;

    document.getElementById("temperature").textContent = `${Math.round(main.temp)}°C`;
    document.getElementById("condition").textContent = weather[0].main;
    document.getElementById("location").textContent = `${name}, ${sys.country}`;

    document.getElementById("detail_city").textContent = name;
    document.getElementById("detail_cloud").textContent = `${clouds.all}%`;
    document.getElementById("detail_feels").textContent = `${Math.round(main.feels_like)}°C`;
    document.getElementById("detail_humidity").textContent = `${main.humidity}%`;
    document.getElementById("detail_max").textContent = `${Math.round(main.temp_max)}°C`;
    document.getElementById("detail_min").textContent = `${Math.round(main.temp_min)}°C`;
    document.getElementById("detail_sunrise").textContent = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("detail_sunset").textContent = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("detail_temp").textContent = `${Math.round(main.temp)}°C`;
    document.getElementById("detail_wind").textContent = `${wind.deg}°`;

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,daily,alerts&units=metric&appid=${apiKey}`);
    const forecastData = await forecastRes.json();

    const hourlyChart = document.getElementById("hourlyChart");
    hourlyChart.innerHTML = "";
    forecastData.hourly.slice(0, 8).forEach(hour => {
      const date = new Date(hour.dt * 1000);
      const block = document.createElement("div");
      block.className = "hour-block";
      block.innerHTML = `
        <p>${date.getHours()}:00</p>
        <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" width="40" alt="icon" />
        <p>${Math.round(hour.temp)}°</p>
      `;
      hourlyChart.appendChild(block);
    });
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

const commonCities = ["Delhi", "New York", "Moscow", "Tokyo", "London"];

async function fetchCommonCitiesWeather() {
  const tableBody = document.querySelector("#commonTable tbody");
  tableBody.innerHTML = "";

  for (const city of commonCities) {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      if (!res.ok) continue;
      const data = await res.json();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${city}</td>
        <td>${data.clouds.all}</td>
        <td>${Math.round(data.main.feels_like)}°C</td>
        <td>${data.main.humidity}%</td>
        <td>${Math.round(data.main.temp_max)}°C</td>
        <td>${Math.round(data.main.temp_min)}°C</td>
        <td>${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${Math.round(data.main.temp)}°C</td>
        <td>${data.wind.deg}°</td>
      `;
      tableBody.appendChild(row);
    } catch (error) {
      console.error("Error loading city:", city, error);
    }
  }
}

setInterval(fetchCommonCitiesWeather, 10 * 60 * 1000);

fetchCommonCitiesWeather();
