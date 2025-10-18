// ==================== Configuration ====================
const API_URL = window.location.origin;
let currentProjectId = null;
let currentEditingProjectId = null;
let currentEditingTaskId = null;
let projects = [];
let tasks = [];
let draggedTaskId = null;
let selectionMode = false; // Modo de seleção para projetos
let taskSelectionMode = false; // Modo de seleção para tarefas
let currentSort = 'recent'; // Ordenação atual
let currentView = 'grid'; // Visualização atual
let searchQuery = ''; // Termo de pesquisa

// ==================== DOM Elements ====================
const elements = {
    // Sections
    projectsSection: document.getElementById('projectsSection'),
    tasksSection: document.getElementById('tasksSection'),
    
    // Projects
    projectsGrid: document.getElementById('projectsGrid'),
    projectsEmptyState: document.getElementById('projectsEmptyState'),
    addProjectBtn: document.getElementById('addProjectBtn'),
    refreshProjectsBtn: document.getElementById('refreshProjectsBtn'),
    exportProjectsBtn: document.getElementById('exportProjectsBtn'),
    importProjectsBtn: document.getElementById('importProjectsBtn'),
    importFileInput: document.getElementById('importFileInput'),
    toggleSelectionModeBtn: document.getElementById('toggleSelectionModeBtn'),
    projectsSelectionBar: document.getElementById('projectsSelectionBar'),
    projectsSelectedCount: document.getElementById('projectsSelectedCount'),
    cancelProjectsSelectionBtn: document.getElementById('cancelProjectsSelectionBtn'),
    deleteSelectedProjectsBtn: document.getElementById('deleteSelectedProjectsBtn'),
    
    // Search and Filters
    searchProjectsInput: document.getElementById('searchProjectsInput'),
    sortDropdown: document.getElementById('sortDropdown'),
    sortMenu: document.getElementById('sortMenu'),
    viewToggles: document.querySelectorAll('.view-toggle'),
    
    // Tasks
    tasksList: document.getElementById('tasksList'),
    tasksEmptyState: document.getElementById('tasksEmptyState'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    refreshTasksBtn: document.getElementById('refreshTasksBtn'),
    backToProjectsBtn: document.getElementById('backToProjectsBtn'),
    currentProjectName: document.getElementById('currentProjectName'),
    currentProjectDescription: document.getElementById('currentProjectDescription'),
    toggleTaskSelectionModeBtn: document.getElementById('toggleTaskSelectionModeBtn'),
    tasksSelectionBar: document.getElementById('tasksSelectionBar'),
    tasksSelectedCount: document.getElementById('tasksSelectedCount'),
    cancelTasksSelectionBtn: document.getElementById('cancelTasksSelectionBtn'),
    deleteSelectedTasksBtn: document.getElementById('deleteSelectedTasksBtn'),
    
    // Stats
    totalTasks: document.getElementById('totalTasks'),
    completedTasks: document.getElementById('completedTasks'),
    pendingTasks: document.getElementById('pendingTasks'),
    
    // Project Modal
    projectModal: document.getElementById('projectModal'),
    projectModalTitle: document.getElementById('projectModalTitle'),
    projectForm: document.getElementById('projectForm'),
    projectName: document.getElementById('projectName'),
    projectDescription: document.getElementById('projectDescription'),
    closeProjectModal: document.getElementById('closeProjectModal'),
    cancelProjectBtn: document.getElementById('cancelProjectBtn'),
    
    // Task Modal
    taskModal: document.getElementById('taskModal'),
    taskModalTitle: document.getElementById('taskModalTitle'),
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskCompleted: document.getElementById('taskCompleted'),
    closeTaskModal: document.getElementById('closeTaskModal'),
    cancelTaskBtn: document.getElementById('cancelTaskBtn'),
    
    // Other
    themeToggle: document.getElementById('themeToggle'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    toastContainer: document.getElementById('toastContainer'),
    
    // Confirm Modal
    confirmModal: document.getElementById('confirmModal'),
    confirmModalTitle: document.getElementById('confirmModalTitle'),
    confirmModalMessage: document.getElementById('confirmModalMessage'),
    confirmOkBtn: document.getElementById('confirmOkBtn'),
    confirmCancelBtn: document.getElementById('confirmCancelBtn'),
    
    // Text Viewer Modal
    textViewerModal: document.getElementById('textViewerModal'),
    textViewerContent: document.getElementById('textViewerContent'),
    closeTextViewerBtn: document.getElementById('closeTextViewerBtn')
};

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeTheme();
    loadProjects();
});

