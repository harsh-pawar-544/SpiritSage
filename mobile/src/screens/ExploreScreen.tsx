import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSpirits } from '../contexts/SpiritsContext';
import { useAuth } from '../contexts/AuthContext';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const { 
    getFilteredSpirits, 
    getAvailableFilterOptions, 
    addSpiritToMyBar, 
    isInMyBar,
    loading, 
    error 
  } = useSpirits();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState({ alcoholTypes: [], subtypes: [], brands: [] });

  // Filter state
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedFlavorProfiles, setSelectedFlavorProfiles] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAbvRanges, setSelectedAbvRanges] = useState<string[]>([]);
  const [selectedAgeStatements, setSelectedAgeStatements] = useState<string[]>([]);
  const [selectedDistilleries, setSelectedDistilleries] = useState<string[]>([]);

  // Get available filter options
  const filterOptions = getAvailableFilterOptions();

  useEffect(() => {
    const applyFilters = () => {
      const filters = {
        regions: selectedRegions,
        flavorProfiles: selectedFlavorProfiles,
        priceRanges: selectedPriceRanges,
        abvRanges: selectedAbvRanges,
        ageStatements: selectedAgeStatements,
        distilleries: selectedDistilleries,
      };

      const result = getFilteredSpirits(filters, searchQuery);
      setFilteredData(result);
    };

    applyFilters();
  }, [
    searchQuery,
    selectedRegions,
    selectedFlavorProfiles,
    selectedPriceRanges,
    selectedAbvRanges,
    selectedAgeStatements,
    selectedDistilleries,
    getFilteredSpirits
  ]);

  const toggleFilter = (filterType: string, value: string) => {
    const setters = {
      'region': setSelectedRegions,
      'flavor': setSelectedFlavorProfiles,
      'price': setSelectedPriceRanges,
      'abv': setSelectedAbvRanges,
      'age': setSelectedAgeStatements,
      'distillery': setSelectedDistilleries,
    };

    const currentLists = {
      'region': selectedRegions,
      'flavor': selectedFlavorProfiles,
      'price': selectedPriceRanges,
      'abv': selectedAbvRanges,
      'age': selectedAgeStatements,
      'distillery': selectedDistilleries,
    };

    const setter = setters[filterType as keyof typeof setters];
    const currentList = currentLists[filterType as keyof typeof currentLists];

    if (setter && currentList) {
      setter((prev: string[]) =>
        prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
      );
    }
  };

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedFlavorProfiles([]);
    setSelectedPriceRanges([]);
    setSelectedAbvRanges([]);
    setSelectedAgeStatements([]);
    setSelectedDistilleries([]);
    setFilterModalVisible(false);
  };

  const addToMyBar = useCallback(async (item: any, type: 'alcohol_type' | 'subtype' | 'brand') => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to add spirits to your bar.');
      return;
    }

    try {
      await addSpiritToMyBar(item.id, type);
      Alert.alert('Success', `${item.name} added to your bar!`);
    } catch (error) {
      console.error('Failed to add to My Bar:', error);
      Alert.alert('Error', 'Could not add to My Bar. Please try again.');
    }
  }, [isAuthenticated, addSpiritToMyBar]);

  const renderSpiritCard = ({ item, type }: { item: any; type: 'alcohol_type' | 'subtype' | 'brand' }) => {
    const inMyBar = isInMyBar(item.id);
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (type === 'alcohol_type') {
            navigation.navigate('AlcoholType' as never, { id: item.id } as never);
          } else if (type === 'subtype') {
            navigation.navigate('Subtype' as never, { id: item.id } as never);
          } else {
            navigation.navigate('Brand' as never, { id: item.id } as never);
          }
        }}
      >
        <Image
          source={{ uri: item.image_url || item.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }}
          style={styles.cardImage}
        />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {type === 'subtype' && item.region && (
            <Text style={styles.cardRegion}>{item.region}</Text>
          )}
          {type === 'brand' && item.abv && (
            <Text style={styles.cardAbv}>{item.abv}% ABV</Text>
          )}
          
          <TouchableOpacity
            style={[styles.addToBarButton, inMyBar && styles.addToBarButtonAdded]}
            onPress={() => addToMyBar(item, type)}
            disabled={inMyBar}
          >
            <Ionicons 
              name={inMyBar ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.addToBarButtonText}>
              {inMyBar ? 'In My Bar' : 'Add to My Bar'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChips = (options: string[], selected: string[], filterType: string) => (
    <View style={styles.filterButtonGroup}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterChip,
            selected.includes(option) && styles.filterChipSelected,
          ]}
          onPress={() => toggleFilter(filterType, option)}
        >
          <Text style={[
            styles.filterChipText,
            selected.includes(option) && styles.filterChipTextSelected,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading spirits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Error loading spirits</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Combine all filtered results for display
  const allFilteredItems = [
    ...filteredData.alcoholTypes.map(item => ({ ...item, type: 'alcohol_type' as const })),
    ...filteredData.subtypes.map(item => ({ ...item, type: 'subtype' as const })),
    ...filteredData.brands.map(item => ({ ...item, type: 'brand' as const }))
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Spirits</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spirits..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6b7280"
          />
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={allFilteredItems}
        renderItem={({ item }) => renderSpiritCard({ item, type: item.type })}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Filter Spirits</Text>

            <ScrollView style={styles.filterOptionsContainer}>
              {/* Region Filter */}
              <Text style={styles.filterSectionTitle}>Region</Text>
              {renderFilterChips(filterOptions.regions, selectedRegions, 'region')}

              {/* Flavor Profile Filter */}
              <Text style={styles.filterSectionTitle}>Flavor Profile</Text>
              {renderFilterChips(filterOptions.flavorProfiles, selectedFlavorProfiles, 'flavor')}

              {/* Price Range Filter */}
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              {renderFilterChips(filterOptions.priceRanges, selectedPriceRanges, 'price')}

              {/* ABV Range Filter */}
              <Text style={styles.filterSectionTitle}>ABV Range</Text>
              {renderFilterChips(filterOptions.abvRanges, selectedAbvRanges, 'abv')}

              {/* Age Statements Filter */}
              <Text style={styles.filterSectionTitle}>Age Statements</Text>
              {renderFilterChips(filterOptions.ageStatements, selectedAgeStatements, 'age')}

              {/* Distilleries Filter */}
              <Text style={styles.filterSectionTitle}>Distilleries</Text>
              {renderFilterChips(filterOptions.distilleries.slice(0, 20), selectedDistilleries, 'distillery')}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={clearAllFilters}>
                <Text style={styles.modalButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  cardRegion: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardAbv: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginBottom: 8,
  },
  addToBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addToBarButtonAdded: {
    backgroundColor: '#10b981',
  },
  addToBarButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  filterOptionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 15,
    marginBottom: 10,
  },
  filterButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  filterChipSelected: {
    backgroundColor: '#6366f1',
  },
  filterChipText: {
    color: '#1f2937',
    fontSize: 14,
  },
  filterChipTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  modalButtonPrimary: {
    backgroundColor: '#6366f1',
  },
  modalButtonPrimaryText: {
    color: 'white',
  },
});