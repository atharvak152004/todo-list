const input = document.querySelector(".todo-input");
const dueDateInput = document.querySelector(".due-date-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();
checkOverdueTasks();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  let dueDateDisplay = todo.dueDate ? `<span class="due-date">Due: ${todo.dueDate}</span>` : '';

  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      ${dueDateDisplay}
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

function showTodos() {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map((todo, index) => {
      if (todo.dueDate && todo.dueDate < today && todo.status !== 'completed') {
        todo.isOverdue = true; // Mark task as overdue
      } else {
        todo.isOverdue = false;
      }
      return getTodoHtml(todo, index);
    }).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  let dueDate = dueDateInput.value;
  input.value = "";
  dueDateInput.value = ""; // Clear the due date input
  todosJson.unshift({ name: todo, status: "pending", dueDate: dueDate });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

function checkOverdueTasks() {
  const today = new Date().toISOString().split("T")[0];
  const overdueTasks = todosJson.filter(todo => todo.dueDate && todo.dueDate < today && todo.status !== 'completed');

  if (overdueTasks.length > 0) {
    alert(`You have ${overdueTasks.length} overdue task(s)!`);
  }
}
