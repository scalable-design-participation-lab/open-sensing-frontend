<template>
  <UPage>
    <UPageBody prose>
      <div v-if="isLoading">Loading...</div>
      <template v-else>
        <h2>Why are we doing this?</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris erat
          nisl, maximus et mollis vitae, vulputate vitae tortor. Nunc sed tortor
          mauris. Aliquam volutpat convallis nulla. Nullam in est sed purus
          efficitur condimentum eu eget mi. Cras consectetur semper magna eget
          luctus. Maecenas non elit non mauris varius tempor. Duis placerat
          luctus fringilla. Sed sit amet nisi a nunc aliquet tincidunt in eget
          erat. Curabitur quis dolor ac dui volutpat condimentum. Ut feugiat
          diam sit amet pharetra ultricies. Praesent et posuere nunc. Quisque
          pharetra facilisis commodo. Etiam id nibh scelerisque, pulvinar sapien
          a, tempor dolor. Donec suscipit efficitur lacus, vel convallis ligula
          pellentesque sed. Vestibulum ante ipsum primis in faucibus orci luctus
          et ultrices posuere cubilia curae;
        </p>

        <h2>This is a Secondary Headline</h2>
        <UCard>
          <UTabs :items="tabItems" />
        </UCard>
        <p>
          Quisque consequat diam dui, nec accumsan arcu laoreet a. Sed bibendum
          neque purus, ac interdum erat posuere dapibus. Quisque commodo felis
          at posuere imperdiet. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Etiam elementum, arcu id
          sagittis venenatis, eros nibh ornare ex, eu mollis nunc lectus dictum
          sem. Quisque eget laoreet elit. Sed egestas sodales odio, at euismod
          est pharetra non. Nam dui leo, mattis id convallis aliquet, fermentum
          sed quam. In porttitor, eros id iaculis sollicitudin, tellus augue
          fringilla nulla, eget suscipit justo sapien convallis erat. Orci
          varius natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nullam accumsan et magna et molestie.
        </p>

        <h2>This is Another Secondary Headline</h2>
        <UCard class="p-4 text-center">
          <div class="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
            Chart placeholder
          </div>
        </UCard>
        <p>
          Donec pharetra lacus nisl, in pulvinar ante auctor non. Fusce
          fermentum metus sit amet neque malesuada, eu interdum diam consequat.
          Phasellus felis tortor, dictum ut augue non, placerat interdum libero.
          Quisque vitae mollis lectus, pellentesque aliquam urna. Mauris
          tincidunt aliquet fringilla. Nam malesuada mollis vestibulum.
          Curabitur malesuada erat sed imperdiet ultrices. Sed nibh turpis,
          porttitor ut semper eu, ornare eget quam. Nulla facilisi. Ut porta at
          elit in tempus. Sed quis dapibus eros, eu cursus ipsum. Nam eu libero
          rutrum, tincidunt nunc at, semper nisl. Sed ullamcorper massa nec est
          faucibus laoreet. Aliquam erat volutpat.
        </p>

        <h2>References</h2>
        <UAccordion :items="accordionItems" />
      </template>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const tabItems = ref([])
const accordionItems = ref([])
const moreSeriesItems = ref([])

onMounted(async () => {
  try {
    // Simulate async data fetching
    await new Promise((resolve) => setTimeout(resolve, 1000))

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
  } catch (error) {
    console.error('Failed to load data:', error)
    // Handle error state here
  } finally {
    isLoading.value = false
  }

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
})
</script>
