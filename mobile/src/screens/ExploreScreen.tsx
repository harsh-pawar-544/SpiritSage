import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal, // Added Modal for filtering
  ScrollView, // Added ScrollView for filter options
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSpirits } from '../contexts/SpiritsContext';

// Assuming you'll have a way to define/fetch these options
// In a real app, these might come from your Supabase database or a separate config file
const ALL_REGIONS = ['Scotland', 'Kentucky', 'Jerez', 'Oaxaca', 'Korea', 'Japan', 'France', 'Italy'];
const ALL_FLAVOR_PROFILES = ['Smoky', 'Fruity', 'Spicy', 'Floral', 'Herbal', 'Sweet', 'Citrusy', 'Earthy'];
const ALL_PRICE_RANGES = ['$', '$$', '$$$'];
const ALL_ABV_RANGES = ['<20%', '20-40%', '40-60%', '>60%'];

export default function ExploreScreen() {
  const navigation = useNavigation();
  const { alcoholTypes, loading, error, getSubtypesByAlcoholTypeId } = useSpirits(); // Added getSubtypesByAlcoholTypeId
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTypes, setFilteredTypes] = useState(alcoholTypes);

  // --- New State for Filtering ---
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedFlavorProfiles, setSelectedFlavorProfiles] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAbvRanges, setSelectedAbvRanges] = useState<string[]>([]);
  // --- End New State for Filtering ---

  useEffect(() => {
    // This effect now needs to consider all filter criteria
    const applyFilters = async () => {
      let currentFiltered = alcoholTypes;

      // Apply search query
      if (searchQuery) {
        currentFiltered = currentFiltered.filter(type =>
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // --- Advanced Filtering Logic (Conceptual) ---
      // IMPORTANT: Filtering by subtype/brand properties (like region, ABV, flavor) on the
      // top-level 'alcoholTypes' directly is complex. The 'alcoholTypes' data
      // from your context currently only includes top-level properties (name, description, etc.).
      // To filter by subtype/brand properties here, you'd generally need:
      // 1. To modify SpiritsContext to eagerly load nested subtypes/brands with alcoholTypes.
      // 2. Or, change this screen to display a flat list of all subtypes, then filter that.
      // 3. Or, fetch all relevant subtypes/brands here and then filter them, mapping back to alcohol types.

      // For demonstration, this section assumes you'd eventually get a richer data structure
      // or filter at a deeper level. For now, it's a placeholder.
      if (selectedRegions.length > 0 || selectedFlavorProfiles.length > 0 ||
          selectedPriceRanges.length > 0 || selectedAbvRanges.length > 0) {

        // This would require fetching all subtypes for the current alcoholTypes
        // and then filtering based on subtype properties.
        // For simplicity in this `ExploreScreen` example, we'll keep it simple
        // or you'd need to modify `SpiritsContext` to return more nested data upfront.
        // A full implementation would involve:
        // - Fetching all relevant subtypes for the current alcoholTypes
        // - Filtering those subtypes by selectedRegions, selectedFlavorProfiles, etc.
        // - Mapping filtered subtypes back to their parent alcohol types or just displaying the subtypes.

        // Placeholder for filtering logic:
        // You would likely filter a collection of ALL subtypes/brands here,
        // and then present the parent AlcoholTypes that contain those filtered items.
        console.log("Applying advanced filters (logic needs to be fully implemented based on data structure):", {
          selectedRegions, selectedFlavorProfiles, selectedPriceRanges, selectedAbvRanges
        });
        // Example: if you had 'allSubtypes' available here:
        // const filteredSubtypes = allSubtypes.filter(subtype => {
        //   return (selectedRegions.length === 0 || selectedRegions.includes(subtype.region)) &&
        //          (selectedFlavorProfiles.length === 0 || subtype.flavor_profile.some(fp => selectedFlavorProfiles.includes(fp)))
        //          // ... and so on for other filters
        // });
        // Then map back to alcohol types or display filtered subtypes directly.
      }
      // --- End Advanced Filtering Logic ---

      setFilteredTypes(currentFiltered);
    };

    applyFilters();
  }, [
    searchQuery,
    alcoholTypes,
    selectedRegions,
    selectedFlavorProfiles,
    selectedPriceRanges,
    selectedAbvRanges,
    getSubtypesByAlcoholTypeId // Included if filtering involves fetching subtypes dynamically
  ]);

  // --- New functions for filtering ---
  const toggleFilter = (filterType: 'region' | 'flavor' | 'price' | 'abv', value: string) => {
    const setters = {
      'region': setSelectedRegions,
      'flavor': setSelectedFlavorProfiles,
      'price': setSelectedPriceRanges,
      'abv': setSelectedAbvRanges,
    };
    const currentList = {
      'region': selectedRegions,
      'flavor': selectedFlavorProfiles,
      'price': selectedPriceRanges,
      'abv': selectedAbvRanges,
    };

    setters[filterType]((prev: string[]) =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const applyFiltersAndCloseModal = () => {
    // The useEffect will handle applying filters when state changes
    setFilterModalVisible(false);
  };

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedFlavorProfiles([]);
    setSelectedPriceRanges([]);
    setSelectedAbvRanges([]);
    setFilterModalVisible(false); // Close after clearing
  };
  // --- End New functions for filtering ---

  // --- New Function for "My Bar" ---
  const addToMyBar = useCallback(async (item: any) => {
    // IMPORTANT: This is where you'd typically interact with your backend
    // to save this spirit to the currently logged-in user's collection.
    // This requires:
    // 1. User Authentication (e.g., Supabase Auth).
    // 2. A new table in Supabase (e.g., `user_spirits`) with columns like `user_id`, `spirit_id`, `added_date`.
    // 3. A new function in `SpiritsContext` (e.g., `addSpiritToMyBar`) to handle the Supabase insertion.
    try {
      console.log(`Adding ${item.name} to My Bar (conceptual).`);
      // Example (assuming `addSpiritToMyBar` exists in SpiritsContext and user is authenticated):
      // await addSpiritToMyBar(item.id);
      // alert(`${item.name} added to your bar!`);
      alert(`Feature coming soon: ${item.name} added to your bar!`); // Placeholder alert
    } catch (e) {
      console.error("Failed to add to My Bar:", e);
      alert("Could not add to My Bar. Please try again.");
    }
  }, []);
  // --- End New Function for "My Bar" ---


  const renderSpiritCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AlcoholType' as never, { id: item.id } as never)}
    >
      <Image
        source={{ uri: item.image_url || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' }}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {/* --- New "Add to My Bar" Button --- */}
        <TouchableOpacity
          style={styles.addToBarButton}
          onPress={() => addToMyBar(item)}
        >
          <Ionicons name="bookmark-outline" size={20} color="white" />
          <Text style={styles.addToBarButtonText}>Add to My Bar</Text>
        </TouchableOpacity>
        {/* --- End New "Add to My Bar" Button --- */}
      </View>
    </TouchableOpacity>
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
          {/* --- New Filter Button --- */}
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#1f2937" />
          </TouchableOpacity>
          {/* --- End New Filter Button --- */}
        </View>
      </View>

      <FlatList
        data={filteredTypes}
        renderItem={renderSpiritCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* --- New Filter Modal --- */}
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
              <View style={styles.filterButtonGroup}>
                {ALL_REGIONS.map(region => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.filterChip,
                      selectedRegions.includes(region) && styles.filterChipSelected,
                    ]}
                    onPress={() => toggleFilter('region', region)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedRegions.includes(region) && styles.filterChipTextSelected,
                    ]}>
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Flavor Profile Filter */}
              <Text style={styles.filterSectionTitle}>Flavor Profile</Text>
              <View style={styles.filterButtonGroup}>
                {ALL_FLAVOR_PROFILES.map(profile => (
                  <TouchableOpacity
                    key={profile}
                    style={[
                      styles.filterChip,
                      selectedFlavorProfiles.includes(profile) && styles.filterChipSelected,
                    ]}
                    onPress={() => toggleFilter('flavor', profile)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedFlavorProfiles.includes(profile) && styles.filterChipTextSelected,
                    ]}>
                      {profile}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Range Filter */}
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.filterButtonGroup}>
                {ALL_PRICE_RANGES.map(range => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterChip,
                      selectedPriceRanges.includes(range) && styles.filterChipSelected,
                    ]}
                    onPress={() => toggleFilter('price', range)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedPriceRanges.includes(range) && styles.filterChipTextSelected,
                    ]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ABV Range Filter */}
              <Text style={styles.filterSectionTitle}>ABV Range</Text>
              <View style={styles.filterButtonGroup}>
                {ALL_ABV_RANGES.map(range => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.filterChip,
                      selectedAbvRanges.includes(range) && styles.filterChipSelected,
                    ]}
                    onPress={() => toggleFilter('abv', range)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedAbvRanges.includes(range) && styles.filterChipTextSelected,
                    ]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={clearAllFilters}>
                <Text style={styles.modalButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={applyFiltersAndCloseModal}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* --- End New Filter Modal --- */}
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
    backgroundColor: '#e5e7eb', // Light gray background
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
    marginBottom: 8, // Added margin for button
  },
  addToBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1', // Indigo color
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start', // Align button to start
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
  // --- New Modal Styles ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Dim background
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
    width: '90%', // Adjust width for web responsiveness
    maxWidth: 500, // Max width for larger screens
    maxHeight: '80%', // Limit height
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
  // --- End New Modal Styles ---
});