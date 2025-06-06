import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSpirits } from '../contexts/SpiritsContext';

export default function BrandScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { getBrandById } = useSpirits();
  
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const brandData = await getBrandById(id);
      setBrand(brandData);
    } catch (error) {
      console.error('Error fetching brand:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!brand) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Brand not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{brand.name}</Text>
        </View>

        {/* Image */}
        <Image 
          source={{ uri: brand.image_url || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }} 
          style={styles.image} 
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.description}>{brand.description}</Text>

          {/* Details */}
          <View style={styles.detailsContainer}>
            {brand.abv && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ABV:</Text>
                <Text style={styles.detailValue}>{brand.abv}%</Text>
              </View>
            )}
            {brand.price_range && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Price Range:</Text>
                <Text style={styles.detailValue}>{brand.price_range}</Text>
              </View>
            )}
          </View>

          {/* Tasting Notes */}
          {brand.tasting_notes && brand.tasting_notes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tasting Notes</Text>
              <View style={styles.tagsContainer}>
                {brand.tasting_notes.map((note: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{note}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* History */}
          {brand.history && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>History</Text>
              <Text style={styles.sectionText}>{brand.history}</Text>
            </View>
          )}

          {/* Fun Facts */}
          {brand.fun_facts && brand.fun_facts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fun Facts</Text>
              {brand.fun_facts.map((fact: string, index: number) => (
                <View key={index} style={styles.factItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Myths */}
          {brand.myths && brand.myths.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Myths & Misconceptions</Text>
              {brand.myths.map((myth: string, index: number) => (
                <View key={index} style={styles.factItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.factText}>{myth}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  factItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#6366f1',
    marginRight: 8,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
});