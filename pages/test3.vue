<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    Loading...
  </div>
  <div v-else class="flex overflow-hidden flex-col bg-white dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-900 py-8 shadow-md">
      <UContainer class="flex justify-between items-center">
        <div class="flex space-x-4">
          <UButton
            v-for="link in headerLinks"
            :key="link.label"
            :to="link.to"
            :class="[
              'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md',
              link.primary
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
            ]"
          >
            {{ link.label }}
          </UButton>
        </div>
        <div class="flex items-center space-x-4">
          <UButton
            to="/draw"
            class="[ 'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md', link.primary ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600', ]"
          >
            → Draw
          </UButton>
          <UColorModeButton
            class="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            :ui="{
              icon: {
                base: 'w-7 h-7',
              },
            }"
          />
          <UAvatar
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt="Avatar"
            size="lg"
            class="rounded-full"
          />
        </div>
      </UContainer>
    </header>

    <UContainer>
      <ULandingHero
        title="Drawing Together"
        description="Collaborate in real-time with your team on creative projects. Experience a new way of visual communication and idea sharing."
        :links="[
          {
            label: 'Start Drawing',
            icon: 'i-heroicons-pencil',
            to: '/draw',
            color: 'primary',
          },
        ]"
      >
        <template #headline>
          <UButton
            color="gray"
            to="/releases"
            label="See what's new in our latest release"
            trailing-icon="i-heroicons-arrow-right"
            size="xs"
            class="rounded-full"
          />
        </template>
        <template #default>
          <img
            src="~/assets/images/northeastern.jpg"
            alt="Illustration of Drawing Together"
            class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
          />
        </template>
      </ULandingHero>

      <UPage>
        <UPageBody prose>
          <h2>Why are we doing this?</h2>
          <p>{{ whyContent }}</p>

          <h2>This is a Secondary Headline</h2>
          <UCard>
            <UTabs :items="tabItems" />
          </UCard>
          <p>{{ secondaryContent }}</p>

          <h2>This is Another Secondary Headline</h2>
          <UCard class="p-4 text-center">
            <div class="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
              Chart placeholder
            </div>
          </UCard>
          <p>{{ tertiaryContent }}</p>

          <h2>References</h2>
          <UAccordion :items="accordionItems" />
        </UPageBody>
      </UPage>

      <UDivider class="my-10" />

      <section>
        <h2 class="text-2xl font-medium text-black dark:text-white mb-5">
          More in this series
        </h2>
        <ULandingGrid :cols="3" :gap="5">
          <ULandingCard
            v-for="(item, index) in moreSeriesItems"
            :key="index"
            :title="item.title"
            :description="item.description"
            :icon="item.icon"
            class="col-span-6 row-span-2"
          />
        </ULandingGrid>
      </section>
    </UContainer>

    <UFooter class="mt-10">
      <template #left>
        <h2 class="text-2xl">Drawing Participation</h2>
        <nav class="mt-4">
          <ul class="space-y-2">
            <li><ULink to="#about">About</ULink></li>
            <li><ULink to="#support">Support</ULink></li>
            <li><ULink to="#more">More</ULink></li>
            <li><ULink to="#evenmore">Even More</ULink></li>
          </ul>
        </nav>
      </template>
      <template #right>
        <div class="flex gap-4">
          <UButton color="gray" label="Logo 1" />
          <UButton color="gray" label="Logo 2" />
        </div>
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const headerLinks = ref([])
const whyContent = ref('')
const secondaryContent = ref('')
const tertiaryContent = ref('')
const tabItems = ref([])
const accordionItems = ref([])
const moreSeriesItems = ref([])

