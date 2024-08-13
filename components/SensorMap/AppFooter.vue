">
<template>
  <footer class="footer">
    <div class="footer-left">
      <div class="footer-content">
        <img
          loading="lazy"
          src="@/assets/images/logo.png"
          alt="Footer content"
          class="footer-image"
        />
      </div>
    </div>
    <div class="footer-right">
      <button class="help-button" aria-label="Help">?</button>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.footer-content:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.footer-image {
  height: 50px;
  width: auto;
}

.help-button {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.help-button:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    align-items: flex-start;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }

  .footer-right {
    margin-top: 0.5rem;
  }

  .footer-content,
  .help-button {
    padding: 0.5rem;
  }

  .footer-image {
    height: 24px;
  }

  .help-button {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
}
</style>
