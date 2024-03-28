<script setup></script>

<template>
  <div class="fixed top-0 left-0 white px-5 py-5 w-full h-20 text-black"
    style="background-color: rgba(255, 255, 255, 0.5)">
    <p class="float-left text-4xl font-bold">PROJECT NAME</p>
    <nav>
      <ul class="navigation">
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#team">Team</a></li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.navigation {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
}

.navigation li {
  margin-left: 20px;
}
</style>
