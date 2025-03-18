// Citation for the following file:
// Date: 2021
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

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
        alert("Please fill out all required fields");
        return;
    }
    
    // Build data object to send
    let data = {
        customer_id: customerId,
        name: nameValue,
        planet: planetValue,
        affiliation: affiliationValue === "" ? null : affiliationValue
    };
    
    // Debug log to verify data being sent
    console.log("Sending update data:", data);
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/customers/put-customer-ajax", true);
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
                    console.log("Updated customer data:", parsedData);
                    
                    // Update the row in the table
                    updateRow(xhttp.response, customerId);
                    
                    // Optional: show success message
                    alert("Customer updated successfully!");
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }
            } else {
                console.log("There was an error with the update. Status code:", xhttp.status);
                alert("Failed to update customer. Please try again.");
            }
        }
    };

    // Send the request with the data as JSON
    xhttp.send(JSON.stringify(data));
});

// Function to update the row in the customers table
function updateRow(data, customer_id) {
    let table = document.getElementById("Customers-table");
    let parsedData = JSON.parse(data);
    
    // Debug: verify the parsed data
    console.log("Updating row with data:", parsedData);
    
    // Find the row to update
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == customer_id) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Update the table cells: column indices are [1]=Name, [2]=Planet, [3]=Affiliation
            let tdName = updateRowIndex.getElementsByTagName("td")[1];
            let tdPlanet = updateRowIndex.getElementsByTagName("td")[2];
            let tdAffiliation = updateRowIndex.getElementsByTagName("td")[3];

            tdName.innerHTML = parsedData.name || 'N/A';
            tdPlanet.innerHTML = parsedData.planet || 'N/A';
            tdAffiliation.innerHTML = parsedData.affiliation || 'N/A';
            
            console.log("Row updated successfully");
            break;
        }
    }
}

// Function to pre-fill the update form when the edit button is clicked
function editCustomer(customer_id) {
    // Get the table row corresponding to the selected customer
    let row = document.querySelector(`tr[data-value='${customer_id}']`);
    
    if (!row) {
        console.error("Could not find row with customer_id:", customer_id);
        return;
    }
    
    // Extract current values from the row
    let name = row.cells[1].innerText;
    let planet = row.cells[2].innerText;
    let affiliation = row.cells[3].innerText;
    
    // Handle 'N/A' values
    if (affiliation === 'N/A') {
        affiliation = '';
    }

    // Pre-fill the update form fields
    document.getElementById("customer-id-update").value = customer_id;
    document.getElementById("input-name-update").value = name;
    document.getElementById("input-planet-update").value = planet;
    document.getElementById("input-affiliation-update").value = affiliation;

    // Scroll down to the update form
    document.getElementById("update-customer-form-ajax").scrollIntoView({ behavior: "smooth" });
}