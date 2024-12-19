// utils/ResizeImages.js
export const resizeAndConvertImages = async (files, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    try {
        // Aseguramos que files siempre sea un array
        const fileArray = Array.isArray(files) ? files : [files];

        const processedFiles = await Promise.all(
            fileArray.map((file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Lee la imagen en base64

                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    console.log("Ancho: " + img.width + " Alto: " + img.height)
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        
                        // Redimensionar la imagen manteniendo la proporción
                        if (width > maxWidth || height > maxHeight) {
                            if (width > height) {
                                height = Math.round((maxWidth / width) * height);
                                width = maxWidth;
                            } else {
                                width = Math.round((maxHeight / height) * width);
                                height = maxHeight;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        console.log("Ancho: " + width + " Alto: " + height)
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Convertir la imagen a formato WebP
                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    // Se crea un nuevo archivo con el blob resultante
                                    const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
                                    resolve(webpFile);
                                } else {
                                    reject(new Error('Error al convertir la imagen a WebP'));
                                }
                            },
                            'image/webp',
                            quality
                        );
                    };

                    img.onerror = () => reject(new Error('Error al cargar la imagen'));
                };

                reader.onerror = () => reject(new Error('Error al leer el archivo'));
            }))
        );

        return processedFiles; 
    } catch (error) {
        console.error('Error al redimensionar la imagen:', error);
        throw error;
    }
};
