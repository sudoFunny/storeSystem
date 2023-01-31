<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Order View</title>
</head>
<body>

    <div class="options">

		<table>

			<tr>
				<th colspan=9>Options</th>
			</tr>

			<tr>
				<td>Last updated</td>
				<td><span id="updatedTime"></span></td>
			</tr>

			<tr>
				<td>Update delay</td>
				<td>
					<input type="text" id="updateDelayInput" name="updateDelayInput" value=2  min=1 max=60 oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); if (this.value == '' || this.value < this.min) this.style.backgroundColor = 'rgba(255, 0, 0, 1)'; else this.style.backgroundColor = 'rgba(255, 0, 0, 0)';" onblur="if (this.value == '' || this.value < this.min) {this.value = this.min; this.style.backgroundColor = 'rgba(255, 0, 0, 0)';} toggleUpdating(); toggleUpdating();" style="width: 25px; font-size: 20px;">
				</td>
			</tr>

			<tr>
				<td>Updating</td>
				<td>
					<input type="checkbox" id="toggleUpdatingInput" value="notActive" oninput="toggleUpdating()">
				</td>
			</tr>

		</table>

		<p>Double click to remove an order</p>

    </div>
	
    <div class="container" id="table" style="margin-top: 50px;"></div>
      
</body>
</html>



<!-- <script type="text/javascript" src="../orderTaker/items.js"></script> -->
<script src="../includes/jquery.min.js"></script>

<script type="text/javascript">

/**
 * 
 * TODO
 * Get item config if current is outdated
 */



// var config = JSON.parse(<?php //echo json_encode(file_get_contents("../includes/itemConfig.json"));?>);
var config = JSON.parse(<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();
$response = $mySQLConnection->query("SELECT config FROM itemConfigs ORDER BY version DESC LIMIT 1;");

while($row = mysqli_fetch_assoc($response)) {
	echo json_encode($row["config"]);
}
?>);


/**
 * 
 * What do you think it does?
 * It does what it's named, else console.error and returns false.
 * 
 */
config.getItemByDataName = function(dataName) {
    for (var i = 0; i < config.items.length; i++) {

        if (config.items[i].dataName === dataName) {
            return config.items[i];
        }
    }

    // console.error('Did not find an item with data_name "' + dataName + '"');
    return false;
}



for (var i = 0; i < config.items.length; i++) {

    config.items[i].interface.getInterfaceWithDataName = function(dataName) {

        for (var p = 0; p < this.length; p++) {
            
            if (this[p].dataName === dataName) {
                return this[p];
            }
        }

        // console.error('Did not find an interface with data_name "' + dataName + '"');
        return false;
    }




    for (var o = 0; o < config.items[i].interface.length; o++) {

        config.items[i].interface[o].getChoiceWithDataName = function(dataName) {

            for (var p = 0; p < this.choices.length; p++) {
                
                if (this.choices[p].dataName === dataName) {
                    return this.choices[p];
                }
            }

            // console.error('Did not find a choice with data_name "' + dataName + '"');
            return false;
        }
    }
}








var table = document.getElementById("table");
var updatedTime = document.getElementById("updatedTime");

var updateDelayInput = document.getElementById("updateDelayInput");
var toggleUpdatingInput = document.getElementById("toggleUpdatingInput");

// do this because I want it to default to it's own attr. and not what was on the page last load
if (toggleUpdatingInput.checked) {
	toggleUpdatingInput.checked = false;
}

// Update
var updateInterval;

toggleUpdatingInput.click();

function toggleUpdating () {
	// var element = document.getElementById("toggleUpdatingButton");

    if (toggleUpdatingInput.value === "notActive") {
        toggleUpdatingInput.value = "active";
        // element.innerText = "Stop Updating";
        getUnfilledPool();

        if (updateDelayInput.value < 1) {
            updateDelayInput.value = 1
        }

        updateInterval = setInterval(getUnfilledPool, updateDelayInput.value * 1000);
    }
    else {
        toggleUpdatingInput.value = "notActive";
        // element.innerText = "Start Updating";
        clearInterval(updateInterval);
    }

}



