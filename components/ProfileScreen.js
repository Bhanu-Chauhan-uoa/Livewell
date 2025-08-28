// screens/ProfileScreen.js
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ user, onUpdateUser, onLogout, onBack }) => {
  const [fontSize, setFontSize] = useState('normal');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name || '');
  const [editedEmail, setEditedEmail] = useState(user.email || '');
  const [editedPhone, setEditedPhone] = useState(user.phoneNumber || '');

  const getFontSize = (baseSize) => {
    const multiplier = fontSize === 'extra-large' ? 1.4 : fontSize === 'large' ? 1.2 : 1;
    return baseSize * multiplier;
  };

  const handleSave = () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Please fill in your name and email address.');
      return;
    }

    const updatedUser = {
      ...user,
      name: editedName.trim(),
      email: editedEmail.trim(),
      phoneNumber: editedPhone.trim(),
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setIsEditing(false);
    Alert.alert('Success', 'Your profile has been updated!');
  };

  const handleCancel = () => {
    setEditedName(user.name || '');
    setEditedEmail(user.email || '');
    setEditedPhone(user.phoneNumber || '');
    setIsEditing(false);
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

  const profileStats = [
    {
      icon: '⭐',
      value: user.frailtyScore || '0',
      label: 'Wellness Score',
      color: '#22c55e'
    },
    {
      icon: '🎯',
      value: `${user.completedGoals || 0}/${user.weeklyGoals || 0}`,
      label: 'Weekly Goals',
      color: '#3b82f6'
    },
    {
      icon: '🔥',
      value: user.streakDays || '0',
      label: 'Day Streak',
      color: '#f59e0b'
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
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6b7280',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    backText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: getFontSize(12),
      marginLeft: 8,
    },
    headerTitle: {
      fontSize: getFontSize(24),
      fontWeight: '700',
      color: '#1a1a1a',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ef4444',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    logoutText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: getFontSize(12),
      marginLeft: 8,
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
    content: {
      flex: 1,
      padding: 20,
    },
    profileCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: '#e9ecef',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatarContainer: {
      backgroundColor: '#22c55e',
      borderRadius: 50,
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: getFontSize(36),
      fontWeight: '700',
      color: '#ffffff',
    },
    profileName: {
      fontSize: getFontSize(24),
      fontWeight: '700',
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: 8,
    },
    profileEmail: {
      fontSize: getFontSize(16),
      color: '#666666',
      textAlign: 'center',
    },
    editButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 16,
    },
    editButtonText: {
      color: '#ffffff',
      fontSize: getFontSize(16),
      fontWeight: '600',
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
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#22c55e',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: '#6b7280',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: getFontSize(16),
      fontWeight: '600',
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
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
    statIconText: {
      fontSize: getFontSize(24),
    },
    statNumber: {
      fontSize: getFontSize(20),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: getFontSize(12),
      color: '#666666',
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#e9ecef',
    },
    infoTitle: {
      fontSize: getFontSize(18),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    infoIcon: {
      fontSize: getFontSize(20),
      marginRight: 16,
    },
    infoText: {
      flex: 1,
    },
    infoLabel: {
      fontSize: getFontSize(12),
      color: '#666666',
      marginBottom: 4,
    },
    infoValue: {
      fontSize: getFontSize(16),
      color: '#1a1a1a',
      fontWeight: '500',
    },
    helpCard: {
      backgroundColor: '#f0fdf4',
      borderWidth: 2,
      borderColor: '#22c55e',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    helpTitle: {
      fontSize: getFontSize(16),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    helpText: {
      fontSize: getFontSize(14),
      color: '#555555',
      textAlign: 'center',
      lineHeight: getFontSize(20),
    },
    phoneNumber: {
      fontSize: getFontSize(16),
      fontWeight: '700',
      color: '#22c55e',
      marginTop: 8,
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
          >
            <Text>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>My Profile</Text>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text>🚪</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <FontSizeButtons />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {getInitials(user.name || user.email || 'U')}
              </Text>
            </View>
            
            {!isEditing ? (
              <>
                <Text style={styles.profileName}>{user.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedEmail}
                    onChangeText={setEditedEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editedPhone}
                    onChangeText={setEditedPhone}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Text style={styles.statIconText}>{stat.icon}</Text>
              </View>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'Today'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔐</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Sign In Method</Text>
              <Text style={styles.infoValue}>
                {user.loginMethod === 'biometric' ? 'Biometric Authentication' : 
                 user.loginMethod === 'new_account' ? 'New Account' : 'Standard Login'}
              </Text>
            </View>
          </View>

          {user.phoneNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📱</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{user.phoneNumber}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you need assistance with your account or have questions about LiveWell, our support team is here to help.
          </Text>
          <Text style={styles.phoneNumber}>1800 LIVEWELL</Text>
          <Text style={styles.helpText}>Monday to Friday, 9 AM to 5 PM</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;