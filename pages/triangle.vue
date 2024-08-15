<template>
    <div id="app">
        <h3>Canvas</h3>
        <canvas width="512" height="512" id="canvas" ref="canvasRef"></canvas>
    </div>
</template>

<script lang="ts" setup>
// triangle.js
const canvasRef = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
    // 获取 canvas 元素
    console.log(canvasRef.value);

    if (canvasRef.value) {
        const gl = canvasRef.value.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        gl.viewport(0, 0, canvasRef.value.width, canvasRef.value.height);
        // 设置视口

        // 定义顶点着色器
        const vertexShaderSource = `
        attribute vec4 a_position;
        void main() {
            gl_Position = a_position;
        }
    `;

        // 定义片段着色器
        const fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 红色
        }
    `;

        // 创建和编译着色器
        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (shader) {
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error(gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            }
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // 创建程序并链接着色器
        const program = gl.createProgram();
        if (program && vertexShader && fragmentShader) {
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
                return;
            }

            gl.useProgram(program);

            // 定义三角形的顶点
            const vertices = new Float32Array([
                0.0, 0.5, 0.0,
                -0.5, -0.5, 0.0,
                0.5, -0.5, 0.0,
            ]);

            // 创建缓冲区并绑定数据
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            // 获取属性位置并启用
            const positionLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

            // 清除画布并绘制三角形
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // 黑色背景
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
    }
})


</script>