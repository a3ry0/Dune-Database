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

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        planet: planetValue,
        affiliation: affiliationValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log("ReadyState: ", xhttp.readyState);
        console.log("Status: ", xhttp.status);
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            let newCustomer = JSON.parse(xhttp.response);
            addRowToTable(newCustomer);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputPlanet.value = '';
            inputAffiliation.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// Customers
function addRowToTable(newCustomer) {
    let table = document.getElementById("Customers-table").getElementsByTagName("tbody")[0];

    let row = document.createElement("TR");
    row.setAttribute('data-value', newCustomer.customer_id);

    // Create table cells
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let planetCell = document.createElement("TD");
    let affiliationCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    // Fill cells with correct data
    idCell.innerText = newCustomer.customer_id || 'Error';
    nameCell.innerText = newCustomer.name || 'Error';
    planetCell.innerText = newCustomer.planet || 'Error';
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
    table.appendChild(row);
}