<template>
  <header
    class="fixed top-8 left-8 right-8 flex justify-between items-center z-50"
  >
    <div class="flex items-center space-x-6">
      <UButton
        v-if="logoSrc"
        variant="outline"
        color="gray"
        class="h-16 w-16 p-0 rounded-full backdrop-blur-md bg-white/90 flex items-center justify-center"
      >
        <img :src="logoSrc" :alt="logoAlt" class="w-10 h-auto" />
      </UButton>
      <UButton
        v-if="showIcon"
        variant="outline"
        color="gray"
        class="h-16 w-16 text-3xl rounded-full backdrop-blur-md bg-white/90 flex items-center justify-center"
      >
        🤲
      </UButton>
      <template v-for="(item, index) in leftItems" :key="index">
        <NuxtLink v-if="item.to" v-slot="{ navigate }" :to="item.to" custom>
          <UButton
            :variant="item.variant || (item.primary ? 'solid' : 'outline')"
            :color="item.color || (item.primary ? 'black' : 'gray')"
            :icon="item.icon"
            class="h-16 px-7 rounded-full text-lg"
            @click="navigate"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
        <UButton
          v-else
          :variant="item.variant || (item.primary ? 'solid' : 'outline')"
          :color="item.color || (item.primary ? 'black' : 'gray')"
          :icon="item.icon"
          class="h-16 px-7 rounded-full text-lg"
          @click="item.onClick"
        >
          {{ item.label }}
        </UButton>
      </template>
    </div>
    <div class="flex items-center space-x-6">
      <template v-for="(item, index) in rightItems" :key="index">
        <UDropdown v-if="item.dropdown" v-bind="item.dropdown">
          <UButton
            :variant="item.variant || 'outline'"
            :color="item.color || 'gray'"
            :icon="item.icon"
            class="h-16 px-7 rounded-full backdrop-blur-md bg-white/90 text-lg"
          >
            {{ item.label }}
          </UButton>
        </UDropdown>
        <NuxtLink
          v-else-if="item.to"
          v-slot="{ navigate }"
          :to="item.to"
          custom
        >
          <UButton
            :variant="item.variant || 'outline'"
            :color="item.color || 'gray'"
            :icon="item.icon"
            class="h-16 px-7 rounded-full backdrop-blur-md bg-white/90 text-lg"
            @click="navigate"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
        <UButton
          v-else
          :variant="item.variant || 'outline'"
          :color="item.color || 'gray'"
          :icon="item.icon"
          class="h-16 px-7 rounded-full backdrop-blur-md bg-white/90 text-lg"
          @click="item.onClick"
        >
          {{ item.label }}
        </UButton>
      </template>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  leftItems: {
    type: Array,
    default: () => [],
  },
  rightItems: {
    type: Array,
    default: () => [],
  },
  logoSrc: {
    type: String,
    default: '',
  },
  logoAlt: {
    type: String,
    default: 'Logo',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
})
</script>
