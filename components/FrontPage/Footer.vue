<template>
  <footer class="footer">
    <div class="footer-left">
      <h2 class="text-2xl">{{ title }}</h2>
      <nav class="mt-4">
        <ul class="space-y-2">
          <li v-for="link in links" :key="link.to">
            <ULink :to="link.to">{{ link.label }}</ULink>
          </li>
        </ul>
      </nav>
    </div>
    <div class="footer-right">
      <div class="flex gap-4">
        <UButton
          v-for="button in buttons"
          :key="button.label"
          color="gray"
          :label="button.label"
        />
      </div>
      <button class="help-button" aria-label="Help">?</button>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  links: Array,
  buttons: Array,
})
</script>

<style scoped>
.footer {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 20;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
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
    margin-top: 1rem;
  }

  .help-button {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
}
</style>
