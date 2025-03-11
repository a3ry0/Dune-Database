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
    let nameValue = inputName.value;
    let planetValue = inputPlanet.value;
    let affiliationValue = inputAffiliation.value;

    // Validate required fields
    if (!nameValue || !planetValue) {
        alert("Please fill out all required fields");
        return;
    }

    // Put data in a javascript object
    let data = {
        name: nameValue,
        planet: planetValue,
        affiliation: affiliationValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/customers/add-customer-ajax", true);
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
                        let newCustomer = JSON.parse(xhttp.response);
                        console.log("Parsed Customer:", newCustomer);
                        
                        // Add the new data to the table
                        addRowToTable(newCustomer);
                    } else {
                        console.error("Empty response received from server");
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }

                // Clear the input fields for another transaction
                inputName.value = '';
                inputPlanet.value = '';
                inputAffiliation.value = '';
            } else {
                console.log("There was an error with the input. Status code:", xhttp.status);
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
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(planetCell);
    row.appendChild(affiliationCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
}