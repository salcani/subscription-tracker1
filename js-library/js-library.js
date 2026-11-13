
// JAVASCRIPT LIBRARY

// 1. Select one HTML element
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

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading saved data:", error);
        return [];
    }
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

// 9. Show a message
function showMessage(element, message) {
    element.textContent = message;
}

// 10. Check if an email is valid
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 11. Get today's date
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

// 12. Generate a unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}
