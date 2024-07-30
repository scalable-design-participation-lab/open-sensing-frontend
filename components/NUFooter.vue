<!-- <script setup></script>

<template>
    <div class="fixed bottom-0 left-0 white px-5 py-3 w-full h-10 text-black">
        <p class="float-left text-1xl font-bold">Northeastern University</p>
    </div>
</template>

<style scoped></style> -->
<script setup>
import { ref } from 'vue'
import { Twitter, Linkedin, Github } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-left">
      <div class="university-info">
        <img
          src="@/assets/images/neu-icon.jpg"
          alt="Northeastern University Logo"
          class="university-logo"
        />
        <p class="university-name">Northeastern University</p>
      </div>
      <p class="copyright">
        © {{ currentYear }} Northeastern University. All rights reserved.
      </p>
    </div>
    <div class="footer-right">
      <nav class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Contact Us</a>
      </nav>
      <div class="social-links">
        <a href="#" class="social-icon" title="Twitter"
          ><Twitter size="18"
        /></a>
        <a href="#" class="social-icon" title="LinkedIn"
          ><Linkedin size="18"
        /></a>
        <a href="#" class="social-icon" title="GitHub"><Github size="18" /></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f8f8f8;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
}

.university-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 2rem;
}

.university-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.university-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-top: 1rem;
}

.copyright {
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  margin-right: 2rem;
}

.footer-link {
  font-size: 0.9rem;
  color: #444;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #c00;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-icon {
  color: #444;
  transition: color 0.3s ease;
}

.social-icon:hover {
  color: #c00;
}
</style>
