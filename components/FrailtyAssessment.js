// screens/FrailtyAssessmentScreen.js
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const FrailtyAssessmentScreen = ({ user, onComplete, onCancel, fontSize = 'normal' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFontSize = (baseSize) => {
    const multiplier = fontSize === 'extra-large' ? 1.4 : fontSize === 'large' ? 1.2 : 1;
    return baseSize * multiplier;
  };

  // Simplified frailty assessment questions based on validated scales
  const questions = [
    {
      id: 'unintentional_weight_loss',
      question: 'In the past year, have you lost 10 pounds or more without trying to?',
      type: 'yes_no',
      options: [
        { value: 'yes', label: 'Yes', points: 1 },
        { value: 'no', label: 'No', points: 0 }
      ]
    },
    {
      id: 'exhaustion',
      question: 'How often do you feel exhausted or worn out?',
      type: 'scale',
      options: [
        { value: 'rarely', label: 'Rarely or never', points: 0 },
        { value: 'sometimes', label: 'Sometimes', points: 0.5 },
        { value: 'often', label: 'Often or always', points: 1 }
      ]
    },
    {
      id: 'physical_activity',
      question: 'How would you describe your current level of physical activity?',
      type: 'scale',
      options: [
        { value: 'active', label: 'Very active (regular exercise)', points: 0 },
        { value: 'moderate', label: 'Moderately active (some walking)', points: 0.5 },
        { value: 'sedentary', label: 'Not very active (mostly sitting)', points: 1 }
      ]
    },
    {
      id: 'walking_speed',
      question: 'Do you feel your walking speed has slowed down compared to a year ago?',
      type: 'yes_no',
      options: [
        { value: 'yes', label: 'Yes, noticeably slower', points: 1 },
        { value: 'no', label: 'No, about the same', points: 0 }
      ]
    },
    {
      id: 'grip_strength',
      question: 'Do you have difficulty opening jars or turning doorknobs?',
      type: 'scale',
      options: [
        { value: 'no', label: 'No difficulty', points: 0 },
        { value: 'some', label: 'Some difficulty', points: 0.5 },
        { value: 'significant', label: 'Significant difficulty', points: 1 }
      ]
    },
    {
      id: 'balance_falls',
      question: 'Have you fallen or felt unsteady in the past year?',
      type: 'scale',
      options: [
        { value: 'no_falls', label: 'No falls or unsteadiness', points: 0 },
        { value: 'occasional', label: 'Occasionally unsteady', points: 0.5 },
        { value: 'falls', label: 'Have fallen or frequently unsteady', points: 1 }
      ]
    },
    {
      id: 'cognitive_function',
      question: 'Do you have trouble remembering things or concentrating?',
      type: 'scale',
      options: [
        { value: 'no', label: 'No trouble', points: 0 },
        { value: 'mild', label: 'Mild trouble occasionally', points: 0.5 },
        { value: 'significant', label: 'Significant trouble often', points: 1 }
      ]
    },
    {
      id: 'social_isolation',
      question: 'How often do you interact with family, friends, or community?',
      type: 'scale',
      options: [
        { value: 'regular', label: 'Regularly (several times per week)', points: 0 },
        { value: 'occasional', label: 'Occasionally (once per week)', points: 0.5 },
        { value: 'rarely', label: 'Rarely (less than weekly)', points: 1 }
      ]
    }
  ];

  const calculateFrailtyScore = () => {
    let totalPoints = 0;
    questions.forEach(question => {
      const response = responses[question.id];
      if (response) {
        const option = question.options.find(opt => opt.value === response);
        if (option) {
          totalPoints += option.points;
        }
      }
    });

    // Convert to a 0-5 scale (5 being least frail)
    const maxPoints = questions.length;
    const frailtyScore = 5 - (totalPoints / maxPoints) * 5;
    return Math.round(frailtyScore * 10) / 10; // Round to 1 decimal place
  };

  const getFrailtyCategory = (score) => {
    if (score >= 4.5) return { category: 'Robust', color: '#22c55e', description: 'You show excellent physical and cognitive resilience.' };
    if (score >= 3.5) return { category: 'Pre-frail', color: '#f59e0b', description: 'You show some signs that warrant attention and prevention.' };
    return { category: 'Frail', color: '#ef4444', description: 'You may benefit from additional support and medical consultation.' };
  };

  const handleAnswer = (value) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));

    // Auto-advance to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const score = calculateFrailtyScore();
    const category = getFrailtyCategory(score);
    
    try {
      // Here you would typically save to database
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assessmentResults = {
        frailtyScore: score,
        frailtyCategory: category.category,
        responses: responses,
        completedAt: new Date().toISOString()
      };
      
      onComplete(assessmentResults);
    } catch (error) {
      Alert.alert('Error', 'Failed to save assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    return Object.keys(responses).length === questions.length;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
      marginBottom: 16,
    },
    backButton: {
      backgroundColor: '#6b7280',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    backButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: getFontSize(14),
    },
    title: {
      fontSize: getFontSize(24),
      fontWeight: '700',
      color: '#1a1a1a',
      textAlign: 'center',
      flex: 1,
    },
    progressContainer: {
      backgroundColor: '#e9ecef',
      height: 8,
      borderRadius: 4,
      marginTop: 16,
    },
    progressBar: {
      backgroundColor: '#22c55e',
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: getFontSize(14),
      color: '#666666',
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    questionCard: {
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
    questionNumber: {
      fontSize: getFontSize(14),
      color: '#22c55e',
      fontWeight: '700',
      marginBottom: 8,
    },
    questionText: {
      fontSize: getFontSize(18),
      color: '#1a1a1a',
      fontWeight: '600',
      lineHeight: getFontSize(26),
      marginBottom: 24,
    },
    optionButton: {
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#e9ecef',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      minHeight: 60,
      justifyContent: 'center',
    },
    selectedOption: {
      backgroundColor: '#22c55e',
      borderColor: '#22c55e',
    },
    optionText: {
      fontSize: getFontSize(16),
      color: '#1a1a1a',
      fontWeight: '500',
      textAlign: 'center',
    },
    selectedOptionText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
    },
    navButton: {
      backgroundColor: '#6b7280',
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 16,
      minWidth: 100,
    },
    navButtonPrimary: {
      backgroundColor: '#22c55e',
    },
    navButtonDisabled: {
      backgroundColor: '#cccccc',
    },
    navButtonText: {
      color: '#ffffff',
      fontSize: getFontSize(16),
      fontWeight: '600',
      textAlign: 'center',
    },
    resultsCard: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 24,
      borderWidth: 2,
      borderColor: '#e9ecef',
      alignItems: 'center',
    },
    scoreDisplay: {
      alignItems: 'center',
      marginBottom: 24,
    },
    scoreNumber: {
      fontSize: getFontSize(48),
      fontWeight: '700',
      marginBottom: 8,
    },
    scoreLabel: {
      fontSize: getFontSize(16),
      color: '#666666',
      marginBottom: 16,
    },
    categoryBadge: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 16,
    },
    categoryText: {
      color: '#ffffff',
      fontSize: getFontSize(16),
      fontWeight: '700',
    },
    descriptionText: {
      fontSize: getFontSize(16),
      color: '#555555',
      textAlign: 'center',
      lineHeight: getFontSize(24),
      marginBottom: 24,
    },
    finishButton: {
      backgroundColor: '#22c55e',
      borderRadius: 12,
      paddingHorizontal: 32,
      paddingVertical: 16,
    },
    finishButtonText: {
      color: '#ffffff',
      fontSize: getFontSize(18),
      fontWeight: '600',
    },
  });

  // Results screen
  if (canProceed() && currentQuestion >= questions.length - 1 && responses[questions[questions.length - 1].id]) {
    const score = calculateFrailtyScore();
    const category = getFrailtyCategory(score);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Wellness Assessment</Text>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsCard}>
            <View style={styles.scoreDisplay}>
              <Text style={[styles.scoreNumber, { color: category.color }]}>
                {score}
              </Text>
              <Text style={styles.scoreLabel}>out of 5.0</Text>
              
              <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                <Text style={styles.categoryText}>{category.category}</Text>
              </View>
              
              <Text style={styles.descriptionText}>{category.description}</Text>
            </View>
            
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#22c55e" />
            ) : (
              <TouchableOpacity style={styles.finishButton} onPress={handleSubmit}>
                <Text style={styles.finishButtonText}>Save My Results</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onCancel}>
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Wellness Check</Text>
          <View style={{ width: 80 }} />
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            QUESTION {currentQuestion + 1}
          </Text>
          <Text style={styles.questionText}>
            {questions[currentQuestion].question}
          </Text>
          
          {questions[currentQuestion].options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                responses[questions[currentQuestion].id] === option.value && styles.selectedOption
              ]}
              onPress={() => handleAnswer(option.value)}
            >
              <Text style={[
                styles.optionText,
                responses[questions[currentQuestion].id] === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
            onPress={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonPrimary,
              !responses[questions[currentQuestion].id] && styles.navButtonDisabled
            ]}
            onPress={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
              }
            }}
            disabled={!responses[questions[currentQuestion].id]}
          >
            <Text style={styles.navButtonText}>
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FrailtyAssessmentScreen;