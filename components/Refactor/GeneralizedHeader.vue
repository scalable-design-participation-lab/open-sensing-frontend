<template>
  <header
    :class="[
      'w-full bg-white dark:bg-gray-900 py-8 shadow-md',
      { 'absolute top-6 left-6 right-6 z-50': isAbsolute },
    ]"
  >
    <UContainer :class="['flex justify-between items-center', containerClass]">
      <div class="nav-left flex items-center space-x-4">
        <slot name="logo">
          <div class="logo-placeholder">Logo</div>
        </slot>
        <template v-for="(item, index) in leftItems" :key="index">
          <component
            :is="item.component || 'UButton'"
            v-bind="item.props"
            :class="[
              'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md',
              item.class,
              {
                'bg-black text-white hover:bg-gray-800': item.primary,
                'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600':
                  !item.primary,
              },
            ]"
            @click="item.onClick"
          >
            {{ item.label }}
          </component>
        </template>
      </div>
      <div class="nav-right flex items-center space-x-4">
        <template v-for="(item, index) in rightItems" :key="index">
          <component
            :is="item.component || 'UButton'"
            v-bind="item.props"
            :class="[
              'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md',
              item.class,
              'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
            ]"
            @click="item.onClick"
          >
            {{ item.label }}
          </component>
        </template>
        <UColorModeButton
          v-if="showColorModeButton"
          class="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          :ui="{
            icon: {
              base: 'w-7 h-7',
            },
          }"
        />
        <UAvatar
          v-if="showAvatar"
          :src="avatarSrc"
          :alt="avatarAlt"
          size="lg"
          class="rounded-full"
        />
      </div>
    </UContainer>
  </header>
</template>

<script>
export default {
  name: 'GeneralizedHeader',
  props: {
    isAbsolute: {
      type: Boolean,
      default: false,
    },
    containerClass: {
      type: String,
      default: '',
    },
    leftItems: {
      type: Array,
      default: () => [
        {
          label: 'Drawing Together',
          component: 'UButton',
          primary: true,
          props: { to: '/' },
        },
        {
          label: 'Project Name',
          component: 'UButton',
          props: { to: '/project' },
        },
        { label: 'Learn', component: 'UButton', props: { to: '/learn' } },
      ],
    },
    rightItems: {
      type: Array,
      default: () => [
        { label: '→ Draw', component: 'UButton', props: { to: '/draw' } },
      ],
    },
    showColorModeButton: {
      type: Boolean,
      default: true,
    },
    showAvatar: {
      type: Boolean,
      default: true,
    },
    avatarSrc: {
      type: String,
      default: 'https://avatars.githubusercontent.com/u/739984?v=4',
    },
    avatarAlt: {
      type: String,
      default: 'User Avatar',
    },
  },
}
</script>

<style scoped>
@media (max-width: 1024px) {
  .header.is-absolute {
    flex-direction: column;
    align-items: flex-start;
    top: 1rem;
    left: 1rem;
  }

  .nav-right {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .header.is-absolute {
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
  }

  .nav-left,
  .nav-right {
    gap: 0.75rem;
  }
}
</style>