// ==================== Event Listeners ====================
function initializeEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Project buttons
    elements.addProjectBtn.addEventListener('click', openAddProjectModal);
    elements.closeProjectModal.addEventListener('click', closeProjectModal);
    elements.cancelProjectBtn.addEventListener('click', closeProjectModal);
    elements.projectForm.addEventListener('submit', handleProjectSubmit);
    elements.refreshProjectsBtn.addEventListener('click', () => {
        loadProjects();
        showToast('Projetos atualizados!', 'success');
    });
    elements.exportProjectsBtn.addEventListener('click', exportData);
    elements.importProjectsBtn.addEventListener('click', () => elements.importFileInput.click());
    elements.importFileInput.addEventListener('change', importData);
    
    // Project selection mode
    elements.toggleSelectionModeBtn.addEventListener('click', toggleSelectionMode);
    elements.cancelProjectsSelectionBtn.addEventListener('click', exitSelectionMode);
    elements.deleteSelectedProjectsBtn.addEventListener('click', deleteSelectedProjects);
    
    // Search and Filters
    elements.searchProjectsInput.addEventListener('input', handleSearch);
    elements.sortDropdown.addEventListener('click', toggleSortMenu);
    elements.viewToggles.forEach(toggle => {
        toggle.addEventListener('click', handleViewToggle);
    });
    
    // Sort menu items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', handleSort);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            elements.sortMenu.classList.remove('show');
        }
    });
    
    // Task buttons
    elements.addTaskBtn.addEventListener('click', openAddTaskModal);
    elements.closeTaskModal.addEventListener('click', closeTaskModal);
    elements.cancelTaskBtn.addEventListener('click', closeTaskModal);
    elements.taskForm.addEventListener('submit', handleTaskSubmit);
    elements.backToProjectsBtn.addEventListener('click', showProjectsSection);
    elements.refreshTasksBtn.addEventListener('click', () => {
        loadTasks(currentProjectId);
        showToast('Tarefas atualizadas!', 'success');
    });
    
    // Task selection mode
    elements.toggleTaskSelectionModeBtn.addEventListener('click', toggleTaskSelectionMode);
    elements.cancelTasksSelectionBtn.addEventListener('click', exitTaskSelectionMode);
    elements.deleteSelectedTasksBtn.addEventListener('click', deleteSelectedTasks);
    
    // Modal click outside
    elements.projectModal.addEventListener('click', (e) => {
        if (e.target === elements.projectModal) closeProjectModal();
    });
    
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) closeTaskModal();
    });
    
    elements.confirmModal.addEventListener('click', (e) => {
        if (e.target === elements.confirmModal) closeConfirmModal();
    });
    
    elements.textViewerModal.addEventListener('click', (e) => {
        if (e.target === elements.textViewerModal) closeTextViewerModal();
    });
    
    // Text Viewer Modal close button
    elements.closeTextViewerBtn.addEventListener('click', closeTextViewerModal);
    
    // Clear errors and update character counters on input
    elements.projectName.addEventListener('input', (e) => {
        elements.projectName.classList.remove('error');
        document.getElementById('projectNameError').classList.remove('show');
        updateCharCounter(e.target, 'projectNameCounter', TEXT_LIMITS.projectName);
    });
    
    elements.projectDescription.addEventListener('input', (e) => {
        elements.projectDescription.classList.remove('error');
        document.getElementById('projectDescriptionError').classList.remove('show');
        updateCharCounter(e.target, 'projectDescriptionCounter', TEXT_LIMITS.projectDescription);
    });
    
    elements.taskTitle.addEventListener('input', (e) => {
        elements.taskTitle.classList.remove('error');
        document.getElementById('taskTitleError').classList.remove('show');
        updateCharCounter(e.target, 'taskTitleCounter', TEXT_LIMITS.taskTitle);
    });
}

// ==================== Character Counter ====================
function updateCharCounter(input, counterId, maxLength) {
    const counter = document.getElementById(counterId);
    if (!counter) return;
    
    const currentLength = input.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;
    
    // Remove all classes
    counter.classList.remove('warning', 'danger');
    
    // Add warning/danger classes based on usage
    const percentage = (currentLength / maxLength) * 100;
    if (percentage >= 100) {
        counter.classList.add('danger');
    } else if (percentage >= 80) {
        counter.classList.add('warning');
    }
}

// ==================== Theme Management ====================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    // O CSS já gerencia os ícones com base no atributo data-theme
    // Não precisa fazer nada aqui
}

