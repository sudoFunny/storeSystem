




function convertJsonSalesDataToTable (salesData) {

// get itemConfig
	var itemConfigs = salesData.pop()

// generate templates
	var templates = {};

	for (var itemConfigIndex = 0; itemConfigIndex < itemConfigs.length; itemConfigIndex++) {

		if (Object.keys(templates).includes(itemConfigs[itemConfigIndex].version)) {
			break;
		}
		else {
			templates[itemConfigs[itemConfigIndex].version.toString()] = createTemplate(itemConfigs[itemConfigIndex]);
		}
		
	}

	templates = addSalesDataToTemplates(templates, salesData);


/*
// for later ig
	if (Object.keys(templates).length > 1) {
		if (confirm("There are " + Object.keys(templates).length + " item configs used between " + salesData.length + " orders, would you like to put the orders in different tables based on what item config version the order uses?\n\nOtherwise they will be joined by the item's data name, this could cause an issue if you changed the data name of an item or if an item has the same data name\n\n\nIt is recommended -for data accuracy- to seperate orders into tables based on item config versions... A.K.A. just select \"yes\" or \"ok\"") == true) {
			
		}
		else {
			// join all sales data based on data name of item
		}
	}
*/

	// templates to csv
	var tables = {};

// for each version in template make table and fill it with rows
	Object.keys(templates).forEach(templateVersion => {
	
	// make table entry with key of version
		tables[templateVersion] = [];

	// make rows
		templates[templateVersion].forEach(templateEntry => {
		// rows are comprised of:
		// Item title, quantity, price
		// Item title has "displayName dataName"

			if (Array.isArray(templateEntry.displayName)) {
				var row = [
					templateEntry,
					templateEntry.itemDisplayName + " " + templateEntry.dataName + ": " + templateEntry.displayName.join(", "),
					templateEntry.quantity,
					templateEntry.price
				];
			}
			else {
				var row = [
					templateEntry,
					templateEntry.itemDisplayName + " " + templateEntry.dataName + ": " + templateEntry.displayName,
					templateEntry.quantity,
					templateEntry.price
				];
			}

			tables[templateVersion].push(row);

		});

	});

	return tables;
}






function createTemplate (config) {

	var entrys = [];

	config.config.items.forEach(item => {

		item.interface.forEach(interfaceElement => {
			if (interfaceElement.save != undefined || interfaceElement.save) {

				if (interfaceElement.choices != undefined) {

					if (interfaceElement.minSelection <= 0) {
						var entry = {};

						entry.dataName = interfaceElement.dataName;
						entry.dataNameValue = [];
						entry.displayName = "no " + interfaceElement.dataName;
						entry.price = parseInt(item.price);

						entry.quantity = 0;

						entry.itemDataName = item.dataName;
						entry.itemDisplayName = item.displayName;

						entrys.push(entry);
					}

					if (interfaceElement.type != "checkbox") {
						interfaceElement.choices.forEach(choice => {
							var entry = {};

							entry.dataName = interfaceElement.dataName;
							entry.dataNameValue = choice.dataName;
							entry.displayName = choice.displayName;

							if (choice.price === "") {
								choice.price = 0;
							}

							if (item.price === "") {
								item.price = 0;
							}

							if (interfaceElement.price == undefined) {
								interfaceElement.price = 0;
							}

							entry.price = parseInt(item.price) + parseInt(choice.price) + parseInt(interfaceElement.price);

							entry.quantity = 0;

							entry.itemDataName = item.dataName;
							entry.itemDisplayName = item.displayName;
							
							entrys.push(entry);
						});
					}
				// if interfaceElement.type === "checkbox" make an entry for each possible combination of the choices
					else if (interfaceElement.type === "checkbox") {

						var listOfChoices = [];

						interfaceElement.choices.forEach(choice => {
							listOfChoices.push(choice);
						});

						// Thanks to guy on stack overflow
						var combinations = [];
						var temp = [];
						var slent = Math.pow(2, listOfChoices.length);

						for (var i = 0; i < slent; i++) {

							temp = [];
							for (var j = 0; j < listOfChoices.length; j++) {

								if ((i & Math.pow(2, j))) {
									temp.push(listOfChoices[j]);
								}
							}
							if (temp.length > 0) {
								combinations.push(temp);
							}
						}

						combinations.sort((a, b) => a.length - b.length);

						combinations.forEach(combination => {
							var entry = {};

							entry.dataName = interfaceElement.dataName;
							entry.dataNameValue = [];
							entry.displayName = [];

							entry.price = 0;

							combination.forEach(combinationElement => {

								entry.dataNameValue.push(combinationElement.dataName);
								entry.displayName.push(combinationElement.displayName);

								if (combinationElement.price === "") {
									combinationElement.price = 0;
								}

								entry.price += parseInt(combinationElement.price);

							});

							if (item.price === "") {
								item.price = 0;
							}

							if (interfaceElement.price == undefined) {
								interfaceElement.price = 0;
							}

							entry.price += parseInt(item.price) + parseInt(interfaceElement.price);	

							entry.quantity = 0;

							entry.itemDataName = item.dataName;
							entry.itemDisplayName = item.displayName;
			
							entrys.push(entry);
						});

					}
				}
				else {
					// console.log("choices were undefined for");
					// console.log(interfaceElement);

					if (interfaceElement.type === "money") {
						var entry = {};

						entry.dataName = interfaceElement.dataName;
						entry.displayName = "";
						entry.dataNameValue = interfaceElement.dataName

						entry.type = interfaceElement.type;

						entry.price = "";

						entry.quantity = 0;

						entry.itemDataName = item.dataName;
						entry.itemDisplayName = item.displayName;

						entrys.push(entry);
					}
				}
			}
		});
	});

	return entrys;
}








