// Success Planner - Core Application Logic

// DOM Element References
const themeToggle = document.getElementById('themeToggle');
const quoteContainer = document.getElementById('quoteContainer');
const dailyQuote = document.getElementById('dailyQuote');
const shareQuote = document.getElementById('shareQuote');
const loginForm = document.getElementById('loginForm');
const goalForm = document.getElementById('goalForm');
const addActionBtn = document.getElementById('addAction');

// Application State
let currentTheme = localStorage.getItem('theme') || 'light';
let goals = JSON.parse(localStorage.getItem('goals')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize Application
function initApp() {
  // Authentication Check
  if (!currentUser && window.location.pathname.includes('dashboard')) {
    window.location.href = 'login.html';
    return;
  }

  // Initialize Components
  setTheme(currentTheme);
  loadDailyQuote();
  setupEventListeners();

  // Dashboard-Specific Initialization
  if (document.getElementById('goalsContainer')) {
    loadGoals();
    initProgressChart();
    updateStats();
  }

  // Form Initialization
  if (goalForm) initGoalForm();
  if (loginForm) initLoginForm();
}

// Theme Management
function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}

// Daily Inspiration Quote
async function loadDailyQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    dailyQuote.textContent = `"${data.content}" — ${data.author}`;
    dailyQuote.dataset.quote = data.content;
    dailyQuote.dataset.author = data.author;
  } catch {
    dailyQuote.textContent = '"The secret of getting ahead is getting started." — Mark Twain';
    dailyQuote.dataset.quote = "The secret of getting ahead is getting started.";
    dailyQuote.dataset.author = "Mark Twain";
  }
}

// User Authentication
function initLoginForm() {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    currentUser = { 
      email,
      name: email.split('@')[0], 
      joined: new Date().toISOString() 
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showToast('Login successful!', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
  });
}

// Goal Creation Form
function initGoalForm() {
  let actionCounter = 1;
  
  // Add Action Item
  addActionBtn.addEventListener('click', () => {
    actionCounter++;
    const actionItem = document.createElement('div');
    actionItem.className = 'flex items-center space-x-2';
    actionItem.innerHTML = `
      <input type="text" name="action-${actionCounter}" required 
             class="input-field flex-1" placeholder="Action step">
      <button type="button" class="remove-action text-red-500 hover:text-red-700 p-2">
        <i class="fas fa-times"></i>
      </button>
    `;
    document.getElementById('actionItems').appendChild(actionItem);
    actionItem.querySelector('.remove-action').addEventListener('click', () => actionItem.remove());
  });
  
  // Form Submission
  goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById('goalTitle').value,
      category: document.getElementById('goalCategory').value,
      deadline: document.getElementById('goalDeadline').value,
      specific: document.getElementById('specific').value,
      measurable: document.getElementById('measurable').value,
      achievable: document.getElementById('achievable').value,
      relevant: document.getElementById('relevant').value,
      timeBound: document.getElementById('timeBound').value,
      tasks: []
    };
    
    // Validation
    if (new Date(formData.deadline) < new Date()) {
      showToast('Deadline must be in the future', 'error');
      return;
    }
    
    // Collect Action Items
    document.querySelectorAll('[name^="action-"]').forEach(input => {
      if (input.value.trim()) {
        formData.tasks.push({ 
          name: input.value.trim(), 
          completed: false 
        });
      }
    });
    
    formData.completedTasks = 0;
    formData.totalTasks = formData.tasks.length;
    
    // Save Goal
    addGoal(formData);
    showToast('Goal created successfully!', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
  });
}

// Goal Management
function loadGoals() {
  const goalsContainer = document.getElementById('goalsContainer');
  if (!goalsContainer) return;

  goalsContainer.innerHTML = goals.length === 0 ? `
    <div class="text-center py-8 animate-fade-in">
      <i class="fas fa-tasks text-4xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 dark:text-gray-400">No goals yet. Create your first goal!</p>
      <a href="create-goal.html" class="mt-4 inline-block px-4 py-2 btn-primary">
        <i class="fas fa-plus mr-2"></i> New Goal
      </a>
    </div>
  ` : goals.map(goal => createGoalCard(goal)).join('');

  // Setup Delete Handlers
  document.querySelectorAll('.delete-goal').forEach(btn => {
    btn.addEventListener('click', handleDeleteGoal);
  });
}

