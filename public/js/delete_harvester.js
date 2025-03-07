function deleteHarvester(harvester_id) {
  // Confirm deletion
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
              // Delete was successful
              deleteRow(harvester_id);
          }
          else {
              console.log("There was an error with the deletion. Status:", xhttp.status);
              console.log("Response:", xhttp.response);
              alert("Error deleting harvester");
          }
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}

function deleteRow(harvester_id){
  let table = document.getElementById("Harvesters-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == harvester_id) {
          table.deleteRow(i);
          break;
     }
  }
}