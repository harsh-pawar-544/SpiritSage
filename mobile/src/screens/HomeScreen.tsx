import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  const featuredSpirits = [
    {
      id: 'whiskey',
      name: 'Whiskey',
      description: 'From smooth bourbon to peaty scotch',
      image: 'https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg',
    },
    {
      id: 'gin',
      name: 'Gin',
      description: 'Botanical-infused spirits',
      image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg',
    },
    {
      id: 'rum',
      name: 'Rum',
      description: 'Caribbean spirits from sugarcane',
      image: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="wine" size={32} color="#6366f1" />
            <Text style={styles.headerTitle}>SpiritSage</Text>
          </View>
          <Text style={styles.headerSubtitle}>Your AI-Powered Spirit Assistant</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover Your Perfect Spirit</Text>
          <Text style={styles.heroDescription}>
            Explore the world of fine spirits with personalized recommendations
            powered by artificial intelligence
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Explore' as never)}
          >
            <Text style={styles.exploreButtonText}>Start Exploring</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Featured Spirits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredSpirits.map((spirit) => (
              <TouchableOpacity
                key={spirit.id}
                style={styles.spiritCard}
                onPress={() => navigation.navigate('AlcoholType' as never, { id: spirit.id } as never)}
              >
                <Image source={{ uri: spirit.image }} style={styles.spiritImage} />
                <View style={styles.spiritOverlay}>
                  <Text style={styles.spiritName}>{spirit.name}</Text>
                  <Text style={styles.spiritDescription}>{spirit.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="search" size={24} color="#6366f1" />
              <Text style={styles.actionTitle}>Search Spirits</Text>
              <Text style={styles.actionDescription}>Find specific brands or types</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="heart" size={24} color="#6366f1" />
              <Text style={styles.actionTitle}>Favorites</Text>
              <Text style={styles.actionDescription}>View your saved spirits</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  hero: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    margin: 20,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  spiritCard: {
    width: width * 0.7,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  spiritImage: {
    width: '100%',
    height: '100%',
  },
  spiritOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  spiritName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  spiritDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});