function addSalesDataToTemplates (templates, salesData) {


	salesData.forEach(order => {

		order.contents.forEach(item => {

			// find item in correct template and increment its quantity
			for (var templateEntryIndex = 0; templateEntryIndex < templates[order.itemConfigVersion].length; templateEntryIndex++) {

				var entry = templates[order.itemConfigVersion][templateEntryIndex];

				if (item.name === entry.itemDataName && Object.keys(item).includes(entry.dataName)) {


					if (Array.isArray(entry.dataNameValue)) {

						if (item[entry.dataName].sort().join(' ') === entry.dataNameValue.sort().join(' ')) {

							if (item.quantity == undefined) { // basically for interface.type = money
								entry.quantity += parseInt(item[entry.dataName]);
							}
							else
								entry.quantity += parseInt(item.quantity);
						}
					}
					else if (item[entry.dataName] === entry.dataNameValue) {
						if (item.quantity == undefined) { // basically for interface.type = money
							entry.quantity += parseInt(item[entry.dataName]);
						}
						else
							entry.quantity += parseInt(item.quantity);
					}
					// basically for interface.type = money
					else if (item.name === entry.dataName) {

						if (entry.type === "money") {
							entry.quantity += parseInt(item[entry.dataName]);
						}
					}
				}
			}
		});
	});

	return templates;
}








function centToDollar (cent) {
	return (cent / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
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






function convertDateTimeToHTMLFormat (date) {

	var dateTimeString = "";

// Year
	if (date.getFullYear() < 10) {
		dateTimeString += "000" + date.getFullYear() + "-";
	}
	else if (date.getFullYear() < 100) {
		dateTimeString += "00" + date.getFullYear() + "-";
	}
	else if (date.getFullYear() < 1000){
		dateTimeString += "000" + date.getFullYear() + "-";
	}
	else
		dateTimeString += date.getFullYear() + "-";

// Month
	if (date.getMonth() + 1 < 10) {
		dateTimeString += "0" + (date.getMonth() + 1) + "-";
	}
	else
		dateTimeString += (date.getMonth() + 1) + "-";

// Day
	if (date.getDate() < 10) {
		dateTimeString += "0" + date.getDate();
	}
	else
		dateTimeString += date.getDate();

// Hour
	if (date.getHours() < 10) {
		dateTimeString += "T0" + date.getHours() + ":";
	}
	else
		dateTimeString += "T" + date.getHours() + ":";

// Minute
	if (date.getMinutes() < 10) {
		dateTimeString += "0" + date.getMinutes() + ":";
	}
	else
		dateTimeString += date.getMinutes() + ":";
	
// Second
	if (date.getSeconds() < 10) {
		dateTimeString += "0" + date.getSeconds();
	}
	else
		dateTimeString += date.getSeconds();
	
	return dateTimeString;
}

function convertToSQLDateTime (inputDate) {
	return inputDate.getUTCFullYear() + '-' +
	('00' + (inputDate.getUTCMonth()+1)).slice(-2) + '-' +
	('00' + inputDate.getUTCDate()).slice(-2) + ' ' + 
	('00' + inputDate.getUTCHours()).slice(-2) + ':' + 
	('00' + inputDate.getUTCMinutes()).slice(-2) + ':' + 
	('00' + inputDate.getUTCSeconds()).slice(-2);
}