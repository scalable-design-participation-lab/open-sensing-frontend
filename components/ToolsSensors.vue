<template>
  <div :class="['tools-sensors', className]">
    <img
      :class="['home-page', homePageClassName]"
      alt="Home page"
      src="../assets/images/Home_Page.png"
    />
    <img
      :class="['funnel', funnelClassName]"
      alt="Funnel"
      src="../assets/images/Funnel.png"
    />
    <img
      :class="['ios-application', iosApplicationClassName]"
      alt="Ios application"
      src="../assets/images/Ios_Application_Placeholder.png"
    />
    <img
      :class="['location', locationClassName]"
      alt="Location"
      src="../assets/images/Location.png"
    />
  </div>
</template>

<script>
export default {
  name: 'ToolsSensors',
  props: {
    className: {
      type: String,
      default: '',
    },
    homePageClassName: {
      type: String,
      default: '',
    },
    funnelClassName: {
      type: String,
      default: '',
    },
    iosApplicationClassName: {
      type: String,
      default: '',
    },
    locationClassName: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
.tools-sensors {
  align-items: center;
  background-color: #fafafa;
  border-radius: 50px;
  box-shadow: var(--drop-shadow);
  display: flex;
  height: 48px;
  justify-content: space-between;
  padding: 5px 45px;
  position: relative;
  transform: rotate(90deg);
  width: 298px;
}

.tools-sensors .home-page {
  height: 25px;
  margin-left: -32.5px;
  position: relative;
  transform: rotate(-90deg);
  width: 90px;
}

.tools-sensors .funnel {
  height: 25px;
  position: relative;
  transform: rotate(-90deg);
  width: 25px;
}

.tools-sensors .ios-application {
  height: 25px;
  position: relative;
  transform: rotate(-90deg);
  width: 90px;
}

.tools-sensors .location {
  height: 25px;
  margin-right: -32.5px;
  position: relative;
  transform: rotate(-90deg);
  width: 90px;
}
</style>
