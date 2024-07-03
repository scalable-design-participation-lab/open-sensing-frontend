<template>
  <div class="modal">
    <button class="close-btn" @click="closeModal">&times;</button>
    <div class="modal-content">
      <h1>About</h1>
      <p>Project and Team Description as needed.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['visible'])
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90%;
  max-height: 90%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
  z-index: 10;
  overflow: auto;
  padding: 50px;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: lightgray;
  cursor: pointer;
}

.close-btn:hover {
  color: #609f80;
}

.modal-content {
  text-align: center;
}

.modal-content h1 {
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #609f80;
}

.modal-content p {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}
</style>
