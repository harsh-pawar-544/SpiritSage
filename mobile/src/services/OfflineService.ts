import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { supabase } from '../lib/supabase';

interface CachedData {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface PendingSync {
  id: string;
  type: 'rating' | 'favorite' | 'user_preference';
  data: any;
  timestamp: number;
}

class OfflineService {
  private readonly CACHE_PREFIX = 'spiritsage_cache_';
  private readonly PENDING_SYNC_KEY = 'spiritsage_pending_sync';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private isOnline = true;
  private syncInProgress = false;

  async initialize(): Promise<void> {
    // Monitor network status
    const networkState = await Network.getNetworkStateAsync();
    this.isOnline = networkState.isConnected || false;

    // Set up network listener
    Network.addNetworkStateListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected || false;
      
      // If we just came back online, sync pending changes
      if (wasOffline && this.isOnline) {
        this.syncPendingChanges();
      }
    });

    console.log('Offline service initialized. Online:', this.isOnline);
  }

  // Cache management
  private getCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}${key}`;
  }

  async cacheData(key: string, data: any, customTTL?: number): Promise<void> {
    try {
      const ttl = customTTL || this.CACHE_DURATION;
      const cachedData: CachedData = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };
      
      await AsyncStorage.setItem(this.getCacheKey(key), JSON.stringify(cachedData));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  async getCachedData(key: string): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(this.getCacheKey(key));
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() > cachedData.expiresAt) {
        await AsyncStorage.removeItem(this.getCacheKey(key));
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Data fetching with offline support
  async fetchWithCache(
    key: string,
    fetchFunction: () => Promise<any>,
    forceRefresh = false
  ): Promise<any> {
    // Try cache first if not forcing refresh and offline
    if (!forceRefresh || !this.isOnline) {
      const cached = await this.getCachedData(key);
      if (cached) {
        return cached;
      }
    }

    // If online, try to fetch fresh data
    if (this.isOnline) {
      try {
        const data = await fetchFunction();
        await this.cacheData(key, data);
        return data;
      } catch (error) {
        console.error('Failed to fetch fresh data:', error);
        // Fall back to cache if available
        const cached = await this.getCachedData(key);
        if (cached) {
          return cached;
        }
        throw error;
      }
    }

    // If offline and no cache, throw error
    throw new Error('No cached data available and device is offline');
  }

  // Pending sync management
  async addPendingSync(type: PendingSync['type'], data: any): Promise<void> {
    try {
      const pending = await this.getPendingSync();
      const newSync: PendingSync = {
        id: Date.now().toString(),
        type,
        data,
        timestamp: Date.now(),
      };
      
      pending.push(newSync);
      await AsyncStorage.setItem(this.PENDING_SYNC_KEY, JSON.stringify(pending));
    } catch (error) {
      console.error('Failed to add pending sync:', error);
    }
  }

  private async getPendingSync(): Promise<PendingSync[]> {
    try {
      const pending = await AsyncStorage.getItem(this.PENDING_SYNC_KEY);
      return pending ? JSON.parse(pending) : [];
    } catch (error) {
      console.error('Failed to get pending sync:', error);
      return [];
    }
  }

  async syncPendingChanges(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    
    try {
      const pending = await this.getPendingSync();
      const successful: string[] = [];

      for (const sync of pending) {
        try {
          await this.processPendingSync(sync);
          successful.push(sync.id);
        } catch (error) {
          console.error(`Failed to sync ${sync.type}:`, error);
        }
      }

      // Remove successful syncs
      if (successful.length > 0) {
        const remaining = pending.filter(sync => !successful.includes(sync.id));
        await AsyncStorage.setItem(this.PENDING_SYNC_KEY, JSON.stringify(remaining));
      }

      console.log(`Synced ${successful.length} pending changes`);
    } catch (error) {
      console.error('Failed to sync pending changes:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processPendingSync(sync: PendingSync): Promise<void> {
    switch (sync.type) {
      case 'rating':
        await supabase
          .from('ratings')
          .insert(sync.data);
        break;
      
      case 'favorite':
        // Implement favorite sync logic
        break;
      
      case 'user_preference':
        // Implement user preference sync logic
        break;
      
      default:
        throw new Error(`Unknown sync type: ${sync.type}`);
    }
  }

  // Utility methods
  isDeviceOnline(): boolean {
    return this.isOnline;
  }

  async getPendingSyncCount(): Promise<number> {
    const pending = await this.getPendingSync();
    return pending.length;
  }
}

export default new OfflineService();