import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.css";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaSignal, FaWifi, FaBatteryFull } from "react-icons/fa";

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    wind_kph: number;
    precip_mm: number;
    cloud: number;
    condition: {
      icon: string;
    };
  };
}

interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: {
    icon: string;
  };
}

interface Forecast {
  forecast: {
    forecastday: {
      hour: HourlyForecast[];
    }[];
  };
}

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [city, setCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const API_KEY = "c9a0ca46550648b29ce125849232709";
  const BASE_URL = "https://api.weatherapi.com/v1";

  const getCurrentLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const currentWeatherResponse = await axios.get<WeatherData>(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`
      );
      setCurrentWeather(currentWeatherResponse.data);
      setErrorMessage("");

      const forecastResponse = await axios.get<Forecast>(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=1&aqi=no`
      );
      setHourlyForecast(forecastResponse.data.forecast.forecastday[0].hour);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
      setErrorMessage("Không thể lấy dữ liệu thời tiết.");
    }
  };

  const searchWeatherByCity = async () => {
    if (city) {
      try {
        const response = await axios.get<WeatherData>(
          `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`
        );
        setCurrentWeather(response.data);
        setErrorMessage("");

        const forecastResponse = await axios.get<Forecast>(
          `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no`
        );
        setHourlyForecast(forecastResponse.data.forecast.forecastday[0].hour);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm thời tiết theo thành phố:", error);
        setErrorMessage("Không tìm thấy thành phố. Vui lòng thử lại.");
      }
    }
  };

  useEffect(() => {
    getCurrentLocation()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy vị trí:", error);
        setErrorMessage("Hãy nhập tên thành phố");
      });
  }, []);

  return (
    <div className="weather-container">
      <div className="phone">
        <div className="status-bar">
          <div className="hour">20:30</div>
          <div className="icons">
            <FaSignal />
            <FaWifi />
            <FaBatteryFull />
          </div>
        </div>
        <div className="weather">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Nhập tên thành phố..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <span className="search-icon" onClick={searchWeatherByCity}>
              <CiSearch />
            </span>
          </div>
          {errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            currentWeather && (
              <>
                <span className="weather-icon">
                  <img
                    src={`https:${currentWeather.current.condition.icon}`}
                    alt="icon thời tiết"
                  />
                </span>
                <p className="temperature">
                  {Math.round(currentWeather.current.temp_c)}°C
                </p>
                <p className="location">{currentWeather.location.name}</p>
                <div className="weather-data">
                  <div className="col">
                    <div>
                      <p>{currentWeather.current.cloud}%</p>
                      <span>Khả năng mưa</span>
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      <p>{currentWeather.current.precip_mm} mm</p>
                      <span>Lượng mưa</span>
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      <p>{currentWeather.current.wind_kph} Km/h</p>
                      <span>Tốc độ gió</span>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
        <div className="forecast-container">
          <h2>Dự báo theo giờ</h2>
          <div className="hourly-forecast-scroll">
            {hourlyForecast.map((hour, index) => (
              <div className="hourly-forecast" key={index}>
                <p className="forecast-time">
                  {new Date(hour.time).getHours()}:00
                </p>
                <div className="forecast-icon">
                  <img src={`https:${hour.condition.icon}`} alt="icon dự báo" />
                </div>
                <div className="forecast-temp">
                  <p>{Math.round(hour.temp_c)}°C</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="weather-button"
          onClick={() => navigate("/forecast", { state: { city } })}
        >
          Thời tiết 5 ngày tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Weather;
