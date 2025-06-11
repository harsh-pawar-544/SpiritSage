import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSpirits } from '../contexts/SpiritsContext';
import { useAuth } from '../contexts/AuthContext';

export default function MyBarScreen() {
  const navigation = useNavigation();
  const { myBarSpirits, removeSpiritFromMyBar, updateMyBarNotes, loadMyBarSpirits } = useSpirits();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpirits, setFilteredSpirits] = useState(myBarSpirits);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyBarSpirits();
    }
  }, [isAuthenticated, loadMyBarSpirits]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = myBarSpirits.filter(spirit =>
        spirit.spirit_data?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpirits(filtered);
    } else {
      setFilteredSpirits(myBarSpirits);
    }
  }, [searchQuery, myBarSpirits]);

  // --- CORRECTED handleRemoveSpirit FUNCTION ---
  const handleRemoveSpirit = (userSpiritRecordId: string, spiritName: string) => { // Renamed parameter for clarity
    Alert.alert(
      'Remove from My Bar',
      `Are you sure you want to remove ${spiritName} from your bar?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              // Pass the userSpiritRecordId (which is item.id from renderSpiritCard)
              await removeSpiritFromMyBar(userSpiritRecordId); 
            } catch (error: any) { // Catch as any to access error.message
              console.error('Error removing spirit from UI:', error); // Log the actual error
              Alert.alert('Error', error.message || 'Failed to remove spirit from your bar.'); // Display specific error message
            }
          }
        }
      ]
    );
  };
  // --- END CORRECTED handleRemoveSpirit FUNCTION ---

  // --- CORRECTED handleSaveNotes and handleEditNotes to use userSpiritRecordId ---
  const handleEditNotes = (spirit: any) => {
    // We now use the unique 'id' of the user_spirits record for editing notes as well
    setEditingNotes(spirit.id); // Use spirit.id here
    setNotesText(spirit.notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    if (editingNotes) { // editingNotes now holds the user_spirits record ID
      try {
        // Pass the user_spirits record ID to updateMyBarNotes
        await updateMyBarNotes(editingNotes, notesText); // Update this line to pass the correct ID
        setShowNotesModal(false);
        setEditingNotes(null);
        setNotesText('');
      } catch (error: any) { // Catch as any to access error.message
        console.error('Error updating My Bar notes from UI:', error); // Log the actual error
        Alert.alert('Error', error.message || 'Failed to update notes.'); // Display specific error message
      }
    }
  };
  // --- END CORRECTED handleSaveNotes and handleEditNotes ---

  const navigateToSpirit = (spirit: any) => {
    switch (spirit.spirit_type) {
      case 'alcohol_type':
        navigation.navigate('AlcoholType' as never, { id: spirit.spirit_id } as never);
        break;
      case 'subtype':
        navigation.navigate('Subtype' as never, { id: spirit.spirit_id } as never);
        break;
      case 'brand':
        navigation.navigate('Brand' as never, { id: spirit.spirit_id } as never);
        break;
    }
  };

  const renderSpiritCard = ({ item }: { item: any }) => {
    const spiritData = item.spirit_data;
    if (!spiritData) return null;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigateToSpirit(item)}
      >
        <Image
          source={{ 
            uri: spiritData.image_url || spiritData.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg' 
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{spiritData.name}</Text>
          <Text style={styles.cardType}>{item.spirit_type.replace('_', ' ').toUpperCase()}</Text>
          {spiritData.region && (
            <Text style={styles.cardRegion}>{spiritData.region}</Text>
          )}
          {spiritData.abv && (
            <Text style={styles.cardAbv}>{spiritData.abv}% ABV</Text>
          )}
          {item.notes && (
            <Text style={styles.cardNotes} numberOfLines={2}>
              Notes: {item.notes}
            </Text>
          )}
          <Text style={styles.cardDate}>
            Added: {new Date(item.added_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditNotes(item)} // Pass the whole item, or item.id
          >
            <Ionicons name="create-outline" size={20} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            // --- CRITICAL CHANGE HERE ---
            onPress={() => handleRemoveSpirit(item.id, spiritData.name)} // Pass item.id (the user_spirits record ID)
            // --- END CRITICAL CHANGE ---
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="wine" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to view and manage your personal spirit collection.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bar</Text>
        <Text style={styles.headerSubtitle}>
          {myBarSpirits.length} spirit{myBarSpirits.length !== 1 ? 's' : ''} in your collection
        </Text>
        
        {myBarSpirits.length > 0 && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your spirits..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6b7280"
            />
          </View>
        )}
      </View>

      {filteredSpirits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wine-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>
            {myBarSpirits.length === 0 ? 'Your Bar is Empty' : 'No Matching Spirits'}
          </Text>
          <Text style={styles.emptyText}>
            {myBarSpirits.length === 0 
              ? 'Start building your collection by exploring spirits and adding them to your bar.'
              : 'Try adjusting your search to find spirits in your collection.'
            }
          </Text>
          {myBarSpirits.length === 0 && (
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Explore' as never)}
            >
              <Text style={styles.exploreButtonText}>Explore Spirits</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredSpirits}
          renderItem={renderSpiritCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Notes Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotesModal}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add your tasting notes, thoughts, or memories..."
              value={notesText}
              onChangeText={setNotesText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowNotesModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveNotes}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>
                  Save Notes
                </Text>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
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
  listContainer: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardRegion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardAbv: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardNotes: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#f3f4f6',
  },
  modalButtonPrimary: {
    backgroundColor: '#6366f1',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalButtonPrimaryText: {
    color: 'white',
  },
});