// Get the update harvester form element
let updateShipmentForm = document.getElementById('update-shipment-form-ajax');

// Modify the objects we need
updateShipmentForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form field elements
    let shipmentId = document.getElementById("shipment-id-update").value;
    let inputOrderId = document.getElementById("input-order-id-update").value;
    let inputShipmentDate = document.getElementById("input-shipment-date-update");
    let inputCarrier = document.getElementById("input-carrier-update");
    let inputTrackingNumber = document.getElementById("input-tracking-number-update");
    let inputShipmentStatus = document.getElementById("input-shipment-status-update");
    let inputQuantity = document.getElementById("input-quantity-update");

    // Get the values from the form fields
    let orderIdValue = parseInt(inputOrderId);
    let shipmentDateValue = inputShipmentDate.value;
    let carrierValue = inputCarrier.value;
    let trackingNumberValue = inputTrackingNumber.value;
    let shipmentStatusValue = inputShipmentStatus.value;
    let quantityValue = inputQuantity.value;

    // Validate required fields 
    if (!orderIdValue || !shipmentDateValue || !carrierValue || !trackingNumberValue || !shipmentStatusValue || !quantityValue) {
        alert("Please fill out all required fields.");
        return;
    }
    
    // Build data object to send
    let data = {
        shipment_id: shipmentId,
        order_id: orderIdValue,
        shipment_date: shipmentDateValue,
        carrier: carrierValue,
        tracking_number: trackingNumberValue,
        shipment_status: shipmentStatusValue,
        quantity: parseInt(quantityValue)
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/shipments/put-shipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                try {
                    // Parse the JSON response
                    let updatedShipment = JSON.parse(xhttp.response);
                    console.log("Updated shipment:", updatedShipment);
                    
                    // Update the row in the shipments table with the new data
                    updateRow(updatedShipment);
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }
            } else {
                console.log("There was an error with the input. Status:", xhttp.status);
                console.log("Response:", xhttp.response);
                alert("Error updating shipment");
            }
        }
    };

    // Send the request with the data as JSON
    xhttp.send(JSON.stringify(data));
});

// Function to update the row in the shipments table
function updateRow(shipment) {
    let table = document.getElementById("Shipments-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == shipment.shipment_id) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Update the table cells
            updateRowIndex.getElementsByTagName("td")[1].innerText = shipment.order_id;
            updateRowIndex.getElementsByTagName("td")[2].innerText = shipment.shipment_date;
            updateRowIndex.getElementsByTagName("td")[3].innerText = shipment.carrier;
            updateRowIndex.getElementsByTagName("td")[4].innerText = shipment.tracking_number;
            updateRowIndex.getElementsByTagName("td")[5].innerText = shipment.shipment_status;
            updateRowIndex.getElementsByTagName("td")[6].innerText = shipment.quantity;
            break;
        }
    }
}

// Function to pre-fill the update form when the edit button is clicked
function editShipment(shipment_id) {
    // Get the table row corresponding to the selected shipment
    let row = document.querySelector(`tr[data-value='${shipment_id}']`);
    
    // Extract current values from the row
    let orderId = parseInt(row.cells[1].innerText);
    let shipmentDate = row.cells[2].innerText;
    let carrier = row.cells[3].innerText;
    let trackingNumber = row.cells[4].innerText;
    let shipmentStatus = row.cells[5].innerText;
    let quantity = row.cells[6].innerText;


    // Pre-fill the update form fields
    document.getElementById("shipment-id-update").value = shipment_id;
    document.getElementById("input-order-id-update").value = orderId;
    document.getElementById("input-shipment-date-update").value = shipmentDate;
    document.getElementById("input-carrier-update").value = carrier;
    document.getElementById("input-tracking-number-update").value = trackingNumber;
    document.getElementById("input-shipment-status-update").value = shipmentStatus;
    document.getElementById("input-quantity-update").value = quantity;
    
    // Scroll down to the update form
    document.getElementById("update-shipment-form-ajax").scrollIntoView({ behavior: "smooth" });
}