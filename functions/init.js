import getLocation from './helpers/location'
import getWeather from './helpers/weather'
import getDateAndTime from './helpers/time'
import getImage from './helpers/ai'

export async function onRequestGet(context) {
  let data = {}

  // get location using CLoudflare headers
  data.location = getLocation(context.request.cf)

  data.date_and_time = getDateAndTime(
    data.location.timezone,
    data.location.locale,
    data.location.latitude
  )

  data.weather = await getWeather(
    data.location,
    context.env.weatherscape_KV,
    context.env.WEATHER_API_KEY
  )

  data.image = await getImage(data, context.env.weatherscape_KV, context.env.OPENAI_API_KEY)

  console.log(data)

  // cache response for 5 mins
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': 'max-age=300' //  (60s * 5) = 300s or 5m
    }
  })
}
