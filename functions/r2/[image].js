export async function onRequestGet(context) {
  const key = context.params.image

  const object = await context.env.R2.get(key)

  if (object === null) {
    return new Response('Image not found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('Cache-Control', 'max-age=86400')

  return new Response(object.body, {
    headers
  })
}
