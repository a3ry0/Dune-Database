// Get the update harvester form element
let updateShipmentForm = document.getElementById('update-harvester-form-ajax');

// Modify the objects we need
updateShipmentForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form field elements
    let harvesterId = document.getElementById("harvester-id-update").value;
    let inputBaseCity = document.getElementById("input-base-city-update");
    let inputModel = document.getElementById("input-model-update");
    let inputTeamCaptain = document.getElementById("input-team-captain-update");
    let inputLastMaintenanceDate = document.getElementById("input-last-maintenance-date-update");
    let inputTotalHarvested = document.getElementById("input-total-harvested-update");

    // Get the values from the form fields
    let baseCityValue = inputBaseCity.value;
    let modelValue = inputModel.value;
    let teamCaptainValue = inputTeamCaptain.value;
    let lastMaintenanceDateValue = inputLastMaintenanceDate.value;
    let totalHarvestedValue = inputTotalHarvested.value;

    // Validate required fields
    if (!baseCityValue || !modelValue || !teamCaptainValue || !totalHarvestedValue) {
        alert("Please fill out all required fields");
        return;
    }
    
    // Build data object to send
    let data = {
        harvester_id: harvesterId,
        base_city: baseCityValue,
        model: modelValue,
        team_captain: teamCaptainValue,
        last_maintenance_date: lastMaintenanceDateValue || null,
        total_harvested: parseFloat(totalHarvestedValue)
    };
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/harvesters/put-harvester-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                try {
                    // Parse the JSON response
                    let updatedHarvester = JSON.parse(xhttp.response);
                    console.log("Updated harvester:", updatedHarvester);
                    
                    // Update the row in the harvesters table with the new data
                    updateRow(updatedHarvester);
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }
            } else {
                console.log("There was an error with the input. Status:", xhttp.status);
                console.log("Response:", xhttp.response);
                alert("Error updating harvester");
            }
        }
    };

    // Send the request with the data as JSON
    xhttp.send(JSON.stringify(data));
});

// Function to update the row in the harvesters table
function updateRow(harvester) {
    let table = document.getElementById("Harvesters-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == harvester.harvester_id) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            // Update the table cells
            updateRowIndex.getElementsByTagName("td")[1].innerText = harvester.base_city;
            updateRowIndex.getElementsByTagName("td")[2].innerText = harvester.model;
            updateRowIndex.getElementsByTagName("td")[3].innerText = harvester.team_captain;
            updateRowIndex.getElementsByTagName("td")[4].innerText = harvester.last_maintenance_date || 'N/A';
            updateRowIndex.getElementsByTagName("td")[5].innerText = harvester.total_harvested;

            break;
        }
    }
}

// Function to pre-fill the update form when the edit button is clicked
function editHarvester(harvester_id) {
    // Get the table row corresponding to the selected harvester
    let row = document.querySelector(`tr[data-value='${harvester_id}']`);
    
    // Extract current values from the row
    let baseCity = row.cells[1].innerText;
    let model = row.cells[2].innerText;
    let teamCaptain = row.cells[3].innerText;
    let lastMaintenanceDate = row.cells[4].innerText;
    let totalHarvested = row.cells[5].innerText;

    // Pre-fill the update form fields
    document.getElementById("harvester-id-update").value = harvester_id;
    document.getElementById("input-base-city-update").value = baseCity;
    document.getElementById("input-model-update").value = model;
    document.getElementById("input-team-captain-update").value = teamCaptain;
    
    // Handle the date field special case
    if (lastMaintenanceDate && lastMaintenanceDate !== 'N/A') {
        document.getElementById("input-last-maintenance-date-update").value = lastMaintenanceDate;
    } else {
        document.getElementById("input-last-maintenance-date-update").value = '';
    }
    
    document.getElementById("input-total-harvested-update").value = totalHarvested;

    // Scroll down to the update form
    document.getElementById("update-harvester-form-ajax").scrollIntoView({ behavior: "smooth" });
}