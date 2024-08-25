<template>
    <div id="app">
        <h3>Canvas</h3>
        <canvas width="512" height="512" id="canvas" ref="canvasRef"></canvas>
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

        gl.viewport(0, 0, canvasRef.value.width, canvasRef.value.height);

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
            return null;
        }
        const vertexShaderSource = `
  attribute vec2 a_position;

  uniform float u_rotation;
  uniform float u_time;
  uniform float u_duration;
  uniform float u_scale;
  uniform vec2 u_dir;

  varying float vP;

  void main() {
    float p = min(1.0, u_time / u_duration);
    float rad = u_rotation + 3.14 * 10.0 * p;
    float scale = u_scale * p * (2.0 - p);
    vec2 offset = 2.0 * u_dir * p * p;
    mat3 translateMatrix = mat3(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      offset.x, offset.y, 1.0
    );
    mat3 rotateMatrix = mat3(
      cos(rad), sin(rad), 0.0,
      -sin(rad), cos(rad), 0.0,
      0.0, 0.0, 1.0
    );
    mat3 scaleMatrix = mat3(
      scale, 0.0, 0.0,
      0.0, scale, 0.0,
      0.0, 0.0, 1.0
    );
    gl_PointSize = 1.0;
    vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * vec3(a_position, 1.0);
    gl_Position = vec4(pos, 1.0);
    vP = p;
  }
`; const fragmentShaderSource = `
  precision mediump float;
  
  uniform vec4 u_color;

  varying float vP;

  void main()
  {
    gl_FragColor.xyz = u_color.xyz;
    gl_FragColor.a = (1.0 - vP) * u_color.a;
  }    
`;
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
                0, 1,
                1, -1,
            ]);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            function randomTriangles() {
                const u_color = [Math.random(), Math.random(), Math.random(), 1.0];
                const u_rotation = Math.random() * Math.PI;
                const u_scale = Math.random() * 0.05 + 0.03;
                const u_time = 0;
                const u_duration = 3.0;
                const rad = Math.random() * Math.PI * 2;
                const u_dir = [Math.cos(rad), Math.sin(rad)];
                const startTime = performance.now();

                return { u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime };
            }

            function setUniforms(gl: WebGLRenderingContext, { u_color, u_rotation, u_scale, u_time, u_duration, u_dir }: any) {
                let loc = gl.getUniformLocation(program, 'u_color');
                gl.uniform4fv(loc, u_color);

                loc = gl.getUniformLocation(program, 'u_rotation');
                gl.uniform1f(loc, u_rotation);

                loc = gl.getUniformLocation(program, 'u_scale');
                gl.uniform1f(loc, u_scale);

                loc = gl.getUniformLocation(program, 'u_time');
                gl.uniform1f(loc, u_time);

                loc = gl.getUniformLocation(program, 'u_duration');
                gl.uniform1f(loc, u_duration);

                loc = gl.getUniformLocation(program, 'u_dir');
                gl.uniform2fv(loc, u_dir);
            }

            let triangles: any[] = [];
            function update() {

                for (let i = 0; i < 5 * Math.random(); i++) {
                    triangles.push(randomTriangles());
                }

                if (gl) {
                    gl.clear(gl.COLOR_BUFFER_BIT);

                    triangles.forEach((triangle) => {
                        triangle.u_time = (performance.now() - triangle.startTime) / 1000;
                        setUniforms(gl, triangle);
                        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
                    });

                    triangles = triangles.filter((triangle) => triangle.u_time <= triangle.u_duration);

                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }
    }
});
</script>
  
<style scoped>
#app {
    text-align: center;
}
</style>
  