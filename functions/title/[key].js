// import { generateTitle } from '../helpers/ai'

// export async function onRequestGet(context) {
//   const key = context.params.key
//   const headers = new Headers()
//   headers.set('Cache-Control', 'max-age=86400') // cache for a day
//   headers.set('Content-Type', 'text/plain')
//   const data_cache = await context.env.KV.get(key)
//   if (!data_cache) {
//     return new Response('Image data not found', { status: 404 })
//   }
//   let data = JSON.parse(data_cache)
//   if (!data?.title) {
//     if (!data?.prompts?.title_prompt) {
//       return new Response('Title prompt not found', { status: 404 })
//     }
//     data.title = await generateTitle(data.prompts.title_prompt, context.env.OPENAI_API_KEY)
//     if (!data.title) {
//       return new Response('Title generation failed', { status: 500 })
//     }
//     await context.env.KV.put(key, JSON.stringify(data))
//   }
//   return new Response(data.title, { headers })
// }
