<template>
  <div class="container">
    <VCodeBlock
      :code="code"
      highlightjs
      lang="javascript"
      :theme="theme"
      :copyButton="false"
      :copyTab="false"
      :copyIcons="false"
      :floatingTabs="false"
    />
  </div>
</template>
<style>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 1;
}

pre,
.hljs {
  background-color: transparent !important;
}
</style>
<script setup>
import { ref, computed } from 'vue'

const theme = computed(() => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'github'
})

import VCodeBlock from '@wdns/vue-code-block'
const code = ref(`import OpenAI from 'openai'

try {
  const openai = new OpenAI({
    apiKey: context.env.OPENAI_API_KEY
  })
  const openaiResponse = await openai.images.generate({
    model: 'dall-e-3',
    prompt: 'Make art!',
    n: 1,
    quality: 'hd',
    size: '1024x1024',
    response_format: 'b64_json'
  );
} catch (e) {
    console.error(e)
    return
}

// loading ...`)
</script>
