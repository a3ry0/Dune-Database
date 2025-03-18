// Citation for the following file:
// Date: 2025
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let addShipmentSiloForm = document.getElementById('add-shipment-silo-form-ajax');

// Modify the objects we need
addShipmentSiloForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputShipmentId = document.getElementById("input-shipment-id");
    let inputSiloId = document.getElementById("input-silo-id");

    // Get the values from the form fields
    let shipmentIdValue = inputShipmentId.value;
    let siloIdValue = inputSiloId.value;

    // Validate required fields
    if (!shipmentIdValue || !siloIdValue) {
        alert("Please select both a shipment and a silo");
        return;
    }

    // Put data in a javascript object
    let data = {
        shipment_id: shipmentIdValue,
        silo_id: siloIdValue
    }
    
    // Debug logging
    console.log("Sending shipment-silo data:", data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/shipments/add-shipment-silo-ajax", true);
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
                        let newAssociation = JSON.parse(xhttp.response);
                        console.log("Parsed Association:", newAssociation);
                        
                        // Add the new data to the table
                        addRowToTable(newAssociation);
                        
                        // Optional: show success message
                        alert("Shipment-Silo association added successfully!");
                        
                        // Clear the input fields for another transaction
                        inputShipmentId.value = '';
                        inputSiloId.value = '';
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
                alert("Failed to add association. Please try again.");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Shipments_Spice_Silos
function addRowToTable(newAssociation) {
    // Get the table body
    let tableBody = document.getElementById("Shipments-Silos-table").getElementsByTagName("tbody")[0];
    
    if (!tableBody) {
        console.error("Could not find table body");
        return;
    }

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newAssociation.shipment_silo_id);

    // Create table cells
    let idCell = document.createElement("td");
    let shipmentCell = document.createElement("td");
    let siloCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    idCell.innerText = newAssociation.shipment_silo_id;
    shipmentCell.innerText = newAssociation.shipment_info; // This comes from the server join
    siloCell.innerText = newAssociation.silo_info; // This comes from the server join

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteShipmentSilo(newAssociation.shipment_silo_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(shipmentCell);
    row.appendChild(siloCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
    
    console.log("New shipment-silo row added to table");
}