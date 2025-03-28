// Citation for the following file:
// Date: 2025
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the update customer form element
let updateSpiceSiloForm = document.getElementById('update-spice-silo-form-ajax');

// Modify the objects we need
updateSpiceSiloForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let siloId = document.getElementById("silo-id-update").value;
    let inputCity = document.getElementById("input-city-update");
    let inputSpiceCapacity = document.getElementById("input-spice-capacity-update");
    let inputSpiceQuantity = document.getElementById("input-spice-quantity-update");
    let inputLastInspectionDate = document.getElementById("input-last-inspection-date-update");

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
    
    // Build data object to send
    let data = {
        silo_id: siloId,
        city: cityValue,
        spice_capacity: spiceCapacityValue,
        spice_quantity: spiceQuantityValue,
        last_inspection_date: lastInspectionDateValue || null
    }

    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/spice_silos/put-spice-silo-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

  

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                try {
                    // Parse the JSON response
                    let updatedSilo = JSON.parse(xhttp.response);
                    console.log("Updated silo:", updatedSilo);
                    
                    // Update the row in the shipments table with the new data
                    updateRow(updatedSilo);
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

// Function to update the row in the silos table
function updateRow(spiceSilo) {
    let table = document.getElementById("Spice-silos-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == spiceSilo.silo_id) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Update the table cells
            let cells = updateRowIndex.getElementsByTagName("td");
            if (cells.length > 1) {
                cells[1].innerText = spiceSilo.city;
                cells[2].innerText = spiceSilo.spice_capacity;
                cells[3].innerText = spiceSilo.spice_quantity;
                cells[4].innerText = spiceSilo.last_inspection_date || "N/A";
            }
            break;
        }
    }
}

// Function to pre-fill the update form when the edit button is clicked
function editSpiceSilo(silo_id) {
    // Get the table row corresponding to the selected shipment
    let row = document.querySelector(`tr[data-value='${silo_id}']`);
    
    // Extract current values from the row
    let city = row.cells[1].innerText;
    let spiceCapacity = row.cells[2].innerText;
    let spiceQuantity = row.cells[3].innerText;
    let lastInspectionDate = row.cells[4].innerText;


    // Pre-fill the update form fields
    document.getElementById("silo-id-update").value = silo_id;
    document.getElementById("input-city-update").value = city;
    document.getElementById("input-spice-capacity-update").value = spiceCapacity;
    document.getElementById("input-spice-quantity-update").value = spiceQuantity;

    // Handle the date field special case
    if (lastInspectionDate && lastInspectionDate !== 'N/A') {
        document.getElementById("input-last-inspection-date-update").value = lastInspectionDate;
    } else {
        document.getElementById("input-last-inspection-date-update").value = '';
    }

    // Scroll down to the update form
    document.getElementById("update-spice-silo-form-ajax").scrollIntoView({ behavior: "smooth" });
}