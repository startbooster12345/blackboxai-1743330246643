import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CreateGoalScreen = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('personal');
  const [deadline, setDeadline] = useState('');
  const [specific, setSpecific] = useState('');
  const [actions, setActions] = useState([{ id: Date.now(), text: '' }]);
  const navigation = useNavigation();

  const handleAddAction = () => {
    setActions([...actions, { id: Date.now(), text: '' }]);
  };

  const handleActionChange = (text, id) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, text } : action
    ));
  };

  const handleRemoveAction = (id) => {
    if (actions.length > 1) {
      setActions(actions.filter(action => action.id !== id));
    }
  };

  const handleSubmit = () => {
    // Validate inputs
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
      category,
      deadline,
      specific: specific.trim(),
      actions: actions.map(action => action.text.trim()),
      createdAt: new Date().toISOString(),
      completed: false
    };

    // TODO: Implement saveGoal function
    // saveGoal(newGoal);
    
    navigation.navigate('Dashboard', { 
      success: true,
      message: 'Goal created successfully!' 
    });
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

      <Text style={styles.label}>Category:</Text>
      <View style={styles.categoryContainer}>
        {['personal', 'work', 'health', 'education'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.selectedCategory
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.categoryText}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Specific details"
        multiline
        value={specific}
        onChangeText={setSpecific}
      />

      <Text style={styles.label}>Action Steps *</Text>
      {actions.map((action) => (
        <View key={action.id} style={styles.actionContainer}>
          <TextInput
            style={[styles.input, styles.actionInput]}
            placeholder={`Action step`}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    color: '#333',
  },
});

export default CreateGoalScreen;