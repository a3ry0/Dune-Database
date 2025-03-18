// Citation for the following file:
// Date: 2021
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("input-customer-id");
    let inputOrderDate = document.getElementById("input-order-date");
    let inputTotalQuantity = document.getElementById("input-total-quantity");
    let inputOrderStatus = document.getElementById("input-order-status");
    let inputDestination = document.getElementById("input-destination");

    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;
    let orderDateValue = inputOrderDate.value;
    let totalQuantityValue = inputTotalQuantity.value;
    let orderStatusValue = inputOrderStatus.value;
    let destinationValue = inputDestination.value;

    // Validate required fields
    if (!orderDateValue || !totalQuantityValue || !orderStatusValue || !destinationValue) {
        alert("Please fill out all required fields");
        return;
    }

    // Put data in a javascript object
    let data = {
        customer_id: customerIdValue || null,
        order_date: orderDateValue,
        total_quantity: totalQuantityValue,
        order_status: orderStatusValue,
        destination: destinationValue
    }
    
    // Debug logging
    console.log("Sending order data:", data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/orders/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log("Status:", xhttp.status);
            console.log("Response:", xhttp.response);
            
            if (xhttp.status == 200) {
                try {
                    // Only try to parse if there is a response
                    if (xhttp.response && xhttp.response.trim().length > 0) {
                        let newOrder = JSON.parse(xhttp.response);
                        console.log("Parsed Order:", newOrder);
                        
                        // Add the new data to the table
                        addRowToTable(newOrder);
                        
                        // Optional: show success message
                        alert("Order added successfully!");
                        
                        // Clear the input fields for another transaction
                        inputCustomerId.value = '';
                        inputOrderDate.value = '';
                        inputTotalQuantity.value = '';
                        inputOrderStatus.value = 'Pending';
                        inputDestination.value = '';
                    } else {
                        console.error("Empty response received from server");
                        alert("Server returned an empty response. Please try again.");
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                    alert("Error processing server response. Please try again.");
                }
            } else {
                console.log("There was an error with the input. Status code:", xhttp.status);
                alert("Failed to add order. Please try again.");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Orders
function addRowToTable(newOrder) {
    // Get the table body
    let tableBody = document.getElementById("Orders-table").getElementsByTagName("tbody")[0];
    
    if (!tableBody) {
        console.error("Could not find table body");
        return;
    }

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newOrder.order_id);

    // Create table cells
    let idCell = document.createElement("td");
    let customerCell = document.createElement("td");
    let orderDateCell = document.createElement("td");
    let totalQuantityCell = document.createElement("td");
    let orderStatusCell = document.createElement("td");
    let destinationCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    idCell.innerText = newOrder.order_id;
    customerCell.innerText = newOrder.customer_name; // This will come from the server join
    orderDateCell.innerText = new Date(newOrder.order_date).toISOString().split('T')[0];
    totalQuantityCell.innerText = newOrder.total_quantity;
    orderStatusCell.innerText = newOrder.order_status;
    destinationCell.innerText = newOrder.destination;

    // Create Edit button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function() {
        editOrder(newOrder.order_id);
    };

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteOrder(newOrder.order_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(document.createTextNode(" ")); // Space between buttons
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(customerCell);
    row.appendChild(orderDateCell);
    row.appendChild(totalQuantityCell);
    row.appendChild(orderStatusCell);
    row.appendChild(destinationCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
    
    console.log("New order row added to table");
}