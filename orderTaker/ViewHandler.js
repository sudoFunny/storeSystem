

/**
 * 
 * 
 * 
 * 
 * KEYWORDS YOU CANNOT USE FOR dataName
 * "quantity"
 * 
 * idk if ^ is true... :/
 */


function goToSelectPage () {
	changeLayout({view: "select"});
}



function changeLayout (query) {
	document.body.setAttribute("layout", query.view);
    // if (query.view === "select") {
    //     document.getElementById("optionsContainer").style.display = "block";
    // }
    // else
    //     document.getElementById("optionsContainer").style.display = "none";


    if (query.view === "detail") {
        removeAllChildren(mainContainer);

        var div = document.createElement("div");

        showDetail(query.item, div);
    }
    else if (query.view === "select") {
        removeAllChildren(mainContainer);

        // to make order panel scrollable
        var screenHeight = window.innerHeight;


        var table = document.createElement("table");
        var tbody = document.createElement("tbody");

        var tr1 = document.createElement("tr");
        var tr2 = document.createElement("tr");
        var tr3 = document.createElement("tr");

        // to make order panel scrollable
        table.style.height = screenHeight * .75 + "px";


        table.id = "table";
        table.style.tableLayout = "fixed";
        table.style.width = "100%";

        tr1.innerHTML = "<td style='font-size: 30px; text-align: center;'>Add Item</td><td style='font-size: 30px; text-align: center;'>Order</td>";

        tr2.innerHTML = "<td id=\"itemList\" class=\"buttonGrid\"></td><td style=\"position: relative;\"><div class=\"orderListContainer\" style=\"max-height: " + screenHeight * .55 + "px; overflow: auto; top: 0; position: absolute; width: 100%;\"><table id=\"orderList\" style=\"width:99%; margin-left: auto;" + "\"></table></div><p id=\"totalPrice\" style=\"position: absolute; bottom: 0; right: 0;\">Total: $0.00</p></td>";

        tr3.innerHTML = "<td colspan=\"2\" style=\"text-align: center\"><button id='submitOrderButton' onclick=\"submitOrder()\" style=\"margin-left: auto; margin-right: auto; width: 50%; height: 100%; min-height: 50px;\">Submit order</button></td>";

        tbody.appendChild(tr1);
        tbody.appendChild(tr2);
        tbody.appendChild(tr3);

        table.appendChild(tbody);

        mainContainer.appendChild(table);

    // make list of items for selection
        createItemList(document.getElementById("itemList"));

        updateOrderList(document.getElementById("orderList"));
    }
}






// items selection
// make item selection interface
function createItemList (appendant) {
    //removeAllChildren(mainContainer);

    // var div = document.createElement("div");
    // div.classList.add("buttonGrid");

// make buttons for each item
    for (var i = 0; i < config.items.length; i++) {
        var item = config.items[i];

        // create button
        var button = document.createElement("button");
        button.innerText = item.displayName;
        
        if (!item.available) {
            button.disabled = true;
            button.classList.add("unavailable");
        }
        else {
            button.classList.add("available");
			button.setAttribute("data-item-config-index", i);

            button.onclick = (ele) => {
				changeLayout({view: "detail", item: ele.target.getAttribute("data-item-config-index")});
            };
        }

        // div.appendChild(button);
        appendant.appendChild(button);
    }

    // mainContainer.appendChild(div);
}