function updateView (orders) {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    var maxCells = 8;
    

    orders.forEach(function(order) {

		var div = document.createElement("div");
        div.innerHTML = "<button ondblclick='deleteOrder(" + order.id + ")'>Remove order</button><span style=\"float: right;\">Order: " + order.id + "</span>";
        
        div.classList.add("item");
        div.id = order.id;

		delete order.id;

        var pushNewOrder = true;

		for (var itemIndex = 0; itemIndex < Object.keys(order).length; itemIndex++) {

            var item = order[itemIndex];

            var orderItemConfig = config.getItemByDataName(item.name);

            if (orderItemConfig.interface.getInterfaceWithDataName(item.name).type === "money" && Object.keys(order).length < 2) {
                pushNewOrder = false;
                continue;
            }

			if (orderItemConfig.interface.getInterfaceWithDataName(item.name).type === "money") {
				continue;
			}


			
		// order.forEach(function(item) {

			var entryElement = document.createElement("p");

            var keys = Object.keys(item);

            for (var i = 0; i < keys.length; i++) {

                if (Array.isArray(item[keys[i]])) {

                    if (item[keys[i]].length > 1) {
						entryElement.innerHTML += keys[i] + ":<br>";

                        for (var o = 0; o < item[keys[i]].length; o++) {
                            entryElement.innerHTML += "&emsp;&emsp;" + item[keys[i]][o] + "<br>";
                        }
                    }
                    else {

						entryElement.innerHTML += keys[i] + ": none<br>";

                    }
                }
                else {

					if (keys[i] != item[keys[i]]) {
						entryElement.innerHTML += keys[i] + ": " + item[keys[i]];
                    	entryElement.innerHTML += "<br>";
					}
                }

            div.appendChild(entryElement);
            }
        // });
		}

        if (pushNewOrder) table.appendChild(div);
    });

/*
// for each order
    for (var i = 0; i < Object.keys(orders).length && i < maxCells; i++) {
        var order = orders[i];

        var div = document.createElement("div");
        div.innerHTML = "<button ondblclick='deleteOrder(" + order.id + ")'>Delete Order</button><span style=\"float: right;\">Order: " + order.id + "</span>";
        
        div.classList.add("item");
        div.id = order.id;

        var position = document.createAttribute("position");
        position.value = i;

        div.setAttributeNode(position);
        
        delete order.id;
// for each item in order
        for (var o = 0; o < Object.keys(order).length; o++) {
            var item = order[o];

            var p = document.createElement("p");

            if (item.name == "Popcorn") {
                p.innerHTML = item.name + " x" + item.quantity;
            }
            else if (item.name == "Slushie") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.size;
                p.innerHTML += "<br>&emsp;&emsp;" + item.flavor.join("<br>&emsp;&emsp;");
            }
            else if (item.name == "Tea") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.size;
            }
            else if (item.name == "Lemonade") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.size;
            }
            else if (item.name == "Coffee") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.size;
            }
            else if (item.name == "Dippin' Dots") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.flavor;
            }
            else if (item.name == "Cookies") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.type;
            }
            else if (item.name == "Hot Chocolate") {
                p.innerHTML = item.name + "<br>&emsp;&emsp;" + item.toppings.join("<br>&emsp;&emsp;");
            }

		    div.appendChild(p);
	    }

        table.appendChild(div);
    }*/
}




function deleteOrder (id) {
    $.ajax({
        url: "../orderPools/deleteOrderById.php",
        type: "POST",
        dataType: "JSON",
        data: {id: id}
		/*,success: function(response) {
            getUnfilledPool(); // for update after change
        }*/
    });

    getUnfilledPool();
}


function getUnfilledPool () {
    $.ajax({
        url: "../orderPools/getPool.php",
        type: "POST",
        dataType: "JSON",
        data: {poolType: "unfilled"},
        success: function(orders) {

            var date = new Date();

			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? "PM" : "AM";
			var seconds = date.getSeconds();
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? "0" + minutes : minutes;

			if (seconds < 9) seconds = "0" + seconds.toString();
			if (hours < 9) hours = "0" + hours.toString();
            
            if (orders != 0) {
                updateView(orders);

				updatedTime.innerHTML = hours + ":" + minutes + ":" + seconds + " " + ampm;
            }
            else {
                updatedTime.innerHTML = "";
                table.innerHTML = "<p>Fetching pool data failed, no data to return<br><br>Time: " + hours + ":" + minutes + ":" + seconds + " " + ampm + "</p>";
            }
        }
    });
}

</script>


<style>

	:root {
		--main-button-border: 2px ridge rgb(117, 116, 122);
		--main-button-border-color: rgb(117, 116, 122);
	}

	@font-face {
		font-family: LiberationSans;
		src: url("../includes/styles/fonts/LiberationSans-Regular.ttf");
	}
	@font-face {
		font-family: LiberationSans;
		src: url("../includes/styles/fonts/LiberationSans-Bold.ttf");
		font-weight: bold;
	}
	@font-face {
		font-family: LiberationSans;
		src: url("../includes/styles/fonts/LiberationSans-Italic.ttf");
		font-style: italic;
	}	
	@font-face {
		font-family: LiberationSans;
		src: url("../includes/styles/fonts/LiberationSans-BoldItalic.ttf");
		font-weight: bold;
		font-style: italic;
	}

	* {
		font-family: "LiberationSans";
	}

	button {
		cursor: pointer;
		background-color: white;
		border: var(--main-button-border);
	}

	p, span {
		font-size: 20px;
	}

	.container {
		display: grid;
		grid-template-columns: repeat(auto-fit, 300px);
		grid-row-gap: 20px;
		grid-column-gap: 10px;
		justify-content: left;
		margin: 0 auto;
		list-style: none;
	}

	.container > .item {
		padding: 10px;
		/* border-style: solid; */
		/* border-width: 5px; */
		/* border-style: ridge;
		border-color: black; */

		border: var(--main-button-border);
	}



	#updateDelayInput:invalid {
		background-color: red;
	}

	input[type="checkbox"] {
		cursor: pointer;
		width: 20px;
		height: 20px;
	}

	input[type="checkbox"]:hover {
		background-color: lightBlue;
	}

	.options > * {
		font-size: 20px;
	}

	.options > span {
		cursor: default;
	}

	button:hover {
		background-color: lightBlue;
	}


	.item > button {
		padding: 5px;
		font-size: 15px;
	}

	.item > * {
		font-size: 20px;
	}
</style>
