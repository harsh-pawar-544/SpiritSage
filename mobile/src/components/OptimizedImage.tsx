import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: any;
  placeholder?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  transition?: number;
  cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';
}

export default function OptimizedImage({
  source,
  style,
  placeholder,
  contentFit = 'cover',
  transition = 200,
  cachePolicy = 'memory-disk',
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFillObject}
        contentFit={contentFit}
        transition={transition}
        placeholder={placeholder}
        cachePolicy={cachePolicy}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6366f1" />
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="image-outline" size={32} color="#9ca3af" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});