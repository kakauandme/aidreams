import getLocation from './helpers/location'
import getWeather from './helpers/weather'
import getDateAndTime from './helpers/time'
import { getPrompts } from './helpers/ai'
import { getImageKey } from './helpers/keys'

export async function onRequestGet(context) {
  let data = {}

  // get location using CLoudflare headers
  data.location = getLocation(context.request.cf)

  data.date_and_time = getDateAndTime(
    data.location.timezone,
    data.location.locale,
    data.location.latitude
  )

  data.weather = await getWeather(data, context.env.KV, context.env.WEATHER_API_KEY)

  if (!data.weather) {
    return new Response('Failed to get weather', { status: 500 })
  }

  data.key = getImageKey(data)

  // create repsonse before adding prompts to it so they don't get passed to the client
  const response = new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': 'max-age=300' //  cache response for (60s * 5) = 300s or 5m
    }
  })

  data.prompts = getPrompts(data, context.env.IMAGE_PROMPT)

  // store image data in cache
  const image_cache = await context.env.KV.get(data.key)
  if (!image_cache) {
    await context.env.KV.put(data.key, JSON.stringify(data))
  }

  return response
}
