# AI dreams

Art x AI experiments. Dreaming illustrations using AI, based on the end user, location, time of the day, season, etc.

## Project Setup

```sh
npm install
```

to update packages run

```sh
npx npm-check -u
```

### Compile and Hot-Reload for Development

```sh
npm run pages:dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Deploy

```sh
npm run pages:deploy
```

### Lint and format

```sh
npm run format
npm run lint
```

### Troubleshooting

If the port is already taken kill it with kindness

```sh
lsof -n -i4TCP:8787 | awk '{print$2}' | tail -1 | xargs kill -9
```

## Resources

1. [Cloudflare IP geolocation](https://developers.cloudflare.com/network/ip-geolocation/)
2. [OpenWeather API](https://openweathermap.org/api/one-call-3)
3. [OpenAI Dall-E API](https://platform.openai.com/docs/guides/images)
4. [Quantum memories by Refik Anadol at NGV photos](https://www.ngv.vic.gov.au/refik-anadol-quantum-memories/)
5. [Byron Bay Print House imagery](https://www.instagram.com/byronbayprinthouse/)
6. [Apple Widgets UI Kit by Alex Muench](https://www.figma.com/community/file/857332868558500566/apple-widgets-ui-kit)
