<template>
    <div id="app">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadImage } from '@/libs/utils'; // 确保在 utils 中有 loadImage 函数

const canvas = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(400);
const canvasHeight = ref(600);
const imgUrl = 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const magnificationFactor = 2; // 放大倍数
const radius = 50; // 放大区域的半径

let originalImageData: ImageData | null = null;

const getImageData = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    return ctx?.getImageData(0, 0, canvasWidth.value, canvasHeight.value) ?? null;
};

const putImageData = (canvas: HTMLCanvasElement, imageData: ImageData) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.putImageData(imageData, 0, 0);
    }
};

const drawImage = async () => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    const img = await loadImage(imgUrl);
    // 计算图像宽高比
    // const aspectRatio = img.height / img.width;
    // 根据宽高比动态设置 Canvas 高度
    // canvasHeight.value = Math.floor(canvasWidth.value * aspectRatio);
    ctx.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
    // 保存原始的 ImageData
    originalImageData = getImageData(canvas.value);
};

const magnifyArea = (x: number, y: number) => {
    if (!canvas.value || !originalImageData) return;

    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    // 创建放大后的 ImageData
    const magnifiedData = ctx.createImageData(canvasWidth.value, canvasHeight.value);

    for (let i = 0; i < magnifiedData.data.length; i++) {
        magnifiedData.data[i] = originalImageData.data[i];
    }

    const { width, height, data } = originalImageData;

    // 遍历圆形范围内的像素
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= radius) {
                // 根据放大倍数获取原图像坐标
                const sx = x + Math.floor(dx / magnificationFactor);
                const sy = y + Math.floor(dy / magnificationFactor);

                if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
                    // 根据坐标获取原像素的像素索引
                    const srcIndex = (sy * width + sx) * 4;
                    // 根据坐标获取放大后的像素索引
                    const destIndex = ((y + dy) * width + (x + dx)) * 4;

                    magnifiedData.data[destIndex] = data[srcIndex];
                    magnifiedData.data[destIndex + 1] = data[srcIndex + 1];
                    magnifiedData.data[destIndex + 2] = data[srcIndex + 2];
                    magnifiedData.data[destIndex + 3] = data[srcIndex + 3];
                }
            }
        }
    }

    // 绘制放大后的数据
    putImageData(canvas.value, magnifiedData);
};

const handleMouseMove = (event: MouseEvent) => {
    if (!canvas.value) return;
    const rect = canvas.value.getBoundingClientRect();
    console.log(rect.left, rect.top);

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    magnifyArea(x, y);
};

onMounted(() => {
    drawImage();
    if (canvas.value) {
        canvas.value.addEventListener('mousemove', handleMouseMove);
    }
});
</script>
  
<style scoped>
canvas {
    border: 1px solid #ccc;
}
</style>
  