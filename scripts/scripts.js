document.addEventListener('DOMContentLoaded', () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const maxTaskLength = 50;
  let currentFilter = 'all';

  const newTodoInput = document.getElementById('newTodo');
  const addTodoButton = document.getElementById('addTodo');
  const todoList = document.getElementById('todoList');
  const filterAllButton = document.getElementById('filterAll');
  const filterCompletedButton = document.getElementById('filterCompleted');
  const filterUncompletedButton = document.getElementById('filterUncompleted');
  const allCount = document.getElementById('allCount');
  const completedCount = document.getElementById('completedCount');
  const uncompletedCount = document.getElementById('uncompletedCount');

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function updateCounters() {
    const allCountValue = todos.length;
    const completedCountValue = todos.filter((todo) => todo.completed).length;
    const uncompletedCountValue = allCountValue - completedCountValue;

    allCount.textContent = allCountValue;
    completedCount.textContent = completedCountValue;
    uncompletedCount.textContent = uncompletedCountValue;
  }

  function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    let filteredTodos = todos;

    if (filter === 'completed') {
      filteredTodos = todos.filter((todo) => todo.completed);
    } else if (filter === 'uncompleted') {
      filteredTodos = todos.filter((todo) => !todo.completed);
    }

    filteredTodos.forEach((todo) => {
      const index = todos.indexOf(todo);
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : ''}" data-index="${index}">${todo.text}</span>
                <button class="btn btn-danger btn-sm delete-button" data-index="${index}">Delete</button>
            `;
      todoList.appendChild(li);
    });

    updateCounters();
  }

  function addTodo() {
    const task = newTodoInput.value.trim();
    if (task && task.length <= maxTaskLength) {
      todos.push({ text: task, completed: false });
      newTodoInput.value = '';
      saveTodos();
      renderTodos(currentFilter);
    }
  }

  addTodoButton.addEventListener('click', addTodo);
  newTodoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

  todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('todo-text')) {
      const { index } = event.target.dataset;
      todos[index].completed = !todos[index].completed;
      saveTodos();
      renderTodos(currentFilter);
    } else if (event.target.classList.contains('delete-button')) {
      const { index } = event.target.dataset;
      todos.splice(index, 1);
      saveTodos();
      renderTodos(currentFilter);
    }
  });

  filterAllButton.addEventListener('click', () => {
    currentFilter = 'all';
    renderTodos(currentFilter);
  });

  filterCompletedButton.addEventListener('click', () => {
    currentFilter = 'completed';
    renderTodos(currentFilter);
  });

  filterUncompletedButton.addEventListener('click', () => {
    currentFilter = 'uncompleted';
    renderTodos(currentFilter);
  });

  renderTodos(currentFilter);
});
