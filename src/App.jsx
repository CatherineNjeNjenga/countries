import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => { 
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [displayCountry, setDisplayCountry] = useState('')
  const [number, setNumber] = useState(0)
  const [details, setDetails] = useState({})
  const [temperature, setTemperature] = useState('')
  const [windSpeed, setWindSpeed] = useState('')
  const [weatherIcon, setWeatherIcon] = useState('')

  useEffect(() => {
    console.log('effect value of countries', countries)

    console.log('waiting for country details...')
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        const allCountries = response.data
        const nameArray = allCountries.map(country => country.name.common)
        console.log(nameArray)
        setCountries(nameArray)
        setDetails(allCountries)
      })
      .catch(error => {
        console.log(error)
      })

  }, [value === ''])

  const handleSearch = (event) => {
    const value = event.target.value
    setValue(value)
    const displayCountries = countries.filter(country => {
      return country.toLowerCase().includes(value.toLowerCase())
    })
    const totalCountries = displayCountries.length
    setNumber(totalCountries)
    setCountries(displayCountries)
    console.log(value)
    
    if (number === 1) {
      console.log(countries)
      if (countries.length === 1) {
        const focusCountry = countries[0]
        console.log(focusCountry)

        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${focusCountry}`)
          .then(response => {
            const returnedCountry = response.data
            console.log(returnedCountry)
            setDisplayCountry(returnedCountry)
          })
          .catch(error => {
            console.log(error)
          })
      }
        // axios
        // .get(`https://api.open-meteo.com/v1/forecast?latitude=${displayCountry.capitalInfo.latlng[0]}&longitude=${displayCountry.capitalInfo.latlng[1]}&current=temperature_2m,wind_speed_10m&wind_speed_unit=ms`)
        // .then(response => {
        //   console.log(response.data)
        //   const temp = response.data.current.temperature_2m
        //   setTemperature(temp)
        //   console.log(temp)
        //   const wind = response.data.current.wind_speed_10m
        //   console.log(wind)
        //   setWindSpeed(wind)
        // })
        // .catch(error => {
        //   console.log(error)
        // })

        axios
        .get(`http://api.weatherstack.com/current?access_key=${import.meta.env.VITE_API_KEY}&query=${displayCountry.capital}`)
        .then(response => {
          console.log(response.data)
          const temp = response.data.current.temperature
          setTemperature(temp)
          console.log(temp)
          const wind = response.data.current.wind_speed
          console.log(wind)
          setWindSpeed(wind)
          const icon = response.data.current.weather_icons
          setWeatherIcon(icon)
        })
        .catch(error => {
          console.log(error)
        })


        // axios
        // .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${displayCountry.capitalInfo.latlng[0]}&lon=${displayCountry.capitalInfo.latlng[1]}&exclude={part}&appid=${api_key}`)
        // .then(response => {
        //   console.log(response.data)
        //   const temp = response.data.current.temp
        //   setTemperature(temp)
        //   console.log(temp)
        //   const wind = response.data.current.wind_speed
        //   console.log(wind)
        //   setWindSpeed(wind)
        // })
        // .catch(error => {
        //   console.log(error)
        // })
    } else {
      return
    }
    setTimeout(() => {
      setValue('')
    }, 20000);
  }
  
  const handleClick = (event) => {
    console.log('clicked', event.target)
    const focusCountry = event.target.value
    axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${focusCountry}`)
        .then(response => {
          const returnedCountry = response.data
          const count = [returnedCountry].length
          console.log(count)
          console.log(returnedCountry)
          setNumber(count)
          setDisplayCountry(returnedCountry)
        })
        .catch(error => {
          console.log(error)
        })
  }

  let onDisplay = ''

  if (value === '') {
    onDisplay
  } else if (number > 10) {
    onDisplay = 'Too many matches, specify another filter'
  } else if (number > 1 || number < 10) {
    onDisplay = (
      <ul>
      {countries.map(country => {
        return (
          <>
            <li key={country}>{country}</li>
            <button onClick={handleClick} value={country}>show </button>
          </>
        )
      })}
    </ul>
    )
  }

  if (number === 1 && displayCountry) {
    console.log('one')
    console.log(displayCountry)
    onDisplay = (
       <> 
       {
        <>
          <h1>{displayCountry.name.common}</h1>
          <p>capital {displayCountry.capital}</p>
          <p>area {displayCountry.area}</p>
          <ul>
            {console.log(Object.values(displayCountry.languages))}
            <h3>Languages</h3>
            {(Object.values(displayCountry.languages)).map(language => {
              return <li>{language}</li>
            })}
          </ul>
          <img src={displayCountry.flags.png} />
          <h3>Weather in {displayCountry.capital}</h3>
          <p>temperature {temperature} Celcius</p>
          <img src={weatherIcon} />
          <p>wind {windSpeed} m/s</p>
        </>
       }
      </>
    ) 
  }

  return (
   <div>
    find countries <input type="text" value={value} onChange={handleSearch}/>
    <div>{onDisplay}</div>
   </div>
  )
}

export default App

