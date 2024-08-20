<template>
  <div class="flex overflow-hidden flex-col bg-white dark:bg-gray-900">
    <Header
      :nav-items="headerNavItems"
      :action-button="headerActionButton"
      :user-avatar="userAvatar"
    />
    <HeroSection v-bind="heroSectionProps" />

    <UContainer>
      <SecondaryHeadline
        title="Why are we doing this?"
        :content="[
          { type: 'Paragraph', props: { content: paragraphContent.why } },
        ]"
      />

      <SecondaryHeadline
        title="This is a Secondary Headline"
        :card-content="{ type: 'UTabs', props: { items: tabItems } }"
        :content="[
          { type: 'Paragraph', props: { content: paragraphContent.secondary } },
        ]"
      />

      <SecondaryHeadline
        title="This is Another Secondary Headline"
        :card-content="{ type: 'ChartPlaceholder', props: {} }"
        :content="[
          { type: 'Paragraph', props: { content: paragraphContent.tertiary } },
        ]"
      />

      <SecondaryHeadline
        title="References"
        :card-content="{ type: 'UAccordion', props: { items: accordionItems } }"
      />

      <UDivider class="my-10" />

      <MoreSeriesItems :items="moreSeriesItems" />
    </UContainer>

    <Footer
      :title="footerTitle"
      :nav-items="footerNavItems"
      :action-buttons="footerActionButtons"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Header props
const headerNavItems = [
  { label: 'Drawing Together', to: '/', primary: true },
  { label: 'Project Name', to: '/project' },
  { label: 'Learn', to: '/learn' },
]

const headerActionButton = { label: '→ Draw', to: '/draw' }

const userAvatar = 'https://avatars.githubusercontent.com/u/739984?v=4'

// Hero Section props
const heroSectionProps = {
  title: 'Drawing Together',
  description:
    'Collaborate in real-time with your team on creative projects. Experience a new way of visual communication and idea sharing.',
  links: [
    {
      label: 'Start Drawing',
      icon: 'i-heroicons-pencil',
      to: '/draw',
      color: 'primary',
    },
  ],
  headlineButton: {
    label: "See what's new in our latest release",
    to: '/releases',
    icon: 'i-heroicons-arrow-right',
  },
  imageSrc: '~/assets/images/northeastern.jpg',
  imageAlt: 'Illustration of Drawing Together',
}

// Paragraph content
const paragraphContent = {
  why: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris erat nisl, maximus et mollis vitae, vulputate vitae tortor. Nunc sed tortor mauris. Aliquam volutpat convallis nulla. Nullam in est sed purus efficitur condimentum eu eget mi. Cras consectetur semper magna eget luctus. Maecenas non elit non mauris varius tempor. Duis placerat luctus fringilla. Sed sit amet nisi a nunc aliquet tincidunt in eget erat. Curabitur quis dolor ac dui volutpat condimentum. Ut feugiat diam sit amet pharetra ultricies. Praesent et posuere nunc. Quisque pharetra facilisis commodo. Etiam id nibh scelerisque, pulvinar sapien a, tempor dolor. Donec suscipit efficitur lacus, vel convallis ligula pellentesque sed. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;',
  secondary:
    'Quisque consequat diam dui, nec accumsan arcu laoreet a. Sed bibendum neque purus, ac interdum erat posuere dapibus. Quisque commodo felis at posuere imperdiet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam elementum, arcu id sagittis venenatis, eros nibh ornare ex, eu mollis nunc lectus dictum sem. Quisque eget laoreet elit. Sed egestas sodales odio, at euismod est pharetra non. Nam dui leo, mattis id convallis aliquet, fermentum sed quam. In porttitor, eros id iaculis sollicitudin, tellus augue fringilla nulla, eget suscipit justo sapien convallis erat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam accumsan et magna et molestie.',
  tertiary:
    'Donec pharetra lacus nisl, in pulvinar ante auctor non. Fusce fermentum metus sit amet neque malesuada, eu interdum diam consequat. Phasellus felis tortor, dictum ut augue non, placerat interdum libero. Quisque vitae mollis lectus, pellentesque aliquam urna. Mauris tincidunt aliquet fringilla. Nam malesuada mollis vestibulum. Curabitur malesuada erat sed imperdiet ultrices. Sed nibh turpis, porttitor ut semper eu, ornare eget quam. Nulla facilisi. Ut porta at elit in tempus. Sed quis dapibus eros, eu cursus ipsum. Nam eu libero rutrum, tincidunt nunc at, semper nisl. Sed ullamcorper massa nec est faucibus laoreet. Aliquam erat volutpat.',
}

// Tab items for UTabs component
const tabItems = ref([
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
])

// Accordion items for UAccordion component
const accordionItems = ref([
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
])

// More Series Items
const moreSeriesItems = [
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

// Footer props
const footerTitle = 'Drawing Participation'
const footerNavItems = [
  { label: 'About', to: '#about' },
  { label: 'Support', to: '#support' },
  { label: 'More', to: '#more' },
  { label: 'Even More', to: '#evenmore' },
]
const footerActionButtons = [{ label: 'Logo 1' }, { label: 'Logo 2' }]
</script>