function updateOrderList (appendant) {
    // clear all
    while (appendant.firstChild) {
        appendant.removeChild(appendant.firstChild);
    }
  
    var totalPrice = 0;
  
    order.forEach(function(item) {
    
		var entryTable = document.createElement("table");
		entryTable.classList.add("orderListItemTable");
		
		entryTable.setAttribute("data-item-index", order.indexOf(item));

		var entryRow = document.createElement("tr");
        // var entryElement = document.createElement("td");
		// entryElement.style.borderBottomStyle = "ridge";
		// entryElement.style.borderBottomWidth = "1px";
// console.log(item);

        var keys = Object.keys(item);

        // console.log(item);

        var itemObjectFromConfig = config.getItemByDataName(item.name);

        for (var i = 0; i < keys.length; i++) {

			var entryElementRow = document.createElement("tr");
			var entryElementOptionsCell = document.createElement("td");
			var entryElementContentCell = document.createElement("td");
			var entryElementPriceCell = document.createElement("td");

			var appendNewRow = true;

			entryElementOptionsCell.classList.add("orderListOptionColumn");
			entryElementContentCell.classList.add("orderListContentColumn");
			entryElementPriceCell.classList.add("orderListPriceColumn");

			if (typeof item[keys[i]] == "function") break;

            if (Array.isArray(item[keys[i]])) {

				var descriptionList = document.createElement("dl");
				descriptionList.style.margin = "0px";
				
                // entryElement.innerHTML += keys[i] + ":";

                descriptionList.innerHTML = "<dt>" + keys[i] + ":</dt>";


                if (item[keys[i]].length > 0 && itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).price != undefined) {
                    totalPrice += parseInt(eval(itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).price.replaceAll("main", itemObjectFromConfig.price)));
                    // entryElement.innerHTML += "<span style='float: right;'>&plus; " + centToDollar(eval(itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).price.replaceAll("main", itemObjectFromConfig.price))) + "</span>";
					entryElementPriceCell.innerHTML += "&plus; " + centToDollar(eval(itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).price.replaceAll("main", itemObjectFromConfig.price)));
                }

                // for (var o = 0; o < item[keys[i]].length; o++) {
				item[keys[i]].forEach(value => {
					
			
                    // entryElement.innerHTML += "<br>&emsp;&emsp;" + value;
					descriptionList.innerHTML += "<dd>" + itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(value).displayName + "</dd>";


                // get price per choice
                    if (itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]) != false) {

                        var choice = itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(value);
                        if (choice.price != "") {
                            totalPrice += parseInt(choice.price);
                            // entryElement.innerHTML += "<span style='float: right;'>&plus; " + centToDollar(choice.price) + "</span>";
							entryElementPriceCell.innerHTML += "&plus; " + centToDollar(choice.price);
                        }
                    }

				});
				// }

				// entryElement.innerHTML += "<br>";

				entryElementContentCell.appendChild(descriptionList);
			}
			else {
				// entryElement.innerHTML += keys[i] + ": " + item[keys[i]];
				if (typeof item[keys[i]] != "function")	{

					if (keys[i] === "name" || keys[i] === "item" || config.getItemByDataName(item[keys[i]]) != false) {
						entryElementContentCell.innerHTML = keys[i] + ": " + itemObjectFromConfig.displayName;
					}
					else if (itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]) != false) {
						if (itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(item[keys[i]]) != false) {
							entryElementContentCell.innerHTML = keys[i] + ": " + itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(item[keys[i]]).displayName;
						}
						else
							entryElementContentCell.innerHTML = keys[i] + ": ";
					}
					else {
						entryElementContentCell.innerHTML = keys[i] + ": " + item[keys[i]];
					}
				}
				// if (typeof item[keys[i]] != "function") entryElementContentCell.innerHTML = keys[i] + ": " + item[keys[i]];


				if (keys[i] === "name") {
					var removeButton = document.createElement("button");
					removeButton.innerHTML = "Remove";

					removeButton.onclick = (event) => {
						order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].remove();
						updateOrderList(document.getElementById("orderList"));
					}

					entryElementOptionsCell.appendChild(removeButton);
				}



                // console.log(itemObjectFromConfig.displayAndCountBasePrice);
            
            // get price per choice
                if (itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]) != false) {

                    var choice = itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(item[keys[i]]);

                    if (choice.price != "" && choice) {

						if (Object.keys(item).includes("quantity")) {
							totalPrice += parseInt(choice.price) * parseInt(item.quantity);
						}
						else
							totalPrice += parseInt(choice.price);
                        
						// entryElement.innerHTML += "<span style='float: right;'>&plus; " + centToDollar(choice.price) + "</span>";
						entryElementPriceCell.innerHTML = "&plus; " + centToDollar(choice.price);
                    }
                    
                // I did this for interface type number because I want it to display (price per * quantity) next to quantity entry
                    if (!choice) {
                        /*
                        var price = parseInt(itemObjectFromConfig.price) * 
                            // quantity
                            parseInt(item[itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).dataName]);
                        
                        totalPrice += price;
						
						console.log(price);

                        entryElement.innerHTML += "<span style='float: right;'>+ " + centToDollar(price) + "</span>";
						*/
						// entryElement.innerHTML += "<span style='float: right;'>&times; " + item[itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).dataName] + "</span>";

						
						if (item[itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).dataName] > 1) {

							if (itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).type != "money") {
								entryElementPriceCell.innerHTML = "&times; " + item[itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).dataName];
							}
							else {
								totalPrice += parseInt(item[itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).dataName]);
								entryElementPriceCell.innerHTML = "&plus; " + centToDollar(item[itemObjectFromConfig.interface.getInterfaceWithDataName(keys[i]).dataName]);
							}
						}

						// console.log(item);
						// console.log(keys[i]);
						// console.log(itemObjectFromConfig);
                    }
                }
            // display base price if current key is "name" and displayAndCountBasePrice is true or not set
                else if (keys[i] === "name" && itemObjectFromConfig.displayAndCountBasePrice || !itemObjectFromConfig.displayAndCountBasePrice == undefined) {

                    if (itemObjectFromConfig.price != "") {

                        totalPrice += parseInt(itemObjectFromConfig.price);
                        // entryElement.innerHTML += "<span style='float: right;'>&plus; " + centToDollar(itemObjectFromConfig.price) + "</span>";
						entryElementPriceCell.innerHTML = "&plus; " + centToDollar(itemObjectFromConfig.price);
                    }
                }
				else if (keys[i] === "quantity") {
					// entryElement.innerHTML += "<span style='float: right;'>&times; " + item.quantity + "</span>";
					// if (item.quantity > 1) {
					// 	entryElementPriceCell.innerHTML = "&times; " + item.quantity;
					// }
					// else
					// 	appendNewRow = false;

                    entryElementPriceCell.innerHTML = "&times; " + item[keys[i]];




					var decrementButton = document.createElement("button");
					decrementButton.innerHTML = "&minus;";

					decrementButton.onclick = (event) => {

                        if (order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].quantity > 1) {
                            order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].quantity -= 1;
                            updateOrderList(document.getElementById("orderList"));
                        }
                        else if (order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].quantity <= 1) {
                            order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].remove();
                            updateOrderList(document.getElementById("orderList"));
                        }
					}

					var incrementButton = document.createElement("button");
					incrementButton.innerHTML = "&plus;";

					incrementButton.onclick = (event) => {
						order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].quantity = parseInt(order[event.target.parentElement.parentElement.parentElement.getAttribute("data-item-index")].quantity) + 1;
						updateOrderList(document.getElementById("orderList"));
					}

					entryElementOptionsCell.appendChild(decrementButton);
					entryElementOptionsCell.appendChild(incrementButton);
				}
				else if (keys[i] === "amount") {
					totalPrice += parseInt(item.amount);
					entryElementPriceCell.innerHTML = "&plus; " + centToDollar(item.amount);
				}

                // entryElement.innerHTML += "<br>";
            }


			if (appendNewRow) {
				entryElementRow.appendChild(entryElementOptionsCell);
				entryElementRow.appendChild(entryElementContentCell);
				entryElementRow.appendChild(entryElementPriceCell);

				entryTable.appendChild(entryElementRow);
				entryRow.appendChild(entryTable);
			}  
        }
		appendant.appendChild(entryRow);
    });
  
   
    document.getElementById("totalPrice").innerText = "Total: " + centToDollar(totalPrice);

	if (appendant.children.length > 0) appendant.children[appendant.children.length - 1].scrollIntoView();
}









