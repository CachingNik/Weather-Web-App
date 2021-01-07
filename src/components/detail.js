import React, { useState, useEffect } from 'react';
import '../css/detail.css';
import { Line } from 'react-chartjs-2';
import { WiStrongWind, WiHumidity } from 'weather-icons-react';

const api = {
    key: process.env.API_KEY,
    base: "https://api.openweathermap.org/data/2.5/",
}

function Detail() {

    const [ location, setLocation ] = useState('');
    const [ unit, setUnit ] = useState(true);
    const [ weather, setWeather ] = useState('');
    const [ htemp, setHtemp ] = useState(null);
    const [ hwind, setHwind ] = useState(null);

    const cunit = () => {
        if(unit)
            setUnit(false)
        else
            setUnit(true)
    }

    useEffect(() => {
        if(typeof weather.coord != "undefined"){
            console.log(weather)
            const lat = weather.coord.lat;
            const lon = weather.coord.lon;

            var t = new Date();
            t.setHours(0,0,0,0);
            t = t/1000 - 86400;
            fetch(`${api.base}onecall/timemachine?lat=${lat}&lon=${lon}&dt=${t}&APPID=${process.env.API_KEY}`)
            .then(res => res.json())
            .then(result => {
                const x = result.hourly.map(a => {
                    return a.wind_speed
                })
                setHwind(x)
                const y = result.hourly.map(a => {
                    if(unit)
                        return Math.round(a.temp - 273.15)
                    else
                        return Math.round((a.temp - 273.15)*9/5 + 32)
                });
                setHtemp(y)
            });}
            else{
                setHtemp(null)
                setHwind(null)
            }
    }, [weather, unit]);

    const search = evt => {
        if(evt.key === "Enter") {
            fetch(`${api.base}weather?q=${location}&units=metirc&APPID=${process.env.API_KEY}`)
            .then(res => res.json())
            .then(result => {
                console.log(result)
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
    
    const data = {
        labels: ['12 AM', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, '12 PM', 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, '12 AM'],
        
        datasets: [
            {
                label: 'Temperature (°C or °K)',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'black',
                borderColor: 'blue',
                borderWidth: 2,
                data: htemp
            },
            {
                label: 'Wind Speed (m/s)',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'black',
                borderColor: 'green',
                borderWidth: 2,
                data: hwind
            }
        ]
    };

    

  return (
    <div className='container'>
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
                <div class="info">
                    <div className='extra'><h3 className="location">Wind Speed | {weather.wind.speed} m/s  </h3><WiStrongWind size={55}/></div>
                    <div className='extra'><h3 className="location">Humidity | {weather.main.humidity}%  </h3><WiHumidity size={55}/></div>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
                    <h2 class="location">{weather.name}, {weather.sys.country}</h2>
                    <p class="date">{dateBuilder(new Date())}</p>
                    {
                        unit ? <h1 class="temp">{Math.round(weather.main.temp - 273.15)} &deg;C</h1> :
                        <h1 class="temp">{Math.round((weather.main.temp - 273.15)*9/5 + 32)} &deg;F</h1>
                    }
                    <h2 class="location">{weather.weather[0].main}</h2>
                </div>
            ) : (' ') }
        </div>
        <div className="graph">
            <b>Note</b>: Click on any Legend to enable/disable them.
            <Line data={data}
            options={{
                title:{
                  display:true,
                  text:'How was the previous day (GMT)',
                  fontSize:20,
                  fontFamily: 'Quicksand'
                },
                legend:{
                  display:true,
                  position:'top'
                },
                scales: {
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: 'Time',
                                fontSize: 18,
                                fontColor: 'black'
                            }
                        }
                    ]
                }
              }} />
        </div>
        <div className="unit" >
            <button className="button" onClick={cunit}><b>&deg;C/ &deg;F</b> (Click here to change unit)</button>
        </div>
    </div>
  );
}

export default Detail;