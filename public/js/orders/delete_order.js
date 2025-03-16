function deleteOrder(order_id) {
  if (!confirm("Are you sure you want to delete this order?")) {
    return;
  }
  // Put our data we want to send in a javascript object
  let data = {
      id: order_id
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/orders/delete-order-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // Remove the row from the table
          deleteRow(order_id);
          // Optional: show success message
          alert("Order deleted successfully!");
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the delete operation.");
          alert("Failed to delete order. Please try again.");
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}

function deleteRow(order_id){
  let table = document.getElementById("Orders-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == order_id) {
          table.deleteRow(i);
          console.log("Order row deleted");
          break;
     }
  }
}