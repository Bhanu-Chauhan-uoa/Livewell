// App.js - Updated to handle frailty assessment
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
    const userName = userData.fullName || userData.name || userData.email?.split('@')[0] || 'User';
    
    // Check if user has a frailty score from the database
    const frailtyScore = userData.profile?.frailtyScore || userData.frailtyScore || null;
    
    // Merge login data with default health profile structure
    const completeUserData = {
      // Basic info from login - ensure name is properly set
      ...userData,
      name: userName,
      
      // Set frailty score (null if not available - this will trigger the assessment)
      frailtyScore: frailtyScore,
      
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
      livingSituation: userData.livingSituation || 'independent',
      
      // Default dashboard stats if not available
      weeklyGoals: userData.weeklyGoals || 5,
      completedGoals: userData.completedGoals || 0,
      streakDays: userData.streakDays || 0,
    };
    
    console.log('Setting user with name:', completeUserData.name);
    console.log('Frailty score available:', completeUserData.frailtyScore !== null);
    
    setUser(completeUserData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logging out user...');
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleUpdateUser = async (updatedUserData) => {
    console.log('Updating user profile:', updatedUserData);
    
    // If this is a frailty assessment update, you might want to save it to the database
    if (updatedUserData.frailtyScore && !user.frailtyScore) {
      try {
        // Save frailty score to database
        const response = await fetch('https://mws-apim-test-01.azure-api.net/v1/user/frailty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '8d7144a492ab484b982f92b12525ec6f',
            'Authorization': `Bearer ${user.token}`, // If you store the JWT token
          },
          body: JSON.stringify({
            userId: user.id,
            frailtyScore: updatedUserData.frailtyScore,
            frailtyCategory: updatedUserData.frailtyCategory,
            assessmentDate: updatedUserData.lastAssessment,
          }),
        });

        if (response.ok) {
          console.log('Frailty score saved to database');
        } else {
          console.error('Failed to save frailty score to database');
        }
      } catch (error) {
        console.error('Error saving frailty score:', error);
      }
    }
    
    setUser(updatedUserData);
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