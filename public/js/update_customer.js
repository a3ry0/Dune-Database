// Get the update customer form element
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form field elements
    let customerId = document.getElementById("customer-id-update").value;
    let inputName = document.getElementById("input-name-update");
    let inputPlanet = document.getElementById("input-planet-update");
    let inputAffiliation = document.getElementById("input-affiliation-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let planetValue = inputPlanet.value;
    let affiliationValue = inputAffiliation.value;

    // Ensure required fields are filled with validation
    if (nameValue === "" || planetValue === "") {
        return;
    }
    if (affiliationValue === "") {
        affiliationValue = null;
    }
    
    // Build data object to send
    let data = {
        customer_id: customerId,
        name: nameValue,
        planet: planetValue,
        affiliation: affiliationValue
    };
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/customers/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Update the row in the customers table with the new data
            updateRow(xhttp.response, customerId);
        } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request with the data as JSON
    xhttp.send(JSON.stringify(data));
});

// Function to update the row in the customers table
function updateRow(data, customer_id) {
    let table = document.getElementById("Customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == customer_id) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Parse the response JSON
            let parsedData = JSON.parse(data);

            // Update the table cells: column indices are [1]=Name, [2]=Planet, [3]=Affiliation
            let tdName = updateRowIndex.getElementsByTagName("td")[1];
            let tdPlanet = updateRowIndex.getElementsByTagName("td")[2];
            let tdAffiliation = updateRowIndex.getElementsByTagName("td")[3];

            tdName.innerHTML = parsedData.name ? parsedData.name : 'N/A';
            tdPlanet.innerHTML = parsedData.planet ? parsedData.planet : 'N/A';
            tdAffiliation.innerHTML = parsedData.affiliation ? parsedData.affiliation : 'N/A';
        }
    }
}

// Function to pre-fill the update form when the edit button is clicked
function editCustomer(customer_id) {
    // Get the table row corresponding to the selected customer
    let row = document.querySelector(`tr[data-value='${customer_id}']`);
    
    // Extract current values from the row
    let name = row.cells[1].innerText;
    let planet = row.cells[2].innerText;
    let affiliation = row.cells[3].innerText;

    // Pre-fill the update form fields
    document.getElementById("customer-id-update").value = customer_id;
    document.getElementById("input-name-update").value = name;
    document.getElementById("input-planet-update").value = planet;
    document.getElementById("input-affiliation-update").value = affiliation;

    // Scroll down to the update form
    document.getElementById("update-customer-form-ajax").scrollIntoView({ behavior: "smooth" });
}