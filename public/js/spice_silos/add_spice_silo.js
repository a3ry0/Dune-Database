// Citation for the following file:
// Date: 2021
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addSpiceSiloForm = document.getElementById('add-spice-silo-form-ajax');

// Modify the objects we need
addSpiceSiloForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCity = document.getElementById("input-city");
    let inputSpiceCapacity = document.getElementById("input-spice-capacity");
    let inputSpiceQuantity = document.getElementById("input-spice-quantity");
    let inputLastInspectionDate = document.getElementById("input-last-inspection-date");

    // Get the values from the form fields
    let cityValue = inputCity.value;
    let spiceCapacityValue = inputSpiceCapacity.value;
    let spiceQuantityValue = inputSpiceQuantity.value;
    let lastInspectionDateValue = inputLastInspectionDate.value;


    // Validate required fields
    if (!cityValue || !spiceCapacityValue || !spiceQuantityValue) {
        alert("Please fill out all required fields");
        return;
    }

    // Put data in a javascript object
    let data = {
        city: cityValue,
        spice_capacity: spiceCapacityValue,
        spice_quantity: spiceQuantityValue,
        last_inspection_date: lastInspectionDateValue || null
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/spice_silos/add-spice-silo-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log("Status:", xhttp.status);
            console.log("Response:", xhttp.response);
            console.log("Response length:", xhttp.response.length);
            
            if (xhttp.status == 200) {
                try {
                    // Only try to parse if there is a response
                    if (xhttp.response && xhttp.response.trim().length > 0) {
                        let newSpiceSilo = JSON.parse(xhttp.response);
                        console.log("Parsed Spice Silo:", newSpiceSilo);
                        
                        // Add the new data to the table
                        addRowToTable(newSpiceSilo);
                    } else {
                        console.error("Empty response received from server");
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }

                // Clear the input fields for another transaction
                inputCity.value = '';
                inputSpiceCapacity.value = '';
                inputSpiceQuantity.value = '';
                inputLastInspectionDate.value = '';
            } else {
                console.log("There was an error with the input. Status code:", xhttp.status);
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Spice Silos
function addRowToTable(newSpiceSilo) {
    // Get the table body
    let tableBody = document.getElementById("Spice-silos-table").getElementsByTagName("tbody")[0];

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newSpiceSilo.silo_id);

    // Create table cells
    let idCell = document.createElement("td");
    let cityCell = document.createElement("td");
    let spiceCapacityCell = document.createElement("td");
    let spiceQuantityCell = document.createElement("td");
    let lastInspectionDateCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    idCell.innerText = newSpiceSilo.silo_id;
    cityCell.innerText = newSpiceSilo.city;
    spiceCapacityCell.innerText = newSpiceSilo.spice_capacity;
    spiceQuantityCell.innerText = newSpiceSilo.spice_quantity;
    lastInspectionDateCell.innerText = newSpiceSilo.last_inspection_date ? newSpiceSilo.last_inspection_date : 'N/A';

    // Create Edit button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function() {
        editSpiceSilo(newSpiceSilo.silo_id);
    };

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteSpiceSilo(newSpiceSilo.silo_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(cityCell);
    row.appendChild(spiceCapacityCell);
    row.appendChild(spiceQuantityCell);
    row.appendChild(lastInspectionDateCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
}