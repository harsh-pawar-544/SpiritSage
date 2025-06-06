import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

class CrashReportingService {
  initialize(dsn: string): void {
    try {
      Sentry.init({
        dsn,
        debug: __DEV__,
        environment: __DEV__ ? 'development' : 'production',
        beforeSend: (event) => {
          // Filter out events in development if needed
          if (__DEV__) {
            console.log('Sentry event:', event);
          }
          return event;
        },
      });

      // Set initial context
      Sentry.setContext('app', {
        name: 'SpiritSage',
        version: Application.nativeApplicationVersion,
        buildNumber: Application.nativeBuildVersion,
      });

      Sentry.setContext('device', {
        name: Device.deviceName,
        model: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
      });

      console.log('Crash reporting initialized');
    } catch (error) {
      console.error('Failed to initialize crash reporting:', error);
    }
  }

  setUser(user: { id: string; email?: string; username?: string }): void {
    Sentry.setUser(user);
  }

  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  setContext(key: string, context: any): void {
    Sentry.setContext(key, context);
  }

  captureException(error: Error, context?: any): void {
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext('additional', context);
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    Sentry.captureMessage(message, level);
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'info' | 'warning' | 'error';
    data?: any;
  }): void {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'app',
      level: breadcrumb.level || 'info',
      data: breadcrumb.data,
      timestamp: Date.now() / 1000,
    });
  }

  // Spirit-specific error tracking
  trackSpiritLoadError(spiritId: string, error: Error): void {
    this.setContext('spirit', { spiritId });
    this.captureException(error);
  }

  trackNetworkError(url: string, error: Error): void {
    this.setContext('network', { url });
    this.captureException(error);
  }

  trackUserAction(action: string, data?: any): void {
    this.addBreadcrumb({
      message: `User action: ${action}`,
      category: 'user',
      level: 'info',
      data,
    });
  }
}

export default new CrashReportingService();