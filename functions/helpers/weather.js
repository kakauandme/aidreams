import { getWeatherSymbol } from '../helpers/countries'
import { getWeatherKey } from './keys'

export default async function getWeather(data, KV, api_key) {
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

      if (!weather_data?.current.weather[0]) {
        return
      }

      // console.log(weather_data)

      result.temperature = Math.round(weather_data.current.temp)
      result.name = weather_data.current.weather[0].main.toLowerCase()
      result.description = weather_data.current.weather[0].description.toLowerCase()
      result.icon = `https://openweathermap.org/img/wn/${weather_data.current.weather[0].icon}@2x.png`
      //result.timezone_offset = weather_data.timezone_offset
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
