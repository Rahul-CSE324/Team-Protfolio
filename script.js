const scrollBtn = document.getElementById("scroll-up-btn");

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  scrollBtn.style.opacity = window.scrollY > 150 ? "1" : "0";
  scrollBtn.style.pointerEvents = window.scrollY > 150 ? "auto" : "none";
});


const todoBtn = document.getElementById("todo-btn");
const todoPanel = document.getElementById("todo-panel");
const todoInput = document.getElementById("todo-input");
const todoAddBtn = document.getElementById("todo-add-btn");
const todoList = document.getElementById("todo-list");

let isInsidePanel = false;

const shouldKeepPanelOpen = () => {
  return [todoInput, todoAddBtn, todoPanel, todoBtn].some(el =>
    el.matches(":hover") || document.activeElement === el
  );
};

todoBtn.addEventListener("mouseenter", () => {
  todoPanel.classList.add("active");
});

todoBtn.addEventListener("mouseleave", () => {
  if (!shouldKeepPanelOpen()) {
    todoPanel.classList.remove("active");
  }
});

todoPanel.addEventListener("mouseenter", () => {
  isInsidePanel = true;
  todoPanel.classList.add("active");
});

todoPanel.addEventListener("mouseleave", () => {
  isInsidePanel = false;
  if (!shouldKeepPanelOpen()) {
    todoPanel.classList.remove("active");
  }
});


let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

const renderTasks = () => {
  todoList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "todo-empty";
    emptyMessage.textContent = "No tasks added yet.";
    todoList.appendChild(emptyMessage);
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const span = document.createElement("span");
    span.textContent = task;

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "todo-delete-btn";
    delBtn.setAttribute("aria-label", `Delete task: ${task}`);
    delBtn.title = "Delete Task";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      localStorage.setItem("todoTasks", JSON.stringify(tasks));
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
};

const addTask = () => {
  const task = todoInput.value.trim();
  if (!task) return;

  tasks.push(task);
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
  todoInput.value = "";
  renderTasks();
};

todoAddBtn.addEventListener("click", addTask);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});


document.addEventListener("DOMContentLoaded", renderTasks);