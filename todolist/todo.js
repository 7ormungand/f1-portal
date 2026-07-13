
const LocalDatabase = {
    key: "todoList",
    getAll() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    },
    save(list) {
        localStorage.setItem(this.key, JSON.stringify(list));
    }
};

let todoList = [];
const baseTodoId = 'todoitem';
let currentSortDirection = 'none'; // 'asc', 'desc', 'none'

document.addEventListener("DOMContentLoaded", () => {
    todoList = LocalDatabase.getAll();
    applyFilterAndRender();
});

function addToDo() {
    const form = document.forms.toDoForm;
    
    if (!form.elements.title.value || !form.elements.date.value) {
        alert("Пожалуйста, заполните название и дату задачи.");
        return;
    }

    const newTodo = {
        id: createNewId(),
        title: form.elements.title.value,
        date: form.elements.date.value,
        color: form.elements.color.value,
        description: form.elements.description.value,
        priority: form.elements.priority.value,
        completed: false,
        checked: false
    };

    todoList.push(newTodo);
    LocalDatabase.save(todoList);
    applyFilterAndRender();
    
    form.reset();
}

function createNewId() {
    return todoList.length === 0 ? 1 : Math.max(...todoList.map(todo => todo.id)) + 1;
}


function setSortDirection(direction) {
    currentSortDirection = direction;
    applyFilterAndRender();
}


function applyFilterAndRender() {
    const filterPriority = document.getElementById('filterPriority').value;
    
    let processedList = [...todoList];
    if (filterPriority !== 'all') {
        processedList = processedList.filter(item => item.priority === filterPriority);
    }

    if (currentSortDirection !== 'none') {
        processedList.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return currentSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    renderTodos(processedList);
}

function renderTodos(listToRender) {
    const container = document.getElementById('toDoContainer');
    container.innerHTML = ''; 

    const priorityLabels = {
        high: { text: 'Высокий', class: 'bg-danger' },
        medium: { text: 'Средний', class: 'bg-warning text-dark' },
        low: { text: 'Низкий', class: 'bg-info text-dark' }
    };

    listToRender.forEach((todo) => {
    
        const originalIndex = todoList.findIndex(item => item.id === todo.id);

        const div = document.createElement('div');
        div.id = baseTodoId + todo.id;
        div.className = 'row my-3';

        const opacityStyle = todo.completed ? 'style="opacity: 0.6;"' : '';
        const textDecoration = todo.completed ? 'text-decoration-line-through text-muted' : '';
        const btnCheckText = todo.completed ? 'Вернуть в работу' : 'Выполнено';
        const pBadge = priorityLabels[todo.priority] || { text: 'Средний', class: 'bg-warning' };

        div.innerHTML = `
            <div class="col" ${opacityStyle}>
                <div class="card shadow-sm border-0 position-relative">
                    <div class="card-header" style="height: 15px; background-color: ${todo.color}"></div>
                    
                    <div class="card-body d-flex align-items-start">
                        <div class="form-check me-3 mt-1">
                            <input class="form-check-input item-checkbox" type="checkbox" 
                                   ${todo.checked ? 'checked' : ''} 
                                   onclick="toggleItemCheck(${todo.id}, this.checked)">
                        </div>
                        
                        <div class="w-100">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title mb-0 ${textDecoration}"> ${todo.title} </h5>
                                <div class="d-flex align-items-center gap-2">
                                    
                                    <div class="btn-group btn-group-sm me-1">
                                        <button class="btn btn-light btn-sm py-0 px-1 border" onclick="moveTodo(${originalIndex}, -1)" ${originalIndex === 0 ? 'disabled' : ''}>↑</button>
                                        <button class="btn btn-light btn-sm py-0 px-1 border" onclick="moveTodo(${originalIndex}, 1)" ${originalIndex === todoList.length - 1 ? 'disabled' : ''}>↓</button>
                                    </div>
                                    
                                    <span class="badge ${pBadge.class}">${pBadge.text}</span>
                                    <span class="badge bg-secondary">${formatDate(todo.date)}</span>
                                </div>
                            </div>
                            <p class="card-text text-secondary ${textDecoration}"> ${todo.description || 'Без описания'} </p>
                            
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <button type="button" class="btn btn-sm btn-outline-success" onclick="toggleComplete(${todo.id})">
                                    ${btnCheckText}
                                </button>
                                <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="deleteElement(${todo.id})">
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        container.append(div);
    });
}

function toggleComplete(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList[index].completed = !todoList[index].completed;
        LocalDatabase.save(todoList);
        applyFilterAndRender();
    }
}

function toggleItemCheck(id, isChecked) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList[index].checked = isChecked;
        LocalDatabase.save(todoList);
    }
}

function toggleSelectAll(masterCheckbox) {
    todoList.forEach(todo => todo.checked = masterCheckbox.checked);
    LocalDatabase.save(todoList);
    applyFilterAndRender();
}

function deleteSelected() {
    todoList = todoList.filter(todo => !todo.checked);
    document.getElementById('selectAll').checked = false;
    LocalDatabase.save(todoList);
    applyFilterAndRender();
}

function deleteElement(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList.splice(index, 1);
        LocalDatabase.save(todoList);
        applyFilterAndRender();
    }
}


function moveTodo(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= todoList.length) return;
    
    const temp = todoList[index];
    todoList[index] = todoList[targetIndex];
    todoList[targetIndex] = temp;
    
    LocalDatabase.save(todoList);
    applyFilterAndRender();
}

function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}