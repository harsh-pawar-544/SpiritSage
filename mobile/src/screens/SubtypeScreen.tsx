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

export default function SubtypeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { getSubtypeById, getBrandsBySubtypeId } = useSpirits();
  
  const [subtype, setSubtype] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subtypeData, brandsData] = await Promise.all([
        getSubtypeById(id),
        getBrandsBySubtypeId(id)
      ]);
      
      setSubtype(subtypeData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!subtype) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Subtype not found</Text>
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
          <Text style={styles.headerTitle}>{subtype.name}</Text>
        </View>

        {/* Image */}
        <Image 
          source={{ uri: subtype.image_url || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }} 
          style={styles.image} 
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.description}>{subtype.description}</Text>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Region:</Text>
              <Text style={styles.detailValue}>{subtype.region}</Text>
            </View>
            {subtype.abv_min && subtype.abv_max && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ABV Range:</Text>
                <Text style={styles.detailValue}>{subtype.abv_min}% - {subtype.abv_max}%</Text>
              </View>
            )}
            {subtype.production_method && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Production:</Text>
                <Text style={styles.detailValue}>{subtype.production_method}</Text>
              </View>
            )}
          </View>

          {/* Flavor Profile */}
          {subtype.flavor_profile && subtype.flavor_profile.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Flavor Profile</Text>
              <View style={styles.tagsContainer}>
                {subtype.flavor_profile.map((flavor: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{flavor}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Characteristics */}
          {subtype.characteristics && subtype.characteristics.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Characteristics</Text>
              <View style={styles.tagsContainer}>
                {subtype.characteristics.map((char: string, index: number) => (
                  <View key={index} style={[styles.tag, styles.characteristicTag]}>
                    <Text style={[styles.tagText, styles.characteristicTagText]}>{char}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Brands</Text>
              {brands.map((brand) => (
                <TouchableOpacity
                  key={brand.id}
                  style={styles.brandCard}
                  onPress={() => navigation.navigate('Brand' as never, { id: brand.id } as never)}
                >
                  <Image 
                    source={{ uri: brand.image_url || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }} 
                    style={styles.brandImage} 
                  />
                  <View style={styles.brandContent}>
                    <Text style={styles.brandName}>{brand.name}</Text>
                    <Text style={styles.brandDescription} numberOfLines={2}>
                      {brand.description}
                    </Text>
                    {brand.abv && (
                      <Text style={styles.brandAbv}>{brand.abv}% ABV</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </TouchableOpacity>
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
    width: 80,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '500',
  },
  characteristicTag: {
    backgroundColor: '#f3e8ff',
  },
  characteristicTagText: {
    color: '#6b21a8',
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  brandImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  brandContent: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  brandDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  brandAbv: {
    fontSize: 12,
    color: '#9ca3af',
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