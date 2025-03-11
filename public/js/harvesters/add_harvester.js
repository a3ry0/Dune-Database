// Get the objects we need to modify
let addHarvesterForm = document.getElementById('add-harvester-form-ajax');

// Modify the objects we need
addHarvesterForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBaseCity = document.getElementById("input-base-city");
    let inputModel = document.getElementById("input-model");
    let inputTeamCaptain = document.getElementById("input-team-captain");
    let inputLastMaintenanceDate = document.getElementById("input-last-maintenance-date");
    let inputTotalHarvested = document.getElementById("input-total-harvested");

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

    // Put our data we want to send in a javascript object
    let data = {
        base_city: baseCityValue,
        model: modelValue,
        team_captain: teamCaptainValue,
        last_maintenance_date: lastMaintenanceDateValue || null,
        total_harvested: parseFloat(totalHarvestedValue)
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/harvesters/add-harvester-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                // Parse the response
                try {
                    let newHarvester = JSON.parse(xhttp.response);
                    console.log("New harvester added:", newHarvester);
                    
                    // Add the new data to the table
                    addRowToTable(newHarvester);

                    // Clear the input fields for another transaction
                    inputBaseCity.value = '';
                    inputModel.value = '';
                    inputTeamCaptain.value = '';
                    inputLastMaintenanceDate.value = '';
                    inputTotalHarvested.value = '';
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                    console.error("Raw response:", xhttp.response);
                }
            } else {
                console.log("There was an error with the input. Status code:", xhttp.status);
                console.log("Response:", xhttp.response);
                alert("Error adding harvester");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from 
// Harvesters
function addRowToTable(newHarvester) {
    // Get the table body
    let tableBody = document.getElementById("Harvesters-table").getElementsByTagName("tbody")[0];

    // Create a new row
    let row = document.createElement("tr");
    row.setAttribute('data-value', newHarvester.harvester_id);

    // Create table cells
    let idCell = document.createElement("td");
    let baseCityCell = document.createElement("td");
    let modelCell = document.createElement("td");
    let teamCaptainCell = document.createElement("td");
    let lastMaintenanceDateCell = document.createElement("td");
    let totalHarvestedCell = document.createElement("td");
    let actionCell = document.createElement("td");

    // Fill cells with correct data
    idCell.innerText = newHarvester.harvester_id;
    baseCityCell.innerText = newHarvester.base_city;
    modelCell.innerText = newHarvester.model;
    teamCaptainCell.innerText = newHarvester.team_captain;
    lastMaintenanceDateCell.innerText = newHarvester.last_maintenance_date || 'N/A';
    totalHarvestedCell.innerText = newHarvester.total_harvested;

    // Create Edit button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = function() {
        editHarvester(newHarvester.harvester_id);
    };

    // Create Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        deleteHarvester(newHarvester.harvester_id);
    };

    // Append buttons to action cell
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    // Append cells to row
    row.appendChild(idCell);
    row.appendChild(baseCityCell);
    row.appendChild(modelCell);
    row.appendChild(teamCaptainCell);
    row.appendChild(lastMaintenanceDateCell);
    row.appendChild(totalHarvestedCell);
    row.appendChild(actionCell);

    // Append row to table
    tableBody.appendChild(row);
}