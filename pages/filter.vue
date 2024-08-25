<template>
    <div id="app">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
        <div class="handle-bar">
            <button @click="handleImg(ProcessingType.NoChange)">还原</button>
            <button @click="handleImg(ProcessingType.Grayscale)">灰度化</button>
            <button @click="handleImg(ProcessingType.Invert)">颜色反转</button>
            <button @click="handleImg(ProcessingType.Brightness)">亮度</button>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import {
    getImageData,
    renderImageOnCanvas,
    processImageData,
    type PixelProcessor,
    grayscaleProcessor,
    invertProcessor,
    brightnessProcessor,
} from '@/libs/utils';

// 枚举类型，用于指定处理类型
enum ProcessingType {
    NoChange,
    Grayscale,
    Invert,
    Brightness,
}

const canvas = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(500);
const canvasHeight = ref(500);
const imgUrl = 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const applyImageProcessing = async (processor?: PixelProcessor) => {
    if (!canvas.value) return;

    await renderImageOnCanvas(canvas.value, imgUrl, canvasWidth.value, canvasHeight.value);

    if (processor) {
        const imageData = getImageData(canvas.value);
        if (imageData) {
            const newImageData = processImageData(imageData, processor);
            const ctx = canvas.value.getContext('2d');
            if (ctx) {
                ctx.putImageData(newImageData, 0, 0);
            }
        }
    }
};

const handleImg = (type: ProcessingType) => {
    switch (type) {
        case ProcessingType.Grayscale:
            applyImageProcessing(grayscaleProcessor);
            break;
        case ProcessingType.Invert:
            applyImageProcessing(invertProcessor);
            break;
        case ProcessingType.Brightness:
            applyImageProcessing(brightnessProcessor(1.2)); // 调整亮度参数为合理值
            break;
        case ProcessingType.NoChange:
            applyImageProcessing();
            break;
        default:
            break;
    }
};

onMounted(applyImageProcessing);
</script>
  
<style scoped>
/* 样式调整 */
canvas {
    border: 1px solid #ccc;
}

.handle-bar {
    margin-top: 10px;
}

button {
    margin-right: 5px;
}
</style>
  