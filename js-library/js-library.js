// JAVASCRIPT LIBRARY

// ================================
// PART A: HELPER FUNCTIONS
// ================================

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
    return new Date(date + "T00:00:00").toLocaleDateString();
}

// 8. Check if a value is empty
function isEmpty(value) {
    return value.trim() === "";
}

// 9. Display a message
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


// ================================
// PART B: SUBSCRIPTION TRACKER LOGIC
// ================================

const STORAGE_KEY = "subscriptions";

function getSubscriptions() {
    return getData(STORAGE_KEY);
}

function saveSubscriptions(subscriptions) {
    saveData(STORAGE_KEY, subscriptions);
}

// Check subscription status
function getStatus(renewalDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewal = new Date(renewalDate + "T00:00:00");

    return renewal < today ? "Expired" : "Active";
}


// --------------------------------
// 1. ADD SUBSCRIPTION (add.html)
// --------------------------------

const subscriptionForm = selectElement("#subscriptionForm");

if (subscriptionForm) {

    subscriptionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const service = selectElement("#service").value.trim();
        const provider = selectElement("#provider").value.trim();
        const subscriber = selectElement("#subscriber").value.trim();
        const renewalDate = selectElement("#renewalDate").value;
        const category = selectElement("#category").value;

        const message = selectElement("#formMessage");

        // Check empty fields
        if (
            isEmpty(service) ||
            isEmpty(provider) ||
            isEmpty(subscriber) ||
            isEmpty(category) ||
            !renewalDate
        ) {
            showMessage(message, "Please complete all fields.");
            return;
        }

        // Check renewal date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(renewalDate + "T00:00:00");

        if (selectedDate < today) {
            showMessage(message, "Renewal date cannot be in the past.");
            return;
        }

        // Create new subscription
        const subscriptions = getSubscriptions();

        subscriptions.push({
            id: generateId(),
            service: service,
            provider: provider,
            subscriber: subscriber,
            renewalDate: renewalDate,
            category: category
        });

        saveSubscriptions(subscriptions);

        showMessage(message, "Subscription saved successfully!");

        subscriptionForm.reset();
    });
}


// --------------------------------
// 2. DISPLAY SUBSCRIPTIONS (subscriptions.html)
// --------------------------------

const subscriptionsTable = selectElement("#subscriptionsTable");

function displaySubscriptions() {

    const subscriptions = getSubscriptions();

    subscriptionsTable.innerHTML = "";

    const emptyMessage = selectElement("#emptyMessage");

    if (subscriptions.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    subscriptions.forEach(function (subscription) {

        const row = createElement("tr");

        const status = getStatus(subscription.renewalDate);

        const statusCell = createElement("td");
        const statusLabel = createElement(
            "span",
            "status " + (status === "Active" ? "status-active" : "status-expired"),
            status
        );
        statusCell.appendChild(statusLabel);

        const actionCell = createElement("td");
        const deleteButton = createElement("button", "btn btn-danger", "Delete");
        deleteButton.type = "button";

        // Confirm before deleting
        deleteButton.addEventListener("click", function () {
            const confirmed = confirm(
                "Are you sure you want to delete this subscription?"
            );

            if (confirmed) {
                const updatedSubscriptions = getSubscriptions().filter(function (item) {
                    return item.id !== subscription.id;
                });

                saveSubscriptions(updatedSubscriptions);
                displaySubscriptions();
            }
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(createElement("td", "", subscription.service));
        row.appendChild(createElement("td", "", subscription.provider));
        row.appendChild(createElement("td", "", subscription.subscriber));
        row.appendChild(createElement("td", "", formatDate(subscription.renewalDate)));
        row.appendChild(createElement("td", "", subscription.category));
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        subscriptionsTable.appendChild(row);
    });
}

if (subscriptionsTable) {
    displaySubscriptions();
}


// --------------------------------
// 3. HOME PAGE SUMMARY (index.html)
// --------------------------------

const totalElement = selectElement("#totalSubscriptions");
const expiredElement = selectElement("#expiredSubscriptions");
const activeElement = selectElement("#activeSubscriptions");

if (totalElement && expiredElement && activeElement) {

    const subscriptions = getSubscriptions();

    const expired = subscriptions.filter(function (subscription) {
        return getStatus(subscription.renewalDate) === "Expired";
    }).length;

    totalElement.textContent = subscriptions.length;
    expiredElement.textContent = expired;
    activeElement.textContent = subscriptions.length - expired;
}