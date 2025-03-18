// Citation for the following file:
// Date: 2025
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the update harvester form element
let updateHarvesterForm = document.getElementById('update-harvester-form-ajax');

// Function to update a harvester row in the table
function updateHarvesterInTable(updatedHarvester) {
  let table = document.getElementById("Harvesters-table");
  
  // Debug: verify the harvester data
  console.log("Updating harvester row with data:", updatedHarvester);
  
  // Find the row to update
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == updatedHarvester.harvester_id) {
      let updateRowIndex = table.getElementsByTagName("tr")[i];
      
      // Update cells: [1]=base_city, [2]=model, [3]=team_captain, [4]=maintenance, [5]=harvested
      updateRowIndex.getElementsByTagName("td")[1].innerText = updatedHarvester.base_city;
      updateRowIndex.getElementsByTagName("td")[2].innerText = updatedHarvester.model;
      updateRowIndex.getElementsByTagName("td")[3].innerText = updatedHarvester.team_captain;
      updateRowIndex.getElementsByTagName("td")[4].innerText = updatedHarvester.last_maintenance_date || '';
      updateRowIndex.getElementsByTagName("td")[5].innerText = updatedHarvester.total_harvested;
      
      // Also update the dropdown option in association section if it exists
      let dropdown = document.getElementById("input-harvester-id");
      if (dropdown) {
        for (let j = 0; j < dropdown.options.length; j++) {
          if (dropdown.options[j].value == updatedHarvester.harvester_id) {
            dropdown.options[j].text = `${updatedHarvester.model} (${updatedHarvester.base_city}) - Captain: ${updatedHarvester.team_captain}`;
            break;
          }
        }
      }
      
      console.log("Harvester row updated successfully");
      break;
    }
  }
}

// Function to populate harvester update form based on harvester ID
function editHarvester(harvester_id) {
  // Find the row in the table with this harvester_id
  let row = document.querySelector(`tr[data-value='${harvester_id}']`);
  
  if (!row) {
    console.error("Could not find row with harvester_id:", harvester_id);
    return;
  }

  // Get values from the row cells (adjust indices as needed)
  let cells = row.getElementsByTagName("td");
  let baseCity = cells[1].textContent;
  let model = cells[2].textContent;
  let teamCaptain = cells[3].textContent;
  let lastMaintenanceDate = cells[4].textContent;
  let totalHarvested = cells[5].textContent;

  // Pre-fill the form fields
  document.getElementById("harvester-id-update").value = harvester_id;
  document.getElementById("input-base-city-update").value = baseCity;
  document.getElementById("input-model-update").value = model;
  document.getElementById("input-team-captain-update").value = teamCaptain;
  document.getElementById("input-last-maintenance-date-update").value = lastMaintenanceDate;
  document.getElementById("input-total-harvested-update").value = totalHarvested;

  // Scroll to the form
  updateHarvesterForm.scrollIntoView({ behavior: "smooth" });
}

// Modify the objects we need
updateHarvesterForm.addEventListener("submit", function (e) {
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

  // Ensure required fields are filled with validation
  if (!baseCityValue || !modelValue || !teamCaptainValue || !totalHarvestedValue) {
    alert("Please fill all required fields");
    return;
  }
  
  // Build data object to send
  let data = {
    harvester_id: harvesterId,
    base_city: baseCityValue,
    model: modelValue,
    team_captain: teamCaptainValue,
    last_maintenance_date: lastMaintenanceDateValue,
    total_harvested: totalHarvestedValue
  };
  
  // Debug log to verify data being sent
  console.log("Sending update data:", data);
  
  // Setup AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/harvesters/put-harvester-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Handle the AJAX response
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
      console.log("Update response status:", xhttp.status);
      console.log("Update response:", xhttp.response);
      
      if (xhttp.status === 200) {
        try {
          // Parse the response data
          let updatedHarvester = JSON.parse(xhttp.response);
          console.log("Updated harvester data:", updatedHarvester);
          
          // Update the row in the table without a page refresh
          updateHarvesterInTable(updatedHarvester);
          
          // Optional: show success message
          alert("Harvester updated successfully!");
          
          // Clear the form
          document.getElementById("harvester-id-update").value = '';
          inputBaseCity.value = '';
          inputModel.value = '';
          inputTeamCaptain.value = '';
          inputLastMaintenanceDate.value = '';
          inputTotalHarvested.value = '';
        } catch (e) {
          console.error("JSON Parse Error:", e);
          console.error("Raw response:", xhttp.response);
          alert("Error processing server response. Please try again.");
        }
      } else {
        console.log("There was an error with the update. Status code:", xhttp.status);
        alert("Failed to update harvester. Please try again.");
      }
    }
  };

  // Send the request with the data as JSON
  xhttp.send(JSON.stringify(data));
});