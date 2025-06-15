// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const exportTasksBtn = document.getElementById('exportTasksBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchTask = document.getElementById('searchTask');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const userName = document.getElementById('userName');
const currentDate = document.getElementById('currentDate');
const userInfoBtn = document.getElementById('userInfoBtn');
const calendarBtn = document.getElementById('calendarBtn');
const userProfileModal = document.getElementById('userProfileModal');
const calendarTasksModal = document.getElementById('calendarTasksModal');
const profileUserName = document.getElementById('profileUserName');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const exportProfileBtn = document.getElementById('exportProfileBtn');
const clearAllTasksBtn = document.getElementById('clearAllTasksBtn');
const calendarMiniDates = document.getElementById('calendarMiniDates');
const currentMonthMini = document.getElementById('currentMonthMini');
const prevMonthMini = document.getElementById('prevMonthMini');
const nextMonthMini = document.getElementById('nextMonthMini');
const showCompleted = document.getElementById('showCompleted');
const showAlarms = document.getElementById('showAlarms');
const selectedDateTasks = document.getElementById('selectedDateTasks');
const calendarTasksList = document.getElementById('calendarTasksList');

// Add new DOM elements
const contentSections = document.querySelectorAll('.content-section');
const contactForm = document.getElementById('contactForm');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');
const taskAlarm = document.getElementById('taskAlarm');
const calendarDates = document.getElementById('calendarDates');
const currentMonth = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const alarmModal = document.getElementById('alarmModal');
const alarmMessage = document.getElementById('alarmMessage');
const snoozeAlarm = document.getElementById('snoozeAlarm');
const dismissAlarm = document.getElementById('dismissAlarm');
const alarmSound = document.getElementById('alarmSound');

// Edit task modal elements
const editTaskModal = document.getElementById('editTaskModal');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskText = document.getElementById('editTaskText');
const editTaskDate = document.getElementById('editTaskDate');
const editTaskTime = document.getElementById('editTaskTime');
const editTaskAlarm = document.getElementById('editTaskAlarm');
const cancelEditTask = document.getElementById('cancelEditTask');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let searchQuery = '';
let calendarDate = new Date();
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let snoozedAlarms = new Map();
let editingTaskId = null;  // Add this to track which task is being edited

// Initialize the app
function init() {
    updateCurrentDate();
    renderTasks();
    updateTaskCount();
    setupEventListeners();
    checkAuthStatus();
    handleNavigation();
    renderCalendar();
    checkAlarms();
}

// Update current date
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// Event Listeners
function setupEventListeners() {
    // Task management
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);
    exportTasksBtn.addEventListener('click', exportTasks);
    searchTask.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks();
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Mobile menu button
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Modal handling
    loginBtn.addEventListener('click', () => showModal(loginModal));
    signupBtn.addEventListener('click', () => showModal(signupModal));
    
    // Close all modals with close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(signupModal);
            hideModal(editTaskModal);
            hideModal(userProfileModal);
            hideModal(calendarTasksModal);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    // Edit task modal
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleEditTaskSubmit(e);
        });
    } else {
        console.error('Edit task form not found');
    }

    if (cancelEditTask) {
        cancelEditTask.addEventListener('click', () => {
            console.log('Cancel edit clicked'); // Debug log
            hideModal(editTaskModal);
        });
    } else {
        console.error('Cancel edit button not found');
    }

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').slice(1); // Remove the # from href
            switchSection(section);
            updateActiveLink(link);
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', handleNavigation);

    // Contact form handling
    contactForm.addEventListener('submit', handleContactSubmit);

    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Alarm modal
    snoozeAlarm.addEventListener('click', handleSnooze);
    dismissAlarm.addEventListener('click', handleDismiss);

    // Set default date/time to now
    const now = new Date();
    taskDate.valueAsDate = now;
    taskTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // User profile and calendar modals
    userInfoBtn.addEventListener('click', showUserProfile);
    calendarBtn.addEventListener('click', showCalendarTasks);
    
    // Profile modal actions
    exportProfileBtn.addEventListener('click', exportAllTasks);
    clearAllTasksBtn.addEventListener('click', clearAllTasks);
    
    // Calendar tasks modal
    prevMonthMini.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderMiniCalendar();
    });
    
    nextMonthMini.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderMiniCalendar();
    });
    
    showCompleted.addEventListener('change', updateCalendarTasks);
    showAlarms.addEventListener('change', updateCalendarTasks);
}

