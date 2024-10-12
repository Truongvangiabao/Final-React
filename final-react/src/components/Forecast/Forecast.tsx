import React, { useEffect, useState } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Forecast.css";
import { FaBatteryFull, FaSignal, FaWifi } from "react-icons/fa6";

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    daily_chance_of_rain: number;
  };
}

const Forecast = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city } = location.state || {};
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const apiKey = "c9a0ca46550648b29ce125849232709";

  useEffect(() => {
    const fetchWeatherData = async () => {
      let url = "";

      if (city) {
        url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
      } else {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`;
          try {
            const response = await axios.get(url);
            console.log("Dữ liệu trả về từ API:", response.data);
            setForecastData(response.data.forecast.forecastday);
          } catch (error) {
            console.error("Error fetching weather data:", error);
          } finally {
            setLoading(false);
          }
        });
        return;
      }

      try {
        const response = await axios.get(url);
        console.log("Dữ liệu trả về từ API:", response.data);
        setForecastData(response.data.forecast.forecastday);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, apiKey]);

  if (loading) {
    return (
      <div className="weather-container">Đang tải dữ liệu thời tiết...</div>
    );
  }

  const daysToShow = forecastData.slice(1, 5);

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
        <div className="forecast-container1">
          <h1>Dự báo thời tiết 5 ngày tiếp theo</h1>
          <div className="forecast-grid">
            {daysToShow.length > 0 ? (
              daysToShow.map((forecast, index) => (
                <div key={index} className="forecast-item">
                  <p>
                    {new Date(forecast.date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                    })}
                  </p>
                  <div>
                    <IoSunnyOutline />
                  </div>
                  <p>{forecast.day.avgtemp_c}°C</p>
                  <p>{forecast.day.daily_chance_of_rain}%</p>
                </div>
              ))
            ) : (
              <p>Không có dữ liệu dự báo.</p>
            )}
          </div>
          <button onClick={() => navigate("/")} className="back-btn">
            Quay về màn hình chính
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