// ==================== API Calls ====================
async function apiCall(endpoint, method = 'GET', data = null) {
    showLoading();
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro na requisição');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showToast(error.message || 'Erro ao comunicar com o servidor', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// ==================== Projects CRUD ====================
async function loadProjects() {
    try {
        const response = await apiCall('/Project');
        projects = response.data || [];
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

async function createProject(projectData) {
    try {
        await apiCall('/Project', 'POST', projectData);
        showToast('Projeto criado com sucesso!', 'success');
        closeProjectModal();
        await loadProjects();
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

async function updateProject(id, projectData) {
    try {
        await apiCall(`/Project/${id}`, 'PUT', projectData);
        showToast('Projeto atualizado com sucesso!', 'success');
        closeProjectModal();
        await loadProjects();
        
        // Update current project if we're viewing its tasks
        if (currentProjectId === id) {
            const project = projects.find(p => p._id === id);
            if (project) {
                elements.currentProjectName.textContent = project.Name;
                elements.currentProjectDescription.textContent = project.Description;
            }
        }
    } catch (error) {
        console.error('Error updating project:', error);
    }
}

async function deleteProject(id) {
    const confirmed = await showConfirmModal(
        'Excluir Projeto',
        'Tem certeza que deseja excluir este projeto? Todas as tarefas associadas também serão excluídas permanentemente.'
    );
    
    if (!confirmed) return;
    
    try {
        await apiCall(`/Project/${id}`, 'DELETE');
        showToast('Projeto excluído com sucesso!', 'success');
        
        // If we're viewing this project's tasks, go back to projects
        if (currentProjectId === id) {
            showProjectsSection();
        }
        
        await loadProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}

// ==================== Tasks CRUD ====================
async function loadTasks(projectId) {
    try {
        const response = await apiCall('/Task');
        const allTasks = response.data || [];
        tasks = allTasks.filter(task => {
            const taskProjectId = task.Project._id || task.Project;
            return taskProjectId === projectId;
        });
        renderTasks();
        updateTaskStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function createTask(taskData) {
    try {
        const projectId = currentProjectId;
        const payload = {
            Title: taskData.Title,
            Completed: taskData.Completed
        };
        
        await apiCall(`/Task/${projectId}`, 'POST', payload);
        showToast('Tarefa criada com sucesso!', 'success');
        closeTaskModal();
        await loadTasks(projectId);
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

async function updateTask(id, taskData) {
    try {
        await apiCall(`/Task/${id}`, 'PUT', taskData);
        showToast('Tarefa atualizada com sucesso!', 'success');
        closeTaskModal();
        await loadTasks(currentProjectId);
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function toggleTaskComplete(id, currentStatus) {
    try {
        const task = tasks.find(t => t._id === id);
        if (!task) return;
        
        const projectId = task.Project._id || task.Project;
        
        await apiCall(`/Task/${id}`, 'PUT', {
            Title: task.Title,
            Completed: !currentStatus,
            Project: projectId
        });
        
        await loadTasks(currentProjectId);
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(id) {
    const confirmed = await showConfirmModal(
        'Excluir Tarefa',
        'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.'
    );
    
    if (!confirmed) return;
    
    try {
        await apiCall(`/Task/${id}`, 'DELETE');
        showToast('Tarefa excluída com sucesso!', 'success');
        await loadTasks(currentProjectId);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// ==================== Search and Filter Functions ====================
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    renderProjects();
}

function toggleSortMenu(e) {
    e.stopPropagation();
    elements.sortMenu.classList.toggle('show');
}

function handleSort(e) {
    const sortType = e.target.dataset.sort;
    currentSort = sortType;
    
    // Update active state
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Update button text
    elements.sortDropdown.innerHTML = `<i class="fas fa-sort"></i> ${e.target.textContent}`;
    
    // Close menu
    elements.sortMenu.classList.remove('show');
    
    // Re-render
    renderProjects();
}

function handleViewToggle(e) {
    const view = e.currentTarget.dataset.view;
    currentView = view;
    
    // Update active state
    elements.viewToggles.forEach(toggle => {
        toggle.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Update grid class
    if (view === 'list') {
        elements.projectsGrid.classList.add('list-view');
    } else {
        elements.projectsGrid.classList.remove('list-view');
    }
    
    renderProjects();
}

function filterAndSortProjects() {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(project => 
            project.Name.toLowerCase().includes(searchQuery) ||
            project.Description.toLowerCase().includes(searchQuery)
        );
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.Name.localeCompare(b.Name));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.Name.localeCompare(a.Name));
            break;
    }
    
    return filtered;
}

// ==================== Render Functions ====================
function renderProjects() {
    const filteredProjects = filterAndSortProjects();
    
    if (!filteredProjects || filteredProjects.length === 0) {
        elements.projectsGrid.style.display = 'none';
        elements.projectsEmptyState.style.display = 'block';
        clearProjectsSelection();
        return;
    }
    
    elements.projectsGrid.style.display = 'grid';
    elements.projectsEmptyState.style.display = 'none';
    
    elements.projectsGrid.innerHTML = '';
    filteredProjects.forEach(project => {
        const card = renderProjectCard(project);
        elements.projectsGrid.appendChild(card);
    });
}

function renderProjectCard(project) {
    const date = new Date(project.CreatedAt);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project._id);
    card.setAttribute('data-selected', 'false');
    card.onclick = (e) => handleProjectCardClick(e, project._id);
    
    // Truncate name for display (10 chars) but check up to 40 for "ver mais"
    const displayName = project.Name.length > 10 ? project.Name.substring(0, 10) + '...' : project.Name;
    const needsExpand = project.Name.length > 40;
    
    card.innerHTML = `
        <div class="project-card-header">
            <h3 title="${escapeHtml(project.Name)}">
                <i class="fas fa-folder"></i>
                <span class="project-name">${escapeHtml(displayName)}</span>
                ${needsExpand ? '<span class="expand-name-btn" title="Ver nome completo"><i class="fas fa-expand-alt"></i></span>' : ''}
            </h3>
            <div class="project-card-actions">
                <button class="btn btn-icon" onclick="event.stopPropagation(); editProject('${project._id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon btn-danger" onclick="event.stopPropagation(); deleteProject('${project._id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <p></p>
        <div class="project-card-footer">
            <span class="project-date">
                <i class="fas fa-calendar"></i>
                ${formattedDate}
            </span>
            <span>
                <i class="fas fa-tasks"></i>
                Ver tarefas
            </span>
        </div>
    `;
    
    // Add click handler for expand name button if needed
    if (needsExpand) {
        const expandBtn = card.querySelector('.expand-name-btn');
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openTextViewerModal(project.Name, '');
        });
    }
    
    // Add truncated description
    const descriptionP = card.querySelector('p');
    const descElement = createTruncatedElement(project.Description, 100, `Descrição: ${project.Name}`);
    descriptionP.appendChild(descElement);
    
    return card;
}

function renderTasks() {
    if (!tasks || tasks.length === 0) {
        elements.tasksList.style.display = 'none';
        elements.tasksEmptyState.style.display = 'block';
        clearTasksSelection();
        return;
    }
    
    elements.tasksList.style.display = 'flex';
    elements.tasksEmptyState.style.display = 'none';
    
    elements.tasksList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskItem = renderTaskItem(task, index);
        elements.tasksList.appendChild(taskItem);
    });
}

function renderTaskItem(task, index) {
    const date = new Date(task.CreatedAt);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.Completed ? 'completed' : ''}`;
    taskItem.setAttribute('draggable', 'true');
    taskItem.setAttribute('data-task-id', task._id);
    taskItem.setAttribute('data-task-index', index);
    taskItem.setAttribute('data-selected', 'false');
    taskItem.onclick = (e) => handleTaskCardClick(e, task._id);
    taskItem.ondragstart = (e) => handleDragStart(e, task._id);
    taskItem.ondragover = handleDragOver;
    taskItem.ondragenter = handleDragEnter;
    taskItem.ondragleave = handleDragLeave;
    taskItem.ondrop = (e) => handleDrop(e, index);
    taskItem.ondragend = handleDragEnd;
    
    taskItem.innerHTML = `
        <div class="drag-handle" title="Arrastar para reordenar">
            <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="task-content">
            <h4 class="task-title"></h4>
            <span class="task-date">
                <i class="fas fa-calendar"></i>
                ${formattedDate}
            </span>
        </div>
        <div class="task-actions">
            <button class="btn btn-icon ${task.Completed ? 'btn-secondary' : 'btn-success'}" 
                    onclick="event.stopPropagation(); toggleTaskComplete('${task._id}', ${task.Completed})" 
                    title="${task.Completed ? 'Marcar como pendente' : 'Marcar como concluída'}">
                <i class="fas ${task.Completed ? 'fa-times' : 'fa-check'}"></i>
            </button>
            <button class="btn btn-icon" onclick="event.stopPropagation(); editTask('${task._id}')" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon btn-danger" onclick="event.stopPropagation(); deleteTask('${task._id}')" title="Excluir">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add truncated title
    const titleElement = taskItem.querySelector('.task-title');
    const titleContent = createTruncatedElement(task.Title, 50, `Tarefa: ${task.Title}`);
    titleElement.appendChild(titleContent);
    
    return taskItem;
}

// ==================== Modal Functions ====================
function openAddProjectModal() {
    currentEditingProjectId = null;
    elements.projectModalTitle.innerHTML = '<i class="fas fa-folder-plus"></i> Novo Projeto';
    elements.projectForm.reset();
    updateCharCounter(elements.projectName, 'projectNameCounter', TEXT_LIMITS.projectName);
    updateCharCounter(elements.projectDescription, 'projectDescriptionCounter', TEXT_LIMITS.projectDescription);
    elements.projectModal.classList.add('active');
}

function closeProjectModal() {
    elements.projectModal.classList.remove('active');
    elements.projectForm.reset();
    currentEditingProjectId = null;
}

function openAddTaskModal() {
    currentEditingTaskId = null;
    elements.taskModalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Nova Tarefa';
    elements.taskForm.reset();
    updateCharCounter(elements.taskTitle, 'taskTitleCounter', TEXT_LIMITS.taskTitle);
    elements.taskModal.classList.add('active');
}

function closeTaskModal() {
    elements.taskModal.classList.remove('active');
    elements.taskForm.reset();
    currentEditingTaskId = null;
}

function editProject(id) {
    const project = projects.find(p => p._id === id);
    if (!project) return;
    
    currentEditingProjectId = id;
    elements.projectModalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Projeto';
    elements.projectName.value = project.Name;
    elements.projectDescription.value = project.Description;
    updateCharCounter(elements.projectName, 'projectNameCounter', TEXT_LIMITS.projectName);
    updateCharCounter(elements.projectDescription, 'projectDescriptionCounter', TEXT_LIMITS.projectDescription);
    elements.projectModal.classList.add('active');
}

function editTask(id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    
    currentEditingTaskId = id;
    elements.taskModalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Tarefa';
    elements.taskTitle.value = task.Title;
    elements.taskCompleted.checked = task.Completed;
    updateCharCounter(elements.taskTitle, 'taskTitleCounter', TEXT_LIMITS.taskTitle);
    elements.taskModal.classList.add('active');
}

// ==================== Form Validation ====================
function validateProjectForm() {
    let isValid = true;
    
    // Get error elements
    const nameError = document.getElementById('projectNameError');
    const descError = document.getElementById('projectDescriptionError');
    
    // Reset errors
    elements.projectName.classList.remove('error');
    elements.projectDescription.classList.remove('error');
    nameError.classList.remove('show');
    descError.classList.remove('show');
    
    const name = elements.projectName.value.trim();
    const description = elements.projectDescription.value.trim();
    
    // Validate name
    if (!name) {
        elements.projectName.classList.add('error');
        nameError.textContent = 'O nome do projeto é obrigatório';
        nameError.classList.add('show');
        isValid = false;
    } else if (name.length > TEXT_LIMITS.projectName) {
        elements.projectName.classList.add('error');
        nameError.textContent = `O nome deve ter no máximo ${TEXT_LIMITS.projectName} caracteres (atual: ${name.length})`;
        nameError.classList.add('show');
        isValid = false;
    }
    
    // Validate description
    if (!description) {
        elements.projectDescription.classList.add('error');
        descError.textContent = 'A descrição do projeto é obrigatória';
        descError.classList.add('show');
        isValid = false;
    } else if (description.length > TEXT_LIMITS.projectDescription) {
        elements.projectDescription.classList.add('error');
        descError.textContent = `A descrição deve ter no máximo ${TEXT_LIMITS.projectDescription} caracteres (atual: ${description.length})`;
        descError.classList.add('show');
        isValid = false;
    }
    
    return isValid;
}

function validateTaskForm() {
    let isValid = true;
    
    // Get error element
    const titleError = document.getElementById('taskTitleError');
    
    // Reset errors
    elements.taskTitle.classList.remove('error');
    titleError.classList.remove('show');
    
    const title = elements.taskTitle.value.trim();
    
    // Validate title
    if (!title) {
        elements.taskTitle.classList.add('error');
        titleError.textContent = 'O título da tarefa é obrigatório';
        titleError.classList.add('show');
        isValid = false;
    } else if (title.length > TEXT_LIMITS.taskTitle) {
        elements.taskTitle.classList.add('error');
        titleError.textContent = `O título deve ter no máximo ${TEXT_LIMITS.taskTitle} caracteres (atual: ${title.length})`;
        titleError.classList.add('show');
        isValid = false;
    }
    
    return isValid;
}

// ==================== Form Handlers ====================
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateProjectForm()) {
        return;
    }
    
    const projectData = {
        Name: elements.projectName.value.trim(),
        Description: elements.projectDescription.value.trim()
    };
    
    if (currentEditingProjectId) {
        await updateProject(currentEditingProjectId, projectData);
    } else {
        await createProject(projectData);
    }
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateTaskForm()) {
        return;
    }
    
    const taskData = {
        Title: elements.taskTitle.value.trim(),
        Completed: elements.taskCompleted.checked,
        Project: currentProjectId
    };
    
    if (currentEditingTaskId) {
        await updateTask(currentEditingTaskId, taskData);
    } else {
        await createTask(taskData);
    }
}

// ==================== View Management ====================
function viewProjectTasks(projectId) {
    currentProjectId = projectId;
    const project = projects.find(p => p._id === projectId);
    
    if (project) {
        // Use truncated text for project name (40 chars limit)
        elements.currentProjectName.innerHTML = '';
        const nameElement = createTruncatedElement(project.Name, 40, '');
        elements.currentProjectName.appendChild(nameElement);
        
        // Use truncated text for description (100 chars limit)
        elements.currentProjectDescription.innerHTML = '';
        const descElement = createTruncatedElement(project.Description, 100, '');
        elements.currentProjectDescription.appendChild(descElement);
    }
    
    elements.projectsSection.style.display = 'none';
    elements.tasksSection.style.display = 'block';
    
    loadTasks(projectId);
}

function showProjectsSection() {
    currentProjectId = null;
    elements.tasksSection.style.display = 'none';
    elements.projectsSection.style.display = 'block';
}

// ==================== Stats ====================
function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.Completed).length;
    const pending = total - completed;
    
    elements.totalTasks.textContent = total;
    elements.completedTasks.textContent = completed;
    elements.pendingTasks.textContent = pending;
}

// ==================== Utility Functions ====================
function showLoading() {
    elements.loadingOverlay.classList.add('active');
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('active');
}

// ==================== Text Truncation and Viewer ====================
const TEXT_LIMITS = {
    projectName: 50,
    projectDescription: 3000,
    taskTitle: 200,
    displayTruncate: 150
};

function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) {
        return { truncated: text, isTruncated: false };
    }
    
    // Limit absolute maximum to prevent page breaking
    const absoluteMax = 3000;
    if (text.length > absoluteMax) {
        text = text.substring(0, absoluteMax) + '... (texto muito longo, foi limitado)';
    }
    
    const truncated = text.substring(0, maxLength).trim();
    return { truncated, isTruncated: true, fullText: text };
}

function createTruncatedElement(text, maxLength = 150, title = '') {
    const result = truncateText(text, maxLength);
    
    if (!result.isTruncated) {
        return document.createTextNode(result.truncated);
    }
    
    const container = document.createElement('span');
    container.className = 'truncated-text expandable';
    container.textContent = result.truncated + '...';
    container.title = 'Ver mais';
    container.style.cursor = 'pointer';
    
    container.addEventListener('click', (e) => {
        e.stopPropagation();
        openTextViewerModal(result.fullText, title);
    });
    
    return container;
}

function openTextViewerModal(text, title = '') {
    elements.textViewerContent.textContent = text;
    elements.textViewerModal.classList.add('active');
}

function closeTextViewerModal() {
    elements.textViewerModal.classList.remove('active');
}

function showToast(message, type = 'success') {
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Confirmation Modal ====================
function showConfirmModal(title, message) {
    return new Promise((resolve) => {
        elements.confirmModalTitle.textContent = title;
        elements.confirmModalMessage.textContent = message;
        elements.confirmModal.classList.add('active');
        
        // Remove previous listeners
        const newOkBtn = elements.confirmOkBtn.cloneNode(true);
        elements.confirmOkBtn.parentNode.replaceChild(newOkBtn, elements.confirmOkBtn);
        elements.confirmOkBtn = newOkBtn;
        
        // Add new listener
        elements.confirmOkBtn.addEventListener('click', () => {
            closeConfirmModal();
            resolve(true);
        }, { once: true });
        
        // Cancel resolves to false
        const cancelHandler = () => {
            closeConfirmModal();
            resolve(false);
        };
        
        elements.confirmCancelBtn.addEventListener('click', cancelHandler, { once: true });
    });
}

function closeConfirmModal() {
    elements.confirmModal.classList.remove('active');
}

// ==================== Drag and Drop Functions ====================
function handleDragStart(event, taskId) {
    draggedTaskId = taskId;
    event.currentTarget.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.currentTarget.innerHTML);
}

function handleDragOver(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    event.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(event) {
    if (event.currentTarget.classList.contains('task-item')) {
        event.currentTarget.classList.add('drag-over');
    }
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event, targetIndex) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    
    event.currentTarget.classList.remove('drag-over');
    
    const draggedIndex = tasks.findIndex(t => t._id === draggedTaskId);
    
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        // Reorder tasks array
        const [draggedTask] = tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, draggedTask);
        
        // Re-render tasks
        renderTasks();
        
        showToast('Tarefa reordenada com sucesso!', 'success');
    }
    
    return false;
}

