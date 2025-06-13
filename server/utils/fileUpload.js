const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

class FileUploadManager {
    constructor() {
        this.uploadDir = process.env.UPLOAD_PATH || './uploads';
        this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5000000; // 5MB
        
        this.ensureDirectoriesExist();
    }
    
    ensureDirectoriesExist() {
        const directories = [
            path.join(this.uploadDir, 'listings'),
            path.join(this.uploadDir, 'avatars'),
            path.join(this.uploadDir, 'documents'),
            path.join(this.uploadDir, 'temp'),
            path.join(this.uploadDir, 'thumbnails')
        ];
        
        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    generateFilename(originalName, prefix = '') {
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(originalName);
        
        return `${prefix}${timestamp}-${randomString}${extension}`;
    }
    
    async processImage(inputPath, outputPath, options = {}) {
        const {
            width = 800,
            height = 600,
            quality = 80,
            format = 'jpeg'
        } = options;
        
        try {
            await sharp(inputPath)
                .resize(width, height, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality })
                .toFile(outputPath);
            
            return outputPath;
        } catch (error) {
            throw new Error(`Image processing failed: ${error.message}`);
        }
    }
    
    async createThumbnail(inputPath, outputPath, size = 200) {
        try {
            await sharp(inputPath)
                .resize(size, size, {
                    fit: 'cover'
                })
                .jpeg({ quality: 70 })
                .toFile(outputPath);
            
            return outputPath;
        } catch (error) {
            throw new Error(`Thumbnail creation failed: ${error.message}`);
        }
    }
    
    async optimizeListingImages(files) {
        const optimizedImages = [];
        
        for (const file of files) {
            try {
                const filename = this.generateFilename(file.originalname, 'listing-');
                const outputPath = path.join(this.uploadDir, 'listings', filename);
                const thumbnailPath = path.join(this.uploadDir, 'thumbnails', filename);
                
                // Process main image
                await this.processImage(file.path, outputPath, {
                    width: 1200,
                    height: 800,
                    quality: 85
                });
                
                // Create thumbnail
                await this.createThumbnail(outputPath, thumbnailPath);
                
                // Delete temporary file
                fs.unlinkSync(file.path);
                
                optimizedImages.push({
                    url: `/uploads/listings/${filename}`,
                    thumbnail: `/uploads/thumbnails/${filename}`,
                    filename: filename,
                    originalName: file.originalname
                });
                
            } catch (error) {
                console.error('Error processing image:', error);
                // Clean up on error
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }
        
        return optimizedImages;
    }
    
    async optimizeAvatar(file) {
        try {
            const filename = this.generateFilename(file.originalname, 'avatar-');
            const outputPath = path.join(this.uploadDir, 'avatars', filename);
            
            // Process avatar (square, smaller size)
            await this.processImage(file.path, outputPath, {
                width: 400,
                height: 400,
                quality: 80
            });
            
            // Delete temporary file
            fs.unlinkSync(file.path);
            
            return {
                url: `/uploads/avatars/${filename}`,
                filename: filename,
                originalName: file.originalname
            };
            
        } catch (error) {
            // Clean up on error
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }
    
    deleteFile(filePath) {
        try {
            const fullPath = path.join(__dirname, '..', filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                
                // Also delete thumbnail if it exists
                const thumbnailPath = fullPath.replace('/listings/', '/thumbnails/');
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
                
                return true;
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    
    async cleanupOldFiles(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const tempDir = path.join(this.uploadDir, 'temp');
        
        try {
            const files = fs.readdirSync(tempDir);
            let deletedCount = 0;
            
            for (const file of files) {
                const filePath = path.join(tempDir, file);
                const stats = fs.statSync(filePath);
                
                if (stats.mtime < cutoffDate) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            }
            
            console.log(`Cleaned up ${deletedCount} old temporary files`);
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
    
    validateFile(file) {
        const errors = [];
        
        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push(`File size exceeds limit of ${this.maxFileSize / 1000000}MB`);
        }
        
        // Check file type for images
        if (file.mimetype.startsWith('image/') && !this.allowedImageTypes.includes(file.mimetype)) {
            errors.push('Invalid image format. Allowed: JPEG, PNG, WebP');
        }
        
        // Check filename
        if (!file.originalname || file.originalname.length > 255) {
            errors.push('Invalid filename');
        }
        
        return errors;
    }
    
    getFileStats() {
        const stats = {
            totalFiles: 0,
            totalSize: 0,
            directories: {}
        };
        
        const directories = ['listings', 'avatars', 'documents', 'thumbnails'];
        
        directories.forEach(dir => {
            const dirPath = path.join(this.uploadDir, dir);
            
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath);
                let dirSize = 0;
                
                files.forEach(file => {
                    const filePath = path.join(dirPath, file);
                    const stats = fs.statSync(filePath);
                    dirSize += stats.size;
                });
                
                stats.directories[dir] = {
                    fileCount: files.length,
                    size: dirSize
                };
                
                stats.totalFiles += files.length;
                stats.totalSize += dirSize;
            }
        });
        
        return stats;
    }
}

module.exports = new FileUploadManager();
