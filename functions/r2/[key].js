import { generateImageWithDallE } from '../helpers/ai'

export async function onRequestGet(context) {
  const key = context.params.key

  const headers = new Headers()
  headers.set('Cache-Control', 'max-age=86400') // cache for a day
  headers.set('Content-Type', 'image/png')

  const file = await context.env.R2.get(key)

  // image exists in the bucket
  if (file) {
    // object.writeHttpMetadata(headers)
    // headers.set('etag', object.httpEtag)

    return new Response(file.body, {
      headers
    })
  } else {
    // generate image and store in the bucket

    const data_cache = await context.env.KV.get(key)
    if (!data_cache) {
      return new Response('Image data not found', { status: 404 })
    }
    let data = JSON.parse(data_cache)

    if (!data?.prompts?.image_prompt) {
      return new Response('Image prompts not found', { status: 404 })
    }

    // OpenAI Dall-E image generation
    let base64Image = await generateImageWithDallE(
      data.prompts.image_prompt,
      context.env.OPENAI_API_KEY
    )

    if (!base64Image) {
      return new Response('Image generation failed', { status: 500 })
    }

    // Doesn't work. See: https://developers.cloudflare.com/workers/runtime-apis/nodejs/buffer/
    // const binaryImage = Buffer.from(base64Image, 'base64')

    const binaryString = atob(base64Image)
    const len = binaryString.length
    const binaryImage = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      binaryImage[i] = binaryString.charCodeAt(i)
    }

    // Stable Diffusion image generation
    // const binaryImage = await generateImageWithStableDiffusion(
    //   data.prompts.image_prompt,
    //   context.env.AI
    // )

    // Use R2 PUT to upload the binaryImage
    await context.env.R2.put(key, binaryImage, {
      httpMetadata: {
        contentType: 'image/png'
      }
    })

    return new Response(binaryImage, {
      headers
    })
  }
}
