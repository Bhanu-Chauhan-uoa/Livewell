// components/LoginScreen.tsx
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
}

type FontSize = 'normal' | 'large' | 'extra-large';
type CurrentStep = 'login' | 'signup' | 'setup-biometric';
type SetupStep = 'email' | 'verify' | 'setup' | 'success';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passkey, setPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [currentStep, setCurrentStep] = useState<CurrentStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [setupStep, setSetupStep] = useState<SetupStep>('email');

  // Prefer EXPO env var; falls back to placeholder string for dev
  const subscriptionKey =
    (process.env.EXPO_PUBLIC_APIM_KEY as string) || '8d7144a492ab484b982f92b12525ec6f';

  const getFontSize = (baseSize: number): number => {
    const multiplier = fontSize === 'extra-large' ? 1.4 : fontSize === 'large' ? 1.2 : 1;
    return baseSize * multiplier;
  };

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      return {
        hasHardware,
        isEnrolled,
        supportedTypes,
        hasFingerprint: supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
        hasFaceID: supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION),
      };
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return { hasHardware: false, isEnrolled: false };
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setMessage('');

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address first.');
      setIsLoading(false);
      return;
    }

    try {
      const biometricAuth = await checkBiometricSupport();

      if (!biometricAuth.hasHardware) {
        Alert.alert(
          'Not Available',
          'Your device does not support biometric authentication. Please contact our support team.\n\nCall: 1800 LIVEWELL',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      if (!biometricAuth.isEnrolled) {
        Alert.alert(
          'Setup Required',
          'Please set up fingerprint or face recognition in your device settings first.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in to LiveWell - Use your fingerprint or face to sign in securely',
        fallbackLabel: 'Use device passcode',
        cancelLabel: 'Cancel',
      });

      if (authResult.success) {
        setMessage('Perfect! Welcome back to LiveWell!');

        const userData = {
          email: email,
          name: name,
          loginMethod: 'biometric',
          loginTime: new Date().toISOString(),
          frailtyScore: 3.2,
          weeklyGoals: 5,
          completedGoals: 3,
          streakDays: 12,
        };

        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(userData);
        }, 1500);
      } else {
        setMessage('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      setMessage('Something went wrong. Please try again or call 1800 LIVEWELL for help.');
      setIsLoading(false);
    }
  };

  // NEW: Passkey login handler
  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setMessage('');

    if (!email || !email.includes('@') || !passkey) {
      setMessage('Please enter both email and passkey.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://mws-apim-test-01.azure-api.net/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '8d7144a492ab484b982f92b12525ec6f',
          },
          body: JSON.stringify({
            identifier: email,
            passkey: passkey,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage('Welcome back!');
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(data);
        }, 1000);
      } else {
        const errorText = await response.text();
        setMessage(`Login failed: ${errorText}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    setMessage('');

    // Validate all fields
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (!name || name.trim().length < 2) {
      setMessage('Please enter your full name (at least 2 characters).');
      setIsLoading(false);
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage('Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }
    if (!passkey || passkey.length < 4) {
      setMessage('Please create a passkey with at least 4 characters.');
      setIsLoading(false);
      return;
    }
    if (passkey !== confirmPasskey) {
      setMessage('Passkeys do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      // FIXED: correct endpoint path
      const response = await fetch('https://mws-apim-test-01.azure-api.net/v1/RegisterUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
        body: JSON.stringify({
          fullName: name,
          emailAddress: email,
          phoneNumber: phoneNumber,
          passkey: passkey,
        }),
      });

      if (response.ok) {
        await response.json();
        setMessage("Account created successfully! Now let's set up secure sign-in.");
        setCurrentStep('setup-biometric');
        setSetupStep('verify');
      } else {
        const errorText = await response.text();
        setMessage(`Error creating account: ${errorText}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupBiometric = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const biometricAuth = await checkBiometricSupport();

      if (!biometricAuth.hasHardware || !biometricAuth.isEnrolled) {
        Alert.alert(
          'Setup Required',
          'Please set up fingerprint or face recognition in your device settings first.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage:
          'Set up secure sign-in for LiveWell - This will allow you to sign in quickly and securely',
        fallbackLabel: 'Use device passcode',
        cancelLabel: 'Cancel',
      });

      if (authResult.success) {
        setSetupStep('success');
        setMessage('Excellent! Your secure sign-in is now ready.');

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        setMessage('Setup was cancelled. You can try again anytime.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      setMessage('Setup failed. Please try again or call 1800 LIVEWELL.');
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = () => {
    const userData = {
      email: email,
      name: name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      phoneNumber: phoneNumber,
      loginMethod: 'new_account',
      loginTime: new Date().toISOString(),
      frailtyScore: 0,
      weeklyGoals: 0,
      completedGoals: 0,
      streakDays: 0,
      isNewUser: true,
    };

    onLoginSuccess(userData);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    keyboardContainer: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 32,
      marginHorizontal: 5,
      borderWidth: 3,
      borderColor: '#e9ecef',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    heartIcon: {
      width: 32,
      height: 32,
      marginLeft: 8,
    },
    logoImage: {
      width: 48,
      height: 48,
    },
    title: {
      fontSize: getFontSize(32),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: getFontSize(16),
      color: '#666666',
      textAlign: 'center',
    },
    fontSizeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    fontSizeLabel: {
      fontSize: getFontSize(16),
      color: '#666666',
      marginRight: 12,
    },
    fontSizeButton: {
      borderWidth: 2,
      borderColor: '#22c55e',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 4,
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
    sectionTitle: {
      fontSize: getFontSize(22),
      fontWeight: '600',
      color: '#1a1a1a',
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: getFontSize(16),
      color: '#555555',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: getFontSize(24),
    },
    inputContainer: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: getFontSize(16),
      color: '#1a1a1a',
      fontWeight: '600',
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 3,
      borderColor: '#e9ecef',
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(16),
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      minHeight: 56,
    },
    biometricContainer: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      alignItems: 'center',
      borderWidth: 3,
    },
    fingerprintContainer: {
      backgroundColor: '#f0fdf4',
      borderColor: '#22c55e',
    },
    faceContainer: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
    },
    // NEW: passkey container/button styles
    passkeyContainer: {
      backgroundColor: '#fffbe6',
      borderColor: '#facc15',
    },
    passkeyButton: {
      backgroundColor: '#facc15',
    },
    biometricIcon: {
      borderRadius: 40,
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    fingerprintIcon: {
      backgroundColor: '#22c55e',
    },
    faceIcon: {
      backgroundColor: '#3b82f6',
    },
    iconEmoji: {
      fontSize: 40,
    },
    biometricTitle: {
      fontSize: getFontSize(18),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    biometricDescription: {
      fontSize: getFontSize(14),
      color: '#555555',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: getFontSize(20),
    },
    primaryButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      minHeight: 60,
      justifyContent: 'center',
    },
    fingerprintButton: {
      backgroundColor: '#22c55e',
    },
    faceButton: {
      backgroundColor: '#3b82f6',
    },
    secondaryButton: {
      backgroundColor: '#8b5cf6',
    },
    disabledButton: {
      backgroundColor: '#cccccc',
    },
    buttonText: {
      fontSize: getFontSize(16),
      fontWeight: '600',
      color: '#ffffff',
      textAlign: 'center',
    },
    newUserContainer: {
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e9ecef',
      marginTop: 16,
    },
    newUserText: {
      fontSize: getFontSize(16),
      color: '#555555',
      marginBottom: 16,
    },
    messageContainer: {
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      borderWidth: 2,
    },
    successMessage: {
      backgroundColor: '#f0fdf4',
      borderColor: '#86efac',
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      borderColor: '#fca5a5',
    },
    messageText: {
      fontSize: getFontSize(14),
      textAlign: 'center',
      fontWeight: '600',
    },
    successMessageText: {
      color: '#166534',
    },
    errorMessageText: {
      color: '#dc2626',
    },
    helpContainer: {
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e9ecef',
      marginTop: 24,
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
    },
    setupContainer: {
      backgroundColor: '#f0fdf4',
      borderWidth: 3,
      borderColor: '#22c55e',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
    },
    setupIcon: {
      backgroundColor: '#22c55e',
      borderRadius: 50,
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    setupIconEmoji: {
      fontSize: 48,
    },
    successContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    successIcon: {
      backgroundColor: '#22c55e',
      borderRadius: 60,
      width: 120,
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    successIconEmoji: {
      fontSize: 60,
    },
    benefitsContainer: {
      backgroundColor: '#f0fdf4',
      borderWidth: 2,
      borderColor: '#22c55e',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    benefitsTitle: {
      fontSize: getFontSize(16),
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 12,
    },
    benefitItem: {
      fontSize: getFontSize(14),
      color: '#555555',
      marginBottom: 6,
      lineHeight: getFontSize(20),
    },
    backButton: {
      backgroundColor: '#6b7280',
      marginBottom: 16,
    },
  });

  const FontSizeButtons = () => {
    const fontSizes: FontSize[] = ['normal', 'large', 'extra-large'];

    return (
      <View style={styles.fontSizeContainer}>
        <Text style={styles.fontSizeLabel}>Text Size:</Text>
        {fontSizes.map((size, index) => (
          <TouchableOpacity
            key={size}
            style={[styles.fontSizeButton, fontSize === size && styles.fontSizeButtonActive]}
            onPress={() => setFontSize(size)}
          >
            <Text
              style={[
                styles.fontSizeButtonText,
                { fontSize: 16 + index * 2 },
                fontSize === size && styles.fontSizeButtonTextActive,
              ]}
            >
              A
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const MessageDisplay = () => {
    if (!message) return null;

    const isError = message.includes('error') || message.includes('Please') || message.includes('failed');

    return (
      <View style={[styles.messageContainer, isError ? styles.errorMessage : styles.successMessage]}>
        <Text style={[styles.messageText, isError ? styles.errorMessageText : styles.successMessageText]}>
          {message}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Image source={require('@/assets/images/Logo.png')} style={styles.heartIcon} resizeMode="contain" />
                <Text style={styles.title}>LiveWell</Text>
              </View>
              <Text style={styles.subtitle}>Secure & Simple Sign In</Text>
            </View>

            {/* Font Size Controls */}
            <FontSizeButtons />

            {/* Login Form */}
            {currentStep === 'login' && (
              <View>
                <Text style={styles.sectionTitle}>Welcome Back!</Text>
                <Text style={styles.description}>
                  Sign in safely using your passkey or biometrics — no passwords to remember!
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Your Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email here"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                  />
                </View>

                {/* NEW: Passkey Login */}
                {/* Passkey Login */}
  <View style={[styles.biometricContainer, { backgroundColor: '#fffbe6', borderColor: '#facc15' }]}>
    <View style={[styles.biometricIcon, { backgroundColor: '#facc15' }]}>
      <Text style={styles.iconEmoji}>🔑</Text>
    </View>
    <Text style={styles.biometricTitle}>Use Your Passkey</Text>
    <Text style={styles.biometricDescription}>
      Enter your email & passkey for secure access
    </Text>

    <TextInput
      style={styles.textInput}
      value={passkey}
      onChangeText={setPasskey}
      placeholder="Enter your passkey"
      secureTextEntry={true}
      autoCapitalize="none"
      autoCorrect={false}
    />

    <TouchableOpacity
      style={[
        styles.primaryButton,
        { backgroundColor: '#facc15' },
        isLoading && styles.disabledButton,
      ]}
      onPress={handlePasskeyLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text style={styles.buttonText}>Sign In with Passkey</Text>
      )}
    </TouchableOpacity>
  </View>


                {/* Fingerprint Login */}
                <View style={[styles.biometricContainer, styles.fingerprintContainer]}>
                  <View style={[styles.biometricIcon, styles.fingerprintIcon]}>
                    <Text style={styles.iconEmoji}>
                      <Image source={require('@/assets/images/fingerprint.png')} style={styles.logoImage} resizeMode="contain" />
                    </Text>
                  </View>
                  <Text style={styles.biometricTitle}>Use Your Fingerprint</Text>
                  <Text style={styles.biometricDescription}>
                    Quick and secure - just touch your device's fingerprint sensor
                  </Text>
                  <TouchableOpacity
                    style={[styles.primaryButton, styles.fingerprintButton, isLoading && styles.disabledButton]}
                    onPress={handleBiometricLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.buttonText}>Sign In with Fingerprint</Text>}
                  </TouchableOpacity>
                </View>

                {/* Face Recognition */}
                <View style={[styles.biometricContainer, styles.faceContainer]}>
                  <View style={[styles.biometricIcon, styles.faceIcon]}>
                    <Text style={styles.iconEmoji}>
                      <Image source={require('@/assets/images/face-recognition.png')} style={styles.logoImage} resizeMode="contain" />
                    </Text>
                  </View>
                  <Text style={styles.biometricTitle}>Use Face Recognition</Text>
                  <Text style={styles.biometricDescription}>Look at your device camera to sign in automatically</Text>
                  <TouchableOpacity
                    style={[styles.primaryButton, styles.faceButton, isLoading && styles.disabledButton]}
                    onPress={handleBiometricLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.buttonText}>Sign In with Face</Text>}
                  </TouchableOpacity>
                </View>

                {/* New User Section */}
                <View style={styles.newUserContainer}>
                  <Text style={styles.newUserText}>New to LiveWell?</Text>
                  <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]} onPress={() => setCurrentStep('signup')}>
                    <Text style={styles.buttonText}>Create Your Free Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Signup Form */}
            {currentStep === 'signup' && (
              <View>
                <Text style={styles.sectionTitle}>Create Your Account</Text>
                <Text style={styles.description}>Welcome to LiveWell! Please fill in your details to get started.</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Create a Passkey *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={passkey}
                    onChangeText={setPasskey}
                    placeholder="Create a 4+ character passkey"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Passkey *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={confirmPasskey}
                    onChangeText={setConfirmPasskey}
                    placeholder="Re-enter your passkey"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>What you'll get with LiveWell:</Text>
                  <Text style={styles.benefitItem}>• Personalized health tracking</Text>
                  <Text style={styles.benefitItem}>• Secure biometric sign-in</Text>
                  <Text style={styles.benefitItem}>• Daily wellness goals</Text>
                  <Text style={styles.benefitItem}>• Expert health guidance</Text>
                  <Text style={styles.benefitItem}>• Community activities near you</Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, styles.secondaryButton, isLoading && styles.disabledButton]}
                  onPress={handleCreateAccount}
                  disabled={isLoading}
                >
                  {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.buttonText}>Create My LiveWell Account</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.primaryButton, styles.backButton]} onPress={() => setCurrentStep('login')}>
                  <Text style={styles.buttonText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Setup Biometric Flow */}
            {currentStep === 'setup-biometric' && (
              <View>
                {setupStep === 'verify' && (
                  <View>
                    <Text style={styles.sectionTitle}>Account Created!</Text>
                    <Text style={styles.description}>
                      Great! Now let's set up secure biometric sign-in so you never have to remember passwords.
                    </Text>

                    <View style={styles.setupContainer}>
                      <View style={styles.setupIcon}>
                        <Text style={styles.setupIconEmoji}>🔒</Text>
                      </View>
                      <Text style={styles.biometricTitle}>Set Up Secure Sign-In</Text>
                      <Text style={styles.biometricDescription}>
                        Use your fingerprint or face recognition for quick, secure access to LiveWell
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryButton, styles.fingerprintButton, isLoading && styles.disabledButton]}
                      onPress={handleSetupBiometric}
                      disabled={isLoading}
                    >
                      {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.buttonText}>Set Up Biometric Sign-In</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.primaryButton, styles.backButton]} onPress={handleCompleteSignup}>
                      <Text style={styles.buttonText}>Skip for Now</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {setupStep === 'success' && (
                  <View>
                    <Text style={styles.sectionTitle}>All Set!</Text>

                    <View style={styles.successContainer}>
                      <View style={styles.successIcon}>
                        <Text style={styles.successIconEmoji}>✅</Text>
                      </View>
                      <Text style={styles.description}>
                        Perfect! Your LiveWell account is ready and your biometric sign-in is active.
                      </Text>
                    </View>

                    <TouchableOpacity style={[styles.primaryButton, styles.fingerprintButton]} onPress={handleCompleteSignup}>
                      <Text style={styles.buttonText}>Start Using LiveWell</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Message Display */}
            <MessageDisplay />

            {/* Help Section */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpText}>
                Call us at <Text style={{ fontWeight: '700' }}>1800 LIVEWELL</Text>
                {'\n'}Monday to Friday, 9 AM to 5 PM
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;