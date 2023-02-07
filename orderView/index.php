<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Order View</title>
</head>
<body>

	<p>Double click to remove an order</p>
	
	<div class="container" id="table" style="margin-top: 50px; margin-bottom: 250px;">
		<p>No data loaded</p>
	</div>

	<div id="optionsContainer">
		<details class="options">
			<summary class="summary">Options</summary>
			<div id="optionsContent"></div>
		</details>
	</div>

</body>
</html>



<script src="../includes/jquery.min.js"></script>

<script type="text/javascript">
/**
 * 
 * TODO
 * 
 * 
 */

	var itemConfigVersionInUse = null;
	var configs = {};

	const minUpdateDelay = 1;


	var toggleUpdatingInput = document.getElementById("toggleUpdatingInput");
	var updateDelayInput = document.getElementById("updateDelayInput");

	window.onload = async () => {
		fillOptions();
		await getItemConfig();

		toggleUpdatingInput = document.getElementById("toggleUpdatingInput");
		updateDelayInput = document.getElementById("updateDelayInput");

		// do this because I want it to default to it's own attr. and not what was on the page last load
		if (toggleUpdatingInput.checked) {
			toggleUpdatingInput.checked = false;
		}

		toggleUpdatingInput.click();
	};



	var table = document.getElementById("table");
	
	// Update
	var updateInterval;


	function toggleUpdating () {
		// var element = document.getElementById("toggleUpdatingButton");

		if (toggleUpdatingInput.value === "notActive") {
			toggleUpdatingInput.value = "active";
			// element.innerText = "Stop Updating";
			getUnfilledPool();

			if (updateDelayInput.value < minUpdateDelay) {
				updateDelayInput.value = minUpdateDelay;
			}

			updateInterval = setInterval(getUnfilledPool, updateDelayInput.value * 1000);
		}
		else {
			toggleUpdatingInput.value = "notActive";
			// element.innerText = "Start Updating";
			clearInterval(updateInterval);
		}

	}



	async function updateView (orders) {
		while (table.firstChild) {
			table.removeChild(table.firstChild);
		}

		var maxCells = parseInt(maxCellsInput.getAttribute("data-value"));

		var greatestOrderVersion = 0;
		var itemConfigVersionsNeeded = [];

		orders.forEach(function(order) {
			if (!Object.keys(configs).includes(order.itemConfigVersion) && !itemConfigVersionsNeeded.includes(order.itemConfigVersion)) {
				// get that item config and save in configs for later use
				itemConfigVersionsNeeded.push(order.itemConfigVersion);
			}
		});

		for (var versionIndex = 0; versionIndex < itemConfigVersionsNeeded.length; versionIndex++) {
			await getItemConfig(itemConfigVersionsNeeded[versionIndex]);
		}
		


		for (
		var orderIndex = 0;
		// if maxCells == 0: do loop till end, if not: do loop untill maxCells are used
		maxCells == 0 ? orderIndex < orders.length : orderIndex < orders.length && orderIndex < maxCells;
		orderIndex++
		) {

			var order = orders[orderIndex];

			var div = document.createElement("div");
			div.innerHTML = "<button ondblclick='deleteOrder(" + order.id + ")'>Remove order</button><span style=\"float: right;\">Order: " + order.id + "</span>";
			
			div.classList.add("item");
			div.id = order.id;


			itemConfigVersionInUse = order.itemConfigVersion;

			

			delete order.itemConfigVersion;
			delete order.id;

			var pushNewOrder = true;

			for (var itemIndex = 0; itemIndex < Object.keys(order).length; itemIndex++) {

				var item = order[itemIndex];

				var orderItemConfig = configs[itemConfigVersionInUse].getItemByDataName(item.name);

				if (orderItemConfig.interface.getInterfaceWithDataName(item.name).type === "money" && Object.keys(order).length < 2) {
					pushNewOrder = false;
					continue;
				}

				if (orderItemConfig.interface.getInterfaceWithDataName(item.name).type === "money") {
					continue;
				}

				var entryElement = document.createElement("p");

				var keys = Object.keys(item);

				try {


					for (var i = 0; i < keys.length; i++) {
						
						if (Array.isArray(item[keys[i]])) {
							

							if (item[keys[i]].length >= 1) {
								entryElement.innerHTML += keys[i] + ":<br>";

								for (var o = 0; o < item[keys[i]].length; o++) {
									
									entryElement.innerHTML += "&emsp;&emsp;" + orderItemConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(item[keys[i]][o]).displayName + "<br>";
								}
							}
							else {

								entryElement.innerHTML += keys[i] + ": none<br>";

							}
						}
						else {

							if (keys[i] != item[keys[i]]) {
								
								if (keys[i] === "name" || keys[i] === "item" || configs[itemConfigVersionInUse].getItemByDataName(item[keys[i]]) != false) { // check if it is an item
									entryElement.innerHTML += keys[i] + ": " + orderItemConfig.displayName;
									entryElement.innerHTML += "<br>";
								}
								else if (orderItemConfig.interface.getInterfaceWithDataName(keys[i]) != false) { // if it is part of an interface
									entryElement.innerHTML += keys[i] + ": " + orderItemConfig.interface.getInterfaceWithDataName(keys[i]).getChoiceWithDataName(item[keys[i]]).displayName;
									entryElement.innerHTML += "<br>";
								}
								else {
									entryElement.innerHTML += keys[i] + ": " + item[keys[i]];
									entryElement.innerHTML += "<br>";
								}
							}
						}

						div.appendChild(entryElement);
					}
				} catch (error) {
					console.error(error);

					// remove all children except the first 2
					for (var childrenIndex = div.children.length - 1; childrenIndex > 1; childrenIndex--) {
						div.children[childrenIndex].remove();
					}

					div.innerHTML += "<span style='color: red;'><br>Error displaying order</span><br>Try to understand this and tell the manager about it<br>";
					entryElement.innerText = JSON.stringify(order, null, 4);

					div.appendChild(entryElement);
				}

				
			}

			if (pushNewOrder) table.appendChild(div);
		}
	}




	function deleteOrder (id) {
		$.ajax({
			url: "../orderPools/deleteOrderById.php",
			type: "POST",
			dataType: "JSON",
			data: {id: id},
			success: function(response) {
				getUnfilledPool(); // for update after change
			}
		});

		// getUnfilledPool();
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

				if (seconds < 10) seconds = "0" + seconds.toString();
				if (hours < 10) hours = "0" + hours.toString();
				
				if (orders != 0) {
					updateView(orders);

					document.getElementById("updatedTime").innerHTML = hours + ":" + minutes + ":" + seconds + " " + ampm;
				}
				else {
					document.getElementById("updatedTime").innerHTML = hours + ":" + minutes + ":" + seconds + " " + ampm;
					table.innerHTML = "<p>No unfilled orders<br><br>Time: " + hours + ":" + minutes + ":" + seconds + " " + ampm + "</p>";
				}
			}
		});
	}


	function getItemConfig (wantedItemConfigVersion) {

		return new Promise((resolve, reject) => {

			$.ajax({
			url: "../includes/getItemConfig.php",
			type: "POST",
			dataType: "JSON",
			data: {itemConfigVersion: wantedItemConfigVersion},
			success: function (response) {
				configs[response.version] = JSON.parse(response.config);
				// configs.push({config: JSON.parse(response.config), itemConfigVersion: response.version});
				itemConfigVersionInUse = response.version;

				/**
				 * 
				 * What do you think it does?
				 * It does what it's named, else console.error and returns false.
				 * 
				 */
				configs[response.version].getItemByDataName = function (dataName) {
					for (var i = 0; i < configs[response.version].items.length; i++) {

						if (configs[response.version].items[i].dataName === dataName) {
							return configs[response.version].items[i];
						}
					}

					return false;
				}

				for (var i = 0; i < configs[response.version].items.length; i++) {

					configs[response.version].items[i].interface.getInterfaceWithDataName = function (dataName) {

						for (var p = 0; p < this.length; p++) {
							
							if (this[p].dataName === dataName) {
								return this[p];
							}
						}

						return false;
					}

					for (var o = 0; o < configs[response.version].items[i].interface.length; o++) {

						configs[response.version].items[i].interface[o].getChoiceWithDataName = function (dataName) {

							if (this.choices != undefined) {
								for (var p = 0; p < this.choices.length; p++) {
									
									if (this.choices[p].dataName === dataName) {
										return this.choices[p];
									}
								}
							}

							return false;
						}
					}
				}
				resolve();
			}
			});
		});
	}



	function fillOptions () {
		var optionsContent = document.getElementById("optionsContent");

		var optionsTable = document.createElement("table");
		optionsTable.style.fontSize = "20px";

		
	// Last updated
		var lastUpdatedRow = document.createElement("tr");
		lastUpdatedRow.style.cursor = "default";
		lastUpdatedRow.innerHTML = "<td>Last updated</td><td><span id='updatedTime'></span></td>";

	// Update delay
		var updateDelayRow = document.createElement("tr");
		updateDelayRow.innerHTML = "<td><label for='updateDelayInput'>Update every</label></td>";


		// updateDelayInput cell
		var updateDelayInputCell = document.createElement("td");

		// update delay input
		var updateDelayInput = document.createElement("input");
		updateDelayInput.type = "text";
		updateDelayInput.id = "updateDelayInput";
		updateDelayInput.value = minUpdateDelay + 1;
		updateDelayInput.name = "updateDelayInput";
		updateDelayInput.min = minUpdateDelay;
		updateDelayInput.maxLength = 2;

		updateDelayInput.style.outline = "none";

		updateDelayInput.style.width = "25px";
		updateDelayInput.style.fontSize = "20px";
		updateDelayInput.style.border = "var(--main-button-border)";
		updateDelayInput.style.backgroundColor = "white";

		updateDelayInput.oninput = () => {
			updateDelayInput.value = updateDelayInput.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
			
			if (updateDelayInput.value == '' || updateDelayInput.value < updateDelayInput.min) updateDelayInput.style.backgroundColor = 'rgba(255, 0, 0, 1)';
			else updateDelayInput.style.backgroundColor = 'rgba(255, 0, 0, 0)';
		};

		updateDelayInput.onblur = () => {
			if (updateDelayInput.value == '' || updateDelayInput.value < updateDelayInput.min) {
				updateDelayInput.value = updateDelayInput.min;
				updateDelayInput.style.backgroundColor = 'rgba(255, 0, 0, 0)';
			}

			toggleUpdating();
			toggleUpdating();
		};

		

		updateDelayInputCell.innerHTML = "<span style='cursor: default;'>sec</span>";
		updateDelayInputCell.insertBefore(updateDelayInput, updateDelayInputCell.children[0]);
		

		updateDelayRow.appendChild(updateDelayInputCell);





	// updating toggle
		var updatingToggleRow = document.createElement("tr");

		updatingToggleRow.innerHTML = "<td><label for='toggleUpdatingInput'>Updating</label></td>";


		// toggleUpdatingInputCell
		var toggleUpdatingInputCell = document.createElement("td");

		// toggleUpdatingInput
		var toggleUpdatingInput = document.createElement("input");
		toggleUpdatingInput.type = "checkbox";

		toggleUpdatingInput.id = "toggleUpdatingInput";
		toggleUpdatingInput.value = "notActive";

		toggleUpdatingInput.oninput = () => {
			toggleUpdating();
		};



		toggleUpdatingInputCell.appendChild(toggleUpdatingInput);

		updatingToggleRow.appendChild(toggleUpdatingInputCell);

	
	// max cells
		var maxCellsRow = document.createElement("tr");

		maxCellsRow.innerHTML = "<td><label for='maxCellsInput'>Max orders</label></td>";


		// maxCellsInputCell
		var maxCellsInputCell = document.createElement("td");

		// maxCellsInput
		var maxCellsInput = document.createElement("input");

		maxCellsInput.type = "text";
		maxCellsInput.id = "maxCellsInput";
		maxCellsInput.value = 10;
		maxCellsInput.name = "maxCellsInput";
		maxCellsInput.min = 8;
		maxCellsInput.maxLength = 2;


		maxCellsInput.setAttribute("data-value", maxCellsInput.value);


		maxCellsInput.title = "0 for infinite";

		maxCellsInput.style.border = "var(--main-button-border)";
		maxCellsInput.style.outline = "none";
		maxCellsInput.style.width = "25px";
		maxCellsInput.style.fontSize = "20px";
		maxCellsInput.style.backgroundColor = "white";

		maxCellsInput.oninput = () => {
			maxCellsInput.value = maxCellsInput.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
			
			if (maxCellsInput.value == '' || (parseInt(maxCellsInput.value) != 0 && parseInt(maxCellsInput.value) < maxCellsInput.min)) {
				maxCellsInput.style.backgroundColor = 'rgba(255, 0, 0, 1)';
			}
			else
				maxCellsInput.style.backgroundColor = 'rgba(255, 0, 0, 0)';
		};

		maxCellsInput.onblur = () => {
			if (maxCellsInput.value == '' || (parseInt(maxCellsInput.value) != 0 && parseInt(maxCellsInput.value) < maxCellsInput.min)) {
				maxCellsInput.value = maxCellsInput.min;
				maxCellsInput.style.backgroundColor = 'rgba(255, 0, 0, 0)';
			}

			maxCellsInput.setAttribute("data-value", maxCellsInput.value);
		};



		maxCellsInputCell.appendChild(maxCellsInput);

		maxCellsRow.appendChild(maxCellsInputCell);





		optionsTable.appendChild(lastUpdatedRow);
		optionsTable.appendChild(updatingToggleRow);
		optionsTable.appendChild(updateDelayRow);
		optionsTable.appendChild(maxCellsRow);

		optionsContent.appendChild(optionsTable);

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



	/* #updateDelayInput:invalid {
		background-color: red;
	} */

	input[type="checkbox"] {
		cursor: pointer;
		width: 20px;
		height: 20px;
	}

	input[type="checkbox"]:hover {
		background-color: lightBlue;
	}

	/* .options > * {
		font-size: 20px;
	}

	.options > span {
		cursor: default;
	} */

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



	#optionsContainer {
		position: fixed;
		bottom: 0px;
		right: 0px;
		padding: 5px;
		z-index: 9999;
		background-color: white;
	}


	.options {
		border: var(--main-button-border);
		padding: 0.5em 0.5em 0;
	}

	.options > *:not(.summary) > * {
		font-size: 16px;
	}

	.options > *:not(.summary) > button {
		padding: 6px;
		margin-bottom: 10px;
	}

	.options > *:not(.summary) > :last-child {
		margin-bottom: 0px;
	}

	.summary {
		font-weight: bold;
		margin: -0.5em -0.5em 0;
		padding: 0.5em;

		font-size: 18px;

		cursor: pointer;
		/* list-style: none; */
		text-align: center;
	}

	.summary::marker {
		/* content: "→"; */
	}

	.options[open] > .summary::marker {
		/* content: "↓"; */
	}

	.options[open] {
		padding: 0.5em;
	}

	.options[open] .summary {
		border-bottom: var(--main-button-border);
		margin-bottom: 0.5em;
	}

	.options > #optionsContent > table > tr > *:first-child {
		text-align: right;
	}
</style>