onMounted(async () => {
  try {
    // Simulate API calls
    await Promise.all([
      loadHeaderLinks(),
      loadContent(),
      loadTabItems(),
      loadAccordionItems(),
      loadMoreSeriesItems(),
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
})

async function loadHeaderLinks() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  headerLinks.value = [
    {
      label: 'Drawing Together',
      icon: 'i-heroicons-pencil',
      to: '/',
      primary: true,
    },
    {
      label: 'Project Name',
      icon: 'i-heroicons-folder',
      to: '/project',
    },
    {
      label: 'Learn',
      icon: 'i-heroicons-academic-cap',
      to: '/learn',
    },
    {
      label: 'Draw',
      icon: 'i-heroicons-pencil-square',
      to: '/draw',
    },
  ]
}

async function loadContent() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  whyContent.value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris erat nisl, maximus et mollis vitae, vulputate vitae tortor. Nunc sed tortor mauris. Aliquam volutpat convallis nulla. Nullam in est sed purus efficitur condimentum eu eget mi. Cras consectetur semper magna eget luctus. Maecenas non elit non mauris varius tempor. Duis placerat luctus fringilla. Sed sit amet nisi a nunc aliquet tincidunt in eget erat. Curabitur quis dolor ac dui volutpat condimentum. Ut feugiat diam sit amet pharetra ultricies. Praesent et posuere nunc. Quisque pharetra facilisis commodo. Etiam id nibh scelerisque, pulvinar sapien a, tempor dolor. Donec suscipit efficitur lacus, vel convallis ligula pellentesque sed. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;`

  secondaryContent.value = `Quisque consequat diam dui, nec accumsan arcu laoreet a. Sed bibendum neque purus, ac interdum erat posuere dapibus. Quisque commodo felis at posuere imperdiet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam elementum, arcu id sagittis venenatis, eros nibh ornare ex, eu mollis nunc lectus dictum sem. Quisque eget laoreet elit. Sed egestas sodales odio, at euismod est pharetra non. Nam dui leo, mattis id convallis aliquet, fermentum sed quam. In porttitor, eros id iaculis sollicitudin, tellus augue fringilla nulla, eget suscipit justo sapien convallis erat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam accumsan et magna et molestie.`

  tertiaryContent.value = `Donec pharetra lacus nisl, in pulvinar ante auctor non. Fusce fermentum metus sit amet neque malesuada, eu interdum diam consequat. Phasellus felis tortor, dictum ut augue non, placerat interdum libero. Quisque vitae mollis lectus, pellentesque aliquam urna. Mauris tincidunt aliquet fringilla. Nam malesuada mollis vestibulum. Curabitur malesuada erat sed imperdiet ultrices. Sed nibh turpis, porttitor ut semper eu, ornare eget quam. Nulla facilisi. Ut porta at elit in tempus. Sed quis dapibus eros, eu cursus ipsum. Nam eu libero rutrum, tincidunt nunc at, semper nisl. Sed ullamcorper massa nec est faucibus laoreet. Aliquam erat volutpat.`
}

async function loadTabItems() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  tabItems.value = [
    {
      label: 'Diagram 1',
      icon: 'i-heroicons-chart-bar',
      content: 'Content for Diagram 1',
    },
    {
      label: 'Diagram 2',
      icon: 'i-heroicons-chart-pie',
      content: 'Content for Diagram 2',
    },
    {
      label: 'Diagram 3',
      icon: 'i-heroicons-chart-square-bar',
      content: 'Content for Diagram 3',
    },
    {
      label: 'Diagram 4',
      icon: 'i-heroicons-presentation-chart-line',
      content: 'Content for Diagram 4',
    },
  ]
}

async function loadAccordionItems() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  accordionItems.value = [
    {
      label: 'Reference 1',
      icon: 'i-heroicons-document-text',
      content:
        'Phasellus felis tortor, dictum ut augue non, placerat interdum libero. Quisque vitae mollis lectus, pellentesque aliquam urna.',
    },
    {
      label: 'Reference 2',
      icon: 'i-heroicons-document-text',
      content:
        'Mauris tincidunt aliquet fringilla. Nam malesuada mollis vestibulum. Curabitur malesuada erat sed imperdiet ultrices.',
    },
    {
      label: 'Reference 3',
      icon: 'i-heroicons-document-text',
      content:
        'Sed nibh turpis, porttitor ut semper eu, ornare eget quam. Nulla facilisi. Ut porta at elit in tempus.',
    },
  ]
}

async function loadMoreSeriesItems() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  moreSeriesItems.value = [
    {
      title: 'Why',
      description: 'Explore the reasons behind our project',
      icon: 'i-heroicons-question-mark-circle',
    },
    {
      title: 'What',
      description: 'Discover what our project offers',
      icon: 'i-heroicons-information-circle',
    },
    {
      title: 'How',
      description: 'Learn how to use our tools effectively',
      icon: 'i-heroicons-academic-cap',
    },
  ]
}
</script>

<style scoped></style>
