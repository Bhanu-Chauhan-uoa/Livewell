// app/(tabs)/index.tsx
import HomeScreen from '@/components/HomeScreen';
import LoginScreen from '@/components/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function TabOneScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('livewell_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (userData: any) => {
    try {
      await AsyncStorage.setItem('livewell_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['livewell_user', 'livewell_biometric_setup']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          <Text style={styles.loadingTitle}>LiveWell</Text>
          <ActivityIndicator size="large" color="#22c55e" style={styles.spinner} />
          <Text style={styles.loadingText}>Loading your health companion...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <HomeScreen user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
  },
  logo: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 48,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});