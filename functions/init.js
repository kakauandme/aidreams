// import OpenAI from 'openai'

import getCountryName from './helpers/countries'

async function getWeather(latitude, longitude, units, api_key) {
  console.log('fetching weather')
  let result = {}

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=${units}&appid=${api_key}`
    )
    const weatherData = await weatherResponse.json()

    //console.log(weatherData);
    result.temp = Math.round(weatherData.current.temp)
    result.name = weatherData.current.weather[0].main
    result.description = weatherData.current.weather[0].description
    result.icon = `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`
    result.timezone_offset = weatherData.timezone_offset
    result.time = weatherData.current.dt
    result.sunrise = weatherData.current.sunrise
    result.sunset = weatherData.current.sunset
  } catch (e) {
    console.log(e)
  }
  return result
}

export async function onRequestGet(context) {
  const data = {
    city: context.request.cf.city,
    region: context.request.cf.region,
    country: context.request.cf.country,
    timezone: context.request.cf.timezone,
    latitude: context.request.cf.latitude,
    longitude: context.request.cf.longitude
  }
  // console.log(context.request.cf);
  // make a request to openweathermap api to get current weather

  data.units =
    data.country === 'US' || data.country === 'LR' || data.country === 'MM' ? 'imperial' : 'metric'
  data.symbol = data.units === 'imperial' ? 'F' : 'C'

  data.country_code = data.country
  data.country = getCountryName(data.country_code)

  const weather_key = 'weather_' + data.latitude + '_' + data.longitude

  const weather_cache = await context.env.weatherscape_KV.get(weather_key)

  console.log(weather_key)

  if (!weather_cache) {
    data.weather = await getWeather(
      data.latitude,
      data.longitude,
      data.units,
      context.env.WEATHER_API_KEY
    )
    await context.env.weatherscape_KV.put(weather_key, JSON.stringify(data.weather), {
      expirationTtl: 60 * 15
    })
  } else {
    data.weather = JSON.parse(weather_cache)
  }

  // try {

  //     const openai = new OpenAI({
  //         apiKey: context.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
  //     });
  //     const openaiResponse = await openai.images.generate({
  //         model: "dall-e-3",
  //         prompt: "A hand-drawn illustration of Melbourne, Australia on a partly cloudy morning with the sun high in the sky and a visible crescent moon. The sky is a mix of light blue with some soft white clouds. In the foreground, people are enjoying outdoor activities in Federation Square, wearing light clothing suitable for 15°C weather. Some are casually strolling, while others are taking photos of the surrounding modern architecture. The buildings of Melbourne's skyline, including the Eureka Tower, are visible in the background. The Yarra River gently flows by, reflecting the cityscape. Large, clear typography in a modern, bold style displays 'Melbourne, 15°C' at the top of the image. The overall scene is vibrant and lively, showcasing the city's unique blend of nature and urban life.",
  //         n: 1,
  //         quality: "hd",
  //         size: "1024x1024",
  //         response_format: "url"
  //     });

  //     console.log(openaiResponse)
  //     data.image = openaiResponse.data[0].url;
  // } catch (e) {
  //     console.log(e)
  // }

  console.log(data)

  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': 'max-age=300' //  (60s * 5) = 300s or 5m
    }
  })
}
