// Citation for the following file:
// Date: 2021
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
 
// Get the update order form element
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form field elements
    let orderId = document.getElementById("order-id-update").value;
    let inputCustomerId = document.getElementById("input-customer-id-update");
    let inputOrderDate = document.getElementById("input-order-date-update");
    let inputTotalQuantity = document.getElementById("input-total-quantity-update");
    let inputOrderStatus = document.getElementById("input-order-status-update");
    let inputDestination = document.getElementById("input-destination-update");

    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;
    let orderDateValue = inputOrderDate.value;
    let totalQuantityValue = inputTotalQuantity.value;
    let orderStatusValue = inputOrderStatus.value;
    let destinationValue = inputDestination.value;

    // Ensure required fields are filled with validation
    if (!orderDateValue || !totalQuantityValue || !orderStatusValue || !destinationValue) {
        alert("Please fill out all required fields");
        return;
    }
    
    // Build data object to send
    let data = {
        order_id: orderId,
        customer_id: customerIdValue || null,
        order_date: orderDateValue,
        total_quantity: totalQuantityValue,
        order_status: orderStatusValue,
        destination: destinationValue
    };
    
    // Debug log to verify data being sent
    console.log("Sending update data:", data);
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/orders/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            console.log("Update response status:", xhttp.status);
            console.log("Update response:", xhttp.response);
            
            if (xhttp.status === 200) {
                try {
                    // Parse the response data
                    let parsedData = JSON.parse(xhttp.response);
                    console.log("Updated order data:", parsedData);
                    
                    // Update the row in the table
                    updateRow(xhttp.response, orderId);
                    
                    // Optional: show success message
                    alert("Order updated successfully!");
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }
            } else {
                console.log("There was an error with the update. Status code:", xhttp.status);
                alert("Failed to update order. Please try again.");
            }
        }
    };

    // Send the request with the data as JSON
    xhttp.send(JSON.stringify(data));
});

// Function to update the row in the orders table
function updateRow(data, order_id) {
    let table = document.getElementById("Orders-table");
    let parsedData = JSON.parse(data);
    
    // Debug: verify the parsed data
    console.log("Updating row with data:", parsedData);
    
    // Find the row to update
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == order_id) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Update the table cells: column indices are
            // [1]=Customer, [2]=OrderDate, [3]=TotalQuantity, [4]=OrderStatus, [5]=Destination
            let tdCustomer = updateRowIndex.getElementsByTagName("td")[1];
            let tdOrderDate = updateRowIndex.getElementsByTagName("td")[2];
            let tdTotalQuantity = updateRowIndex.getElementsByTagName("td")[3];
            let tdOrderStatus = updateRowIndex.getElementsByTagName("td")[4];
            let tdDestination = updateRowIndex.getElementsByTagName("td")[5];

            tdCustomer.innerHTML = parsedData.customer_name || 'N/A';
            tdOrderDate.innerHTML = new Date(parsedData.order_date).toISOString().split('T')[0];
            tdTotalQuantity.innerHTML = parsedData.total_quantity;
            tdOrderStatus.innerHTML = parsedData.order_status;
            tdDestination.innerHTML = parsedData.destination;
            
            console.log("Row updated successfully");
            break;
        }
    }
}

// Function to pre-fill the update form when the edit button is clicked
function editOrder(order_id) {
    // Get the table row corresponding to the selected order
    let row = document.querySelector(`tr[data-value='${order_id}']`);
    
    if (!row) {
        console.error("Could not find row with order_id:", order_id);
        return;
    }
    
    // Get customer ID from a data attribute (we'll add this in the template)
    let customerId = row.getAttribute("data-customer-id");
    
    // Extract current values from the row
    let orderDate = row.cells[2].innerText;
    let totalQuantity = row.cells[3].innerText;
    let orderStatus = row.cells[4].innerText;
    let destination = row.cells[5].innerText;

    // Pre-fill the update form fields
    document.getElementById("order-id-update").value = order_id;
    document.getElementById("input-customer-id-update").value = customerId;
    document.getElementById("input-order-date-update").value = orderDate;
    document.getElementById("input-total-quantity-update").value = totalQuantity;
    document.getElementById("input-order-status-update").value = orderStatus;
    document.getElementById("input-destination-update").value = destination;

    // Scroll down to the update form
    document.getElementById("update-order-form-ajax").scrollIntoView({ behavior: "smooth" });
}