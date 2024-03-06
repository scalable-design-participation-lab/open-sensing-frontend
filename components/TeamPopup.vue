<template>
    <div v-if="show" class="popup">
        <h2>Title</h2>
        <p>Some text</p>
      <button @click="$emit('close')">Close</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .popup {
    /* Add your styles for the popup here */
  }
  </style>