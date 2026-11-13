// JAVASCRIPT LIBRARY

// 1. Select an HTML element
function selectElement(selector) {
    return document.querySelector(selector);
}

// 2. Select multiple HTML elements
function selectAllElements(selector) {
    return document.querySelectorAll(selector);
}

// 3. Save data in LocalStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// 4. Get data from LocalStorage
function getData(key) {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : [];
}

// 5. Delete data from LocalStorage
function deleteData(key) {
    localStorage.removeItem(key);
}

// 6. Create an HTML element
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

// 7. Format a date
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// 8. Check if a value is empty
function isEmpty(value) {
    return value.trim() === "";
}

// 9. Display a message
function showMessage(element, message) {
    element.textContent = message;
}