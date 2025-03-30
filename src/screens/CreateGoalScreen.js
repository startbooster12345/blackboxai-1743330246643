import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CreateGoalScreen = () => {
  const [title, setTitle] = useState('');
  const [actions, setActions] = useState([{ id: Date.now(), text: '' }]);
  const navigation = useNavigation();

  const handleAddAction = () => {
    console.log('Adding new action step');
    setActions([...actions, { id: Date.now(), text: '' }]);
  };

  const handleActionChange = (text, id) => {
    console.log('Updating action step:', id, text);
    setActions(actions.map(action => 
      action.id === id ? { ...action, text } : action
    ));
  };

  const handleRemoveAction = (id) => {
    console.log('Removing action step:', id);
    if (actions.length > 1) {
      setActions(actions.filter(action => action.id !== id));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting goal with actions:', actions);
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    if (actions.some(action => !action.text.trim())) {
      Alert.alert('Error', 'Please fill in all action steps');
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title: title.trim(),
      actions: actions.map(action => action.text.trim()),
      createdAt: new Date().toISOString()
    };

    console.log('Goal created:', newGoal);
    // TODO: Implement save functionality
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Goal</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Goal Title *"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Action Steps *</Text>
      {actions.map((action) => (
        <View key={action.id} style={styles.actionContainer}>
          <TextInput
            style={[styles.input, styles.actionInput]}
            placeholder={`Action step ${actions.indexOf(action) + 1}`}
            value={action.text}
            onChangeText={(text) => handleActionChange(text, action.id)}
          />
          {actions.length > 1 && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveAction(action.id)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddAction}
      >
        <Ionicons name="add-circle" size={24} color="#3B82F6" />
        <Text style={styles.addButtonText}>Add Action Step</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Save Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3B82F6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    marginLeft: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateGoalScreen;