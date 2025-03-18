// Citation for the following file:
// Date: 2025
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteHarvester(harvester_id) {
  // Confirm deletion with the user
  if (!confirm("Are you sure you want to delete this harvester?")) {
    return;
  }
  
  // Put our data we want to send in a javascript object
  let data = {
    id: harvester_id
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/harvesters/delete-harvester-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4) {
      if (xhttp.status == 204) {
        // Remove the row from the table without a page refresh
        deleteHarvesterFromTable(harvester_id);
        
        // Optional: show success message
        alert("Harvester deleted successfully!");
      } else {
        console.log("There was an error with the delete operation. Status code:", xhttp.status);
        alert("Failed to delete harvester. Please try again.");
      }
    }
  }
  
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}