// Mobile menu toggle
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
    
    // Update mobile menu button icon
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
}

// Modal functions
function showModal(modal) {
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    console.log('Showing modal:', modal.id); // Debug log
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideModal(modal) {
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    console.log('Hiding modal:', modal.id); // Debug log
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation (in a real app, this would be handled by a backend)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = { email: user.email, name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        hideModal(loginModal);
        checkAuthStatus();
        showNotification('Successfully logged in!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showNotification('Email already exists', 'error');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    hideModal(signupModal);
    showModal(loginModal);
    showNotification('Account created successfully! Please login.', 'success');
}

function checkAuthStatus() {
    if (currentUser) {
        userName.textContent = currentUser.name;
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        // Add logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-logout';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.addEventListener('click', handleLogout);
        authButtons.appendChild(logoutBtn);
    } else {
        userName.textContent = 'Guest User';
        loginBtn.style.display = 'flex';
        signupBtn.style.display = 'flex';
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) logoutBtn.remove();
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    showNotification('Successfully logged out!', 'success');
}

// Task Management Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const date = taskDate.value;
    const time = taskTime.value;
    const hasAlarm = taskAlarm.checked;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: date,
        time: time,
        hasAlarm: hasAlarm,
        createdAt: new Date().toISOString(),
        userId: currentUser ? currentUser.email : 'guest'
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateTaskCount();
    renderCalendar();

    // Set alarm if enabled
    if (hasAlarm) {
        setAlarm(task);
    }

    // Clear inputs
    taskInput.value = '';
    taskDate.value = '';
    taskTime.value = '';
    taskAlarm.checked = false;
    showNotification('Task added successfully!', 'success');
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateTaskCount();
    showNotification('Task deleted successfully!', 'success');
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
    updateTaskCount();
}

function editTask(id) {
    console.log('Edit task called with ID:', id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        console.error('Task not found:', id);
        return;
    }

    // Store the task ID being edited
    editingTaskId = id;

    // Populate the edit form
    editTaskText.value = task.text;
    editTaskDate.value = task.date || '';
    editTaskTime.value = task.time || '';
    editTaskAlarm.checked = task.hasAlarm || false;

    // Show the modal
    console.log('Edit task modal element:', editTaskModal);
    if (editTaskModal) {
        showModal(editTaskModal);
    } else {
        console.error('Edit task modal not found in DOM');
    }
}

function handleEditTaskSubmit(e) {
    e.preventDefault();

    if (!editingTaskId) return;

    const newText = editTaskText.value.trim();
    if (!newText) return;

    const task = tasks.find(task => task.id === editingTaskId);
    if (!task) return;

    // Update the task
    const updatedTask = {
        ...task,
        text: newText,
        date: editTaskDate.value,
        time: editTaskTime.value,
        hasAlarm: editTaskAlarm.checked
    };

    // Update alarms if needed
    if (task.hasAlarm && !editTaskAlarm.checked) {
        // Remove alarm if it was unchecked
        alarms = alarms.filter(alarm => alarm.taskId !== task.id);
        localStorage.setItem('alarms', JSON.stringify(alarms));
    } else if (!task.hasAlarm && editTaskAlarm.checked) {
        // Add new alarm if it was checked
        setAlarm(updatedTask);
    } else if (task.hasAlarm && editTaskAlarm.checked) {
        // Update existing alarm if date/time changed
        const oldAlarmTime = new Date(`${task.date}T${task.time}`);
        const newAlarmTime = new Date(`${editTaskDate.value}T${editTaskTime.value}`);
        if (oldAlarmTime.getTime() !== newAlarmTime.getTime()) {
            alarms = alarms.filter(alarm => alarm.taskId !== task.id);
            setAlarm(updatedTask);
        }
    }

    // Update the task in the tasks array
    tasks = tasks.map(t => t.id === editingTaskId ? updatedTask : t);
    saveTasks();
    renderTasks();
    updateTaskCount();
    renderCalendar();

    // Hide the modal and reset
    hideModal(editTaskModal);
    editingTaskId = null;
    showNotification('Task updated successfully!', 'success');
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskCount();
    showNotification('Completed tasks cleared!', 'success');
}

function exportTasks() {
    const tasksToExport = currentUser 
        ? tasks.filter(task => task.userId === currentUser.email)
        : tasks.filter(task => task.userId === 'guest');

    const dataStr = JSON.stringify(tasksToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tasks.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showNotification('Tasks exported successfully!', 'success');
}

// Render Functions
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tasks based on current user, search query, and filter
    const filteredTasks = tasks.filter(task => {
        // Filter by user
        const taskUserId = task.userId || 'guest';
        if (currentUser && taskUserId !== currentUser.email) return false;
        if (!currentUser && taskUserId !== 'guest') return false;

        // Filter by search query
        if (searchQuery && !task.text.toLowerCase().includes(searchQuery)) return false;

        // Filter by status
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = `
            <i class="fas fa-clipboard-list"></i>
            <p>No tasks found</p>
        `;
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        // Ensure task has an ID
        if (!task.id) {
            task.id = Date.now().toString();
            saveTasks();
        }

        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;
        
        const dateTime = task.date && task.time ? 
            new Date(`${task.date}T${task.time}`).toLocaleString() : 
            'No date/time set';

        // Create task content
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.innerHTML = `
            <span class="task-text">${task.text}</span>
            <span class="task-date">${dateTime}</span>
        `;

        // Create task actions
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        // Add alarm icon if task has alarm
        if (task.hasAlarm) {
            const alarmIcon = document.createElement('i');
            alarmIcon.className = 'fas fa-bell';
            alarmIcon.title = 'Alarm set';
            taskActions.appendChild(alarmIcon);
        }

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.title = 'Edit task';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Edit button clicked for task:', task.id);
            editTask(task.id);
        };

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete task';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteTask(task.id);
        };

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleTask(task.id);

        // Assemble task item
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        li.appendChild(checkbox);
        li.appendChild(taskContent);
        li.appendChild(taskActions);

        taskList.appendChild(li);
    });
}

