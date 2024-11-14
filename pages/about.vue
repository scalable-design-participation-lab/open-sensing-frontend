<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    Loading...
  </div>
  <div v-else class="flex overflow-hidden flex-col bg-white dark:bg-gray-900">
    <GeneralizedHeader
      :left-items="headerLinks"
      :right-items="[{ label: '→ Draw', to: '/draw' }]"
      :show-color-mode-button="true"
      :show-avatar="true"
      avatar-src="https://avatars.githubusercontent.com/u/739984?v=4"
      avatar-alt="User Avatar"
      class="z-50"
    />

    <UContainer class="flex-grow">
      <HeroSection
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
        :headline-button="{
          label: 'See what\'s new in our latest release',
          to: '/releases',
          icon: 'i-heroicons-arrow-right',
        }"
        image-src="/northeastern.jpg"
        image-alt="Illustration of Drawing Together"
      />

      <UPage>
        <UPageBody prose>
          <Headline
            title="Why are we doing this?"
            type="paragraph"
            :content="whyContent"
          />

          <Headline
            title="This is a Secondary Headline"
            type="diagram"
            :content="tabItems"
          />
          <p>{{ secondaryContent }}</p>

          <Headline
            title="This is Another Secondary Headline"
            type="chart"
            content="Chart placeholder"
          />
          <p>{{ tertiaryContent }}</p>

          <Reference :items="accordionItems" />
        </UPageBody>
      </UPage>

      <UDivider class="my-10" />

      <MoreInThisSeries :items="moreSeriesItems" :cols="3" />
    </UContainer>

    <GeneralizedFooter
      title="Drawing Participation"
      :links="[
        { to: '#about', label: 'About' },
        { to: '#support', label: 'Support' },
        { to: '#more', label: 'More' },
        { to: '#evenmore', label: 'Even More' },
      ]"
      :buttons="[{ label: 'Logo 1' }, { label: 'Logo 2' }]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const headerLinks = ref([
  { label: 'Drawing Together', to: '/', primary: true },
  { label: 'Project Name', to: '/project' },
  { label: 'Learn', to: '/learn' },
])
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
