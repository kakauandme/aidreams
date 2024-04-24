<template>
  <div class="container">
    <!-- TODO: move loading spinner and base CSS to <head> -->
    <div class="loader"></div>
  </div>
</template>
<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  aspect-ratio: 1/1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
}
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: rgba(var(--color-text), 1) rgba(var(--color-text), 1) transparent transparent;
  box-sizing: border-box;
  animation: rotation 5s ease infinite;
}
.loader::after,
.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent rgba(var(--color-text), 0.5) rgba(var(--color-text), 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 1s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 32px;
  height: 32px;
  border-color: rgba(var(--color-text), 1) rgba(var(--color-text), 1) transparent transparent;
  animation: rotationForward 1.5s linear infinite;
}

@keyframes rotationForward {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
