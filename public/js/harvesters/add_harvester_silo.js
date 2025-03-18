// Citation for the following file:
// Date: 2021
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addHarvesterSiloForm = document.getElementById('add-harvester-silo-form-ajax');

// Modify the objects we need
addHarvesterSiloForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputHarvesterId = document.getElementById("input-harvester-id");
    let inputSiloId = document.getElementById("input-silo-id");

    // Get the values from the form fields
    let harvesterIdValue = inputHarvesterId.value;
    let siloIdValue = inputSiloId.value;

    // Validate required fields
    if (!harvesterIdValue || !siloIdValue) {
        alert("Please select both a harvester and a silo");
        return;
    }

    // Put data in a javascript object
    let data = {
        harvester_id: harvesterIdValue,
        silo_id: siloIdValue
    }
    
    // Debug logging
    console.log("Sending harvester-silo data:", data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/harvesters/add-harvester-silo-ajax", true);
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
                        alert("Harvester-Silo association added successfully!");
                        
                        // Clear the input fields for another transaction
                        inputHarvesterId.value = '';
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

// Creates a single row from an Object representing a single record from Harvesters_Spice_Silos
function addRowToTable(newAssociation) {
    // Get the table body
    let tableBody = document.getElementById("Harvesters-Silos-table").getElementsByTagName("tbody")[0];
    
    if (!tableBody) {
        console.error("Could not find table body");
        return;
    }

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newAssociation.harvester_silo_id);

    // Create table cells
    let idCell = document.createElement("td");
    let harvesterCell = document.createElement("td");
    let siloCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    idCell.innerText = newAssociation.harvester_silo_id;
    harvesterCell.innerText = newAssociation.harvester_info; // This comes from the server join
    siloCell.innerText = newAssociation.silo_info; // This comes from the server join

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteHarvesterSilo(newAssociation.harvester_silo_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(harvesterCell);
    row.appendChild(siloCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
    
    console.log("New harvester-silo row added to table");
}
