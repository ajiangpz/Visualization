<template>
    <div id="app">
        <h3>Canvas</h3>
        <canvas width="512" height="512" id="canvas" ref="canvasRef"></canvas>
    </div>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Vector2D } from "@/libs/vector2d"
const canvasRef = ref<HTMLCanvasElement | null>(null);
/**
 * 
 * @param context canvas上下文
 * @param v0 初始向量
 * @param length 树枝长度
 * @param thickness 树枝宽度
 * @param dir 树枝旋转角度
 * @param bias 随机变向因子
 */
const drawBranch = (context: CanvasRenderingContext2D, v0: Vector2D, length: number, thickness: number, dir: number, bias: number) => {
    const v = new Vector2D().rotate(dir).scale(length);
    const v1 = v0.copy().add(v)
    context.lineWidth = thickness;
    context.beginPath();
    context.moveTo(v0.x, v0.y);
    context.lineTo(v1.x, v1.y);
    context.stroke();
    if (thickness > 2) {
        const left = Math.PI / 4 + 0.5 * (dir - 0.2) + (Math.random() - 0.5) * bias;
        drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9)
        const right = Math.PI / 4 + 0.5 * (dir + 0.2) + (Math.random() - 0.5) * bias;
        drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9)
    }


}
onMounted(() => {
    if (!canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d') as CanvasRenderingContext2D;

    // 背景
    ctx.fillStyle = "pink";
    const { width, height } = canvasRef.value;
    ctx.fillRect(0, 0, width, height)

    ctx.translate(0, canvasRef.value.height);
    ctx.scale(1, -1);
    ctx.lineCap = 'round';

    // draw
    const v0 = new Vector2D(256, 0);
    drawBranch(ctx, v0, 50, 10, Math.PI / 2, 3)


})
</script>