// Citation for the following file:
// Date: 2025
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputPlanet = document.getElementById("input-planet");
    let inputAffiliation = document.getElementById("input-affiliation");

    // Get the values from the form fields
    let nameValue = inputName.value.trim();
    let planetValue = inputPlanet.value.trim();
    let affiliationValue = inputAffiliation.value.trim();

    // Validate required fields
    if (!nameValue || !planetValue) {
        alert("Please fill out all required fields");
        return;
    }

    // Put data in a javascript object
    let data = {
        name: nameValue,
        planet: planetValue,
        affiliation: affiliationValue || null  // Convert empty string to null
    }
    
    // Debug log to verify data being sent
    console.log("Sending data:", data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/customers/add-customer-ajax", true);
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
                        let newCustomer = JSON.parse(xhttp.response);
                        console.log("Parsed Customer:", newCustomer);
                        
                        // Add the new data to the table
                        addRowToTable(newCustomer);
                        
                        // Optional: show success message
                        alert("Customer added successfully!");
                        
                        // Clear the input fields for another transaction
                        inputName.value = '';
                        inputPlanet.value = '';
                        inputAffiliation.value = '';
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
                alert("Failed to add customer. Please try again.");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from Customers
function addRowToTable(newCustomer) {
    // Get the table body
    let tableBody = document.getElementById("Customers-table").getElementsByTagName("tbody")[0];
    
    if (!tableBody) {
        console.error("Could not find table body");
        return;
    }

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newCustomer.customer_id);

    // Create table cells
    let idCell = document.createElement("td");
    let nameCell = document.createElement("td");
    let planetCell = document.createElement("td");
    let affiliationCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    idCell.innerText = newCustomer.customer_id;
    nameCell.innerText = newCustomer.name;
    planetCell.innerText = newCustomer.planet;
    affiliationCell.innerText = newCustomer.affiliation ? newCustomer.affiliation : 'N/A';

    // Create Edit button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function() {
        editCustomer(newCustomer.customer_id);
    };

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteCustomer(newCustomer.customer_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(document.createTextNode(" "));  // Space between buttons
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(planetCell);
    row.appendChild(affiliationCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
    
    console.log("New row added to table");
}