function handleDragEnd(event) {
    event.currentTarget.classList.remove('dragging');
    
    // Remove drag-over class from all items
    document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

// ==================== Selection Handlers ====================
function toggleSelectionMode() {
    selectionMode = !selectionMode;
    
    if (selectionMode) {
        // Entrar no modo de seleção
        elements.toggleSelectionModeBtn.classList.add('active');
        elements.toggleSelectionModeBtn.innerHTML = '<i class="fas fa-times"></i> Sair do Modo Seleção';
        elements.projectsGrid.classList.add('selection-mode');
    } else {
        // Sair do modo de seleção
        exitSelectionMode();
    }
}

function exitSelectionMode() {
    selectionMode = false;
    elements.toggleSelectionModeBtn.classList.remove('active');
    elements.toggleSelectionModeBtn.innerHTML = '<i class="fas fa-check-square"></i> Modo Seleção';
    elements.projectsGrid.classList.remove('selection-mode');
    clearProjectsSelection();
}

function toggleTaskSelectionMode() {
    taskSelectionMode = !taskSelectionMode;
    
    if (taskSelectionMode) {
        // Entrar no modo de seleção
        elements.toggleTaskSelectionModeBtn.classList.add('active');
        elements.toggleTaskSelectionModeBtn.innerHTML = '<i class="fas fa-times"></i> Sair do Modo Seleção';
        elements.tasksList.classList.add('selection-mode');
    } else {
        // Sair do modo de seleção
        exitTaskSelectionMode();
    }
}

function exitTaskSelectionMode() {
    taskSelectionMode = false;
    elements.toggleTaskSelectionModeBtn.classList.remove('active');
    elements.toggleTaskSelectionModeBtn.innerHTML = '<i class="fas fa-check-square"></i> Modo Seleção';
    elements.tasksList.classList.remove('selection-mode');
    clearTasksSelection();
}

function handleProjectCheckboxChange() {
    updateProjectsSelection();
}

function handleTaskCheckboxChange() {
    updateTasksSelection();
}

function handleTaskCardClick(event, taskId) {
    // Se clicou em um botão de ação, não fazer nada
    if (event.target.closest('.task-actions')) {
        return;
    }
    
    // Se está no modo de seleção, alternar seleção
    if (taskSelectionMode) {
        const taskItem = event.currentTarget;
        const isSelected = taskItem.getAttribute('data-selected') === 'true';
        taskItem.setAttribute('data-selected', !isSelected);
        updateTasksSelection();
    }
}

function handleProjectCardClick(event, projectId) {
    // Se clicou em um botão de ação, não fazer nada
    if (event.target.closest('.project-card-actions')) {
        return;
    }
    
    // Se está no modo de seleção, alternar seleção
    if (selectionMode) {
        const card = event.currentTarget;
        const isSelected = card.getAttribute('data-selected') === 'true';
        card.setAttribute('data-selected', !isSelected);
        updateProjectsSelection();
    } else {
        // Se não está no modo de seleção, navegar para as tarefas
        viewProjectTasks(projectId);
    }
}

function updateProjectsSelection() {
    const cards = document.querySelectorAll('.project-card');
    const selectedCards = document.querySelectorAll('.project-card[data-selected="true"]');
    const selectedCount = selectedCards.length;
    
    // Atualizar visual dos cards
    cards.forEach(card => {
        const isSelected = card.getAttribute('data-selected') === 'true';
        if (isSelected) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Mostrar/esconder barra de seleção
    if (selectedCount > 0) {
        elements.projectsSelectionBar.style.display = 'flex';
        elements.projectsSelectedCount.textContent = selectedCount;
    } else {
        elements.projectsSelectionBar.style.display = 'none';
    }
}

function updateTasksSelection() {
    const items = document.querySelectorAll('.task-item');
    const selectedItems = document.querySelectorAll('.task-item[data-selected="true"]');
    const selectedCount = selectedItems.length;
    
    // Atualizar visual dos items
    items.forEach(item => {
        const isSelected = item.getAttribute('data-selected') === 'true';
        if (isSelected) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Mostrar/esconder barra de seleção
    if (selectedCount > 0) {
        elements.tasksSelectionBar.style.display = 'flex';
        elements.tasksSelectedCount.textContent = selectedCount;
    } else {
        elements.tasksSelectionBar.style.display = 'none';
    }
}

function clearProjectsSelection() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.setAttribute('data-selected', 'false');
        card.classList.remove('selected');
    });
    
    elements.projectsSelectionBar.style.display = 'none';
}

function clearTasksSelection() {
    const items = document.querySelectorAll('.task-item');
    items.forEach(item => {
        item.setAttribute('data-selected', 'false');
        item.classList.remove('selected');
    });
    
    elements.tasksSelectionBar.style.display = 'none';
}

async function deleteSelectedProjects() {
    const selectedCards = document.querySelectorAll('.project-card[data-selected="true"]');
    const selectedCount = selectedCards.length;
    
    if (selectedCount === 0) return;
    
    const confirmed = await showConfirmModal(
        'Excluir Projetos',
        `Tem certeza que deseja excluir ${selectedCount} projeto(s) selecionado(s)? Esta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;
    
    const selectedIds = Array.from(selectedCards).map(card => card.dataset.projectId);
    
    try {
        // Deletar todos os projetos selecionados
        await Promise.all(selectedIds.map(id => 
            fetch(`${API_URL}/Project/${id}`, { method: 'DELETE' })
        ));
        
        showToast(`${selectedCount} projeto(s) excluído(s) com sucesso!`, 'success');
        clearProjectsSelection();
        await loadProjects();
    } catch (error) {
        showToast('Erro ao excluir projetos', 'error');
        console.error('Erro ao excluir projetos:', error);
    }
}

async function deleteSelectedTasks() {
    const selectedItems = document.querySelectorAll('.task-item[data-selected="true"]');
    const selectedCount = selectedItems.length;
    
    if (selectedCount === 0) return;
    
    const confirmed = await showConfirmModal(
        'Excluir Tarefas',
        `Tem certeza que deseja excluir ${selectedCount} tarefa(s) selecionada(s)? Esta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;
    
    const selectedIds = Array.from(selectedItems).map(item => item.dataset.taskId);
    
    try {
        // Deletar todas as tarefas selecionadas
        await Promise.all(selectedIds.map(id => 
            fetch(`${API_URL}/Task/${id}`, { method: 'DELETE' })
        ));
        
        showToast(`${selectedCount} tarefa(s) excluída(s) com sucesso!`, 'success');
        clearTasksSelection();
        await loadTasks(currentProjectId);
    } catch (error) {
        showToast('Erro ao excluir tarefas', 'error');
        console.error('Erro ao excluir tarefas:', error);
    }
}

// ==================== Import/Export Functions ====================
async function exportData() {
    try {
        showLoading();
        
        // Obter todos os projetos e tarefas
        const projectsData = await apiCall('/Project');
        const tasksData = await apiCall('/Task');
        
        const allProjects = projectsData.data || [];
        const allTasks = tasksData.data || [];
        
        if (allProjects.length === 0 && allTasks.length === 0) {
            showToast('Não há dados para exportar', 'info');
            return;
        }
        
        // Criar objeto de exportação
        const exportObj = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            projectCount: allProjects.length,
            taskCount: allTasks.length,
            projects: allProjects,
            tasks: allTasks
        };
        
        // Criar blob e fazer download
        const dataStr = JSON.stringify(exportObj, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast(`Exportados ${allProjects.length} projeto(s) e ${allTasks.length} tarefa(s)!`, 'success');
    } catch (error) {
        showToast('Erro ao exportar dados', 'error');
        console.error('Erro ao exportar dados:', error);
    } finally {
        hideLoading();
    }
}

async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const fileContent = await file.text();
        const importObj = JSON.parse(fileContent);
        
        console.log('Dados importados:', importObj);
        
        // Extrair projetos e tarefas (pode estar em data ou direto)
        let projectsArray = [];
        let tasksArray = [];
        
        // Verificar se está no formato da API (com .data)
        if (importObj.data) {
            projectsArray = Array.isArray(importObj.data) ? importObj.data : [];
        } else if (importObj.projects) {
            // Formato de exportação próprio
            projectsArray = Array.isArray(importObj.projects) ? importObj.projects : 
                           (importObj.projects.data ? importObj.projects.data : []);
        }
        
        if (importObj.tasks) {
            tasksArray = Array.isArray(importObj.tasks) ? importObj.tasks : 
                        (importObj.tasks.data ? importObj.tasks.data : []);
        }
        
        console.log('Projetos extraídos:', projectsArray);
        console.log('Tarefas extraídas:', tasksArray);
        
        // Validar se temos dados
        if (!Array.isArray(projectsArray) || !Array.isArray(tasksArray)) {
            throw new Error('Formato de arquivo inválido - dados não encontrados ou não são arrays');
        }
        
        const projectCount = projectsArray.length;
        const taskCount = tasksArray.length;
        
        if (projectCount === 0 && taskCount === 0) {
            hideLoading();
            showToast('O arquivo não contém dados para importar', 'info');
            event.target.value = '';
            return;
        }
        
        const confirmed = await showConfirmModal(
            'Importar Dados',
            `Deseja importar ${projectCount} projeto(s) e ${taskCount} tarefa(s)? Os dados existentes não serão removidos.`
        );
        
        if (!confirmed) {
            hideLoading();
            event.target.value = '';
            return;
        }
        
        showLoading();
        let importedProjects = 0;
        let importedTasks = 0;
        const projectIdMap = new Map(); // Mapear IDs antigos para novos
        
        // Importar projetos primeiro
        for (const project of projectsArray) {
            try {
                const oldId = project._id;
                // Remover campos que não devem ser importados
                const { _id, CreatedAt, UpdatedAt, __v, ...projectData } = project;
                
                console.log('Importando projeto:', projectData.Name, 'Old ID:', oldId);
                
                const response = await apiCall('/Project', 'POST', projectData);
                
                console.log('Resposta da API:', response);
                
                if (response) {
                    // A resposta pode estar em response.data ou direto em response
                    const newProjectData = response.data || response;
                    const newId = newProjectData._id || newProjectData.id;
                    
                    if (newId) {
                        importedProjects++;
                        // Mapear ID antigo para novo
                        projectIdMap.set(oldId, newId);
                        console.log('Projeto importado! Old ID:', oldId, '-> New ID:', newId);
                    } else {
                        console.error('ID do projeto não encontrado na resposta:', newProjectData);
                    }
                }
            } catch (error) {
                console.error('Erro ao importar projeto:', project.Name, error);
            }
        }
        
        console.log('Mapa de IDs de projetos:', projectIdMap);
        console.log('Total de tarefas a importar:', tasksArray.length);
        
        // Importar tarefas vinculando aos novos IDs de projeto
        for (const task of tasksArray) {
            try {
                const oldProjectId = typeof task.Project === 'object' ? task.Project._id : task.Project;
                console.log('Tarefa:', task.Title, '| Old Project ID:', oldProjectId);
                
                const newProjectId = projectIdMap.get(oldProjectId);
                console.log('New Project ID encontrado:', newProjectId);
                
                // Se o projeto foi importado, importar a tarefa
                if (newProjectId) {
                    // Remover campos que não devem ser importados
                    const { _id, CreatedAt, UpdatedAt, __v, Project, ...taskData } = task;
                    
                    console.log('Importando tarefa:', taskData.Title, 'para projeto:', newProjectId);
                    
                    const response = await apiCall(`/Task/${newProjectId}`, 'POST', {
                        Title: taskData.Title,
                        Completed: taskData.Completed || false
                    });
                    
                    if (response && response.data) {
                        importedTasks++;
                        console.log('Tarefa importada com sucesso!');
                    }
                } else {
                    console.warn('Projeto não encontrado para tarefa:', task.Title, '| Old Project ID:', oldProjectId);
                }
            } catch (error) {
                console.error('Erro ao importar tarefa:', task.Title, error);
            }
        }
        
        hideLoading();
        
        if (importedProjects === 0 && importedTasks === 0) {
            showToast('Nenhum dado foi importado. Verifique o formato do arquivo.', 'error');
        } else {
            showToast(`✅ Importados: ${importedProjects} projeto(s) e ${importedTasks} tarefa(s)!`, 'success');
        }
        
        await loadProjects();
        
        // Se estiver na view de tarefas, recarregar
        if (currentProjectId) {
            await loadTasks(currentProjectId);
        }
        
        // Resetar input de arquivo
        event.target.value = '';
    } catch (error) {
        hideLoading();
        showToast('Erro ao importar dados: ' + error.message, 'error');
        console.error('Erro ao importar dados:', error);
        
        // Resetar input de arquivo
        event.target.value = '';
    }
}

// ==================== Global Functions ====================
// Make functions globally accessible for inline onclick handlers
window.viewProjectTasks = viewProjectTasks;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.toggleTaskComplete = toggleTaskComplete;
window.handleDragStart = handleDragStart;
window.handleDragOver = handleDragOver;
window.handleDragEnter = handleDragEnter;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;
window.handleDragEnd = handleDragEnd;
window.handleProjectCardClick = handleProjectCardClick;
window.handleProjectCheckboxChange = handleProjectCheckboxChange;
window.handleTaskCheckboxChange = handleTaskCheckboxChange;
