function deleteShipmentSilo(shipment_silo_id) {
    if (!confirm("Are you sure you want to delete this shipment-silo association?")) {
      return;
    }
    // Put our data we want to send in a javascript object
    let data = {
        id: shipment_silo_id
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/shipments/delete-shipment-silo-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
  
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the row from the table
            deleteRow(shipment_silo_id);
            // Optional: show success message
            alert("Association deleted successfully!");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the delete operation.");
            alert("The association already exists. Please try again.");
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
  }
  
  function deleteRow(shipment_silo_id){
    let table = document.getElementById("Shipments-Silos-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == shipment_silo_id) {
            table.deleteRow(i);
            console.log("Shipments-Silo row deleted");
            break;
       }
    }
  }