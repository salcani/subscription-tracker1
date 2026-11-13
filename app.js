
// MAIN APPLICATION JAVASCRIPT

const STORAGE_KEY = "subscriptions";

// Get subscriptions from LocalStorage
function getSubscriptions() {
    return getData(STORAGE_KEY);
}

// Save subscriptions in LocalStorage
function saveSubscriptions(subscriptions) {
    saveData(STORAGE_KEY, subscriptions);
}

// Check subscription status
function getStatus(renewalDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewal = new Date(renewalDate + "T00:00:00");

    if (renewal < today) {
        return "Expired";
    }

    return "Active";
}


// --------------------------------
// 1. ADD SUBSCRIPTION
// --------------------------------

const subscriptionForm = selectElement("#subscriptionForm");

if (subscriptionForm) {

    subscriptionForm.addEventListener("submit", function(event) {
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

        const newSubscription = {
            id: Date.now(),
            service: service,
            provider: provider,
            subscriber: subscriber,
            renewalDate: renewalDate,
            category: category
        };

        subscriptions.push(newSubscription);

        saveSubscriptions(subscriptions);

        showMessage(message, "Subscription saved successfully!");

        subscriptionForm.reset();
    });
}


// --------------------------------
// 2. DISPLAY SUBSCRIPTIONS
// --------------------------------

const subscriptionsTable = selectElement("#subscriptionsTable");

if (subscriptionsTable) {

    function displaySubscriptions() {

        const subscriptions = getSubscriptions();

        subscriptionsTable.innerHTML = "";

        const emptyMessage = selectElement("#emptyMessage");

        if (subscriptions.length === 0) {
            emptyMessage.style.display = "block";
            return;
        }

        emptyMessage.style.display = "none";

        subscriptions.forEach(function(subscription) {

            const row = createElement("tr");

            const serviceCell = createElement("td", "", subscription.service);
            const providerCell = createElement("td", "", subscription.provider);
            const subscriberCell = createElement("td", "", subscription.subscriber);
            const dateCell = createElement("td", "", formatDate(subscription.renewalDate));
            const categoryCell = createElement("td", "", subscription.category);
            const statusCell = createElement("td", "", getStatus(subscription.renewalDate));

            const actionCell = createElement("td");

            const deleteButton = createElement(
                "button",
                "btn btn-danger",
                "Delete"
            );

            deleteButton.type = "button";

            // Confirm before deleting
            deleteButton.addEventListener("click", function() {

                const confirmed = confirm(
                    "Are you sure you want to delete this subscription?"
                );

                if (confirmed) {

                    const updatedSubscriptions = getSubscriptions().filter(
                        function(item) {
                            return item.id !== subscription.id;
                        }
                    );

                    saveSubscriptions(updatedSubscriptions);

                    displaySubscriptions();
                }
            });

            actionCell.appendChild(deleteButton);

            row.appendChild(serviceCell);
            row.appendChild(providerCell);
            row.appendChild(subscriberCell);
            row.appendChild(dateCell);
            row.appendChild(categoryCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            subscriptionsTable.appendChild(row);
        });
    }

    displaySubscriptions();
}


// --------------------------------
// 3. HOME PAGE SUMMARY
// --------------------------------

const totalElement = selectElement("#totalSubscriptions");
const expiredElement = selectElement("#expiredSubscriptions");
const activeElement = selectElement("#activeSubscriptions");

if (totalElement && expiredElement && activeElement) {

    const subscriptions = getSubscriptions();

    const total = subscriptions.length;

    const expired = subscriptions.filter(function(subscription) {
        return getStatus(subscription.renewalDate) === "Expired";
    }).length;

    const active = subscriptions.filter(function(subscription) {
        return getStatus(subscription.renewalDate) === "Active";
    }).length;

    totalElement.textContent = total;
    expiredElement.textContent = expired;
    activeElement.textContent = active;
}
