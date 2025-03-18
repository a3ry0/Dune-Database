// Citation for the following file:
// Date: 2021
// Adapted from CS 340 Starter code:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteHarvesterSilo(harvester_silo_id) {
  if (!confirm("Are you sure you want to delete this harvester-silo association?")) {
    return;
  }
  // Put our data we want to send in a javascript object
  let data = {
      id: harvester_silo_id
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/harvesters/delete-harvester-silo-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // Remove the row from the table
          deleteRow(harvester_silo_id);
          // Optional: show success message
          alert("Association deleted successfully!");
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the delete operation.");
          alert("Failed to delete association. Please try again.");
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}

function deleteRow(harvester_silo_id){
  let table = document.getElementById("Harvesters-Silos-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == harvester_silo_id) {
          table.deleteRow(i);
          console.log("Harvester-Silo row deleted");
          break;
     }
  }
}