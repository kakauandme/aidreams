import { getWeatherSymbol } from './countries'
import { getWeatherKey } from './keys'

async function getLocationByCityAndCountryCode(city, country_code, api_key) {
  try {
    // make a request to openweathermap api to get coordinates https://openweathermap.org/api/geocoding-api

    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

    const coordinates_response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${toCapital(city)},${country_code}&limit=1&appid=${api_key}`
    )
    const coordinates_data = await coordinates_response.json()

    // console.log(coordinates_data)
    // TODO: redirect to 404 if city not found
    if (!coordinates_data[0]?.lat || !coordinates_data[0]?.lon) {
      return
    }

    result = {
      city: coordinates_data[0].name,
      country_code: country_code,
      latitude: coordinates_data[0].lat,
      longitude: coordinates_data[0].lon
    }

    if (coordinates_data[0].state) {
      result.region = coordinates_data[0].state
    }
  } catch (e) {
    console.error(e)
    return
  }
  return result
}
async function getWeather(data, KV, api_key) {
  let result = {}

  // console.log(data)
  result.symbol = getWeatherSymbol(data.location.country_code)

  // cache weather data for current location
  const weather_key = getWeatherKey(data)

  const weather_cache = await KV.get(weather_key)

  // check if weather is set for the coordinates
  if (!weather_cache) {
    try {
      // make a request to openweathermap api to get current weather
      const weather_response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${data.location.latitude}&lon=${data.location.longitude}&exclude=minutely,hourly,daily,alerts&units=${data.location.units}&appid=${api_key}`
      )
      const weather_data = await weather_response.json()
      // console.log(weather_data)
      if (!weather_data?.current?.weather[0]) {
        return
      }

      result.temperature = Math.round(weather_data.current.temp)
      result.name = weather_data.current.weather[0].main.toLowerCase()
      result.description = weather_data.current.weather[0].description.toLowerCase()
      result.icon = `https://openweathermap.org/img/wn/${weather_data.current.weather[0].icon}@2x.png`
      result.timezone = weather_data.timezone
      result.time = weather_data.current.dt
      result.sunrise = weather_data.current.sunrise
      result.sunset = weather_data.current.sunset
    } catch (e) {
      console.error(e)
      return
    }

    // add weather to cache for 15mins
    await KV.put(weather_key, JSON.stringify(result), {
      expirationTtl: 60 * 15
    })
  } else {
    result = JSON.parse(weather_cache)
  }

  return result
}

export { getLocationByCityAndCountryCode, getWeather }
