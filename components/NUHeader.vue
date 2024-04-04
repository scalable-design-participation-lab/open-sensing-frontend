<script setup></script>

<template>
  <div class="fixed top-0 left-0 white px-5 py-5 w-full h-20 text-black"
    style="background-color: rgba(255, 255, 255, 0.5) ">
    <p class="float-left text-4xl font-bold">PROJECT NAME</p>
    <nav>
      <ul class="navigation">
        <li><a href="#team">TEAM</a></li>
        <li><a href="#about">ABOUT</a></li>
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
  align-items: center;
  margin-top: 10px;
}

.navigation li {
  margin-left: 20px;
  font-size: 1.2rem;
  font-family: "Segoe UI Symbol", sans-serif;
}

.navigation li a {
  color: black;
  text-decoration: none;
}

.navigation li a:active {
  color: #609F80;
  font-weight: bold;
}
</style>
