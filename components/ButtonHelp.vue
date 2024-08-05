<template>
  <div class="button-help">
    <div class="text-wrapper">?</div>
  </div>
</template>

<script>
export default {
  name: 'ButtonHelp',
}
</script>

<style>
.button-help {
  align-items: center;
  background-color: var(--bg-area);
  border-radius: 50px;
  box-shadow: var(--drop-shadow);
  display: flex;
  gap: 10px;
  height: 48px;
  justify-content: center;
  padding: 16px 133px;
  position: relative;
  width: 48px;
}

.button-help .text-wrapper {
  color: #000000;
  font-family: var(--body-font-family);
  font-size: var(--body-font-size);
  font-style: var(--body-font-style);
  font-weight: var(--body-font-weight);
  letter-spacing: var(--body-letter-spacing);
  line-height: var(--body-line-height);
  margin-left: -113.5px;
  margin-right: -113.5px;
  margin-top: -2px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}
</style>
