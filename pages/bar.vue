<template>
    <div id="app">
        <canvas id="canvas" width="512" height="512" ref="canvasRef"></canvas>
    </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
const canvasRef = ref<HTMLCanvasElement | null>(null);
const data: number[] = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
onMounted(() => {
    // 获取Canvas上下文
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    if (canvasRef.value) {
        const context = canvasRef.value.getContext('2d');
        if (context) {
            context.translate(256, 256)
            context.scale(1, -1)
            for (let i = 0; i < 20; i++) {
                const c = d3.lab(30, i * 15 - 150, i * 15 - 150).rgb();

                console.log(c);

                context.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
                context.beginPath();
                context.arc((i - 10) * 20, 60, 10, 0, Math.PI * 2);
                context.fill();
            }
        }
    }
})


</script>