const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

class CleanupService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_PATH || './uploads';
        this.tempDir = path.join(this.uploadDir, 'temp');
        
        // Schedule cleanup to run daily at 2 AM
        this.scheduleCleanup();
    }
    
    scheduleCleanup() {
        // Run daily at 2:00 AM
        cron.schedule('0 2 * * *', () => {
            this.performCleanup();
        });
        
        console.log('Cleanup service scheduled to run daily at 2:00 AM');
    }
    
    async performCleanup() {
        console.log('Starting file cleanup process...');
        
        try {
            const results = await Promise.all([
                this.cleanTempFiles(),
                this.cleanOrphanedFiles(),
                this.cleanOldThumbnails()
            ]);
            
            const totalCleaned = results.reduce((sum, result) => sum + result, 0);
            console.log(`Cleanup completed. Removed ${totalCleaned} files.`);
            
        } catch (error) {
            console.error('Cleanup process failed:', error);
        }
    }
    
    async cleanTempFiles(maxAge = 24) { // 24 hours
        const cutoffTime = Date.now() - (maxAge * 60 * 60 * 1000);
        let cleanedCount = 0;
        
        try {
            const files = await fs.readdir(this.tempDir);
            
            for (const file of files) {
                const filePath = path.join(this.tempDir, file);
                const stats = await fs.stat(filePath);
                
                if (stats.mtime.getTime() < cutoffTime) {
                    await fs.unlink(filePath);
                    cleanedCount++;
                }
            }
            
        } catch (error) {
            console.error('Error cleaning temp files:', error);
        }
        
        return cleanedCount;
    }
    
    async cleanOrphanedFiles() {
        // This would require database queries to check which files are still referenced
        // For now, we'll implement a basic version
        let cleanedCount = 0;
        
        try {
            // Get all listing images
            const listingsDir = path.join(this.uploadDir, 'listings');
            const files = await fs.readdir(listingsDir);
            
            // Check each file against database (would need to implement DB check)
            // For now, just clean files older than 90 days that might be orphaned
            const cutoffTime = Date.now() - (90 * 24 * 60 * 60 * 1000);
            
            for (const file of files) {
                const filePath = path.join(listingsDir, file);
                const stats = await fs.stat(filePath);
                
                // This is a simplified check - in production, you'd query the database
                if (stats.mtime.getTime() < cutoffTime) {
                    // Additional checks would go here
                    // await fs.unlink(filePath);
                    // cleanedCount++;
                }
            }
            
        } catch (error) {
            console.error('Error cleaning orphaned files:', error);
        }
        
        return cleanedCount;
    }
    
    async cleanOldThumbnails(maxAge = 30) { // 30 days
        const cutoffTime = Date.now() - (maxAge * 24 * 60 * 60 * 1000);
        let cleanedCount = 0;
        
        try {
            const thumbnailsDir = path.join(this.uploadDir, 'thumbnails');
            const files = await fs.readdir(thumbnailsDir);
            
            for (const file of files) {
                const filePath = path.join(thumbnailsDir, file);
                const stats = await fs.stat(filePath);
                
                if (stats.mtime.getTime() < cutoffTime) {
                    // Check if original file still exists
                    const originalPath = path.join(this.uploadDir, 'listings', file);
                    
                    try {
                        await fs.access(originalPath);
                        // Original exists, keep thumbnail
                    } catch {
                        // Original doesn't exist, remove thumbnail
                        await fs.unlink(filePath);
                        cleanedCount++;
                    }
                }
            }
            
        } catch (error) {
            console.error('Error cleaning thumbnails:', error);
        }
        
        return cleanedCount;
    }
    
    async getStorageStats() {
        const stats = {
            totalSize: 0,
            directories: {}
        };
        
        const directories = ['listings', 'avatars', 'documents', 'thumbnails', 'temp'];
        
        for (const dir of directories) {
            const dirPath = path.join(this.uploadDir, dir);
            
            try {
                const files = await fs.readdir(dirPath);
                let dirSize = 0;
                
                for (const file of files) {
                    const filePath = path.join(dirPath, file);
                    const stat = await fs.stat(filePath);
                    dirSize += stat.size;
                }
                
                stats.directories[dir] = {
                    fileCount: files.length,
                    size: dirSize,
                    sizeFormatted: this.formatBytes(dirSize)
                };
                
                stats.totalSize += dirSize;
                
            } catch (error) {
                stats.directories[dir] = {
                    fileCount: 0,
                    size: 0,
                    sizeFormatted: '0 B'
                };
            }
        }
        
        stats.totalSizeFormatted = this.formatBytes(stats.totalSize);
        return stats;
    }
    
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

module.exports = new CleanupService();
