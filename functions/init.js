import getLocation from './helpers/location'
import getWeather from './helpers/openweathermap'
import getDateAndTime from './helpers/time'
import { getPrompts, getStyle } from './helpers/ai'
import { getKey, getSlug } from './helpers/keys'

export async function onRequestGet(context) {
  let data = {}

  const { searchParams } = new URL(context.request.url)

  let city = searchParams.get('city')
  let country_code = searchParams.get('country_code')

  data.location = await getLocation(
    city,
    country_code,
    context.request.cf,
    context.env.KV,
    context.env.WEATHER_API_KEY
  )

  if (!data.location) {
    return new Response('Location not found', { status: 404 })
  }


  data.weather = await getWeather(data, context.env.KV, context.env.WEATHER_API_KEY)

  if (!data.weather) {
    return new Response('Failed to get weather', { status: 500 })
  }

  // when getting location from ?city&country_code, timezone is not set so getting it from weather data
  if (!data.location.timezone && data.weather.timezone) {
    data.location.timezone = data.weather.timezone
  }

  data.date_and_time = getDateAndTime(
    data.location.timezone,
    data.location.locale,
    data.location.latitude
  )

  
  data.slug = getSlug(data)
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
