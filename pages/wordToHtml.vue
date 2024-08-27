<template>
    <div>
        <h1>Word to HTML Converter</h1>
        <input type="file" @change="uploadFile" />
        <div v-if="htmlContent">
            <h2>Converted HTML</h2>
            <div v-html="htmlContent"></div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';

const htmlContent = ref<string>('');

async function uploadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
        });

        htmlContent.value = await response.text();
    } catch (error) {
        console.error('Error converting file:', error);
    }
}
</script>
  