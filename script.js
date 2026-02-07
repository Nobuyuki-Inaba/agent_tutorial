const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Load todos from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTodos);

// Add todo on button click
addBtn.addEventListener('click', addTodo);

// Add todo on Enter key press
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('Please enter a todo!');
        return;
    }

    // Create todo object
    const todo = {
        id: Date.now(),
        text: todoText,
        timestamp: new Date().toLocaleString(),
        completed: false
    };

    // Add to local storage
    const todos = getTodos();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));

    // Clear input
    todoInput.value = '';
    todoInput.focus();

    // Render todos
    renderTodos();
}

function toggleComplete(id) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }
}

function deleteTodo(id) {
    const todos = getTodos();
    const updatedTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    renderTodos();
}

function getTodos() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function renderTodos() {
    const todos = getTodos();
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-message">No todos yet. Add one to get started!</div>';
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id})">
            <div class="todo-text">${escapeHtml(todo.text)}</div>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

function loadTodos() {
    renderTodos();
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
