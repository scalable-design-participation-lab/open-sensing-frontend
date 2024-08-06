<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="header">
    <nav class="nav-left">
      <div class="neu-logo">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7e29babea30db976030704cfbd4779ea5f2dbb729f52574063bbcb61a05ac37?apiKey=ae53b33f21034bb89bae5f89d96cde5e&&apiKey=ae53b33f21034bb89bae5f89d96cde5e"
          class="logo-image"
          alt="Neu Logo"
        />
      </div>
      <div class="sdpl-icon">🤲</div>
      <div class="application-name">Open Sensing</div>
    </nav>
    <nav class="nav-right">
      <div class="satellite-button">Satellite</div>
      <button class="more-options" aria-label="More options">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
      <button
        class="additional-options"
        aria-label="Additional options"
      ></button>
    </nav>
  </header>
</template>

<style scoped>
.header {
  align-items: start;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-left {
  justify-content: start;
}

.nav-right {
  justify-content: end;
  color: var(--NEU-Black, #000);
  white-space: nowrap;
  font: 500 15px Helvetica Neue, sans-serif;
}

.neu-logo,
.sdpl-icon,
.application-name,
.satellite-button,
.more-options,
.additional-options {
  border-radius: 15px;
  align-self: stretch;
  margin: auto 0;
}

.neu-logo {
  background-color: #fafafa;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  width: 138px;
  padding: 8px 13px;
}

.logo-image {
  aspect-ratio: 3.34;
  object-fit: contain;
  object-position: center;
  width: 107px;
  max-width: 100%;
}

.sdpl-icon {
  background-color: #fafafa;
  overflow: hidden;
  color: #000;
  text-align: center;
  width: 48px;
  height: 48px;
  padding: 0 12px;
  font: 400 25px Inter, sans-serif;
}

.application-name {
  background-color: #000;
  min-height: 48px;
  color: var(--NEU-White, #fff);
  text-align: center;
  width: 137px;
  padding: 15px 20px;
  font: 500 15px Helvetica Neue, sans-serif;
}

.satellite-button {
  background-color: var(--bg-area, #f9f9f9);
  min-height: 48px;
  text-align: center;
  width: 87px;
  padding: 15px 16px;
}

.more-options,
.additional-options {
  background-color: #fff;
  width: 48px;
  height: 48px;
  border: none;
  cursor: pointer;
}

.more-options {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: space-between;
  padding: 15px 10px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #000;
  border-radius: 50%;
}

@media (max-width: 991px) {
  .nav-right,
  .satellite-button,
  .more-options {
    white-space: initial;
  }

  .sdpl-icon {
    white-space: initial;
  }
}
</style>
