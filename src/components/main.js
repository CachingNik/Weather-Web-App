import React, { useState, useEffect } from 'react';
import Detail from './detail';
import Lgraph from './lgraph';
//import api from '../secret/config';
import '../css/main.css';
import Dia from './dia';
import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = runtimeEnv();

const api = {
    base: env.REACT_APP_API_BASE,
    key: env.REACT_APP_API_KEY
}

export const WeatherContext = React.createContext();

function Main() {

  const [ location, setLocation ] = useState('');
  const [ unit, setUnit ] = useState(true);
  const [ weather, setWeather ] = useState('');
  const [ htemp, setHtemp ] = useState(null);
  const [ hwind, setHwind ] = useState(null);
  const [ city1, setCity1 ] = useState('');
  const [ city2, setCity2 ] = useState('');
  const [ temp1, setTemp1 ] = useState(null);
  const [ temp2, setTemp2 ] = useState(null);
  const [ lc1, setLc1 ] = useState('City 1');
  const [ lc2, setLc2 ] = useState('City 2');
  const [ open, setOpen ] = useState(false);

  const value = {
    location,
    setLocation,
    unit,
    weather,
    setWeather,
    open,
    setOpen
  }

  const cunit = () => {
    if(unit)
      setUnit(false)
    else
      setUnit(true)
  }

  async function comp () {
    var lat1, lon1, lat2, lon2, result;

    if(city1==='' || city2===''){
      setCity1('');
      setCity2('');
      return;
    }

    result = await fetch(`${api.base}weather?q=${city1}&units=metirc&APPID=${api.key}`);
    result = await result.json();
    if(result.cod === "404"){
      setCity1('');
      setCity2('');
      setOpen(true);
      return;
    }
    lat1 = result.coord.lat;
    lon1 = result.coord.lon;
    setLc1(result.name)

    result = await fetch(`${api.base}weather?q=${city2}&units=metirc&APPID=${api.key}`);
    result = await result.json();
    if(result.cod === "404"){
      setCity1('');
      setCity2('');
      setOpen(true);
      return;
    }
    lat2 = result.coord.lat;
    lon2 = result.coord.lon;
    setLc2(result.name)

    var t = new Date();
    t.setHours(0,0,0,0);
    t = t/1000 - 86400;

    fetch(`${api.base}onecall/timemachine?lat=${lat1}&lon=${lon1}&dt=${t}&APPID=${api.key}`)
    .then(res => res.json())
    .then(result => {
      const arr = result.hourly.map(temp => {
        return Math.round(temp.temp - 273.15)
      })
      setTemp1(arr)
    })

    fetch(`${api.base}onecall/timemachine?lat=${lat2}&lon=${lon2}&dt=${t}&APPID=${api.key}`)
    .then(res => res.json())
    .then(result => {
      const arr = result.hourly.map(temp => {
        return Math.round(temp.temp - 273.15)
      })
      setTemp2(arr)
    })
  }

  useEffect(() => {
    if(typeof weather.coord != "undefined"){
      const lat = weather.coord.lat;
      const lon = weather.coord.lon;

      var t = new Date();
      t.setHours(0,0,0,0);
      t = t/1000 - 86400;

      fetch(`${api.base}onecall/timemachine?lat=${lat}&lon=${lon}&dt=${t}&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        const arrws = result.hourly.map(oc => {
          return oc.wind_speed
        })
        setHwind(arrws)
        const arrt = result.hourly.map(oc => {
          if(unit)
            return Math.round(oc.temp - 273.15)
          else
            return Math.round((oc.temp - 273.15)*9/5 + 32)
        });
        setHtemp(arrt)
      });
    }
    else{
      setHtemp(null)
      setHwind(null)
    }
  }, [weather, unit]);

  return (
    <WeatherContext.Provider value={value}>
      <Dia open={open} />
      <h1 className='heading' >Start Forecasting</h1>
      <div className='container' >
        <Detail />
        <Lgraph title="How was the previous day (GMT)" Xaxis="Time"
        label1="Temperature (&deg;C/&deg;F)" label2 ="Wind Speed (m/s)"
        data1={htemp} data2={hwind} />
        <div>
          <div className='compform' >
            <h2>Compare Temperature b/w 2 Cities for the previous day:</h2>
            <input placeholder="City 1" value={city1} onChange={(c)=>setCity1(c.target.value)}
            className='cin' />
            <input placeholder="City 2" value={city2} onChange={(c)=>setCity2(c.target.value)}
            className='cin' />
            <button className='gobutdes' onClick={comp}>GO</button>
          </div>
          <Lgraph title="Comparison of 2 Cities (Temperature) in &deg;C" Xaxis="Time"
          data1={temp1} data2={temp2}
          label1={lc1} label2={lc2} />
        </div> 
      </div>
      <div className='cbut' >
        <button className='cbutdes' onClick={cunit}><b>&deg;C/ &deg;F</b> (Click here to change unit)</button>
      </div>
    </WeatherContext.Provider>
  );

}

export default Main;