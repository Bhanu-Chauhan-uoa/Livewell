// App.js - Updated to properly handle database user names
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    
    // Properly extract the user's name from database response
    // The database likely returns 'fullName' but HomeScreen expects 'name'
    const userName = userData.fullName || userData.name || userData.email?.split('@')[0] || 'User';
    
    // Merge login data with default health profile structure
    const completeUserData = {
      // Basic info from login - ensure name is properly set
      ...userData,
      name: userName, // This ensures HomeScreen gets the correct name
      
      // Health profile defaults (if not already present)
      age: userData.age || '',
      height: userData.height || '',
      weight: userData.weight || '',
      medicalConditions: userData.medicalConditions || [],
      medications: userData.medications || [],
      exerciseLevel: userData.exerciseLevel || 'light',
      mobilityAids: userData.mobilityAids || [],
      emergencyContact: userData.emergencyContact || { name: '', phone: '' },
      dietaryRestrictions: userData.dietaryRestrictions || [],
      fallHistory: userData.fallHistory || 'no',
      livingSituation: userData.livingSituation || 'independent'
    };
    
    console.log('Setting user with name:', completeUserData.name); // Debug log
    
    setUser(completeUserData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logging out user...');
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleUpdateUser = (updatedUserData) => {
    console.log('Updating user profile:', updatedUserData);
    setUser(updatedUserData);
    
    // Here you could also save to a database or local storage
    // For now, we'll just update the state
  };

  return (
    <>
      <StatusBar style="auto" />
      {!isLoggedIn || !user ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <HomeScreen 
          user={user} 
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </>
  );
}