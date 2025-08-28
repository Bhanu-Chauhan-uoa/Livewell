import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FrailtyAssessmentScreen from './FrailtyAssessment';

const { width } = Dimensions.get('window');

const HomeScreen = ({ user, onLogout, onUpdateUser }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [fontSize, setFontSize] = useState('normal');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFrailtyAssessment, setShowFrailtyAssessment] = useState(false);

  const getFontSize = (baseSize) => {
    const multiplier = fontSize === 'extra-large' ? 1.4 : fontSize === 'large' ? 1.2 : 1;
    return baseSize * multiplier;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to sign out of LiveWell?');
      if (confirmed && onLogout) {
        onLogout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of LiveWell?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => onLogout && onLogout() }
        ]
      );
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'health', label: 'Health Tips', icon: '💡' },
    { id: 'events', label: 'Activities', icon: '🚶‍♀️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'help', label: 'Help', icon: '❓' }
  ];

  const handleFrailtyAssessmentComplete = (results) => {
    console.log('Frailty assessment completed:', results);
    
    // Update user data with the new frailty score
    const updatedUser = {
      ...user,
      frailtyScore: results.frailtyScore,
      frailtyCategory: results.frailtyCategory,
      lastAssessment: results.completedAt,
    };
    
    // Update user in parent component
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    
    // Close the assessment screen
    setShowFrailtyAssessment(false);
    
    // Show success message
    if (typeof window !== 'undefined') {
      window.alert(`Assessment completed! Your wellness score is ${results.frailtyScore}/5.0`);
    }
  };

  // Update your return statement at the bottom of the HomeScreen component:
  if (showFrailtyAssessment) {
    return (
      <FrailtyAssessmentScreen
        user={user}
        fontSize={fontSize}
        onComplete={handleFrailtyAssessmentComplete}
        onCancel={() => setShowFrailtyAssessment(false)}
      />
    );
  }


  const handleMenuItemPress = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const avoidFramework = [
    {
      id: 'activity',
      title: 'Stay Active',
      description: 'Keep moving with gentle exercises',
      icon: '🚶‍♂️',
      color: '#22c55e',
      tips: ['Take daily walks', 'Try chair exercises', 'Join fitness classes']
    },
    {
      id: 'vaccinate',
      title: 'Stay Protected',
      description: 'Keep your vaccinations current',
      icon: '💉',
      color: '#3b82f6',
      tips: ['Annual flu shots', 'COVID boosters', 'Pneumonia vaccines']
    },
    {
      id: 'optimize',
      title: 'Manage Medicine',
      description: 'Take medications safely',
      icon: '💊',
      color: '#f59e0b',
      tips: ['Use pill organizers', 'Review with doctor', 'Ask pharmacist questions']
    },
    {
      id: 'interact',
      title: 'Stay Connected',
      description: 'Keep in touch with others',
      icon: '👥',
      color: '#8b5cf6',
      tips: ['Call family', 'Join groups', 'Make new friends']
    },
    {
      id: 'diet',
      title: 'Eat Well',
      description: 'Enjoy healthy foods',
      icon: '🥗',
      color: '#10b981',
      tips: ['Eat colorful foods', 'Drink water', 'Include protein']
    }
  ];

  const communityEvents = [
    {
      id: 1,
      title: 'Morning Walk Group',
      location: 'Royal Botanic Gardens',
      date: 'Today, 8:00 AM',
      participants: 12,
      description: 'Join other seniors for a gentle walk through beautiful gardens.',
      difficulty: 'Easy',
      category: 'Stay Active'
    },
    {
      id: 2,
      title: 'Healthy Cooking Class',
      location: 'Community Center, Carlton',
      date: 'Tomorrow, 2:00 PM',
      participants: 8,
      description: 'Learn simple, nutritious recipes you can make at home.',
      difficulty: 'Beginner',
      category: 'Eat Well'
    },
    {
      id: 3,
      title: 'Chair Tai Chi',
      location: 'Fitzroy Gardens',
      date: 'Friday, 9:00 AM',
      participants: 15,
      description: 'Gentle movements you can do sitting down.',
      difficulty: 'Very Easy',
      category: 'Stay Active'
    }
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      backgroundColor: '#ffffff',
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#e9ecef',
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    hamburgerButton: {
      backgroundColor: '#22c55e',
      borderRadius: 12,
      padding: 12,
      marginRight: 16,
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    hamburgerIcon: {
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      backgroundColor: 'rgb(73 180 255)',
      borderRadius: 50,
      padding: 12,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImage: {
      width: 24,
      height: 24,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: getFontSize(24),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 2,
    },
    welcomeText: {
      fontSize: getFontSize(14),
      color: '#666666',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ef4444',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutEmoji: {
      fontSize: 16,
      marginRight: 8,
    },
    logoutText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: getFontSize(12),
    },
    fontSizeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 12,
    },
    fontSizeLabel: {
      fontSize: getFontSize(14),
      color: '#666666',
      marginRight: 12,
    },
    fontSizeButton: {
      borderWidth: 2,
      borderColor: '#22c55e',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginHorizontal: 3,
    },
    fontSizeButtonActive: {
      backgroundColor: '#22c55e',
    },
    fontSizeButtonText: {
      color: '#1a1a1a',
      fontWeight: '600',
    },
    fontSizeButtonTextActive: {
      color: '#ffffff',
    },
    // Hamburger menu styles
    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
    },
    menuContainer: {
      backgroundColor: '#ffffff',
      width: Math.min(320, width * 0.85),
      height: '100%',
      paddingTop: 60,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },
    menuHeader: {
      borderBottomWidth: 2,
      borderBottomColor: '#e9ecef',
      paddingBottom: 20,
      marginBottom: 20,
      alignItems: 'center',
    },
    menuLogo: {
      backgroundColor: 'rgb(73, 180, 255)',
      borderRadius: 50,
      padding: 15,
      marginBottom: 12,
    },
    menuLogoImage: {
      width: 30,
      height: 30,
    },
    menuTitle: {
      fontSize: getFontSize(24),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    menuSubtitle: {
      fontSize: getFontSize(14),
      color: '#666666',
      textAlign: 'center',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#e9ecef',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      minHeight: 64,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    menuItemActive: {
      backgroundColor: '#22c55e',
      borderColor: '#22c55e',
    },
    menuIcon: {
      fontSize: 28,
      marginRight: 16,
      minWidth: 40,
      textAlign: 'center',
    },
    menuLabel: {
      fontSize: getFontSize(18),
      fontWeight: '600',
      color: '#1a1a1a',
      flex: 1,
    },
    menuLabelActive: {
      color: '#ffffff',
    },
    closeMenuArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sectionTitle: {
      fontSize: getFontSize(24),
      fontWeight: '700',
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: 16,
    },
    sectionDescription: {
      fontSize: getFontSize(16),
      color: '#555555',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: getFontSize(24),
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 32,
    },
    statCard: {
      flex: 1,
      minWidth: (width - 72) / 2,
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e9ecef',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statIcon: {
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statIconEmoji: {
      fontSize: 24,
    },
    statNumber: {
      fontSize: getFontSize(28),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: getFontSize(12),
      color: '#666666',
      textAlign: 'center',
    },
    avoidGrid: {
      gap: 16,
      marginBottom: 32,
    },
    avoidCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      borderWidth: 3,
      borderColor: '#e9ecef',
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    avoidIcon: {
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    avoidIconEmoji: {
      fontSize: 30,
    },
    avoidTextContainer: {
      flex: 1,
    },
    avoidTitle: {
      fontSize: getFontSize(18),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    avoidDescription: {
      fontSize: getFontSize(14),
      color: '#555555',
      lineHeight: getFontSize(20),
    },
    eventCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#e9ecef',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    eventTitle: {
      fontSize: getFontSize(18),
      fontWeight: '700',
      color: '#1a1a1a',
      flex: 1,
      marginRight: 12,
    },
    participantsBadge: {
      backgroundColor: '#22c55e',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    participantsText: {
      color: '#ffffff',
      fontSize: getFontSize(12),
      fontWeight: '600',
    },
    eventDescription: {
      fontSize: getFontSize(14),
      color: '#555555',
      marginBottom: 16,
      lineHeight: getFontSize(20),
    },
    eventDetails: {
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    eventDetail: {
      fontSize: getFontSize(14),
      color: '#1a1a1a',
      marginBottom: 6,
      fontWeight: '500',
    },
    joinButton: {
      backgroundColor: '#22c55e',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    joinButtonText: {
      color: '#ffffff',
      fontSize: getFontSize(16),
      fontWeight: '600',
    },
    helpContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e9ecef',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    helpIcon: {
      backgroundColor: '#3b82f6',
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    helpIconEmoji: {
      fontSize: 30,
    },
    helpTitle: {
      fontSize: getFontSize(20),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 12,
    },
    helpText: {
      fontSize: getFontSize(16),
      color: '#555555',
      textAlign: 'center',
      lineHeight: getFontSize(24),
    },
    phoneNumber: {
      fontSize: getFontSize(18),
      fontWeight: '700',
      color: '#3b82f6',
      marginTop: 8,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: getFontSize(16),
      color: '#1a1a1a',
      fontWeight: '600',
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 2,
      borderColor: '#e9ecef',
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(16),
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      minHeight: 56,
    },
    optionButton: {
      borderWidth: 2,
      borderColor: '#e9ecef',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#ffffff',
    },
    optionButtonActive: {
      backgroundColor: '#22c55e',
      borderColor: '#22c55e',
    },
    optionButtonText: {
      fontSize: getFontSize(14),
      color: '#1a1a1a',
      fontWeight: '500',
    },
    optionButtonTextActive: {
      color: '#ffffff',
    },
    checkboxOption: {
      borderWidth: 2,
      borderColor: '#e9ecef',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#ffffff',
      margin: 2,
    },
    checkboxOptionActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    checkboxOptionText: {
      fontSize: getFontSize(12),
      color: '#1a1a1a',
      fontWeight: '500',
    },
    checkboxOptionTextActive: {
      color: '#ffffff',
    },
    tipCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: '#e9ecef',
    },
    retakeButton: {
      backgroundColor: '#8b5cf6',
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginTop: 8,
      alignItems: 'center',
    },
    retakeButtonText: {
      color: '#ffffff',
      fontSize: getFontSize(10),
      fontWeight: '600',
    },
  });

  const FontSizeButtons = () => (
    <View style={styles.fontSizeContainer}>
      <Text style={styles.fontSizeLabel}>Text Size:</Text>
      {['normal', 'large', 'extra-large'].map((size, index) => (
        <TouchableOpacity
          key={size}
          style={[
            styles.fontSizeButton,
            fontSize === size && styles.fontSizeButtonActive,
          ]}
          onPress={() => setFontSize(size)}
        >
          <Text
            style={[
              styles.fontSizeButtonText,
              { fontSize: 14 + (index * 2) },
              fontSize === size && styles.fontSizeButtonTextActive,
            ]}
          >
            A
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const HamburgerMenu = () => (
    <Modal
      visible={isMenuOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsMenuOpen(false)}
    >
      <View style={styles.menuOverlay}>
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <View style={styles.menuLogo}>
              <Image
                source={require('../assets/images/Logo.png')}
                style={styles.menuLogoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.menuTitle}>LiveWell</Text>
            <Text style={styles.menuSubtitle}>Navigate your health journey</Text>
          </View>
          
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                activeSection === item.id && styles.menuItemActive,
              ]}
              onPress={() => handleMenuItemPress(item.id)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[
                styles.menuLabel,
                activeSection === item.id && styles.menuLabelActive,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.closeMenuArea} 
          onPress={() => setIsMenuOpen(false)}
          activeOpacity={1}
        />
      </View>
    </Modal>
  );

  const renderHomeContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Your Health Dashboard</Text>
      <Text style={styles.sectionDescription}>
        Here's how you're doing with your health goals
      </Text>

      <View style={styles.statsContainer}>
        {/* Wellness Score Card with Retake Option */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#22c55e20' }]}>
            <Text style={styles.statIconEmoji}>⭐</Text>
          </View>
          <Text style={styles.statNumber}>{user.frailtyScore}</Text>
          <Text style={styles.statLabel}>Wellness Score</Text>
          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => setShowFrailtyAssessment(true)}
          >
            <Text style={styles.retakeButtonText}>Retake Assessment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
            <Text style={styles.statIconEmoji}>🎯</Text>
          </View>
          <Text style={styles.statNumber}>{user.completedGoals}/{user.weeklyGoals}</Text>
          <Text style={styles.statLabel}>Weekly Goals</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
            <Text style={styles.statIconEmoji}>🔥</Text>
          </View>
          <Text style={styles.statNumber}>{user.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Health Tips</Text>
      <Text style={styles.sectionDescription}>
        Simple steps to stay healthy every day
      </Text>
      
      <View style={styles.avoidGrid}>
        {avoidFramework.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.avoidCard, { borderLeftColor: item.color, borderLeftWidth: 6 }]}
            onPress={() => setActiveSection('health')}
          >
            <View style={[styles.avoidIcon, { backgroundColor: `${item.color}20` }]}>
              <Text style={styles.avoidIconEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.avoidTextContainer}>
              <Text style={styles.avoidTitle}>{item.title}</Text>
              <Text style={styles.avoidDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's Activities</Text>
      <Text style={styles.sectionDescription}>
        Join others in your community
      </Text>
      
      {communityEvents.slice(0, 2).map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.participantsBadge}>
              <Text style={styles.participantsText}>{event.participants} joining</Text>
            </View>
          </View>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <View style={styles.eventDetails}>
            <Text style={styles.eventDetail}>📍 {event.location}</Text>
            <Text style={styles.eventDetail}>🕐 {event.date}</Text>
            <Text style={styles.eventDetail}>💪 {event.difficulty}</Text>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join This Activity</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderHealthContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Your Health Guide</Text>
      <Text style={styles.sectionDescription}>
        Five simple ways to stay healthy as you age
      </Text>
      
      <View style={styles.avoidGrid}>
        {avoidFramework.map((item) => (
          <View key={item.id} style={[styles.avoidCard, { borderLeftColor: item.color, borderLeftWidth: 6 }]}>
            <View style={[styles.avoidIcon, { backgroundColor: `${item.color}20` }]}>
              <Text style={styles.avoidIconEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.avoidTextContainer}>
              <Text style={styles.avoidTitle}>{item.title}</Text>
              <Text style={styles.avoidDescription}>{item.description}</Text>
              {item.tips.map((tip, index) => (
                <Text key={index} style={[styles.avoidDescription, { marginTop: 4, fontSize: getFontSize(12) }]}>
                  ✓ {tip}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderEventsContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Activities For You</Text>
      <Text style={styles.sectionDescription}>
        Join fellow seniors in fun, healthy activities around Melbourne
      </Text>
      
      {communityEvents.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.participantsBadge}>
              <Text style={styles.participantsText}>{event.participants} joining</Text>
            </View>
          </View>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <View style={styles.eventDetails}>
            <Text style={styles.eventDetail}>📍 Where: {event.location}</Text>
            <Text style={styles.eventDetail}>🕐 When: {event.date}</Text>
            <Text style={styles.eventDetail}>💪 Difficulty: {event.difficulty}</Text>
            <Text style={styles.eventDetail}>🏷️ Category: {event.category}</Text>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>I Want to Join This Activity</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  // Enhanced Profile Section for HomeScreen.js
  // Replace the renderProfileContent function with this:

  const renderProfileContent = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      age: user.age || '',
      height: user.height || '',
      weight: user.weight || '',
      medicalConditions: user.medicalConditions || [],
      medications: user.medications || [],
      exerciseLevel: user.exerciseLevel || 'light',
      mobilityAids: user.mobilityAids || [],
      emergencyContact: user.emergencyContact || { name: '', phone: '' },
      dietaryRestrictions: user.dietaryRestrictions || [],
      fallHistory: user.fallHistory || 'no',
      livingSituation: user.livingSituation || 'independent'
    });

    const handleSave = () => {
      if (!editedProfile.name.trim() || !editedProfile.email.trim()) {
        if (typeof window !== 'undefined') {
          window.alert('Please fill in your name and email address.');
        }
        return;
      }

      const updatedUser = {
        ...user,
        ...editedProfile
      };

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      setIsEditing(false);
      if (typeof window !== 'undefined') {
        window.alert('Your profile has been updated!');
      }
    };

    const handleCancel = () => {
      setEditedProfile({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        medicalConditions: user.medicalConditions || [],
        medications: user.medications || [],
        exerciseLevel: user.exerciseLevel || 'light',
        mobilityAids: user.mobilityAids || [],
        emergencyContact: user.emergencyContact || { name: '', phone: '' },
        dietaryRestrictions: user.dietaryRestrictions || [],
        fallHistory: user.fallHistory || 'no',
        livingSituation: user.livingSituation || 'independent'
      });
      setIsEditing(false);
    };

    const updateArrayField = (field, value, checked) => {
      setEditedProfile(prev => ({
        ...prev,
        [field]: checked 
          ? [...prev[field], value]
          : prev[field].filter(item => item !== value)
      }));
    };

    // Generate personalized health tips based on user profile
    const generatePersonalizedTips = () => {
      const tips = [];
      const age = parseInt(user.age) || 65;
      const conditions = user.medicalConditions || [];
      const exerciseLevel = user.exerciseLevel || 'light';
      const fallHistory = user.fallHistory || 'no';
      const mobilityAids = user.mobilityAids || [];

      // Age-based tips
      if (age >= 75) {
        tips.push({
          category: 'Exercise',
          tip: 'Focus on balance exercises daily - try standing on one foot for 30 seconds',
          icon: '⚖️',
          priority: 'high'
        });
      }

      // Exercise level tips
      if (exerciseLevel === 'sedentary') {
        tips.push({
          category: 'Activity',
          tip: 'Start with 5-minute walks twice daily and gradually increase',
          icon: '🚶‍♂️',
          priority: 'high'
        });
      }

      // Fall history tips
      if (fallHistory === 'yes') {
        tips.push({
          category: 'Safety',
          tip: 'Remove loose rugs and ensure good lighting in all walkways',
          icon: '🏠',
          priority: 'high'
        });
        tips.push({
          category: 'Exercise',
          tip: 'Practice tai chi or chair exercises to improve balance',
          icon: '🧘‍♀️',
          priority: 'medium'
        });
      }

      // Medical condition specific tips
      if (conditions.includes('diabetes')) {
        tips.push({
          category: 'Nutrition',
          tip: 'Eat protein with each meal to help stabilize blood sugar',
          icon: '🍽️',
          priority: 'high'
        });
      }

      if (conditions.includes('arthritis')) {
        tips.push({
          category: 'Exercise',
          tip: 'Try water exercises - they are gentle on joints',
          icon: '🏊‍♀️',
          priority: 'medium'
        });
      }

      if (conditions.includes('osteoporosis')) {
        tips.push({
          category: 'Nutrition',
          tip: 'Ensure adequate calcium and vitamin D intake daily',
          icon: '🥛',
          priority: 'high'
        });
      }

      // Mobility aids tips
      if (mobilityAids.includes('walker') || mobilityAids.includes('cane')) {
        tips.push({
          category: 'Safety',
          tip: 'Have your mobility aid checked regularly for proper fit and wear',
          icon: '🦯',
          priority: 'medium'
        });
      }

      // Default tips if no specific conditions
      if (tips.length === 0) {
        tips.push(
          {
            category: 'Exercise',
            tip: 'Aim for 150 minutes of moderate activity per week',
            icon: '💪',
            priority: 'medium'
          },
          {
            category: 'Nutrition',
            tip: 'Include colorful fruits and vegetables in every meal',
            icon: '🥗',
            priority: 'medium'
          },
          {
            category: 'Social',
            tip: 'Stay connected with friends and family regularly',
            icon: '👥',
            priority: 'medium'
          }
        );
      }

      return tips;
    };

    const personalizedTips = generatePersonalizedTips();

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <Text style={styles.sectionDescription}>
          {isEditing ? 'Update your personal information' : 'Manage your account and health information'}
        </Text>

        {/* Profile Header */}
        <View style={[styles.eventCard, { alignItems: 'center', marginBottom: 24 }]}>
          <View style={{
            backgroundColor: '#22c55e',
            borderRadius: 40,
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: getFontSize(28),
              fontWeight: '700',
              color: '#ffffff',
            }}>
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.avoidTitle}>{user.name || 'User'}</Text>
          <Text style={styles.avoidDescription}>{user.email}</Text>
          
          {!isEditing ? (
            <TouchableOpacity 
              style={[styles.joinButton, { marginTop: 16 }]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.joinButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity 
                style={[styles.joinButton, { backgroundColor: '#6b7280', flex: 1 }]}
                onPress={handleCancel}
              >
                <Text style={styles.joinButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.joinButton, { flex: 1 }]}
                onPress={handleSave}
              >
                <Text style={styles.joinButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Personal Information</Text>
          
          {isEditing ? (
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile(prev => ({...prev, name: text}))}
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile(prev => ({...prev, email: text}))}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedProfile.phoneNumber}
                  onChangeText={(text) => setEditedProfile(prev => ({...prev, phoneNumber: text}))}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedProfile.age}
                    onChangeText={(text) => setEditedProfile(prev => ({...prev, age: text}))}
                    placeholder="Age"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Height (cm)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedProfile.height}
                    onChangeText={(text) => setEditedProfile(prev => ({...prev, height: text}))}
                    placeholder="Height"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedProfile.weight}
                    onChangeText={(text) => setEditedProfile(prev => ({...prev, weight: text}))}
                    placeholder="Weight"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.eventDetails}>
              <Text style={styles.eventDetail}>👤 Name: {user.name || 'Not provided'}</Text>
              <Text style={styles.eventDetail}>📧 Email: {user.email}</Text>
              <Text style={styles.eventDetail}>📱 Phone: {user.phoneNumber || 'Not provided'}</Text>
              <Text style={styles.eventDetail}>🎂 Age: {user.age || 'Not provided'}</Text>
              <Text style={styles.eventDetail}>📏 Height: {user.height ? `${user.height} cm` : 'Not provided'}</Text>
              <Text style={styles.eventDetail}>⚖️ Weight: {user.weight ? `${user.weight} kg` : 'Not provided'}</Text>
            </View>
          )}
        </View>

        {/* Health Information */}
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Health Information</Text>
          
          {isEditing ? (
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Exercise Level</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {['sedentary', 'light', 'moderate', 'active'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.optionButton,
                        editedProfile.exerciseLevel === level && styles.optionButtonActive
                      ]}
                      onPress={() => setEditedProfile(prev => ({...prev, exerciseLevel: level}))}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        editedProfile.exerciseLevel === level && styles.optionButtonTextActive
                      ]}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Medical Conditions</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {['diabetes', 'arthritis', 'osteoporosis', 'heart_disease', 'hypertension', 'none'].map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.checkboxOption,
                        editedProfile.medicalConditions.includes(condition) && styles.checkboxOptionActive
                      ]}
                      onPress={() => updateArrayField('medicalConditions', condition, !editedProfile.medicalConditions.includes(condition))}
                    >
                      <Text style={[
                        styles.checkboxOptionText,
                        editedProfile.medicalConditions.includes(condition) && styles.checkboxOptionTextActive
                      ]}>
                        {condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Fall History</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['no', 'yes'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        editedProfile.fallHistory === option && styles.optionButtonActive
                      ]}
                      onPress={() => setEditedProfile(prev => ({...prev, fallHistory: option}))}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        editedProfile.fallHistory === option && styles.optionButtonTextActive
                      ]}>
                        {option === 'no' ? 'No Falls' : 'Had Falls'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobility Aids</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {['none', 'cane', 'walker', 'wheelchair'].map((aid) => (
                    <TouchableOpacity
                      key={aid}
                      style={[
                        styles.checkboxOption,
                        editedProfile.mobilityAids.includes(aid) && styles.checkboxOptionActive
                      ]}
                      onPress={() => updateArrayField('mobilityAids', aid, !editedProfile.mobilityAids.includes(aid))}
                    >
                      <Text style={[
                        styles.checkboxOptionText,
                        editedProfile.mobilityAids.includes(aid) && styles.checkboxOptionTextActive
                      ]}>
                        {aid.charAt(0).toUpperCase() + aid.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.eventDetails}>
              <Text style={styles.eventDetail}>💪 Exercise Level: {user.exerciseLevel ? user.exerciseLevel.charAt(0).toUpperCase() + user.exerciseLevel.slice(1) : 'Not specified'}</Text>
              <Text style={styles.eventDetail}>🏥 Medical Conditions: {user.medicalConditions && user.medicalConditions.length > 0 ? user.medicalConditions.join(', ').replace(/\b\w/g, l => l.toUpperCase()) : 'None reported'}</Text>
              <Text style={styles.eventDetail}>⚠️ Fall History: {user.fallHistory === 'yes' ? 'Has experienced falls' : 'No recent falls'}</Text>
              <Text style={styles.eventDetail}>🦯 Mobility Aids: {user.mobilityAids && user.mobilityAids.length > 0 ? user.mobilityAids.join(', ').replace(/\b\w/g, l => l.toUpperCase()) : 'None used'}</Text>
            </View>
          )}
        </View>

        {/* Personalized Health Tips */}
        {!isEditing && personalizedTips.length > 0 && (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Your Personalized Health Tips</Text>
            <Text style={[styles.avoidDescription, { marginBottom: 16, textAlign: 'center' }]}>
              Based on your profile, here are specific recommendations to help maintain your health and independence
            </Text>
            
            {personalizedTips.map((tip, index) => (
              <View key={index} style={[
                styles.tipCard,
                { borderLeftColor: tip.priority === 'high' ? '#ef4444' : '#f59e0b', borderLeftWidth: 4 }
              ]}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{tip.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.avoidTitle, { fontSize: getFontSize(16) }]}>
                      {tip.category}
                      {tip.priority === 'high' && <Text style={{ color: '#ef4444' }}> (Priority)</Text>}
                    </Text>
                    <Text style={styles.avoidDescription}>{tip.tip}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Emergency Contact */}
        {!isEditing && (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>Emergency Contact</Text>
            <View style={styles.eventDetails}>
              <Text style={styles.eventDetail}>👨‍⚕️ Emergency Contact: {user.emergencyContact?.name || 'Not provided'}</Text>
              <Text style={styles.eventDetail}>📞 Emergency Phone: {user.emergencyContact?.phone || 'Not provided'}</Text>
            </View>
          </View>
        )}

        {/* Account Progress */}
        {!isEditing && (
          <>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#22c55e20' }]}>
                  <Text style={styles.statIconEmoji}>⭐</Text>
                </View>
                <Text style={styles.statNumber}>{user.frailtyScore}</Text>
                <Text style={styles.statLabel}>Wellness Score</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
                  <Text style={styles.statIconEmoji}>🎯</Text>
                </View>
                <Text style={styles.statNumber}>{user.completedGoals}/{user.weeklyGoals}</Text>
                <Text style={styles.statLabel}>Weekly Goals</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
                  <Text style={styles.statIconEmoji}>🔥</Text>
                </View>
                <Text style={styles.statNumber}>{user.streakDays}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </>
        )}

        {/* Help Section */}
        {!isEditing && (
          <View style={styles.helpContainer}>
            <View style={styles.helpIcon}>
              <Text style={styles.helpIconEmoji}>📞</Text>
            </View>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              Call us at <Text style={{ fontWeight: '700' }}>1800 LIVEWELL</Text>{'\n'}
              Monday to Friday, 9 AM to 5 PM
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderHelpContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>We're Here to Help</Text>
      <Text style={styles.sectionDescription}>
        If you need help or have questions, we're here for you
      </Text>
      
      <View style={styles.helpContainer}>
        <View style={styles.helpIcon}>
          <Text style={styles.helpIconEmoji}>📞</Text>
        </View>
        <Text style={styles.helpTitle}>Call Us Anytime</Text>
        <Text style={styles.helpText}>
          Talk to a real person who can help you with LiveWell or answer your health questions.
        </Text>
        <Text style={styles.phoneNumber}>1800 LIVEWELL</Text>
        <Text style={styles.helpText}>Monday to Friday, 9 AM to 5 PM</Text>
      </View>

      <View style={[styles.helpContainer, { backgroundColor: '#f0fdf4', borderColor: '#22c55e' }]}>
        <View style={[styles.helpIcon, { backgroundColor: '#22c55e' }]}>
          <Text style={[styles.helpIconEmoji, { color: '#ffffff' }]}>❓</Text>
        </View>
        <Text style={styles.helpTitle}>Common Questions</Text>
        <Text style={styles.helpText}>
          • How do I make text bigger? Use the "Text Size" buttons at the top{'\n\n'}
          • How do I join activities? Tap "Activities" and choose what you like{'\n\n'}
          • Is LiveWell free? Yes! Completely free for all seniors{'\n\n'}
          • How do I sign out? Tap the red "Sign Out" button at the top
        </Text>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'health': return renderHealthContent();
      case 'events': return renderEventsContent();
      case 'profile': return renderProfileContent();
      case 'help': return renderHelpContent();
      default: return renderHomeContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.leftSection}>
            <TouchableOpacity 
              style={styles.hamburgerButton}
              onPress={() => setIsMenuOpen(true)}
            >
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Image
                  source={require('../assets/images/Logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>LiveWell</Text>
                <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <FontSizeButtons />
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <HamburgerMenu />
    </SafeAreaView>
  );
};

export default HomeScreen;