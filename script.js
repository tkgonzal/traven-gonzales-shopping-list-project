// DOM ELEMENT DECLARATIONS/ASSIGNMENTS
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");
const formBtn = itemForm.querySelector("button");
let editing = false;


// BASE FUNCTIONS
// Establishes all of the event listeners and loads data in 
// Shopping List based on item in Local Storage
function init() {
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    clearBtn.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    // Checks the contents of the UI to see whether or not to 
    // display certain elements
    resetUI();
}

// Checks if there are items in the item list. If there are, will 
// set their display as block. If not, removes them from the display
function resetUI() {
    itemInput.value = "";
    const items = itemList.querySelectorAll("li");

    if (items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }

    formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
    formBtn.style.backgroundColor = "#333";

    editing = false;
}


// EVENT FUNCTIONS
// Loads the items in local storage in the Shopping List if any exist
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    resetUI();
}

// The event handler for when the user wants to add an item
// to their shopping list
function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if (newItem === "") {
        alert("Please add an item");
        return;
    }

    if (editing) {
        const editedItem = itemList.querySelector(".edit-mode");
        removeItemFromStorage(editedItem.textContent);
        editedItem.classList.remove("edit-mode");
        editedItem.remove();
    } else {
        if (checkIfItemExists(newItem)) {
            alert(`${newItem} already exists!`);
            return;
        }
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);

    resetUI();  // Checks the UI to update display as necessary
    itemInput.value = "";
}

// Edits the shopping list based on where on a list item the user has
// clicked. If on the remove button, removes the list item from the 
// list. Anywhere else, allows the user to edit the list item's name
function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    editing = true;
    itemList.querySelectorAll("li").forEach(item => {
        item.classList.remove("edit-mode");
    });
    item.classList.add("edit-mode");
    formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
    formBtn.style.backgroundColor = "#228b22";
    itemInput.value = item.textContent;
}

// Clears all of the items from the shopping list
function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem("items");
    resetUI();
}

// Filters the items display in the items list based on the 
// input in the item filter
function filterItems(e) {
    const filterText = e.target.value.toLowerCase();
    const items = document.querySelectorAll("li");

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(filterText) !== -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}


// HELPER FUNCTIONS
// If there are existing items in local storage, returns an array
// of the items in storage
function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

// Returns whether or not an item exists in the Shopping List already
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

// Attempts to add a given item to the Shopping List DOM
function addItemToDOM(newItem) {
    // Create List Item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(newItem));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    itemList.appendChild(li);
}

// Adds a given item to local storage
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// When an item remove button is closed, removes the corressponding
// list item from the shopping list
function removeItem(item) {
    if (confirm(`Are you sure you would like to remove ${item.firstChild.textContent}?`)) {
        item.remove();
        removeItemFromStorage(item.firstChild.textContent);
        resetUI();  // UI check to see if display updating is necessary
    }
}

// Given an item name, removes it from local storage
function removeItemFromStorage(itemName) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter(item => item !== itemName);
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// Creates a Close Button For a List Item using the Given Classes
function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;

    // Uses the FontAwesome Solid and X Marks Classes to create
    // A red X for the close button
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);

    return button;
}

// Creates an Icon for a Close Button using the Given Classes
function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}


// INIT CALL
init();

