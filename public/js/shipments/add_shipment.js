// Get the objects we need to modify
let addShipmentForm = document.getElementById('add-shipment-form-ajax');

// Modify the objects we need
addShipmentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("input-order-id");
    console.log(inputOrderId);
    let inputShipmentDate = document.getElementById("input-shipment-date");
    let inputCarrier = document.getElementById("input-carrier");
    let inputTrackingNumber = document.getElementById("input-tracking-number");
    let inputShipmentStatus = document.getElementById("input-shipment-status");
    let inputQuantity = document.getElementById("input-quantity");

    // Get the values from the form fields
    let orderIdValue = parseInt(inputOrderId.value);
    let shipmentDateValue = inputShipmentDate.value;
    let carrierValue = inputCarrier.value;
    let trackingNumberValue = inputTrackingNumber.value;
    let shipmentStatusValue = inputShipmentStatus.value;
    let quantityValue = inputQuantity.value;

    // Validate required fields 
    if (!orderIdValue || !shipmentDateValue || !carrierValue || !trackingNumberValue || !shipmentStatusValue || !quantityValue) {
        alert("Please fill out all required fields");
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderIdValue,
        shipment_date: shipmentDateValue,
        carrier: carrierValue,
        tracking_number: trackingNumberValue,
        shipment_status: shipmentStatusValue || null,
        quantity: parseFloat(quantityValue)
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/shipments/add-shipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                // Parse the response
                try {
                    let newShipment = JSON.parse(xhttp.response);
                    console.log("New shipment added:", newShipment);
                    
                    // Add the new data to the table
                    addRowToTable(newShipment);

                    // Clear the input fields for another transaction
                    inputOrderId.value = '';
                    inputShipmentDate.value = '';
                    inputCarrier.value = '';
                    inputTrackingNumber.value = '';
                    inputShipmentStatus.value = '';
                    inputQuantity.value = '';
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }
            } else {
                console.log("There was an error with the input. Status code:", xhttp.status);
                console.log("Response:", xhttp.response);
                alert("Error adding shipment");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from 
// Shipments
function addRowToTable(newShipment) {
    // Get the table body
    let tableBody = document.getElementById("Shipments-table").getElementsByTagName("tbody")[0];

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newShipment.shipment_id);

    // Create table cells
    let sidCell = document.createElement("td");
    let oidCell = document.createElement("td");
    let shipmentDateCell = document.createElement("td");
    let carrierCell = document.createElement("td");
    let trackingNumberCell = document.createElement("td");
    let shipmentStatusCell = document.createElement("td");
    let quantityCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    sidCell.innerText = newShipment.shipment_id;
    oidCell.innerText = newShipment.order_id;
    shipmentDateCell.innerText = newShipment.shipment_date;
    carrierCell.innerText = newShipment.carrier;
    trackingNumberCell.innerText = newShipment.tracking_number;
    shipmentStatusCell.innerText = newShipment.shipment_status;
    quantityCell.innerText = newShipment.quantity;

    // Create Edit button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function() {
        editShipment(newShipment.shipment_id);
    };

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteShipment(newShipment.shipment_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(sidCell);
    row.appendChild(oidCell);
    row.appendChild(shipmentDateCell);
    row.appendChild(carrierCell);
    row.appendChild(trackingNumberCell);
    row.appendChild(shipmentStatusCell);
    row.appendChild(quantityCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
}