function makeAddToOrderButton (item, appendant) {
	var tr = document.createElement("tr");
	var td = document.createElement("td");

	var addToOrderButton = document.createElement("button");
	addToOrderButton.innerText = "Add to order";
	addToOrderButton.classList.add("addToOrderButton");
	td.style.textAlign = "center";


	// Check order and add
	addToOrderButton.onclick = (ele) => {


		var itemObject = {}, doNotPush = false;
		itemObject.name = item.dataName;

		// for each interface in item
		for (var i = 0; i < item.interface.length; i++) {
            var interfaceElement = item.interface[i];

                if (interfaceElement.type == "radio") {
                    // var interfaceElementObject = {};


                    var radio = document.getElementsByName(interfaceElement.dataName);
                    var type = -1;
                    for (var radioIndex = 0; radioIndex < radio.length; radioIndex++) {
                        if (radio[radioIndex].checked/* && interfaceElement.available*/) {
                            type = radio[radioIndex].value;
                            // break;
                        }
                        // else {
                        // // if (interfaceElement.required && !radio[radioIndex].checked) {
                        //     alert("You must select an option of \"" + interfaceElement.dataName + "\" for it is required");
                        //     // could make it fancy by using get____ByDataName() functions
                        //     doNotPush = true;
                        //     break;
                        // }
                    }


                    if (type == -1) {
                        alert("Invalid value for " + interfaceElement.dataName);
                        return;
                    }

                    // interfaceElementObject[interfaceElement.dataName] = type;

                    itemObject[interfaceElement.dataName] = type;
                    
                    // itemObject = Object.assign(itemObject, interfaceElementObject);
                }
                else if (interfaceElement.type == "checkbox") {
                    // var interfaceElementObject = [];



                    var checkBoxes = document.getElementsByName(interfaceElement.dataName);
                    var checks = [];
                    for (var o = 0; o < checkBoxes.length; o++) {
                        if (checkBoxes[o].checked/* && itemsConfig.hotChocolate.toppings[checkBoxes[o].id].available*/) checks.push(checkBoxes[o].value);
                        if (checkBoxes[o].getAttribute("required") == "true" && !checkBoxes[o].checked) {
                            alert("Option \"" + checkBoxes[o].value + "\" is required");
                            // could make it fancy by using get____ByDataName() functions
                            doNotPush = true;
                        }
                    }

                    if (checks.length < interfaceElement.minSelection || doNotPush) {
                        alert("Invalid value for " + interfaceElement.dataName);
                        return;
                    }

                    // interfaceElementObject[interfaceElement.dataName] = checks;

                    itemObject[interfaceElement.dataName] = checks;

                    // itemObject.push(interfaceElementObject);
                    
                    // itemObject = Object.assign(itemObject, interfaceElementObject);
                }
				// else if (interfaceElement.type == "number") {
                else if (interfaceElement.type == "quantity") {

                    // var input = document.getElementsByName(interfaceElement.dataName);
					var input = document.getElementsByName("quantity");

                    if (input[0].value < 1) {
                        alert("Invalid value for " + interfaceElement.dataName);
                        // console.log("Invalid value for " + interfaceElement.dataName);
                        return;
                    }

                    var alreadyInOrder = false;

					// itemObject[interfaceElement.dataName] = input[0].value;
					// console.log(itemObject);
					
					order.forEach(orderItem => {
						// console.log(orderItem);
                        if (orderItem.name === item.dataName) {

							var allArraysMatch = [];
							var allPropertiesMatch = [];

							item.interface.forEach(interface => {
								if (typeof interface === "object") {
									// console.log(interface);


									var propertyMatches = [];

									Object.keys(itemObject).forEach(itemObjectProperty => {
										// console.log(itemObjectProperty);

									
									// when an item in the order has the same properties
										if (interface.dataName === itemObjectProperty/* || interface.dataName === interfaceElement.dataName*/) {
											// console.log("test");

										// if property is an array
											// console.log(Array.isArray(itemObject[itemObjectProperty]));
											if (Array.isArray(itemObject[itemObjectProperty]) && itemObject[itemObjectProperty].length == orderItem[interface.dataName].length) {

												// check if both arrays have the same values with each value's index not mattering

												var arrayMatches = [];

												// console.log();
												// console.log(itemObject[itemObjectProperty]);
												
												for (var newItemPropertyArrayValueIndex = 0; newItemPropertyArrayValueIndex < itemObject[itemObjectProperty].length; newItemPropertyArrayValueIndex++) {
													arrayMatches.push(orderItem[interface.dataName].includes(itemObject[itemObjectProperty][newItemPropertyArrayValueIndex]));
												}


												allArraysMatch.push(!arrayMatches.includes(false));
											}
											else {
											// and property values
												propertyMatches.push(orderItem[interface.dataName] === itemObject[itemObjectProperty]);
											}
										}
									});
									
									allPropertiesMatch.push(!propertyMatches.includes(false));

								}
							});

							// do final stuff
							if (!allArraysMatch.includes(false) && !allPropertiesMatch.includes(false)) {
								orderItem.quantity = parseInt(orderItem.quantity) + parseInt(input[0].value);
								alreadyInOrder = true;
								doNotPush = true;
							}
                        }

					});
                    
                    if (!alreadyInOrder) {
                        itemObject.quantity = input[0].value;
                    }
                }
                else if (interfaceElement.type == "money") {

                    var input = document.getElementsByName(interfaceElement.dataName);

                    if (input[0].value < 1) {
                        alert("Invalid value for " + interfaceElement.dataName);
                        return;
                    }



                    var alreadyInOrder = false;
                    for (var i = 0; i < order.length; i++) {
                        if (order[i].name === item.dataName) {
                            order[i][interfaceElement.dataName] = parseInt(order[i][interfaceElement.dataName]) + parseInt(input[0].value);
                            alreadyInOrder = true;
                            doNotPush = true;
                            break;
                        }
                    }
                    if (!alreadyInOrder) {
                        itemObject[interfaceElement.dataName] = input[0].value;
                    }
                }
            }


            if (!doNotPush) {
				itemObject.remove = function() {
					order.splice(order.indexOf(this), 1);
				}
				order.push(itemObject);
			}
            goToSelectPage();
        };
    
	td.appendChild(addToOrderButton);
	tr.appendChild(td);
    appendant.appendChild(tr);
}



