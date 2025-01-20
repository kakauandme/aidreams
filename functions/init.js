import getLocation from './helpers/location'
import getWeather from './helpers/weather'
import getDateAndTime from './helpers/time'
import { getPrompts, getStyle } from './helpers/ai'
import { getKey } from './helpers/keys'

export async function onRequestGet(context) {
  let data = {}

  // Get country and city from URL query parameters
  const url = new URL(context.request.url)
  const country_code = url.searchParams.get('country_code')
  const city = url.searchParams.get('city')

  // Decode parameters if they exist
  const decodedCountryCode = country_code ? decodeURIComponent(country_code) : null
  const decodedCity = city ? decodeURIComponent(city) : null

  // get location using Cloudflare headers or URL parameters
  data.location = await getLocation(
    context.request.cf,
    decodedCity,
    decodedCountryCode,
    context.env.WEATHER_API_KEY
  )

  // Get weather data first to get the timezone
  data.weather = await getWeather(data, context.env.KV, context.env.WEATHER_API_KEY)

  if (!data.weather) {
    return new Response('Failed to get weather', { status: 500 })
  }

  // if location timezone is not set, use weather timezone
  if (!data.location.timezone) {
    data.location.timezone = data.weather.timezone
  }

  data.date_and_time = getDateAndTime(data)

  data.key = getKey(data)

  // check that cache exists for the image and get style from it if it does
  const data_cache = await context.env.KV.get(data.key)

  let update_cache = false
  if (data_cache) {
    let cached_data = JSON.parse(data_cache)
    if (cached_data?.style) {
      data.style = cached_data.style
    }
  }
  if (!data.style) {
    data.style = getStyle(data)
    update_cache = true
  }

  // create response before adding prompts to it so they don't get passed to the client
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Cache-Control': 'max-age=300' //  cache response for (60s * 5) = 300s or 5m
    }
  })

  data.prompts = getPrompts(data, context.env.IMAGE_PROMPT)

  if (update_cache) {
    await context.env.KV.put(data.key, JSON.stringify(data))
  }

  return response
}
