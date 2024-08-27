import { defineEventHandler, H3Event } from 'h3';
import mammoth from 'mammoth';
import fs from 'fs';
import { Formidable, File } from 'formidable';

export default defineEventHandler(async (event: H3Event) => {
    const form = new Formidable();

    // 处理文件上传
    const files: { [key: string]: File } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(files)
            resolve(files);
        });
    });

    const file = files.file?.[0];
    if (!file) {
        event.node.res.statusCode = 400;
        return 'No file uploaded!';
    }

    try {
        // 读取文件
        console.log('readfile');

        const buffer = fs.readFileSync(file.filepath);
        console.log(buffer);

        // 使用 mammoth 将 Word 文档转换为 HTML
        const result = await mammoth.convertToHtml({ buffer });

        event.node.res.statusCode = 200;
        return result.value; // 返回HTML内容
    } catch (error) {
        event.node.res.statusCode = 500;
        return 'Error converting file!';
    }
});
