import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

class ImageOptimizer {
  private readonly CACHE_DIR = `${FileSystem.cacheDirectory}optimized_images/`;

  async initialize(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.CACHE_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to initialize image cache directory:', error);
    }
  }

  async optimizeImage(
    uri: string,
    options: OptimizationOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    try {
      // Generate cache key
      const cacheKey = this.generateCacheKey(uri, options);
      const cachedPath = `${this.CACHE_DIR}${cacheKey}.${format}`;

      // Check if optimized version exists
      const cachedInfo = await FileSystem.getInfoAsync(cachedPath);
      if (cachedInfo.exists) {
        return cachedPath;
      }

      // Optimize image
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: maxWidth,
              height: maxHeight,
            },
          },
        ],
        {
          compress: quality,
          format: format === 'jpeg' ? ImageManipulator.SaveFormat.JPEG : ImageManipulator.SaveFormat.PNG,
        }
      );

      // Move to cache directory
      await FileSystem.moveAsync({
        from: result.uri,
        to: cachedPath,
      });

      return cachedPath;
    } catch (error) {
      console.error('Failed to optimize image:', error);
      return uri; // Return original URI if optimization fails
    }
  }

  private generateCacheKey(uri: string, options: OptimizationOptions): string {
    const optionsString = JSON.stringify(options);
    const combined = `${uri}_${optionsString}`;
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString();
  }

  async clearCache(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.CACHE_DIR);
        await FileSystem.makeDirectoryAsync(this.CACHE_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to clear image cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (!dirInfo.exists) return 0;

      const files = await FileSystem.readDirectoryAsync(this.CACHE_DIR);
      let totalSize = 0;

      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${this.CACHE_DIR}${file}`);
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  }

  // Preload and optimize images for better performance
  async preloadImages(uris: string[], options?: OptimizationOptions): Promise<void> {
    const promises = uris.map(uri => this.optimizeImage(uri, options));
    
    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Failed to preload images:', error);
    }
  }
}

export default new ImageOptimizer();