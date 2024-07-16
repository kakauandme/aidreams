import OpenAI from 'openai'

const styles = [
  'Anime',
  'Analog Film',
  'Art Deco',
  'Cartoon',
  'Caricature',
  'Comic Book',
  'Expressionistic',
  // 'Fantasy',
  // 'Futurism',
  // 'Gothic',
  'Hand-drawn Illustration',
  'Impressionistic',
  'Line Art',
  'Manga',
  'Minimalistic',
  'Oil Painting',
  'Photorealistic',
  'Pencil Drawing',
  'Pixel Art',
  'Pop Art',
  // 'Psychedelic', // to hectic
  // 'Realistic',
  'Retro',
  // 'Sci-Fi',
  // 'Steampunk', // not realistic
  // 'Synthwave',
  'Vintage',
  'Watercolor'
]

function getStyle() {
  // return styles[7] // Hand-drawn Illustration
  return styles[Math.floor(Math.random() * styles.length)]
}

function generatePromptTextFromData(data) {
  // TODO: add sunset information to the prompt if available

  const city = data.location.city ? data.location.city + ', ' : ''
  const region = data.location.region ? data.location.region + ', ' : ''
  return `Location: ${city}${region}${data.location.country}
Weather: ${data.weather.description}
Temperature: ${data.weather.temperature}${data.weather.symbol}
Time: ${data.date_and_time.time}
Time of the day: ${data.date_and_time.time_of_day}
Date: ${data.date_and_time.date}
Weekday: ${data.date_and_time.day_of_week}
Season: ${data.date_and_time.season}`
}

function getPrompts(data, image_prompt_template) {
  let result = {}

  const article = ['a', 'e', 'i', 'o', 'u'].includes(data.style[0].toLowerCase()) ? 'an' : 'a'

  result.image_prompt =
    generatePromptTextFromData(data) +
    '\n\n' +
    image_prompt_template.replace('{style}', article + ' ' + data.style)

  result.title_prompt = [
    {
      role: 'system',
      content:
        "You are a writer who comes up with a witty short titles in the form of a sentence that describes the user's location in the current season of the year, using local slang, inside jokes and sarcasm."
    },
    {
      role: 'user',
      content:
        'Location: Melbourne, Australia\nWeather: Broken clouds\nTemperature: 20C\nTime: 2:45 pm\nTime of the day: Afternoon\nDate: 8 April 2024\nWeekday: Monday\nSeason: Autumn'
    },
    {
      role: 'assistant',
      content: "Sippin' flat whites under the moody Melbourne skies in autumn, mate."
    },
    {
      role: 'user',
      content:
        'Location: London, UK\nWeather: Sunny\nTemperature: 24C\nTime: 5:45 pm\nTime of the day: Evening\nDate: 15 July 2024\nWeekday: Friday\nSeason: Summer'
    },
    {
      role: 'assistant',
      content: 'Loving life in London with a tad too much sun for the Brits in the summer, innit?'
    },
    {
      role: 'user',
      content:
        'Location: Paris, France\nWeather: Snow\nTemperature: -10C\nTime: 9:02 am\nTime of the day: Morning\nDate: 01 January 2024\nWeekday: Sunday\nSeason: Winter'
    },
    {
      role: 'assistant',
      content: 'Feeling très chic in Paris with a snowy start to the new year, brrrr!'
    },
    {
      role: 'user',
      content: generatePromptTextFromData(data)
    }
  ]
  return result
}

// streming example
// https://github.com/cloudflare/cloudflare-docs/issues/12060
// https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/
// async function generateTitle(prompt, api_key) {
//   try {
//     const openai = new OpenAI({
//       apiKey: api_key,
//       baseURL:
//         'https://gateway.ai.cloudflare.com/v1/677edd60c5f332d8345470a5a9853879/aidreams/openai'
//     })
//     console.log(prompt)
//     const openaiResponse = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: prompt,
//       temperature: 1,
//       max_tokens: 100
//       //stream: true
//     })

//     // // loop over the data as it is streamed from OpenAI and write it using our writeable
//     // for await (const part of stream) {
//     //   // console.log(part.choices[0]?.delta?.content || '')
//     //   writer.write(textEncoder.encode(part.choices[0]?.delta?.content || ''))
//     // }

//     // writer.close()

//     if (!openaiResponse?.choices[0]?.message?.content) {
//       return
//     }

//     console.log(openaiResponse.choices[0].message.content)
//     return openaiResponse.choices[0].message.content
//   } catch (e) {
//     console.error(e)
//     return
//   }
// }

async function generateImageWithDallE(prompt, api_key) {
  // https://platform.openai.com/docs/api-reference/images/create
  try {
    const openai = new OpenAI({
      apiKey: api_key,
      baseURL:
        'https://gateway.ai.cloudflare.com/v1/677edd60c5f332d8345470a5a9853879/aidreams/openai'
    })

    console.log(prompt)
    const openaiResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      quality: 'hd',
      size: '1024x1024',
      //response_format: 'url'
      response_format: 'b64_json'
    })

    // console.log(openaiResponse.data[0].b64_json)
    // console.log(openaiResponse.data[0].url)
    console.log(openaiResponse.data[0].revised_prompt)

    if (!openaiResponse?.data[0]?.b64_json) {
      return
    }

    return openaiResponse.data[0].b64_json
  } catch (e) {
    console.error(e)
    return
  }
}

// async function generateImageWithStableDiffusion(prompt, AI) {
//   try {
//     console.log(prompt)
//     const image = await AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
//       prompt: prompt,
//     })

//     if (!image) {
//       return
//     }

//     return image
//   } catch (e) {
//     console.error(e)
//     return
//   }
// }
export { getPrompts, getStyle, generateImageWithDallE }
