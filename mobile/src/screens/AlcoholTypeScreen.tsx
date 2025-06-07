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

export default function AlcoholTypeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { getAlcoholTypeById, getSubtypesByCategoryId, getBrandsBySubtypeId } = useSpirits();
  
  const [alcoholType, setAlcoholType] = useState<any>(null);
  const [subtypesWithBrands, setSubtypesWithBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch the alcohol type
      const typeData = await getAlcoholTypeById(id);
      setAlcoholType(typeData);
      
      // Fetch all subtypes for this alcohol type
      const subtypes = getSubtypesByCategoryId(id);
      
      // For each subtype, fetch 2-3 example brands
      const subtypesWithExamples = await Promise.all(
        subtypes.map(async (subtype) => {
          const brands = getBrandsBySubtypeId(subtype.id);
          return {
            ...subtype,
            exampleBrands: brands.slice(0, 3) // Get first 3 brands as examples
          };
        })
      );
      
      setSubtypesWithBrands(subtypesWithExamples);
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

  if (!alcoholType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Spirit not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: alcoholType.image_url || alcoholType.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }} 
            style={styles.headerImage} 
          />
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{alcoholType.name}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.description}>{alcoholType.description}</Text>

          {alcoholType.history && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>History</Text>
              <Text style={styles.sectionText}>{alcoholType.history}</Text>
            </View>
          )}

          {alcoholType.fun_facts && alcoholType.fun_facts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fun Facts</Text>
              {alcoholType.fun_facts.map((fact: string, index: number) => (
                <View key={index} style={styles.factItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          )}

          {alcoholType.myths && alcoholType.myths.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Myths & Misconceptions</Text>
              {alcoholType.myths.map((myth: string, index: number) => (
                <View key={index} style={styles.factItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.factText}>{myth}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Subtypes with Example Brands */}
          {subtypesWithBrands.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Types of {alcoholType.name}</Text>
              {subtypesWithBrands.map((subtype) => (
                <View key={subtype.id} style={styles.subtypeSection}>
                  <TouchableOpacity
                    style={styles.subtypeHeader}
                    onPress={() => navigation.navigate('Subtype' as never, { id: subtype.id } as never)}
                  >
                    <Image 
                      source={{ uri: subtype.image_url || subtype.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }} 
                      style={styles.subtypeImage} 
                    />
                    <View style={styles.subtypeContent}>
                      <Text style={styles.subtypeName}>{subtype.name}</Text>
                      <Text style={styles.subtypeDescription} numberOfLines={2}>
                        {subtype.description}
                      </Text>
                      <Text style={styles.subtypeRegion}>{subtype.region}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </TouchableOpacity>

                  {/* Example Brands Section */}
                  {subtype.exampleBrands && subtype.exampleBrands.length > 0 && (
                    <View style={styles.exampleBrandsSection}>
                      <Text style={styles.exampleBrandsTitle}>Popular {subtype.name} Brands:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {subtype.exampleBrands.map((brand: any) => (
                          <TouchableOpacity
                            key={brand.id}
                            style={styles.brandCard}
                            onPress={() => navigation.navigate('Brand' as never, { id: brand.id } as never)}
                          >
                            <Image 
                              source={{ uri: brand.image_url || brand.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }} 
                              style={styles.brandImage} 
                            />
                            <View style={styles.brandInfo}>
                              <Text style={styles.brandName} numberOfLines={1}>{brand.name}</Text>
                              <Text style={styles.brandDescription} numberOfLines={2}>
                                {brand.description}
                              </Text>
                              {brand.abv && (
                                <Text style={styles.brandAbv}>{brand.abv}% ABV</Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
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
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
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
  subtypeSection: {
    marginBottom: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  subtypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtypeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  subtypeContent: {
    flex: 1,
  },
  subtypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtypeDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  subtypeRegion: {
    fontSize: 12,
    color: '#9ca3af',
  },
  exampleBrandsSection: {
    marginTop: 8,
  },
  exampleBrandsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  brandCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  brandImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  brandDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  brandAbv: {
    fontSize: 11,
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