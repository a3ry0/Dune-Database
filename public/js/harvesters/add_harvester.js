// Citation for the following file:
// Date: 2025
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addHarvesterForm = document.getElementById('add-harvester-form-ajax');

// Function to add a new harvester row to the table
function addHarvesterToTable(newHarvester) {
  // Get the table body
  let tableBody = document.getElementById("Harvesters-table").getElementsByTagName("tbody")[0];
  
  if (!tableBody) {
    console.error("Could not find table body for Harvesters");
    return;
  }

  // Create a new row
  let row = document.createElement("tr");
  row.setAttribute('data-value', newHarvester.harvester_id);

  // Create table cells
  let idCell = document.createElement("td");
  let baseCityCell = document.createElement("td");
  let modelCell = document.createElement("td");
  let captainCell = document.createElement("td");
  let maintenanceCell = document.createElement("td");
  let harvestedCell = document.createElement("td");
  let actionCell = document.createElement("td");

  // Fill cells with correct data
  idCell.innerText = newHarvester.harvester_id;
  baseCityCell.innerText = newHarvester.base_city;
  modelCell.innerText = newHarvester.model;
  captainCell.innerText = newHarvester.team_captain;
  maintenanceCell.innerText = newHarvester.last_maintenance_date || '';
  harvestedCell.innerText = newHarvester.total_harvested;
  
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
  actionCell.appendChild(document.createTextNode(" ")); // Space between buttons
  actionCell.appendChild(deleteButton);

  // Append cells to row
  row.appendChild(idCell);
  row.appendChild(baseCityCell);
  row.appendChild(modelCell);
  row.appendChild(captainCell);
  row.appendChild(maintenanceCell);
  row.appendChild(harvestedCell);
  row.appendChild(actionCell);

  // Append row to table
  tableBody.appendChild(row);
  
  // Also update the harvester dropdown in the association section if it exists
  let dropdown = document.getElementById("input-harvester-id");
  if (dropdown) {
    let option = document.createElement("option");
    option.value = newHarvester.harvester_id;
    option.text = `${newHarvester.model} (${newHarvester.base_city}) - Captain: ${newHarvester.team_captain}`;
    dropdown.appendChild(option);
  }
  
  console.log("New harvester row added to table");
}

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
        alert("Please fill all required fields");
        return;
    }

    // Put data in a javascript object
    let data = {
        base_city: baseCityValue,
        model: modelValue,
        team_captain: teamCaptainValue,
        last_maintenance_date: lastMaintenanceDateValue,
        total_harvested: totalHarvestedValue
    }
    
    // Debug logging
    console.log("Sending harvester data:", data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/harvesters/add-harvester-ajax", true);
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
                        let newHarvester = JSON.parse(xhttp.response);
                        console.log("Parsed Harvester:", newHarvester);
                        
                        // Add the new harvester to the table without a page refresh
                        addHarvesterToTable(newHarvester);
                        
                        // Optional: show success message
                        alert("Harvester added successfully!");
                        
                        // Clear the input fields for another transaction
                        inputBaseCity.value = '';
                        inputModel.value = '';
                        inputTeamCaptain.value = '';
                        inputLastMaintenanceDate.value = '';
                        inputTotalHarvested.value = '';
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
                alert("Failed to add harvester. Please try again.");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});