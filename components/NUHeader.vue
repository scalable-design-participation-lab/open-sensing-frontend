<template>
  <header class="header">
    <div class="nav-left">
      <div class="neu-logo">
        <img :src="neuLogoN" alt="N" class="neu-logo-n" />
        <img
          :src="neuLogo"
          alt="Northeastern University"
          class="neu-logo-main"
        />
      </div>
      <div class="sdpl">🤲</div>
      <div class="application">
        <span>Open Sensing</span>
      </div>
    </div>
    <div class="nav-right">
      <button class="satellite-button">Satellite</button>
      <button class="more-button" aria-label="More options">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
      <button class="download-button" aria-label="Download">
        <span class="icon-download">↩</span>
      </button>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import neuLogo from '../assets/images/group.png'
import neuLogoN from '../assets/images/vector.svg'

export default defineComponent({
  setup() {
    return {
      neuLogo,
      neuLogoN,
    }
  },
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 64px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.neu-logo,
.sdpl,
.application {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 15px;
  background-color: #fafafa;
}

.neu-logo {
  width: 138px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}

.neu-logo-n {
  height: 32px;
  width: auto;
}

.neu-logo-main {
  height: 24px;
  width: auto;
}

.sdpl {
  width: 48px;
  font-size: 24px;
}

.application {
  width: 137px;
  background-color: #000000;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
}

.satellite-button,
.more-button,
.download-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: none;
  border-radius: 24px;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.satellite-button {
  padding: 0 20px;
}

.more-button,
.download-button {
  width: 48px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #000000;
  border-radius: 50%;
  margin: 0 2px;
}

.icon-download {
  font-size: 20px;
  transform: rotate(-90deg);
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem;
  }

  .nav-left,
  .nav-right {
    gap: 0.5rem;
  }

  .neu-logo,
  .sdpl {
    display: none;
  }
}
</style>
