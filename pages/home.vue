<template>
  <div class="sensor-map">
    <div class="overlap-group-wrapper">
      <div class="overlap-group-2">
        <div class="map-satellite">
          <img
            class="screenshot"
            alt="Screenshot"
            src="https://s3-alpha-sig.figma.com/img/a715/4676/5ff30d25f2c37956a8bc1b0219fb183a?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LOGIreU2FyqIfOaFdhlelLl8dEoNHTZhXGOv4vX-R24HB06Tqg6XqiJ98MCdNuFGiQ9pGxYj3CHOzazDQCBeZm02l-C2edSd-gUuZbpDkIboZo4iXK~iKROdeOYCtFpuTVtYpqHEk3noZr97gzeA2DPNHA7iuER674KpTkE7RzmQNsM3gfUg5M9CQ81cjIwGfrFrLH0jNRklnGDxli03qPa-KpRHl~cEcA63l5aPM0R0Byn~f~1mwI1rix1kNEioWbd8HNJpC9JDqKeob6zB2w6dAG22m7od~8ATp8~1uCH7B8aP69KsxxUI9kOOClvF4YgcAP6njaiiow4lpiOvaQ__"
          />
        </div>
        <div class="map-discover">
          <img
            class="img"
            alt="Screenshot"
            src="https://s3-alpha-sig.figma.com/img/550b/98b8/3c9c8ffcf98738c304384ee3c5290e4c?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YPMLROaQQstL3TyFSX5c-nDt7bN2NTWdu0kXydYzoJg9Bwdb3EiLy2sCKViPYKqMdv8X5aEDza7gEy8PcPU7L6wAIfzDTxcw2SC-pf9p017HMbXWs-gtWF9R4Ar-dDsZMfQGQXxn-HmUnw0bCA80UzkSRSdxe0yT169On2S53jHhjxkg78sjf-0oo6dueUJ0wPAhux3aB8d34zPtA1X5iZFxZedUztGrGULvD6o~GqZ6PBU-JrbuJHQgrLvQTaZa5IO8M369PP6NmmqXDveOk1AYLGc9hD6~l93bWwC2A0Y9gorBgoFD5kFx34GwJ1SQwKKZ26PLCFaykiFELmczUA__"
          />
        </div>
        <ToolsSensors class="tools-sensors-instance" />
        <NUHeader class="header-instance" />
        <ButtonHelp class="button-help-instance" />
        <img class="right-toggle" alt="Right toggle" src="right-toggle.png" />
        <LocationTag
          class="location-tag-instance"
          overlap-group-class-name="design-component-instance-node"
        />
        <LocationTag
          class="location-tag-2"
          overlap-group-class-name="design-component-instance-node"
        />
        <LocationTag
          class="location-tag-3"
          overlap-group-class-name="design-component-instance-node"
        />
        <LocationTag
          class="location-tag-4"
          overlap-group-class-name="design-component-instance-node"
        />
        <LocationTag
          class="location-tag-5"
          overlap-group-class-name="design-component-instance-node"
        />
        <LocationTag
          class="location-tag-6"
          overlap-group-class-name="design-component-instance-node"
        />
        <img class="group" alt="Group" src="group-73.png" />
        <div class="neu-logo-text-wrapper">
          <NeuLogoText class="neu-logo-text-instance" />
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style>
.sensor-map {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.sensor-map .overlap-group-wrapper {
  background-color: #ffffff;
  height: 982px;
  overflow: hidden;
  width: 1512px;
}

.sensor-map .overlap-group-2 {
  border-radius: 50px;
  height: 48px;
  left: -150px;
  position: relative;
  top: -34px;
  width: 1835px;
}

.sensor-map .map-satellite {
  height: 1031px;
  left: 0;
  position: absolute;
  top: 0;
  width: 1835px;
}

.sensor-map .screenshot {
  height: 982px;
  left: 150px;
  object-fit: cover;
  position: absolute;
  top: 34px;
  width: 1512px;
}

.sensor-map .map-discover {
  height: 1019px;
  left: 0;
  position: absolute;
  top: 34px;
  width: 1835px;
}

.sensor-map .img {
  height: 982px;
  left: 150px;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 1512px;
}

.sensor-map .tools-sensors-instance {
  left: 47px !important;
  position: absolute !important;
  top: 501px !important;
}

.sensor-map .header-instance {
  background-color: transparent !important;
  left: 172px !important;
  position: absolute !important;
  top: 59px !important;
}

.sensor-map .button-help-instance {
  left: 172px !important;
  position: absolute !important;
  top: 952px !important;
}

.sensor-map .right-toggle {
  height: 812px;
  left: 1343px;
  position: absolute;
  top: 131px;
  width: 308px;
}

.sensor-map .location-tag-instance {
  left: 450px !important;
  position: absolute !important;
  top: 607px !important;
}

.sensor-map .design-component-instance-node {
  left: unset !important;
  top: unset !important;
  width: unset !important;
}

.sensor-map .location-tag-2 {
  left: 615px !important;
  position: absolute !important;
  top: 641px !important;
}

.sensor-map .location-tag-3 {
  left: 1048px !important;
  position: absolute !important;
  top: 401px !important;
}

.sensor-map .location-tag-4 {
  box-shadow: var(--drop-shadow) !important;
  left: 818px !important;
  position: absolute !important;
  top: 325px !important;
}

.sensor-map .location-tag-5 {
  left: 1031px !important;
  position: absolute !important;
  top: 824px !important;
}

.sensor-map .location-tag-6 {
  left: 236px !important;
  position: absolute !important;
  top: 756px !important;
}

.sensor-map .group {
  height: 140px;
  left: 844px;
  position: absolute;
  top: 180px;
  width: 237px;
}

.sensor-map .neu-logo-text-wrapper {
  align-items: center;
  background-color: #fafafa;
  border-radius: 50px;
  box-shadow: var(--drop-shadow);
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 37px;
  justify-content: center;
  left: 788px;
  overflow: hidden;
  padding: 6px 9px;
  position: absolute;
  top: 957px;
  width: 236px;
}

.sensor-map .neu-logo-text-instance {
  height: 17.41px !important;
  left: unset !important;
  position: relative !important;
  top: unset !important;
}
</style>
