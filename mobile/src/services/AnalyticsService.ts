// Simple analytics service without external dependencies
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProperties {
  userId?: string;
  email?: string;
  preferredSpirit?: string;
  theme?: string;
  language?: string;
}

interface EventProperties {
  [key: string]: any;
}

interface AnalyticsEvent {
  event: string;
  properties: EventProperties;
  timestamp: string;
  userId?: string;
}

class AnalyticsService {
  private isInitialized = false;
  private userId?: string;
  private userProperties: UserProperties = {};
  private events: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = 'spiritsage_analytics_events';
  private readonly MAX_EVENTS = 100;

  async initialize(writeKey?: string): Promise<void> {
    try {
      this.isInitialized = true;
      
      // Load stored events
      await this.loadStoredEvents();
      
      // Track app installation/first open
      const hasLaunchedBefore = await this.hasLaunchedBefore();
      if (!hasLaunchedBefore) {
        this.track('App Installed', {
          version: Application.nativeApplicationVersion,
          buildNumber: Application.nativeBuildVersion,
          platform: Device.osName,
        });
        await AsyncStorage.setItem('spiritsage_has_launched', 'true');
      }

      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  private async hasLaunchedBefore(): Promise<boolean> {
    try {
      const hasLaunched = await AsyncStorage.getItem('spiritsage_has_launched');
      return hasLaunched === 'true';
    } catch {
      return false;
    }
  }

  private async loadStoredEvents(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored events:', error);
    }
  }

  private async storeEvents(): Promise<void> {
    try {
      // Keep only the most recent events
      const eventsToStore = this.events.slice(-this.MAX_EVENTS);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventsToStore));
    } catch (error) {
      console.error('Failed to store events:', error);
    }
  }

  identify(userId: string, traits: UserProperties = {}): void {
    if (!this.isInitialized) return;

    try {
      this.userId = userId;
      this.userProperties = {
        ...traits,
        platform: Device.osName,
        appVersion: Application.nativeApplicationVersion,
      };

      this.track('User Identified', { userId, ...traits });
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }

  track(event: string, properties: EventProperties = {}): void {
    if (!this.isInitialized) return;

    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          platform: Device.osName,
          ...this.userProperties,
        },
        timestamp: new Date().toISOString(),
        userId: this.userId,
      };

      this.events.push(analyticsEvent);
      this.storeEvents();

      // Log in development
      if (__DEV__) {
        console.log('Analytics Event:', event, properties);
      }
    } catch (error) {
      console.error('Analytics track error:', error);
    }
  }

  screen(name: string, properties: EventProperties = {}): void {
    this.track('Screen Viewed', { screen: name, ...properties });
  }

  // Spirit-specific tracking methods
  trackSpiritViewed(spiritId: string, spiritName: string, category: string): void {
    this.track('Spirit Viewed', {
      spiritId,
      spiritName,
      category,
    });
  }

  trackSpiritRated(spiritId: string, spiritName: string, rating: number): void {
    this.track('Spirit Rated', {
      spiritId,
      spiritName,
      rating,
    });
  }

  trackSearchPerformed(query: string, resultsCount: number): void {
    this.track('Search Performed', {
      query,
      resultsCount,
    });
  }

  trackCategoryExplored(category: string): void {
    this.track('Category Explored', {
      category,
    });
  }

  trackUserPreferenceChanged(preference: string, value: any): void {
    this.track('User Preference Changed', {
      preference,
      value,
    });
  }

  trackAppOpened(): void {
    this.track('App Opened', {
      timestamp: new Date().toISOString(),
    });
  }

  trackAppBackgrounded(): void {
    this.track('App Backgrounded', {
      timestamp: new Date().toISOString(),
    });
  }

  // Get stored events for debugging or export
  async getStoredEvents(): Promise<AnalyticsEvent[]> {
    await this.loadStoredEvents();
    return this.events;
  }

  // Clear all stored events
  async clearEvents(): Promise<void> {
    this.events = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }
}

export default new AnalyticsService();