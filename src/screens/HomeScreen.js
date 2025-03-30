import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getRandomQuote } from '../utils/quotes';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const [dailyQuote, setDailyQuote] = useState(null);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const loadDailyQuote = () => {
    const quote = getRandomQuote();
    setDailyQuote(quote);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Success Planner</Text>
      
      {dailyQuote && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadDailyQuote}
          >
            <Ionicons name="refresh" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3B82F6',
  },
  quoteContainer: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    width: '100%',
  },
  refreshButton: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;