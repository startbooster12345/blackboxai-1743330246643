// Sample goals data structure
const sampleGoals = [
  {
    id: 1,
    title: "Learn React Native",
    category: "career",
    specific: "Build 3 mobile apps by end of quarter",
    measurable: "Complete 1 app every 2 weeks",
    achievable: "Dedicate 10 hours/week to learning",
    relevant: "Essential for mobile developer role",
    timeBound: "Complete by June 30",
    deadline: "2023-06-30",
    completedTasks: 6,
    totalTasks: 10,
    tasks: [
      { id: 1, name: "Complete React Native basics course", completed: true },
      { id: 2, name: "Build first demo app", completed: true },
      { id: 3, name: "Learn state management", completed: true },
      { id: 4, name: "Implement navigation", completed: true },
      { id: 5, name: "Build second app with API integration", completed: true },
      { id: 6, name: "Learn native modules", completed: true },
      { id: 7, name: "Build third app with complex features", completed: false },
      { id: 8, name: "Implement testing", completed: false },
      { id: 9, name: "Optimize performance", completed: false },
      { id: 10, name: "Prepare portfolio showcase", completed: false }
    ]
  },
  {
    id: 2,
    title: "Run a Marathon",
    category: "health",
    specific: "Complete a full marathon (42.2km)",
    measurable: "Track weekly mileage and pace",
    achievable: "Follow 16-week training plan",
    relevant: "Improve cardiovascular health",
    timeBound: "Race on October 15",
    deadline: "2023-10-15",
    completedTasks: 8,
    totalTasks: 16,
    tasks: [
      { id: 1, name: "Buy proper running shoes", completed: true },
      { id: 2, name: "Create training plan", completed: true },
      { id: 3, name: "Run 3 times/week for 2 weeks", completed: true },
      { id: 4, name: "Complete 5K run", completed: true },
      { id: 5, name: "Complete 10K run", completed: true },
      { id: 6, name: "Run 4 times/week for 4 weeks", completed: true },
      { id: 7, name: "Complete half marathon", completed: true },
      { id: 8, name: "Increase long run to 25km", completed: true },
      { id: 9, name: "Practice race nutrition", completed: false },
      { id: 10, name: "Taper training", completed: false },
      { id: 11, name: "Complete 30km run", completed: false },
      { id: 12, name: "Finalize race strategy", completed: false },
      { id: 13, name: "Rest before race", completed: false },
      { id: 14, name: "Prepare race gear", completed: false },
      { id: 15, name: "Complete 35km run", completed: false },
      { id: 16, name: "Run marathon!", completed: false }
    ]
  }
];

// Local Storage Operations
function saveGoals(goals) {
  localStorage.setItem('goals', JSON.stringify(goals));
}

function loadGoals() {
  const storedGoals = localStorage.getItem('goals');
  return storedGoals ? JSON.parse(storedGoals) : sampleGoals;
}

function addGoal(newGoal) {
  const goals = loadGoals();
  const newId = goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1;
  goals.push({ ...newGoal, id: newId });
  saveGoals(goals);
  return newId;
}

function updateGoal(updatedGoal) {
  const goals = loadGoals();
  const index = goals.findIndex(g => g.id === updatedGoal.id);
  if (index !== -1) {
    goals[index] = updatedGoal;
    saveGoals(goals);
    return true;
  }
  return false;
}

function deleteGoal(goalId) {
  const goals = loadGoals();
  const filteredGoals = goals.filter(g => g.id !== goalId);
  saveGoals(filteredGoals);
  return filteredGoals.length !== goals.length;
}

// Task Operations
function completeTask(goalId, taskId) {
  const goals = loadGoals();
  const goal = goals.find(g => g.id === goalId);
  if (goal) {
    const task = goal.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.completed = true;
      goal.completedTasks++;
      saveGoals(goals);
      return true;
    }
  }
  return false;
}

// Statistics
function getGoalStats() {
  const goals = loadGoals();
  const activeGoals = goals.filter(g => {
    const deadline = new Date(g.deadline);
    const today = new Date();
    return g.completedTasks < g.totalTasks && deadline >= today;
  }).length;

  const completedTasks = goals.reduce((sum, g) => sum + g.completedTasks, 0);
  const totalTasks = goals.reduce((sum, g) => sum + g.totalTasks, 0);
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    activeGoals,
    completedTasks,
    successRate
  };
}

// Export functions
export {
  saveGoals,
  loadGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  completeTask,
  getGoalStats
};