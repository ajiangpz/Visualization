export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // 设置跨域属性
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
};


export const renderImageOnCanvas = async (
    canvas: HTMLCanvasElement,
    imageUrl: string,
    canvasMaxWidth: number,
    canvasMaxHeight: number
): Promise<void> => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = await loadImage(imageUrl);
    // 原始图像尺寸
    const originalWidth = image.width;
    const originalHeight = image.height;

    // 计算缩放比例
    const widthRatio = canvasMaxWidth / originalWidth;
    const heightRatio = canvasMaxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio); // 选择最小的比例，确保图片完整显示

    // 计算缩放后的尺寸
    const scaledWidth = originalWidth * ratio;
    const scaledHeight = originalHeight * ratio;

    // 设置画布尺寸
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // 绘制缩放后的图像
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
};

export const getImageData = (
    canvas: HTMLCanvasElement,
    x: number = 0,
    y: number = 0,
    width?: number,
    height?: number
): ImageData | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    width = width || canvas.width;
    height = height || canvas.height;

    return ctx.getImageData(x, y, width, height);
};

export type PixelProcessor = (r: number, g: number, b: number, a: number) => [number, number, number, number];

export const processImageData = (imageData: ImageData, processor: PixelProcessor): ImageData => {
    const { data, width, height } = imageData;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // 红色通道
        const g = data[i + 1]; // 绿色通道
        const b = data[i + 2]; // 蓝色通道
        const a = data[i + 3]; // 透明度通道

        // 使用处理函数获得新的 RGBA 值
        const [newR, newG, newB, newA] = processor(r, g, b, a);

        // 设置新的 RGBA 值
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        data[i + 3] = newA;
    }

    return new ImageData(data, width, height);
};

export const invertProcessor: PixelProcessor = (r, g, b, a) => {
    return [255 - r, 255 - g, 255 - b, a];
};
export const brightnessProcessor = (factor: number): PixelProcessor => {
    return (r, g, b, a) => {
        return [
            Math.min(r * factor, 255),
            Math.min(g * factor, 255),
            Math.min(b * factor, 255),
            a
        ];
    };
};

export const grayscaleProcessor: PixelProcessor = (r, g, b, a) => {
    const avg = (r + g + b) / 3;
    return [avg, avg, avg, a];
};

