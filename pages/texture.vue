<template>
    <div id="app">
        <canvas ref="canvas" width="500" height="500"></canvas>
    </div>
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();
onMounted(() => {
    if (canvas.value) {
        const gl = canvas.value.getContext('webgl');
    }
})
</script>