function updateTaskCount() {
    const userTasks = currentUser 
        ? tasks.filter(task => task.userId === currentUser.email)
        : tasks.filter(task => task.userId === 'guest');

    const pendingTasks = userTasks.filter(task => !task.completed).length;
    const completedTasks = userTasks.filter(task => task.completed).length;

    taskCount.textContent = `${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} remaining`;
    completedCount.textContent = `${completedTasks} completed`;
}

// Storage Functions
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Navigation functions
function handleNavigation() {
    const hash = window.location.hash.slice(1) || 'home';
    switchSection(hash);
    const activeLink = document.querySelector(`.nav-links a[href="#${hash}"]`);
    if (activeLink) {
        updateActiveLink(activeLink);
    }
}

function switchSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        // Update URL without page reload
        history.pushState(null, '', `#${sectionId}`);
    }
}

function updateActiveLink(activeLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Contact form handling
function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // In a real application, this would send the data to a server
    console.log('Contact form submission:', { name, email, message });
    
    // Show success message
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Calendar functions
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    // Update month/year display
    currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Clear previous dates
    calendarDates.innerHTML = '';

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
        const emptyDate = document.createElement('div');
        emptyDate.className = 'calendar-date other-month';
        calendarDates.appendChild(emptyDate);
    }

    // Add dates
    for (let day = 1; day <= totalDays; day++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = day;

        const currentDateObj = new Date(year, month, day);
        
        // Check if it's today
        if (isToday(currentDateObj)) {
            dateElement.classList.add('today');
        }

        // Check if there are tasks on this date
        if (hasTasksOnDate(currentDateObj)) {
            dateElement.classList.add('has-tasks');
        }

        // Add click event to show tasks for this date
        dateElement.addEventListener('click', () => {
            filterTasksByDate(currentDateObj);
        });

        calendarDates.appendChild(dateElement);
    }
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function hasTasksOnDate(date) {
    return tasks.some(task => {
        const taskDate = new Date(task.date);
        return taskDate.getDate() === date.getDate() &&
               taskDate.getMonth() === date.getMonth() &&
               taskDate.getFullYear() === date.getFullYear();
    });
}

function filterTasksByDate(date) {
    const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getDate() === date.getDate() &&
               taskDate.getMonth() === date.getMonth() &&
               taskDate.getFullYear() === date.getFullYear();
    });
    renderTasks(filteredTasks);
}

