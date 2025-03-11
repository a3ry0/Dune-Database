function deleteShipment(shipment_id) {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this shipment?")) {
      return;
    }
  
    // Put our data we want to send in a javascript object
    let data = {
        id: shipment_id
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/shipments/delete-shipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
  
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 204) {
                // Delete was successful
                deleteRow(shipment_id);
            }
            else {
                console.log("There was an error with the deletion. Status:", xhttp.status);
                console.log("Response:", xhttp.response);
                alert("Error deleting shipment");
            }
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
  }
  
  function deleteRow(shipment_id){
    let table = document.getElementById("Shipments-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == shipment_id) {
            table.deleteRow(i);
            break;
       }
    }
  }