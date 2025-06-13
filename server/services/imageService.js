const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class ImageService {
    constructor() {
        this.imageFormats = {
            thumbnail: { width: 300, height: 200, quality: 70 },
            medium: { width: 800, height: 600, quality: 80 },
            large: { width: 1200, height: 800, quality: 85 },
            avatar: { width: 200, height: 200, quality: 80 }
        };
    }
    
    async generateMultipleFormats(inputPath, outputDir, baseName) {
        const results = {};
        
        try {
            // Ensure output directory exists
            await fs.mkdir(outputDir, { recursive: true });
            
            // Generate different formats
            for (const [format, options] of Object.entries(this.imageFormats)) {
                const outputPath = path.join(outputDir, `${baseName}_${format}.jpg`);
                
                await sharp(inputPath)
                    .resize(options.width, options.height, {
                        fit: format === 'avatar' ? 'cover' : 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: options.quality })
                    .toFile(outputPath);
                
                results[format] = outputPath;
            }
            
            return results;
        } catch (error) {
            throw new Error(`Failed to generate image formats: ${error.message}`);
        }
    }
    
    async convertToWebP(inputPath, outputPath, quality = 80) {
        try {
            await sharp(inputPath)
                .webp({ quality })
                .toFile(outputPath);
            
            return outputPath;
        } catch (error) {
            throw new Error(`WebP conversion failed: ${error.message}`);
        }
    }
    
    async addWatermark(inputPath, outputPath, watermarkPath) {
        try {
            const image = sharp(inputPath);
            const { width, height } = await image.metadata();
            
            const watermark = await sharp(watermarkPath)
                .resize(Math.floor(width * 0.2))
                .png()
                .toBuffer();
            
            await image
                .composite([{
                    input: watermark,
                    gravity: 'southeast'
                }])
                .jpeg({ quality: 85 })
                .toFile(outputPath);
            
            return outputPath;
        } catch (error) {
            throw new Error(`Watermark application failed: ${error.message}`);
        }
    }
    
    async optimizeForWeb(inputPath, outputPath) {
        try {
            const { width, height } = await sharp(inputPath).metadata();
            
            // Determine optimal dimensions
            let newWidth = width;
            let newHeight = height;
            
            if (width > 1920) {
                newWidth = 1920;
                newHeight = Math.floor((height * 1920) / width);
            }
            
            await sharp(inputPath)
                .resize(newWidth, newHeight)
                .jpeg({ 
                    quality: 85,
                    progressive: true,
                    mozjpeg: true
                })
                .toFile(outputPath);
            
            return outputPath;
        } catch (error) {
            throw new Error(`Web optimization failed: ${error.message}`);
        }
    }
}

module.exports = new ImageService();
