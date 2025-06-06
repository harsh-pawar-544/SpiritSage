import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  spiritId?: string;
  type?: 'recommendation' | 'new_spirit' | 'rating_reminder';
  title: string;
  body: string;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Request permissions
      await this.requestPermissions();
      
      // Get push token
      const token = await this.registerForPushNotificationsAsync();
      if (token) {
        this.expoPushToken = token;
        await AsyncStorage.setItem('expoPushToken', token);
        console.log('Push token:', token);
      }

      // Set up notification listeners
      this.setupNotificationListeners();
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  private async registerForPushNotificationsAsync(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  private setupNotificationListeners(): void {
    // Handle notification received while app is foregrounded
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification response (user tapped notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data as NotificationData;
      
      // Handle navigation based on notification data
      if (data.spiritId) {
        // Navigate to spirit detail screen
        // This would be handled by your navigation system
      }
    });
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: trigger || null,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Schedule a reminder to rate a spirit
  async scheduleRatingReminder(spiritName: string, spiritId: string): Promise<string> {
    const trigger = {
      seconds: 24 * 60 * 60, // 24 hours
    };

    return this.scheduleLocalNotification(
      'How was that spirit?',
      `Rate your experience with ${spiritName}`,
      {
        spiritId,
        type: 'rating_reminder',
        title: 'Rate Spirit',
        body: `Rate your experience with ${spiritName}`,
      },
      trigger
    );
  }

  // Schedule daily recommendation
  async scheduleDailyRecommendation(): Promise<string> {
    const trigger = {
      hour: 18, // 6 PM
      minute: 0,
      repeats: true,
    };

    return this.scheduleLocalNotification(
      'Discover Something New',
      'Check out today\'s spirit recommendation!',
      {
        type: 'recommendation',
        title: 'Daily Recommendation',
        body: 'Check out today\'s spirit recommendation!',
      },
      trigger
    );
  }
}

export default new NotificationService();