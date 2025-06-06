import { Segment } from 'expo-analytics-segment';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

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

class AnalyticsService {
  private isInitialized = false;

  async initialize(writeKey: string): Promise<void> {
    try {
      await Segment.initialize({ writeKey });
      this.isInitialized = true;
      
      // Track app installation/first open
      const hasLaunchedBefore = await this.hasLaunchedBefore();
      if (!hasLaunchedBefore) {
        this.track('App Installed', {
          version: Application.nativeApplicationVersion,
          buildNumber: Application.nativeBuildVersion,
          platform: Device.osName,
        });
      }

      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  private async hasLaunchedBefore(): Promise<boolean> {
    // This would typically check AsyncStorage for a flag
    // For now, we'll assume it's a new install
    return false;
  }

  identify(userId: string, traits: UserProperties = {}): void {
    if (!this.isInitialized) return;

    try {
      Segment.identify(userId, {
        ...traits,
        platform: Device.osName,
        appVersion: Application.nativeApplicationVersion,
      });
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }

  track(event: string, properties: EventProperties = {}): void {
    if (!this.isInitialized) return;

    try {
      Segment.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: Device.osName,
      });
    } catch (error) {
      console.error('Analytics track error:', error);
    }
  }

  screen(name: string, properties: EventProperties = {}): void {
    if (!this.isInitialized) return;

    try {
      Segment.screen(name, properties);
    } catch (error) {
      console.error('Analytics screen error:', error);
    }
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
}

export default new AnalyticsService();