<!DOCTYPE html>
<html>
<head>
    <title>Order Taker</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body onload="checkURL()" style="font-family: LiberationSans;">
    <div id="container"></div>
</body>
</html>


<script src="ViewHandler.js"></script>
<script src="../includes/jquery.min.js"></script>

<script>


var config = JSON.parse(<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();
$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs ORDER BY version DESC LIMIT 1;");

$itemConfigVersion = "null";

while($row = mysqli_fetch_assoc($response)) {
	$itemConfigVersion = $row["version"];
	echo json_encode($row["config"]);
}
?>);

var itemConfigVersion = <?php echo $itemConfigVersion;?>;


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

    // console.error('Did not find an item with dataName "' + dataName + '"');
    return false;
}



for (var i = 0; i < config.items.length; i++) {

    config.items[i].interface.getInterfaceWithDataName = function(dataName) {

        for (var p = 0; p < this.length; p++) {
            
            if (this[p].dataName === dataName) {
                return this[p];
            }
        }

        // console.error('Did not find an interface with dataName "' + dataName + '"');
        return false;
    }




    for (var o = 0; o < config.items[i].interface.length; o++) {

        config.items[i].interface[o].getChoiceWithDataName = function(dataName) {

            if (this.choices != undefined) {
                for (var p = 0; p < this.choices.length; p++) {
                    
                    if (this.choices[p].dataName === dataName) {
                        return this.choices[p];
                    }
                }
            }

            // console.error('Did not find a choice with dataName "' + dataName + '"');
            return false;
        }
    }
}














    var order = [];


    var mainContainer = document.getElementById("container");


    function showDetail (index, appendant) {
        // removeAllChildren(mainContainer);

		if (index >= config.items.length) {
			if (index < 9000) {

				var suffix = "";
				var j = parseInt(index) + 1 % 10,
					k = parseInt(index) + 1 % 100;
				if (j == 1 && k != 11) {
					suffix = "st";
				}
				if (j == 2 && k != 12) {
					suffix = "nd";
				}
				if (j == 3 && k != 13) {
					suffix = "rd";
				}
				suffix = "th";

				alert("There are only " + config.items.length + " items, but you have elected to search for a " + (parseInt(index) + 1) + suffix + " item.\nI commend your research and I hope one day you'll find that every so elusive " + (parseInt(index) + 1) + suffix + " item!");
				window.location.href = "#?view=select";
				return 0;
			}
			else {
				alert("The number of items isn't over 9,000 :sadge:");
				window.location.href = "#?view=select";
				return 0;
			}
		}

        var item = config.items[index];


        //var div = document.createElement("div");

    // make table for center
		var table = document.createElement("table");
		table.style.marginLeft = "auto";
		table.style.marginRight = "auto";

        


        // var goBackButton = document.createElement("button");
        // goBackButton.innerText = "Go Back";
        // goBackButton.onclick = () => {
        //     goToSelectPage();
        // };
        var backButtonTr = document.createElement("tr");
		backButtonTr.innerHTML = "<td class='centerText'><button class='button backButton' onclick='goToSelectPage()'>Go Back</button></td>";

		table.appendChild(backButtonTr);
          

        // var price = document.createElement("p");
        // price.innerHTML = "Price: " + centToDollar(item.price);

        // var name = document.createElement("p");
        // name.innerHTML = "Name: " + item.displayName;

        var nameTr = document.createElement("tr");
        nameTr.innerHTML = '<td><p class="centerText fontSize30" style="margin-top: 0; margin-bottom: 0;">' + item.displayName + '</p></td>';

        table.appendChild(nameTr);



        // var interface = document.createElement("div");

    // make each interface
        for (var i = 0; i < item.interface.length; i++) {
            // var interfaceElement = null;


            makeInterface(item.interface[i], item, table);
			


                /*switch (item.interface[i].type) {
                case "radio": interfaceElement = makeRadio(item.interface[i], item); break;
                case "checkbox": interfaceElement = makeCheckbox(item.interface[i], item); break;
                case "number": interfaceElement = makeNumber(item.interface[i], item); break;

                default: break;
                }*/

            // if (interfaceElement != null) {
            //     interface.appendChild(interfaceElement);
            // }
        }

		makeAddToOrderButton(item, table);



        //table.appendChild(goBackButton);
        //div.appendChild(price);
        //table.appendChild(name);
        //table.appendChild(interface);
        mainContainer.appendChild(table);


	// do "onafter" stuff
		document.querySelectorAll('[onafter]').forEach(element => {

			var onAfterArray = element.getAttribute("onafter").split(",");
			
			onAfterArray.forEach(onAfterCommand => {

				switch (onAfterCommand) {
					case "click":
						element.click();
						break;
				
					default:
						break;
				}
			});
			
		});
    }





    function makeInterface (interfaceConfig, item, table) {

        var tr = document.createElement("tr");
        var td = document.createElement("td");

// add label per interface entry

        if (Object.hasOwn(interfaceConfig, "label")) {
            // if (interfaceConfig.label != "") {
                var interfaceLabel = document.createElement("p");
                interfaceLabel.innerHTML = interfaceConfig.label;
                interfaceLabel.style.marginTop = "32px";
                interfaceLabel.style.marginBottom = "8px";

                interfaceLabel.classList.add("labelFor");
                // using innerHTML so config can use bold text and colored text... probably not a good idea for producion since you can write scripts in it
                td.appendChild(interfaceLabel);
            // }
        }

        // var div = document.createElement("div");

        

        if (Object.hasOwn(interfaceConfig, "choices") && interfaceConfig.type != "number" && interfaceConfig.type != "money" && interfaceConfig.type != "quantity") {
            for (var i = 0; i < interfaceConfig.choices.length; i++) {
                var choice = interfaceConfig.choices[i];

                

            // label
                var label = document.createElement("label");
                label.for = choice.dataName;
                
                // label.classList.add("radio");
                label.classList.add(interfaceConfig.type);
                label.classList.add("fontSize30");

            // input
                var input = document.createElement("input");
                //input.id = choice.dataName;
                input.type = interfaceConfig.type;
                input.name = interfaceConfig.dataName;
                input.value = choice.dataName;

                var required = document.createAttribute("required");
                // required.value = choice.required;
                if (choice.required == undefined) required.value = false;
                else required.value = choice.required;
                input.setAttributeNode(required);

            // if (choice.required || choice.required == undefined) {
            //     // Create custom update attr.
            //     var required = document.createAttribute("required");
            //     required.value = choice.required;
            //     // if (item.displayTotalPrice == undefined) update.value = false;
            //     input.setAttributeNode(required);
            // }

            // disable
				if (choice.disabled) {
                    input.disabled = choice.disabled;
                    //label.classList.add("unavailable");
                }

			// selected
				var selectOnAfter = document.createAttribute("onAfter");
				if (choice.selected != undefined || choice.selected) {
					selectOnAfter.value += "click,";
					input.setAttributeNode(selectOnAfter);
				}
                

                    
            // get price
                var price = "";
                if (choice.price != "") {
                    if (choice.price.includes("main")) {
                        price = centToDollar(eval(choice.price.replaceAll("main", item.price)));
                    }
                    else
                        price = centToDollar(choice.price);
                }

            // append
                label.appendChild(input);

            // label display text
                label.innerHTML += choice.displayName + "<span style=\"float: right;\">" + price + "</span><br>";

                td.appendChild(label);
            }
        }
    // else if it doesn't have choices
        else {
            if (interfaceConfig.type == "number") {

            // Price
                if (item.displayPricePerUnit) {                
                    var priceTr = document.createElement("tr");
                    priceTr.innerHTML = "<td><p>Price per unit: " + centToDollar(item.price) + "</p></td>";

					priceTr.id = "pricePerUnitNumberInput";

                    table.appendChild(priceTr);
                }

            // Input Number
                var inputDiv = document.createElement("div");

                var input = document.createElement("input");

                var decButton = document.createElement("button");
                var incButton = document.createElement("button");

                inputDiv.style.display = "flex";
                inputDiv.classList.add("numberContainer");

                input.type = "text";
                input.id = "numberInput";
                input.classList.add("numberInput");
                input.name = interfaceConfig.dataName;


                // Create custom update attr.
                var update = document.createAttribute("update");
                update.value = item.displayTotalPrice;
                if (item.displayTotalPrice == undefined) update.value = false;
                input.setAttributeNode(update);

                // Create custom step attr.
                var step = document.createAttribute("step");
                step.value = interfaceConfig.step;
                if (interfaceConfig.step == undefined) step.value = 1;
                input.setAttributeNode(step);


                input.value = 1; // Don't tell anyone that this is the true default!
                if (interfaceConfig.defaultValue != undefined) input.value = interfaceConfig.defaultValue;
                // the != is a bit sus... idk if something bad will happen in the future
                

                input.oninput = () => {
                    input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                    if (document.getElementById("numberInput").getAttribute("update")  == "true") document.getElementById("totalPriceNumberInput").innerText = "Total price: " + centToDollar(item.price * input.value);
                };

                decButton.innerText = "-";
                decButton.classList.add("numberInputButton");
                var minValue = 1;
                decButton.onclick = () => {
                    if (input.value <= minValue) input.value = minValue;
                    else {
                        input.value = parseInt(input.value) - parseInt(document.getElementById("numberInput").getAttribute("step"));
                        //if (input.value < minValue) input.value = minValue;
                    }
                    if (document.getElementById("numberInput").getAttribute("update")  == "true") document.getElementById("totalPriceNumberInput").innerText = "Total price: " + centToDollar(item.price * input.value);
                };

                incButton.innerText = "+";
                incButton.classList.add("numberInputButton");
                incButton.onclick = () => {
                    if (input.value == "") input.value = 0;
                    input.value = parseInt(input.value) + parseInt(document.getElementById("numberInput").getAttribute("step"));
                    if (document.getElementById("numberInput").getAttribute("update")  == "true") document.getElementById("totalPriceNumberInput").innerText = "Total price: " + centToDollar(item.price * input.value);
                };


                inputDiv.appendChild(input);
                inputDiv.appendChild(decButton);
                inputDiv.appendChild(incButton);

                td.appendChild(inputDiv);

            // Total price
                if (item.displayTotalPrice) {
                    var totalPrice = document.createElement("p");
                    totalPrice.innerText = "Total price: " + centToDollar(item.price);
                    totalPrice.id = "totalPriceNumberInput";

                    td.appendChild(totalPrice);
                }
            }
			else if (interfaceConfig.type == "quantity") {

			// Price
				if (item.displayPricePerUnit) {                
					var priceTr = document.createElement("tr");
					priceTr.innerHTML = "<td><p>Price per unit: " + centToDollar(item.price) + "</p></td>";

					priceTr.id = "pricePerUnitNumberInput";

					table.appendChild(priceTr);
				}

			// Input Number
				var inputDiv = document.createElement("div");

				var input = document.createElement("input");

				var decButton = document.createElement("button");
				var incButton = document.createElement("button");

				inputDiv.style.display = "flex";
				inputDiv.classList.add("numberContainer");

				input.type = "text";
				input.id = "numberInput";
				input.classList.add("numberInput");
				// input.name = interfaceConfig.dataName;\
				input.name = "quantity";


				// Create custom update attr.
				var update = document.createAttribute("update");
				update.value = item.displayTotalPrice;
				if (item.displayTotalPrice == undefined) update.value = false;
				input.setAttributeNode(update);

				// Create custom step attr.
				var step = document.createAttribute("step");
				step.value = interfaceConfig.step;
				if (interfaceConfig.step == undefined) step.value = 1;
				input.setAttributeNode(step);


				input.value = 1; // Don't tell anyone that this is the true default!
				if (interfaceConfig.defaultValue != undefined) input.value = interfaceConfig.defaultValue;
				// the != is a bit sus... idk if something bad will happen in the future
				

				input.oninput = () => {
					input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
					if (document.getElementById("numberInput").getAttribute("update")  == "true") document.getElementById("totalPriceNumberInput").innerText = "Total price: " + centToDollar(item.price * input.value);
				};

				decButton.innerText = "-";
				decButton.classList.add("numberInputButton");
				var minValue = 1;
				decButton.onclick = () => {
					if (input.value <= minValue) input.value = minValue;
					else {
						input.value = parseInt(input.value) - parseInt(document.getElementById("numberInput").getAttribute("step"));
						//if (input.value < minValue) input.value = minValue;
					}
					if (document.getElementById("numberInput").getAttribute("update")  == "true") document.getElementById("totalPriceNumberInput").innerText = "Total price: " + centToDollar(item.price * input.value);
				};

				incButton.innerText = "+";
				incButton.classList.add("numberInputButton");
				incButton.onclick = () => {
					if (input.value == "") input.value = 0;
					input.value = parseInt(input.value) + parseInt(document.getElementById("numberInput").getAttribute("step"));
					if (document.getElementById("numberInput").getAttribute("update")  == "true") document.getElementById("totalPriceNumberInput").innerText = "Total price: " + centToDollar(item.price * input.value);
				};


				inputDiv.appendChild(input);
				inputDiv.appendChild(decButton);
				inputDiv.appendChild(incButton);

				td.appendChild(inputDiv);

			// Total price
				if (item.displayTotalPrice) {
					var totalPrice = document.createElement("p");
					totalPrice.innerText = "Total price: " + centToDollar(item.price);
					totalPrice.id = "totalPriceNumberInput";

					td.appendChild(totalPrice);
				}
			}
            else if (interfaceConfig.type == "money") {

            // Input Number

                var inputDiv = document.createElement("div");

                var input = document.createElement("input");

                var decButton = document.createElement("button");
                var incButton = document.createElement("button");

                inputDiv.style.display = "flex";
                inputDiv.classList.add("numberContainer");

                input.type = "text";
                input.id = "numberInput";
                input.classList.add("numberInput");
                input.name = interfaceConfig.dataName;


                // Create custom update attr.
                var update = document.createAttribute("update");
                update.value = item.displayTotalPrice;
                if (item.displayTotalPrice == undefined) update.value = false;
                input.setAttributeNode(update);

                // Create custom step attr.
                var step = document.createAttribute("step");
                step.value = interfaceConfig.step;
                if (interfaceConfig.step == undefined) step.value = 1;
                input.setAttributeNode(step);


                input.value = 1; // Don't tell anyone that this is the true default!
                if (interfaceConfig.defaultValue != undefined) input.value = interfaceConfig.defaultValue;
                

                
                input.oninput = () => {
                    input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                };

                decButton.innerText = "-";
                decButton.classList.add("numberInputButton");
                var minValue = 1;
                decButton.onclick = () => {
                    if (input.value <= minValue) input.value = 0;
                    else input.value = parseInt(input.value) - parseInt(document.getElementById("numberInput").getAttribute("step"));
                };

                incButton.innerText = "+";
                incButton.classList.add("numberInputButton");
                incButton.onclick = () => {
                    input.value = parseInt(input.value) + parseInt(document.getElementById("numberInput").getAttribute("step"));
                };




                inputDiv.appendChild(input);
                inputDiv.appendChild(decButton);
                inputDiv.appendChild(incButton);

                td.appendChild(inputDiv);



                /*

                // Trying to show $_.__ and not value in cent

                input.value = centToDollar(1); // Don't tell anyone that this is the true default!
                if (interfaceConfig.defaultValue != undefined) input.value = centToDollar(interfaceConfig.defaultValue);
                
                input.oninput = () => {
                    input.value = centToDollar((input.value.substring(1) * 100).toString().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
                        // remove $ and * 100 to get value in cent
                };

                decButton.innerText = "-";
                decButton.classList.add("numberInputButton");
                var minValue = 1;
                decButton.onclick = () => {
                    if ((input.value.substring(1) * 100) <= minValue) input.value = centToDollar(minValue);
                    else {
                        input.value = centToDollar(parseInt((input.value.substring(1) * 100)) - parseInt(document.getElementById("numberInput").getAttribute("step")));

                        //if (input.value < minValue) input.value = minValue;
                    }
                };

                incButton.innerText = "+";
                incButton.classList.add("numberInputButton");
                incButton.onclick = () => {
                    if ((input.value.substring(1) * 100) == "") input.value = centToDollar(0);
                    input.value = centToDollar(parseInt((input.value.substring(1) * 100)) + parseInt(document.getElementById("numberInput").getAttribute("step")));
                };
                */
            }
            // console.log(item);
        }
        // return div;
        

        // td.appendChild(div);
        tr.appendChild(td);
        table.appendChild(tr);
    }







