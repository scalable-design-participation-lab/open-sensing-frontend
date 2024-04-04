<template>
    <div v-if="show" class="popup">
        <h2>ABOUT THE PROJECT</h2>
        <p>Description of Sensor Project</p>
        <button @click="$emit('close')">Close</button>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style scoped>
.popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 45px;
    padding: 40px;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
}
</style>