function createGoalCard(goal) {
  const progressPercent = calculateProgress(goal.completedTasks, goal.totalTasks);
  const dueDate = new Date(goal.deadline).toLocaleDateString();
  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  
  return `
    <div class="goal-card card animate-fade-in">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${goal.title}</h3>
        <span class="px-2 py-1 ${getCategoryColor(goal.category)} text-xs rounded-full">
          ${formatCategory(goal.category)}
        </span>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mb-4 truncate-2-lines">${goal.specific}</p>
      
      <div class="mb-3">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>${progressPercent}% (${goal.completedTasks}/${goal.totalTasks} tasks)</span>
        </div>
        <div class="progress-bar bg-gray-200 dark:bg-gray-700">
          <div class="progress-fill bg-blue-600" style="width: ${progressPercent}%"></div>
        </div>
      </div>
      
      <div class="flex justify-between items-center text-sm">
        <div class="text-gray-500 dark:text-gray-400">
          <i class="fas fa-calendar-alt mr-1"></i>
          <span>Due: ${dueDate} (${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'})</span>
        </div>
        <div class="flex space-x-2">
          <a href="create-goal.html?edit=${goal.id}" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1">
            <i class="fas fa-edit"></i>
          </a>
          <button class="text-red-500 hover:text-red-700 p-1 delete-goal" data-id="${goal.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleDeleteGoal(e) {
  const goalId = parseInt(e.currentTarget.dataset.id);
  if (confirm('Are you sure you want to delete this goal?')) {
    if (deleteGoal(goalId)) {
      showToast('Goal deleted successfully', 'success');
      loadGoals();
      updateStats();
    } else {
      showToast('Failed to delete goal', 'error');
    }
  }
}

// Progress Tracking
function updateStats() {
  const stats = getGoalStats();
  document.getElementById('activeGoals').textContent = stats.activeGoals;
  document.getElementById('completedTasks').textContent = stats.completedTasks;
  document.getElementById('successRate').textContent = `${stats.successRate}%`;
}

function initProgressChart() {
  const ctx = document.getElementById('progressChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Tasks Completed',
        data: [2, 3, 1, 4, 2, 1, 0],
        backgroundColor: '#3B82F6',
        borderRadius: 4
      }, {
        label: 'Tasks Planned',
        data: [3, 3, 3, 3, 2, 2, 1],
        backgroundColor: '#E5E7EB',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#6B7280' }
        }
      }
    }
  });
}

// UI Utilities
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
    type === 'error' ? 'bg-red-500' : 
    type === 'success' ? 'bg-green-500' : 'bg-blue-500'
  } animate-fade-in`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function setupEventListeners() {
  // Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  // Quote Sharing
  if (shareQuote) {
    shareQuote.addEventListener('click', shareDailyQuote);
  }

  // Goal Filters
  document.getElementById('filterAll')?.addEventListener('click', loadGoals);
  document.getElementById('filterActive')?.addEventListener('click', () => {
    renderFilteredGoals(goals.filter(goal => 
      goal.completedTasks < goal.totalTasks && new Date(goal.deadline) >= new Date()
    ));
  });
  document.getElementById('filterCompleted')?.addEventListener('click', () => {
    renderFilteredGoals(goals.filter(goal => goal.completedTasks >= goal.totalTasks));
  });
}

function shareDailyQuote() {
  if (navigator.share) {
    navigator.share({
      title: 'Daily Motivation',
      text: `${dailyQuote.dataset.quote} — ${dailyQuote.dataset.author}`,
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(
      `${dailyQuote.dataset.quote} — ${dailyQuote.dataset.author}\n\nShared from Success Planner`
    ).then(() => showToast('Quote copied to clipboard!', 'success'));
  }
}

function renderFilteredGoals(filteredGoals) {
  const goalsContainer = document.getElementById('goalsContainer');
  if (!goalsContainer) return;

  goalsContainer.innerHTML = filteredGoals.length === 0 ? `
    <div class="text-center py-8">
      <i class="fas fa-tasks text-4xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 dark:text-gray-400">No goals match this filter</p>
    </div>
  ` : filteredGoals.map(goal => createGoalCard(goal)).join('');
}

// Helper Functions
function calculateProgress(completed, total) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function getCategoryColor(category) {
  const colors = {
    career: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    health: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    learning: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    personal: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    finance: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
  };
  return colors[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
}

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', initApp);

// Data Functions
import { addGoal, deleteGoal, getGoalStats } from './data.js';