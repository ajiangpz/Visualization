<template>
    <div id="app">
        <canvas id="canvas" ref="canvasRef" width="600" height="600"></canvas>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if (canvasRef.value) {
        const gl = canvasRef.value.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        // Vertex shader
        const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 vUv;
  
      void main() {
        vUv = (a_position + 1.0) * 0.5;  // Transform coordinates from [-1, 1] to [0, 1]
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
      `;

        // Fragment shader with evenly distributed grid
        const fragmentShaderSource = `
      precision mediump float;
      varying vec2 vUv;
  
      void main() {
        vec2 st = mod(vUv * 60.0, 1.0);  // Use mod instead of fract for uniform distribution
        float d1 = step(st.x, 0.9);
        float d2 = step(0.1, st.y);
        gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
        gl_FragColor.a = 1.0;
      }
      `;

        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (shader) {
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                return shader;
            }
            return null;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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

            const vertices = new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1,
            ]);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

    }
});
</script>
  
<style scoped>
#app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
  