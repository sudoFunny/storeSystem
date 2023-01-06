




function convertJsonSalesDataToCSV (salesData) {

// get itemConfig
	var itemConfigs = salesData.pop()
	// console.log(salesData);
	// console.log(itemConfigs);


// generate templates
	var templates = {};

	// foreach (version in itemConfigs) {
	for (var itemConfigIndex = 0; itemConfigIndex < itemConfigs.length; itemConfigIndex++) {

		if (Object.keys(templates).includes(itemConfigs[itemConfigIndex].version)) {
			break;
		}
		else {
			templates[itemConfigs[itemConfigIndex].version.toString()] = createTemplate(itemConfigs[itemConfigIndex]);
		}
		
	}

	// console.log(templates);

	templates = addSalesDataToTemplates(templates, salesData);

	// console.log(templates);

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
			var row = [
				templateEntry.itemDisplayName + " " + templateEntry.dataName + ": " + templateEntry.displayName,
				templateEntry.quantity,
				templateEntry.price
			];

			tables[templateVersion].push(row);

		});


	});

	console.log(tables);
	console.table(tables["1"]);

	var cvsTable = {};

	Object.keys(tables).forEach(tableVersion => {

		cvsTable[tableVersion] = "";

	// make table header
		var headerRow = [
			"Item title",
			"Quantity",
			"Price"
		];
		cvsTable[tableVersion] += headerRow.join(",") + "\n";


		tables[tableVersion].forEach(row => {

			row.forEach(rowValue => {
				if (typeof rowValue === "string" && rowValue.includes(",")) {
					rowValue = "\"" + rowValue + "\"";
				}
			});
		
			cvsTable[tableVersion] += row.join(",") + "\n";

		});

		
	});

	// console.log(cvsTable);




}






function createTemplate (config) {

	var entrys = [];

	config.config.items.forEach(item => {


		item.interface.forEach(interfaceElement => {
			if (interfaceElement.save != undefined || interfaceElement.save) {


				if (interfaceElement.choices != undefined) {

				// what about hotChocolate? if no topping?
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


						// entry.dataName = interfaceElement.dataName;
						entry.quantity = 0;
		
						
						
						entry.itemDataName = item.dataName;
						entry.itemDisplayName = item.displayName;
						
						
		
						entrys.push(entry);
						// console.log(interfaceElement);
					});
				}
				else {
					alert("choices were undefined");
				}
			}
		});
	});

	

	// entrys.itemDataName = 


	// template.version = config.version;

	// console.log(entrys);

	return entrys;
}








function addSalesDataToTemplates (templates, salesData) {



	salesData.forEach(order => {
		// console.log(order);

		// console.log(templates[order.itemConfigVersion]);


		order.contents.forEach(item => {
			// console.log(item);


			// find item in correct template and increment its quantity
			for (var templateEntryIndex = 0; templateEntryIndex < templates[order.itemConfigVersion].length; templateEntryIndex++) {
				// var template = templates[order.itemConfigVersion];

				var entry = templates[order.itemConfigVersion][templateEntryIndex];
				// console.log(entry);

				if (item.name === entry.itemDataName && Object.keys(item).includes(entry.dataName)) {


// need to account for cases like: hotChocolate with all toppings or slushie whose flavor is of many... so basically have an entry for each possible combination of array
					if (Array.isArray(entry.dataNameValue)) {
						
						if (item[entry.dataName].length === entry.dataNameValue.length) {
							entry.quantity += parseInt(item.quantity);
						}
					}
					else if (item[entry.dataName] === entry.dataNameValue) {
						entry.quantity += parseInt(item.quantity);
					}
				}
			}
		});
	});

	return templates;
}





/*
function convertJsonSalesDataToCSV (salesData) {
	
	

// get itemConfig
	var itemConfigs = salesData.pop()
	console.log(salesData);
	console.log(itemConfigs);


	var itemTemplates = [];

// make templates
	salesData.forEach(sale => {
		// console.log(sale.itemConfigVersion);




	// find matching itemConfigVersion
		
		itemConfigs.forEach(configObject => {
			// configObject.config = JSON.parse(configObject.config);

			if (configObject.version == sale.itemConfigVersion) {
				// console.log(JSON.parse(sale.contents));


				// sale.contents = JSON.parse(sale.contents);


				Object.keys(sale.contents).forEach(propertyName => {

					console.log(sale.contents[propertyName]);





					for (var itemIndex = 0; itemIndex < configObject.config.items.length; itemIndex++) {



						// configObject.config.items[itemIndex].interface.forEach(interfaceElement => {
						
						for (var interfaceIndex = 0; interfaceIndex < configObject.config.items[itemIndex].interface.length; interfaceIndex++) {
							var interfaceElement = configObject.config.items[itemIndex].interface[interfaceIndex];
							
							if (interfaceElement.save != undefined || interfaceElement.save) {
								console.log(interfaceElement.dataName);





								console.log(sale.contents[propertyName][interfaceElement.dataName]);
								// break;
							}
						}
						// });
					}
				});








			}
		});
		







		// if (!itemTemplates.length == 0) {
			// var matchingVersonFound = false;
			// itemTemplates.forEach(template => {
			// 	if (template.version == sale.itemConfigVersion) matchingVersonFound = true;
			// });

			// if (!matchingVersonFound) {

			// 	for (var configIndex = 0; configIndex < itemConfigs.length; configIndex++) {

			// 		if (itemConfigs[configIndex].version == sale.itemConfigVersion) {
			// 			itemTemplates.push(new ItemsTemplate(sale.itemConfigVersion, JSON.parse(itemConfigs[configIndex].config)));
			// 			break;
			// 		}
			// 	}
				
			// }
		// }
	});

	// console.log(itemTemplates);




	// salesData.forEach(sale => {
	// 	console.log(sale);
	// });


	// var data = createSalesDataTemplate();



}
*/



class ItemsTemplate {
	
	constructor (version, config) {
		this.version = version;
		this.config = config;



		// this.rows = [];


	// make properties in template
		
		// config.items.forEach(item => {
			
		// });

		// console.log(this.rows);
	}



	fillData (data) {

	}
}







/*





class ItemsTemplate {
	
	constructor (version, config) {
		this.version = version;
		this.config = config;



		this.rows = [];


	// make properties in template
		
		config.items.forEach(item => {
			// console.log(item);
			

			// get each option for item
			// var itemTemplate = {dataName: item.dataName, quantity: 0};
			var itemTemplate = {dataName: item.dataName, variants: []};


			item.interface.forEach(interfaceElement => {

				// if (interfaceElement.dataName == undefined) return 0;
				var itemVeriant = {dataName: interfaceElement.dataName}; 

				if (interfaceElement.hasOwnProperty("choices")) {
					interfaceElement.choices.forEach(interfaceOption => {
						itemVeriant["dataName"] = interfaceOption.dataName
						itemVeriant["displayName"] = interfaceOption.displayName
						itemVeriant["price"] = interfaceOption.price
					});
				}

				itemTemplate.variants.push(itemVeriant);
			});

			// itemTemplate.variants.push();

			this.rows.push(itemTemplate);
		});

		// console.log(this.rows);
	}
}



*/












































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