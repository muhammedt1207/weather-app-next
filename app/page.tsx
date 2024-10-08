"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

interface WeatherData {
  weather: {
    description: string;
  }[];
  main: {
    temp: number;
  };
  name: string;
}

function getCurrentDate(): string {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: "long" };
  const monthName = currentDate.toLocaleString("en-US", options);
  const date = `${currentDate.getDate()}, ${monthName}`;
  return date;
}


const Home = () => {
  
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("lahore");

  async function fetchData(cityName: string) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/weather?address=" + cityName
      );
      const jsonData: WeatherData = (await response.json());
      setWeatherData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchDataByCoordinates(latitude: number, longitude: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
      );
      
      const jsonData: WeatherData = (await response.json());
      console.log(jsonData,'result of weather data')
      setWeatherData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }else{
      console.log('not geolocation in navigator');
      
    }
    console.log(weatherData,'[[[[')
  }, []);

  useEffect(() => {
    console.log(weatherData, 'Updated Weather Data');
  }, [weatherData]);
  
  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <form
          className={styles.weatherLocation}
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
        >
          <input
            className={styles.input_field}
            placeholder="Enter city name"
            type="text"
            id="cityName"
            name="cityName"
            onChange={(e) => setCity(e.target.value)}
          />
          <button className={styles.search_button} type="submit">
            Search
          </button>
        </form>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className={styles.icon_and_weatherInfo}>
              <div className={styles.weatherIcon}>
                {weatherData.weather[0].description === "rain" ||
                weatherData.weather[0].description === "fog" ? (
                  <i
                    className={`wi wi-day-${weatherData.weather[0].description}`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy"></i>
                )}
              </div>
              <div className={styles.weatherInfo}>
                <div className={styles.temperature}>
                  <span>
                    {(weatherData.main.temp - 273.5).toFixed(2) +
                      String.fromCharCode(176)}
                  </span>
                </div>
                <div className={styles.weatherCondition}>
                  {weatherData.weather[0].description.toUpperCase()}
                </div>
              </div>
            </div>
            <div className={styles.place}>{weatherData.name}</div>
            <div className={styles.date}>{date}</div>
          </>
        ) : (
          <div className={styles.place}>Loading...</div>
        )}
      </article>
    </main>
  );
};

export default Home;
