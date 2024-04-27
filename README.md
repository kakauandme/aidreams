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

## Recources

1. [OpenAI Dall-E](https://platform.openai.com/docs/guides/images)
2. [Quantum memories by Refik Anadol](https://www.ngv.vic.gov.au/refik-anadol-quantum-memories/)
3. [Byron Bay Print House](https://www.instagram.com/byronbayprinthouse/)
4. [Apple Widgets UI Kit by Alex Muench](https://www.figma.com/community/file/857332868558500566/apple-widgets-ui-kit)