function fillOptions () {
	var optionsContent = document.getElementById("optionsContent");

	
// update menu button / get newest menu version
	var updateMenuButton = document.createElement("button");
	updateMenuButton.id = "updateMenuButton";
	updateMenuButton.innerText = "Update menu";
	updateMenuButton.title = "Gets newest menu version";

	updateMenuButton.style.width = "100%";

	updateMenuButton.onclick = async () => {
		var currentItemConfigVersion = JSON.parse(JSON.stringify(itemConfigVersion));
		goToSelectPage();
		await getItemConfig();

		if (currentItemConfigVersion == itemConfigVersion) {
			sendNotification({travelTime: {in: 0.5, out: 0.5}, closeAfter: 5, message: "Menu already up-to-date"});
		}
		else sendNotification({travelTime: {in: 0.5, out: 0.5}, closeAfter: 5, message: "Menu updated"});
	};


// clear all notification
	var clearAllNotificationsButton = document.createElement("button");
	clearAllNotificationsButton.innerText = "Clear all notifications";

	clearAllNotificationsButton.style.width = "100%";

	clearAllNotificationsButton.onclick = () => {

		var leaveFor = 0.5;

		// only remove current children
		var children = document.getElementById("notificationArea").children;

		for (var childIndex = 0; childIndex < children.length; childIndex++) {
			children[childIndex].style.animation = "notificationWidthOut cubic-bezier(.79,.14,.15,.86) " + leaveFor + "s";
			children[childIndex].classList.add("removeMe");
		}

		window.scroll({
			top: 0,
			behavior: "smooth"
		});

		setTimeout(() => {

			var toRemove = document.getElementsByClassName("removeMe");
			for (var i = toRemove.length - 1; i >= 0; i--) {
				toRemove[i].remove();
			}
			
			document.getElementById("notificationArea").style.opacity = "100%";
			document.getElementById("notificationArea").style.animation = "";
		}, leaveFor * 1000);
	};
	

// go to select view page (../)
	var goToLandingPageButton = document.createElement("button");
	goToLandingPageButton.style.width = "100%";

	goToLandingPageButton.innerText = "Go to landing page";

	goToLandingPageButton.onclick = () => {
		window.location = "../";
	};




	optionsContent.appendChild(updateMenuButton);
	optionsContent.appendChild(clearAllNotificationsButton);
	optionsContent.appendChild(goToLandingPageButton);
}






function wordWrap (str, cols, delimiter) {
	var formatedString = '',
		wordsArray = [];

	wordsArray = str.split(' ');

	formatedString = wordsArray[0];

	for (var i = 1; i < wordsArray.length; i++) {
		if (wordsArray[i].length > cols) {
			formatedString += delimiter + wordsArray[i];
		} else {
			if (formatedString.length + wordsArray[i].length > cols) {
				formatedString += delimiter + wordsArray[i];
			} else {
				formatedString += ' ' + wordsArray[i];
			}
		}
	}

	return formatedString;
}