let todoInput = document.getElementById("todoInput");
let addButton = document.getElementById("addTodo");
let todoList = document.getElementById("todoList");

let showAllButton = document.getElementById("showAll");
let showActiveButton = document.getElementById("showActive");
let showCompletedButton = document.getElementById("showCompleted");
let clearCompletedButton = document.getElementById("clearCompleted");

let categoryFilterButtons = document.querySelectorAll(".category-filters button");

let categoryButton = document.getElementById("categoryButton");
let categoryOptions = document.getElementById("categoryOptions");

let categoryButtons = categoryOptions.querySelectorAll("button");

let currentFilter = "all";
let currentCategoryFilter = "all";
let currentCategory = "home";


categoryFilterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentCategoryFilter = button.dataset.category;

        categoryFilterButtons.forEach(function(button) {
            button.classList.remove("selected");
        });

        button.classList.add("selected");

        renderTodos();
    });
});

categoryButton.addEventListener("click", function() {

    categoryOptions.classList.toggle("open");
});

showAllButton.addEventListener("click", function() {
    currentFilter = "all";
    renderTodos();
});

showActiveButton.addEventListener("click", function() {
    currentFilter = "active";
    renderTodos();
});

showCompletedButton.addEventListener("click", function() {
    currentFilter = "completed";
    renderTodos();
});

clearCompletedButton.addEventListener("click", function() {
    todos = todos.filter(function(todo) {
        return !todo.completed;
    });
    renderTodos();
    saveTodos();
});

let todos = [];

let animals = [
    // Home
    { animal: "sleepy-capybara", category: "home" },
    { animal: "axolotl", category: "home" },
    { animal: "mazie", category: "home" },
    { animal: "salem", category: "home" },

    // Cleaning
    { animal: "raccoon", category: "cleaning" },
    { animal: "orange-cat", category: "cleaning" },
    { animal: "hamster", category: "cleaning" },
    {animal: "red-panda", category: "cleaning"},

    // Work
    { animal: "coding-buddy-cat", category: "work" },
    {animal: "owl", category: "work"},
    {animal: "penguin", category: "work"},
    { animal: "squirrel", category: "work" },

    // Garden
    { animal: "bunny", category: "garden" },
    { animal: "frog", category: "garden" },
    { animal: "hedgehog", category: "garden" },
    { animal: "theo", category: "garden" },
    { animal: "bee", category: "garden"},
];

let animalImages = {
    axolotl: "assets/animals/axolotl.png",
    "coding-buddy-cat": "assets/animals/coding-buddy-cat.png",
    mazie: "assets/animals/mazie.png",
    theo: "assets/animals/theo.png",
    "orange-cat": "assets/animals/orange-cat.png",
    salem: "assets/animals/salem.png",
    raccoon: "assets/animals/raccoon.png",
    hamster: "assets/animals/hamster.png",
    bunny: "assets/animals/bunny.png",
    owl: "assets/animals/owl.png",
    bee: "assets/animals/bee.png",
    "sleepy-capybara": "assets/animals/sleepy-capybara.png",
    penguin: "assets/animals/penguin.png",
    squirrel: "assets/animals/squirrel.png",
    hedgehog: "assets/animals/hedgehog.png",
    frog: "assets/animals/frog.png",
    "red-panda": "assets/animals/red-panda.png"
}

let categoryImages = {
    home: "assets/categories/home-badge.png",
    cleaning: "assets/categories/cleaning-badge.png",
    work: "assets/categories/work-badge.png",
    garden: "assets/categories/garden-badge.png"
};

let categoryDropdownImages = {
    home: "assets/categories/home-dropdown.png",
    cleaning: "assets/categories/cleaning-dropdown.png",
    work: "assets/categories/work-dropdown.png",
    garden: "assets/categories/garden-dropdown.png"
};

function updateCategoryButton() {

        categoryButton.replaceChildren();

        let categoryImage = document.createElement("img");
        categoryImage.classList.add("category-dropdown-image");
        categoryImage.src = categoryDropdownImages[currentCategory];

        let categoryText = document.createElement("span");
        categoryText.textContent = currentCategory;

        categoryButton.appendChild(categoryImage);
        categoryButton.appendChild(categoryText);
};

updateCategoryButton();

categoryButtons.forEach(function(button) {

    let categoryImage = document.createElement("img");
    categoryImage.classList.add("category-option-image");

    categoryImage.src = categoryDropdownImages[button.dataset.category];
    button.prepend(categoryImage);

    button.addEventListener("click", function() {

        currentCategory = button.dataset.category;

        updateCategoryButton();

        categoryOptions.classList.remove("open");
    })
});

function loadTodos() {

    let storedTodos = localStorage.getItem("todos");

    if (storedTodos) {
        todos = JSON.parse(storedTodos);

        todos.forEach(function(todo) {
            if (!todo.animal) {
                todo.animal = animals[Math.floor(Math.random() * animals.length)].animal;
            }
        });
        saveTodos();
    }

} 

