import React, { useContext } from 'react';
import '../css/detail.css';
import { WiStrongWind, WiHumidity } from 'weather-icons-react';
//import api from '../secret/config';
import { WeatherContext } from './main';
import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = runtimeEnv();

const api = {
    base: env.REACT_APP_API_BASE,
    key: env.REACT_APP_API_KEY
}

function Detail() {

    const { location, setLocation, unit, weather, setWeather } = useContext(WeatherContext);

    const search = evt => {
        if(evt.key === "Enter") {
            fetch(`${api.base}weather?q=${location}&units=metirc&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setWeather(result)
                setLocation('')
            });
        }
    }

    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", 
            "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", 
            "Friday", "Saturday"]

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} | ${date} ${month} | ${year}`
    }
    
    return (
        <div className='box'>
            <div className='wave -one'></div>
            <div className='wave -two'></div>
            <div className='wave -three'></div>
            <div className='search-box'>
                <input 
                type='text' 
                className='search-bar'
                placeholder='Enter Region'
                onChange={ e => setLocation(e.target.value) }
                value={location}
                onKeyPress={search} />
            </div>
            { (typeof weather.main !="undefined") ? (
                <div className="info">
                    <div className='wah'><h3 className='location'>Wind Speed | {weather.wind.speed} m/s  </h3><WiStrongWind size={55}/></div>
                    <div className='wah'><h3 className='location'>Humidity | {weather.main.humidity}%  </h3><WiHumidity size={55}/></div>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt='' />
                    <h2 className='location'>{weather.name}, {weather.sys.country}</h2>
                    <p className='date'>{dateBuilder(new Date())}</p>
                    {
                        unit ? <h1 className='temp'>{Math.round(weather.main.temp - 273.15)} &deg;C</h1> :
                        <h1 className='temp'>{Math.round((weather.main.temp - 273.15)*9/5 + 32)} &deg;F</h1>
                    }
                    <h2 className='location'>{weather.weather[0].main}</h2>
                </div>
            ) : (' ') }
        </div>
    );

}

export default Detail;