// Task functions
function setAlarm(task) {
    const alarmTime = new Date(`${task.date}T${task.time}`);
    if (alarmTime > new Date()) {
        alarms.push({
            taskId: task.id,
            time: alarmTime.toISOString(),
            text: task.text
        });
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }
}

function checkAlarms() {
    setInterval(() => {
        const now = new Date();
        alarms = alarms.filter(alarm => {
            const alarmTime = new Date(alarm.time);
            if (alarmTime <= now && !snoozedAlarms.has(alarm.taskId)) {
                triggerAlarm(alarm);
                return false;
            }
            return true;
        });
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }, 1000);
}

function triggerAlarm(alarm) {
    alarmMessage.textContent = `Time for: ${alarm.text}`;
    alarmModal.style.display = 'flex';
    alarmSound.play();
}

function handleSnooze() {
    const activeAlarm = alarms.find(alarm => 
        new Date(alarm.time) <= new Date() && !snoozedAlarms.has(alarm.taskId)
    );
    
    if (activeAlarm) {
        const snoozeTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        snoozedAlarms.set(activeAlarm.taskId, snoozeTime);
        
        // Update alarm time
        activeAlarm.time = snoozeTime.toISOString();
        localStorage.setItem('alarms', JSON.stringify(alarms));
        
        alarmModal.style.display = 'none';
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        showNotification('Alarm snoozed for 5 minutes', 'info');
    }
}

function handleDismiss() {
    const activeAlarm = alarms.find(alarm => 
        new Date(alarm.time) <= new Date() && !snoozedAlarms.has(alarm.taskId)
    );
    
    if (activeAlarm) {
        alarms = alarms.filter(a => a.taskId !== activeAlarm.taskId);
        localStorage.setItem('alarms', JSON.stringify(alarms));
        
        alarmModal.style.display = 'none';
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        showNotification('Alarm dismissed', 'success');
    }
}

// User Profile Functions
function showUserProfile() {
    updateProfileStats();
    profileUserName.textContent = userName.textContent;
    userProfileModal.style.display = 'flex';
}

function updateProfileStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

function exportAllTasks() {
    const tasksData = {
        user: userName.textContent,
        exportDate: new Date().toISOString(),
        tasks: tasks
    };

    const blob = new Blob([JSON.stringify(tasksData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Tasks exported successfully!', 'success');
}

function clearAllTasks() {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        tasks = [];
        alarms = [];
        saveTasks();
        localStorage.setItem('alarms', JSON.stringify(alarms));
        renderTasks();
        updateTaskCount();
        renderCalendar();
        renderMiniCalendar();
        updateProfileStats();
        showNotification('All tasks cleared successfully!', 'success');
    }
}

// Calendar Tasks Functions
function showCalendarTasks() {
    renderMiniCalendar();
    updateCalendarTasks();
    calendarTasksModal.style.display = 'flex';
}

function renderMiniCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    currentMonthMini.textContent = new Date(year, month).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    calendarMiniDates.innerHTML = '';

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
        const emptyDate = document.createElement('div');
        emptyDate.className = 'calendar-mini-date other-month';
        calendarMiniDates.appendChild(emptyDate);
    }

    // Add dates
    for (let day = 1; day <= totalDays; day++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-mini-date';
        dateElement.textContent = day;

        const currentDateObj = new Date(year, month, day);
        
        if (isToday(currentDateObj)) {
            dateElement.classList.add('today');
        }

        if (hasTasksOnDate(currentDateObj)) {
            dateElement.classList.add('has-tasks');
        }

        dateElement.addEventListener('click', () => {
            showTasksForDate(currentDateObj);
        });

        calendarMiniDates.appendChild(dateElement);
    }
}

function showTasksForDate(date) {
    selectedDateTasks.textContent = `Tasks for ${date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })}`;
    
    updateCalendarTasks(date);
}