function submitOrder () {
    if (order.length == 0) {
        alert("Empty order");
        return;
    }

    document.getElementById("submitOrderButton").innerText = "Submiting";

    $.ajax({
        url: "submitOrder.php",
        type: "POST",
        dataType: "JSON",
        data: {data: JSON.stringify(order), itemConfigVersion: itemConfigVersion},
        success: function(response){
            console.log(response);
            
            // Clear newOrder
            order = [];
            changeLayout({view: "select"});

            alert(response.message);
        }
    });
}







// smol functions
    function removeAllChildren (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function centToDollar (cent) {
        return (cent / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
    }



</script>


<style src="../includes/styles/LiberationFonts.css"></style>
<style type="text/css">
    .available {
      cursor: pointer;
      //text-decoration: underline;
    }
    
    .unavailable {
      color: red;
      text-decoration: line-through;
    }
    
    .margin {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    
    
    .buttonGrid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      grid-auto-rows: 75px;
    }
    
    .buttonGrid > button {
      width: 100%;
      height: 100%;
      /* border: none; */
      border-style: ridge;
    
      min-width: 100px;
      //max-width: 200px;
    }
    
    button {
        border-style: ridge;
        cursor: pointer;
    }
    
    // for checkbox css
    .checkbox {
      display: grid;
      grid-template-columns: 40px auto;
      font-size: 30px;
    }
    
    .checkbox:hover:not(.unavailable) {
      background-color: lightblue;
      cursor: pointer;
    }
    
    .checkbox input[type="checkbox"] {
      width: 30px;
      height: 30px;
    }
    
    .checkbox:not(.unavailable) > input[type="checkbox"] {
      cursor: pointer;
    }
    
    
    
    
    .radio {
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
    
    .radio:hover:not(.unavailable) {
      background-color: lightblue;
      cursor: pointer;
    }
    
    .radio input[type="radio"] {
      width: 30px;
      height: 30px;
    }
    
    .radio:not(.unavailable) > input[type="radio"] {
      cursor: pointer;
    }
    
    
    
    button:hover:not(.unavailable) {
      background-color: lightblue;
    }




    .fontSize30 {
        font-size: 30px;
    }

    .labelFor {
        font-size: 30px;
    }

    .centerText {
        text-align: center;
    }

    .addToOrderButton {
        margin-top: 25px;
        width: 100%;
        height: 100%;
        min-height: 50px;

        font-size: 30px;
    }

    .backButton {
        margin-bottom: 25px;
        width: 100%;
        height: 100%;
        min-height: 50px;

        font-size: 30px;
    }


        

    .numberContainer > * {
        font-size: 30px;
    }

    .numberContainer > :first-child {
        border-style: ridge none ridge ridge;
    }

    .numberContainer > :last-child {
        border-style: ridge ridge ridge none;
    }

    .numberContainer > *:not(:last-child, :first-child) {
        border-style: ridge none ridge none;
    }

    .numberInput {
        width: 100px;
    }

    .numberInputButton {
        width: 50px;
    }



	#totalPriceNumberInput {
		font-size: 30px;
	}

	#pricePerUnitNumberInput {
		font-size: 30px;
	}





.editTable {
  border-spacing: 0px;
  font-size: 24px;
  margin-top: 50px;
}

.editTable > tr:nth-child(even) {
  background-color: lightgray;
}

.editTable > tr:hover {
  background-color: lightblue;
}


body > * {
    font-family: "LiberationSans";
}




	.orderListContainer > *:not(:first-child) {
		border-spacing: 0px 15px;
	}

	.orderListContainer:first-child {
		border-spacing: 0px 0px;
	}


/* orderList */

	.orderListItemTable {
		width: 100%;
		/* table-layout: auto; */
		border-bottom-style: ridge;
		border-bottom-width: 1px;
	}


	.orderListOptionColumn {
		/* width: 5%; */
		display: flex;
		width: 100%;
		flex-flow: row wrap;
		justify-content: space-around;
	}

	.orderListOptionColumn > *{
		/* float: right; */

		display: table-cell;
		text-align: center;
	}


	.orderListContentColumn {
		/* width: 50%; */
	}

	.orderListPriceColumn {
		/* width: 25%; */
		float: right;
	}
</style>