function addTodo() {

        let todoText = todoInput.value.trim();
        let todoCategory = currentCategory;

        if (todoText === "") {
        todoInput.value = "";
        return;
        }

        let categoryAnimals = animals.filter(function(animal) {
            return animal.category === todoCategory;
        });
        
        let categoryTodos = todos.filter(function(todo) {
            return todo.category === todoCategory;
        });

        let usedAnimals = categoryTodos.map(function(todo) {
            return todo.animal;
        });

        let availableAnimals = categoryAnimals.filter(function(animal) {
            return !usedAnimals.includes(animal.animal);
        });

        if (availableAnimals.length === 0) {
            availableAnimals = categoryAnimals;
        }

        let randomAnimal =
            availableAnimals[Math.floor(Math.random() * availableAnimals.length)];

        let todo = {
            text: todoText,
            completed: false,
            category: todoCategory,
            animal: randomAnimal.animal
        };

        todos.push(todo);

        saveTodos();

        renderTodos();

        todoInput.value = "";

    }

addButton.addEventListener("click", function() {

    addTodo();

});

function renderTodos() {
    
    let displayTodos = todos.filter(function(todo) {

        let matchesCategory = currentCategoryFilter === "all" || todo.category === currentCategoryFilter;

        return (
        (currentFilter === "all" 
            || (currentFilter === "active" && todo.completed === false)
            || (currentFilter === "completed" && todo.completed === true))
            && matchesCategory
        );
    });

    todoList.textContent = "";

    showAllButton.classList.remove("selected");
    showActiveButton.classList.remove("selected");
    showCompletedButton.classList.remove("selected");

    categoryFilterButtons.forEach(function(button) {
        button.classList.remove("selected");
    });

    categoryFilterButtons.forEach(function(button) {
        if (button.dataset.category === currentCategoryFilter) {
            button.classList.add("selected");
        }
    });

    if (currentFilter === "all") {
        showAllButton.classList.add("selected");
    } else if (currentFilter === "active") {
        showActiveButton.classList.add("selected");
    } else if (currentFilter === "completed") {
        showCompletedButton.classList.add("selected");
    }

    displayTodos.forEach(function(todo, index) {

        let todoItem = document.createElement("li");

        let todoTextSpan = document.createElement("span");
        todoTextSpan.textContent = todo.text;
        todoTextSpan.classList.add("todo-text");
        todoItem.appendChild(todoTextSpan);

        let categorySpan = document.createElement("span");
        
        let categoryImage = document.createElement("img");
        categorySpan.classList.add("category-badge");
        categoryImage.src = categoryImages[todo.category];
        categorySpan.appendChild(categoryImage);

        todoItem.appendChild(categorySpan);

        let editButton = document.createElement("button");
        let editImage = document.createElement("img");
        editImage.src = "assets/buttons/edit-feather.png";
        editImage.alt = "Edit";
        editImage.classList.add("edit-feather");

        editButton.appendChild(editImage);
        todoItem.appendChild(editButton);

        editButton.addEventListener("click", function() {

            editButton.style.display = "none";

            let editInput = document.createElement("input");
            editInput.classList.add("edit-input");
            editInput.value = todo.text;
            todoItem.replaceChild(editInput, todoTextSpan);
            editInput.focus();

        editInput.addEventListener("keydown", function(event) {

            if (event.key === "Enter") {

                if (editInput.value.trim() === "") {
                    renderTodos();
                    return;
                }

                todo.text = editInput.value.trim();
                saveTodos();
                renderTodos();
            }

            if (event.key === "Escape") {
                renderTodos();
            }

        });

        editInput.addEventListener("focusout", function() {
            renderTodos();
        });

        });


        let animalSpan = document.createElement("span");

        if (todo.completed) {

            let completedImage = document.createElement("img");
            completedImage.src = "assets/buttons/completed-flower.png";
            completedImage.alt = "Completed";
            animalSpan.appendChild(completedImage);

        } else if (animalImages[todo.animal]) {

            let animalImage = document.createElement("img");

            animalImage.src = animalImages[todo.animal];
            animalImage.alt = todo.animal;

            animalSpan.appendChild(animalImage);
        } else {
            animalSpan.textContent = todo.animal;
        }

        animalSpan.classList.add("animal");
        todoItem.prepend(animalSpan);

        if (todo.completed) {
            todoTextSpan.classList.add("completed");
        }

        let deleteButton = document.createElement("button");

        let deleteImage = document.createElement("img")
        deleteImage.src = "assets/buttons/delete-heart.png";
        deleteImage.alt = "Delete";

        deleteButton.appendChild(deleteImage)
        todoItem.appendChild(deleteButton);

        deleteButton.addEventListener("click", function(event) {
            event.stopPropagation();

            todos.splice(todos.indexOf(todo), 1);
            saveTodos();
            renderTodos();
        });

        todoTextSpan.addEventListener("click", function() {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();

        });

        todoList.appendChild(todoItem);

    });

    updateCompletedDisplay();
}


todoInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTodo();
    }

});

function updateCompletedDisplay() {

    let completedCount = 0;

    todos.forEach(function(todo) {
        if (todo.completed) {
            completedCount++;
        }
    });

    let progress = 0;
        if (todos.length > 0) {
        progress = completedCount / todos.length * 100;
    }

    let remainingCount = todos.length - completedCount;

    let completedDisplay = document.getElementById("completedCount");
    completedDisplay.textContent = completedCount;

    let remainingDisplay = document.getElementById("remainingCount");
    remainingDisplay.textContent = remainingCount;

    let progressDisplay = document.getElementById("progressDisplay");
    progressDisplay.textContent = progress.toFixed(1) + "%";

    let progressBarFill = document.getElementById("progressFill");
    progressBarFill.style.width = progress + "%";

}

function saveTodos() {

    localStorage.setItem("todos", JSON.stringify(todos));

}

loadTodos();
renderTodos();