function updateCalendarTasks(selectedDate = new Date()) {
    const showCompletedTasks = showCompleted.checked;
    const showAlarmTasks = showAlarms.checked;

    const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        const isSameDate = taskDate.getDate() === selectedDate.getDate() &&
                          taskDate.getMonth() === selectedDate.getMonth() &&
                          taskDate.getFullYear() === selectedDate.getFullYear();
        
        const matchesFilters = (showCompletedTasks || !task.completed) &&
                             (showAlarmTasks || !task.hasAlarm);

        return isSameDate && matchesFilters;
    });

    calendarTasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        calendarTasksList.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-calendar-check"></i>
                <p>No tasks for this date</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        calendarTasksList.appendChild(taskElement);
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// --- Floating Bubbles ---
function createBubbles() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;
    for (let i = 0; i < 12; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 40 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.background = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.18)`;
        bubble.style.animationDuration = `${10 + Math.random() * 10}s`;
        container.appendChild(bubble);
    }
}

// --- Confetti Animation ---
function showConfetti() {
    const confetti = document.getElementById('confetti');
    if (!confetti) return;
    confetti.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
        piece.style.animationDelay = `${Math.random() * 0.2}s`;
        confetti.appendChild(piece);
    }
    setTimeout(() => { confetti.innerHTML = ''; }, 1400);
}

// --- Animated Checkmark ---
function showCheckmark(target) {
    const check = document.createElement('span');
    check.className = 'animated-checkmark';
    check.innerHTML = `<svg viewBox="0 0 24 24"><polyline class="check" points="20 6 11 17 4 10" fill="none" stroke="currentColor"/></svg>`;
    target.appendChild(check);
    setTimeout(() => check.remove(), 900);
}

// --- Animated Toast Notification ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('hide'), 2200);
    setTimeout(() => toast.remove(), 2700);
}

// --- Stylish Spinner ---
function showSpinner(show = true) {
    const spinner = document.getElementById('spinner');
    if (!spinner) return;
    spinner.style.display = show ? 'block' : 'none';
}

// --- Integrate Animations ---
// Call createBubbles on DOMContentLoaded
if (document.readyState !== 'loading') createBubbles();
else document.addEventListener('DOMContentLoaded', createBubbles);

// Show confetti and checkmark on task complete
const originalToggleTask = toggleTask;
toggleTask = function(id) {
    originalToggleTask.call(this, id);
    const li = document.querySelector(`li[data-task-id='${id}']`);
    if (li && tasks.find(t => t.id === id && t.completed)) {
        showConfetti();
        showCheckmark(li.querySelector('.task-content'));
        showToast('Task completed!', 'success');
    }
};

// Show checkmark and toast on addTask
const originalAddTask = addTask;
addTask = function() {
    originalAddTask.call(this);
    const lastTask = tasks[tasks.length-1];
    if (lastTask) {
        const li = document.querySelector(`li[data-task-id='${lastTask.id}']`);
        if (li) showCheckmark(li.querySelector('.task-content'));
    }
    showToast('Task added!', 'success');
};

// Replace showNotification with showToast
showNotification = showToast;

// Show spinner on export
const originalExportTasks = exportTasks;
exportTasks = function() {
    showSpinner(true);
    setTimeout(() => {
        originalExportTasks.call(this);
        showSpinner(false);
        showToast('Tasks exported!', 'success');
    }, 800);
};

// Export tasks as PDF
function exportTasksAsPDF() {
    const tasksToExport = currentUser 
        ? tasks.filter(task => task.userId === currentUser.email)
        : tasks.filter(task => task.userId === 'guest');
    if (!tasksToExport.length) {
        showToast('No tasks to export!', 'info');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text('TaskMaster - Task List', 14, 18);
    doc.setFontSize(12);
    let y = 30;
    tasksToExport.forEach((task, i) => {
        let status = task.completed ? '✔️ Completed' : '⏳ Pending';
        let dateTime = (task.date && task.time) ? `${task.date} ${task.time}` : 'No date/time';
        let alarm = task.hasAlarm ? '🔔' : '';
        doc.text(`${i+1}. ${task.text} ${alarm}`, 14, y);
        doc.text(`   ${status} | ${dateTime}`, 14, y+7);
        y += 18;
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    doc.save('tasks.pdf');
    showToast('Tasks exported as PDF!', 'success');
}

// Add event listener for PDF export
if (document.readyState !== 'loading') {
    const pdfBtn = document.getElementById('exportPdfBtn');
    if (pdfBtn) pdfBtn.onclick = exportTasksAsPDF;
} else {
    document.addEventListener('DOMContentLoaded', () => {
        const pdfBtn = document.getElementById('exportPdfBtn');
        if (pdfBtn) pdfBtn.onclick = exportTasksAsPDF;
    });
} 