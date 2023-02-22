



class Modal {

	constructor () {

		this.modal = document.createElement("div");
		this.modal.classList.add("modal");
		this.modal.style.display = "none";
		
		this.container = document.createElement("div");
		this.container.classList.add("modal-container");
		this.container.innerHTML = "<span class='close' onclick='modal.disable();'>&times;</span>";

		this.content = document.createElement("div");


		this.container.appendChild(this.content);
		this.modal.appendChild(this.container);

		document.body.insertBefore(this.modal, document.getElementById("container"))
	}
	

	disable () {
		this.modal.style.display = "none";
	}

	enable () {
		this.modal.style.display = "block";
	}

	clearContent () {
		removeAllChildren(this.content);
	}


	showGetSalesData () {

		this.clearContent();
		
		var title = document.createElement("h2");
		title.innerText = "Sales Data";
		title.style.textAlign = "center";
		title.style.marginTop = "50px";


		// section discription
		var dateInputDiscription = document.createElement("h3");
		dateInputDiscription.innerHTML = "Select a range of dates<hr style='max-width: 75%;'>";

		dateInputDiscription.style.textAlign = "center";
		dateInputDiscription.style.marginTop = "50px";




// from div
		var fromInputContainer = document.createElement("div");

		fromInputContainer.style.textAlign = "center";

// from date input
		var labelForFromDateTimeInput = document.createElement("label");
		labelForFromDateTimeInput.htmlFor = "fromDateTimeInput";
		labelForFromDateTimeInput.innerHTML = "From<br>";

		var fromDateTimeInput = document.createElement("input");
		fromDateTimeInput.type = "datetime-local";
		fromDateTimeInput.id = "fromDateTimeInput";
		fromDateTimeInput.step = 1; // so seconds will show... bit odd but ok I guess :/
		fromDateTimeInput.max = convertDateTimeToHTMLFormat(new Date(Date.now()));

		fromDateTimeInput.onchange = () => {
			// update custom time format
			fromDateTimeInput.dispatchEvent(new Event("input"));
		};
		fromDateTimeInput.oninput = () => {
			// update custom time format
			customDateTimeFormatInput.dispatchEvent(new Event("input"));
		};
		

		try {
			if (window.salesDataDate.localFromDate < new Date(Date.now())) {
				fromDateTimeInput.value = convertDateTimeToHTMLFormat(window.salesDataDate.localFromDate);
			}
		} catch (error) {
			console.error("Could not find sales data from time in window");
		}
		


		fromDateTimeInput.classList.add("dateTimeInput");
		

// to quick options
		var fromOptions = JSON.parse('{\
			"Custom": "",\
			"Date": {\
				"Yesterday": "now - 864e5",\
				"Five Days Ago": "now - 864e5 * 5",\
				"Seven Days Ago": "now - 864e5 * 7",\
				"n Days Ago": "now - 864e5 * prompt"\
			},\
			"Time": {\
				"One Hour Ago": "now - 36e5",\
				"n Hours Ago": "now - 36e5 * prompt"\
			}\
		}');

		var fromQuickOptionLabel = document.createElement("label");
		fromQuickOptionLabel.htmlFor = "fromQuickOption";
		fromQuickOptionLabel.innerText = "Quick options:";
		fromQuickOptionLabel.style.marginLeft = "25px";

		var fromQuickOptionSelect = document.createElement("div");
		fromQuickOptionSelect.id = "fromQuickOption";

		fromQuickOptionSelect.classList.add("dropdown");
		fromQuickOptionSelect.innerHTML = "<button id='fromDropDownbutton' class='button buttonPadding' data-for=\"fromQuickOptionSelectDropDown\" onclick='deselectAllDropDowns(\"dropdown\", this);'>Custom</button>";

		var fromQuickOptionSelectDropDown_Container = document.createElement("div");
		fromQuickOptionSelectDropDown_Container.classList.add("dropdown-content-container");
		fromQuickOptionSelectDropDown_Container.classList.add("hidden");
		fromQuickOptionSelectDropDown_Container.id = "fromQuickOptionSelectDropDown_Container";
		fromQuickOptionSelectDropDown_Container.onclick = () => {
			document.getElementById("fromQuickOptionSelectDropDown_Container").classList.toggle("hidden");
		};

		var fromQuickOptionSelectDropDown = document.createElement("div");
		fromQuickOptionSelectDropDown.classList.add("dropdown-content");
		fromQuickOptionSelectDropDown.id = "fromQuickOptionSelectDropDown";


		Object.keys(fromOptions).forEach(optionParentName => {
			var optionParent = fromOptions[optionParentName];
			
			if (typeof optionParent === "object") {
				var group = document.createElement("dl");
				group.innerHTML = "<dt style='cursor: default;'>" + optionParentName + "</dt>";

				Object.keys(optionParent).forEach(optionName => {
					var optionElement = document.createElement("dd");
					optionElement.innerHTML = "<button value='" + optionParent[optionName] + "' onclick='updateGetSalesData(document.getElementById(\"fromDateTimeInput\"), this.value); document.getElementById(\"fromDropDownbutton\").innerText = event.target.innerText;'>" + optionName + "</button>";

					group.appendChild(optionElement);
				});

				fromQuickOptionSelectDropDown.appendChild(group);
			}	
			else {
				var optionElement = document.createElement("button");
				optionElement.innerText = optionParentName;
				optionElement.value = optionParent;

				optionElement.onclick = (event) => {

					updateGetSalesData(document.getElementById("fromDateTimeInput"), event.target.value);
					document.getElementById("fromDropDownbutton").innerText = event.target.innerText;
				};

				fromQuickOptionSelectDropDown.appendChild(optionElement);
			}
		});
		

// append from inputs to fromInputContainer
		fromQuickOptionSelectDropDown_Container.appendChild(fromQuickOptionSelectDropDown);
		fromQuickOptionSelect.appendChild(fromQuickOptionSelectDropDown_Container);

		fromInputContainer.appendChild(labelForFromDateTimeInput);
		fromInputContainer.appendChild(fromDateTimeInput);

		fromInputContainer.appendChild(fromQuickOptionLabel);
		fromInputContainer.appendChild(fromQuickOptionSelect);
		






// to div
		var toInputContainer = document.createElement("div");

		toInputContainer.style.textAlign = "center";
		toInputContainer.style.marginTop = "15px";

// to datetime input
		var labelForToDateTimeInput = document.createElement("label");
		labelForToDateTimeInput.htmlFor = "toDateTimeInput";
		labelForToDateTimeInput.innerHTML = "To<br>";

		var toDateTimeInput = document.createElement("input");
		toDateTimeInput.type = "datetime-local";
		toDateTimeInput.id = "toDateTimeInput";
		toDateTimeInput.step = 1; // so seconds will show... bit odd but ok I guess :/
		toDateTimeInput.max = convertDateTimeToHTMLFormat(new Date(Date.now()));

		toDateTimeInput.onchange = () => {
			// update custom time format
			toDateTimeInput.dispatchEvent(new Event("input"));
		};
		toDateTimeInput.oninput = () => {
			// update custom time format
			customDateTimeFormatInput.dispatchEvent(new Event("input"));
		};

		try {
			if (window.salesDataDate.localToDate < new Date(Date.now())) {
				toDateTimeInput.value = convertDateTimeToHTMLFormat(window.salesDataDate.localToDate);
			}
		} catch (error) {
			console.error("Could not find sales data to time in window");
		}

		toDateTimeInput.classList.add("dateTimeInput");

// to quick options
		var toOptions = JSON.parse('{\
			"Now": "now",\
			"Custom": "",\
			"Date": {\
				"Yesterday": "now - 864e5",\
				"Five Days Ago": "now - 864e5 * 5",\
				"Seven Days Ago": "now - 864e5 * 7",\
				"n Days Ago": "now - 864e5 * prompt"\
			},\
			"Time": {\
				"One Hour Ago": "now - 36e5",\
				"n Hours Ago": "now - 36e5 * prompt"\
			}\
		}');

		var toQuickOptionLabel = document.createElement("label");
		toQuickOptionLabel.htmlFor = "toQuickOption";
		toQuickOptionLabel.innerText = "Quick options:";
		toQuickOptionLabel.style.marginLeft = "25px";

		var toQuickOptionSelect = document.createElement("div");
		toQuickOptionSelect.id = "toQuickOption";

		toQuickOptionSelect.classList.add("dropdown");
		toQuickOptionSelect.innerHTML = "<button id='toDropDownbutton' class='button buttonPadding' data-for=\"toQuickOptionSelectDropDown\" onclick='deselectAllDropDowns(\"dropdown\", this);'>Now</button>";


		var toQuickOptionSelectDropDown_Container = document.createElement("div");
		toQuickOptionSelectDropDown_Container.classList.add("dropdown-content-container");
		toQuickOptionSelectDropDown_Container.classList.add("hidden");
		toQuickOptionSelectDropDown_Container.id = "toQuickOptionSelectDropDown_Container";
		toQuickOptionSelectDropDown_Container.onclick = () => {
			document.getElementById("toQuickOptionSelectDropDown_Container").classList.toggle("hidden");
		};

		var toQuickOptionSelectDropDown = document.createElement("div");
		toQuickOptionSelectDropDown.classList.add("dropdown-content");
		toQuickOptionSelectDropDown.id = "toQuickOptionSelectDropDown";

		Object.keys(toOptions).forEach(optionParentName => {
			var optionParent = toOptions[optionParentName];
			
			if (typeof optionParent === "object") {
				var group = document.createElement("dl");
				group.innerHTML = "<dt style='cursor: default;'>" + optionParentName + "</dt>";

				Object.keys(optionParent).forEach(optionName => {
					var optionElement = document.createElement("dd");
					optionElement.innerHTML = "<button value='" + optionParent[optionName] + "' onclick='updateGetSalesData(document.getElementById(\"toDateTimeInput\"), this.value); document.getElementById(\"toDropDownbutton\").innerText = event.target.innerText;'>" + optionName + "</button>";

					group.appendChild(optionElement);
				});

				toQuickOptionSelectDropDown.appendChild(group);
			}
			else {
				var optionElement = document.createElement("button");
				optionElement.innerText = optionParentName;
				optionElement.value = optionParent;

				optionElement.onclick = (event) => {
					
					updateGetSalesData(document.getElementById("toDateTimeInput"), event.target.value);
					document.getElementById("toDropDownbutton").innerText = event.target.innerText;
				};

				toQuickOptionSelectDropDown.appendChild(optionElement);
			}
		});



// append to inputs to toInputContainer
		toQuickOptionSelectDropDown_Container.appendChild(toQuickOptionSelectDropDown);
		toQuickOptionSelect.appendChild(toQuickOptionSelectDropDown_Container);
		
		toInputContainer.appendChild(labelForToDateTimeInput);
		toInputContainer.appendChild(toDateTimeInput);

		toInputContainer.appendChild(toQuickOptionLabel);
		toInputContainer.appendChild(toQuickOptionSelect);






// Table(s) options

		var addionalOptionsDiscription = document.createElement("h3");
		addionalOptionsDiscription.innerHTML = "Select addional options<hr style='max-width: 75%;'>";

		addionalOptionsDiscription.style.textAlign = "center";
		addionalOptionsDiscription.style.marginTop = "50px";


		var tableOptionsContainer = document.createElement("div");
		

		var tableOptionsTable = document.createElement("table");
		tableOptionsTable.style.borderCollapse = "collapse";
		tableOptionsTable.style.textAlign = "center";
		tableOptionsTable.style.marginLeft = "auto";
		tableOptionsTable.style.marginRight = "auto";

		var tableOptionsTableOptionsTr = document.createElement("tr");
		tableOptionsTableOptionsTr.innerHTML = "\
		<td></td>\
		<td style='padding-left: 20px; padding-right: 20px;'>" + wordWrap("Apply when displaying or printing", 5, "<br>") + "</td>\
		<td style='padding-left: 20px; padding-right: 20px;'>" + wordWrap("Apply when downloading", 5, "<br>") + "</td>\
		";

		tableOptionsTable.appendChild(tableOptionsTableOptionsTr);


		var useTrueDefault = false;

		try {
			// get default table options
			var tableOptions = JSON.parse(localStorage.getItem("tableOptions"));
			if (tableOptions == null) throw new Error;
		} catch (error) {
			useTrueDefault = true;
		}
		

		var tableOptionsTemplate = [
			{
				"label": "Convert cent to dollar",
				"options": [
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.convertToDollar.when.displaying,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "convertToDollar",
							"data-table-options-when": "displaying"
						}
					},
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.convertToDollar.when.downloading,
						"attributes":
							{
								"data-table-options": "",
								"data-table-options-apply": "convertToDollar",
								"data-table-options-when": "downloading"
							}
					}
				]
			},
			{
				"label": "Show total column",
				"options": [
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.displayTotalColumn.when.displaying,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "displayTotalColumn",
							"data-table-options-when": "displaying"
						}
					},
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.displayTotalColumn.when.downloading,
						"attributes":
							{
								"data-table-options": "",
								"data-table-options-apply": "displayTotalColumn",
								"data-table-options-when": "downloading"
							}
					}
				]
			},
			{
				"label": "Show total row",
				"options": [
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.displayTotalRow.when.displaying,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "displayTotalRow",
							"data-table-options-when": "displaying"
						}
					},
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.displayTotalRow.when.downloading,
						"attributes":
							{
								"data-table-options": "",
								"data-table-options-apply": "displayTotalRow",
								"data-table-options-when": "downloading"
							}
					}
				]
			},
			{
				"label": "Show date and time",
				"options": [
					{
						"id": "",
						"checked": useTrueDefault ? true : tableOptions.displayDateTime.when.displaying,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "displayDateTime",
							"data-table-options-when": "displaying",
							"onclick": "if (this.checked) document.getElementById('customDateTimeFormatContainer').style.display = 'table'; else document.getElementById('customDateTimeFormatContainer').style.display = 'none';"
						}
					}
					// ,{
					// 	"id": "",
					// 	"checked": useTrueDefault ? true : tableOptions.displayDateTime.when.downloading,
					// 	"attributes":
					// 		{
					// 			"data-table-options": "",
					// 			"data-table-options-apply": "displayDateTime",
					// 			"data-table-options-when": "downloading"
					// 		}
					// }
				]
			}
		];


		tableOptionsTemplate.forEach(optionTemplate => {
			


			var entry = document.createElement("tr");

			// label
			entry.innerHTML += "<td><span style='float: right;'>" + optionTemplate.label + "</span></td>";
			

			optionTemplate.options.forEach(entryOption => {
				
				var optionElementCell = document.createElement("td");
				var optionElement = document.createElement("input");


				optionElement.type = "checkbox";
				optionElement.checked = entryOption.checked;

				optionElement.style.cursor = "pointer";
				
				Object.keys(entryOption.attributes).forEach(attributeKey => {
					optionElement.setAttribute(attributeKey, entryOption.attributes[attributeKey]);

					// to activate any onclick event listeners
					setTimeout(() => {
						optionElement.click();
						optionElement.click();
					}, 50);
					// find better way ^
					
				});

				optionElementCell.appendChild(optionElement);
				entry.appendChild(optionElementCell);
			});


			tableOptionsTable.appendChild(entry);
		});

		
		tableOptionsContainer.appendChild(tableOptionsTable);


// Custom date time format

		var customDateTimeFormat = document.createElement("div");
		customDateTimeFormat.id = "customDateTimeFormatContainer";
		customDateTimeFormat.innerHTML = "<h4 style='text-align: center;'>Make a date time format<hr style='max-width: 75%;'></h4>";

		customDateTimeFormat.style.display = "table";
		customDateTimeFormat.style.marginLeft = "auto";
		customDateTimeFormat.style.marginRight = "auto";


		// input
		var customDateTimeFormatInput = document.createElement("input");
		customDateTimeFormatInput.id = "customDateTimeFormatInput";
		customDateTimeFormatInput.type = "text";
		customDateTimeFormatInput.classList.add("dateTimeInput");

		customDateTimeFormatInput.value = useTrueDefault ? "%F" : tableOptions.displayDateTime.customDateTimeFormat;
		
		customDateTimeFormatInput.oninput = () => {

			var masterText = "<b>Preview</b><br>Sales from:<br>%from%<br>To:<br>%to%";
			var customFormatText = customDateTimeFormatInput.value;
			
			var dateRange = [fromDateTimeInput.value, toDateTimeInput.value];

			for (var dateRangeIndex = 0; dateRangeIndex < dateRange.length; dateRangeIndex++) {
				var date = new Date(dateRange[dateRangeIndex]);

				if (date == "Invalid Date") {
					dateRange[dateRangeIndex] = "Invalid Date";
					continue;
				}

				dateRange[dateRangeIndex] = dateFromFormat(customFormatText, date);
			}

			masterText = masterText.replaceAll("%from%", dateRange[0]);
			masterText = masterText.replaceAll("%to%", dateRange[1]);

			customDateTimeFormatPreview.innerHTML = masterText;

			
		};

		

		// preview
		var customDateTimeFormatPreview = document.createElement("p");

		// just read it
		customDateTimeFormatInput.dispatchEvent(new Event("input"));

		// customDateTimeFormatPreview.innerText = new Date().toLocaleString();

		// syntax ref
		var customDateTimeFormatSyntax = document.createElement("details");
		customDateTimeFormatSyntax.innerHTML = "<summary style='cursor: pointer;'>Format syntax</summary><p></p>";

		customDateTimeFormatSyntax.children[1].innerHTML = "\
		Quick Options<br>\
			&emsp;%F - Auto format date and time based on location<br>\
			&emsp;%D - Auto format date based on location<br>\
			&emsp;%T - Auto format time based on location<br>\
			&emsp;%U - Date in UTC time<br>\
			&emsp;%s - Date in ISO 8601<br>\
			&emsp;%L - Date in HTML format<br>\
		<br>\
		Seconds<br>\
			&emsp;%S - Second of the minute<br>\
		<br>\
		Minutes<br>\
			&emsp;%M - Minute of the hour<br>\
		<br>\
		Hours<br>\
			&emsp;%I - Hour of the day (12 hour)<br>\
			&emsp;%H - Hour of the day (24 hour)<br>\
		<br>\
		Days<br>\
			&emsp;%d - Day of the month<br>\
			&emsp;%A - Full weekday (Monday)<br>\
			&emsp;%a - Abbreviated weekday (Mon)<br>\
		<br>\
		Months<br>\
			&emsp;%m - Numerical month of year (09)<br>\
			&emsp;%B - Name of the month (February)<br>\
			&emsp;%b - Abbreviated name of the month (Feb)<br>\
		<br>\
		Years<br>\
			&emsp;%y - Last two digits of year (23)<br>\
			&emsp;%Y - Full year (2023)<br>\
		<br>\
		Others<br>\
			&emsp;%p - Lower case am or pm<br>\
			&emsp;%P - Upper case AM or PM<br>\
			&emsp;%Z - Abbreviated time zone (EST, PST, UTC...)<br>\
			&emsp;%% - The % symbol<br>\
		";


		customDateTimeFormat.appendChild(customDateTimeFormatInput);
		customDateTimeFormat.appendChild(customDateTimeFormatPreview);
		customDateTimeFormat.appendChild(customDateTimeFormatSyntax);


		tableOptionsContainer.appendChild(customDateTimeFormat);


// save addional options
		var saveAddionalOptionsDiscription = document.createElement("h3");
		saveAddionalOptionsDiscription.style.textAlign = "center";
		saveAddionalOptionsDiscription.style.marginTop = "50px";

		saveAddionalOptionsDiscription.innerHTML = "Save addional options<hr style='max-width: 75%'>";
		
		// container and buttons
		var saveAddionalOptionsContainer = document.createElement("div");
		saveAddionalOptionsContainer.style.textAlign = "center";


		var saveTableOptionsButton = document.createElement("button");

		saveTableOptionsButton.innerHTML = "Set current choices as default";
		saveTableOptionsButton.classList.add("button");
		
		saveTableOptionsButton.onclick = () => {
			var tableOptionsElements = document.querySelectorAll("[data-table-options]");
		
			var tableOptions = {
				"convertToDollar": {
					"when": {
						"displaying": false,
						"downloading": false
					}
				},
				"displayTotalColumn": {
					"when": {
						"displaying": false,
						"downloading": false
					}
				},
				"displayTotalRow": {
					"when": {
						"displaying": false,
						"downloading": false
					}
				},
				"displayDateTime": {
					"when": {
						"displaying": false,
						"downloading": false
					},
					"customDateTimeFormat": "%F"
				}
			};
					
			tableOptionsElements.forEach(optionElement => {
				tableOptions[optionElement.getAttribute("data-table-options-apply")].when[optionElement.getAttribute("data-table-options-when")] = optionElement.checked;
		
				if (optionElement.getAttribute("data-table-options-apply") == "displayDateTime" && optionElement.checked) {
					tableOptions.displayDateTime.customDateTimeFormat = document.getElementById("customDateTimeFormatInput").value;
				}
			});
		
		
			localStorage.setItem("tableOptions", JSON.stringify(tableOptions));
			saveTableOptionsButton.innerHTML = "Addional options saved";
			setTimeout(() => {
				saveTableOptionsButton.innerHTML = "Set current choices as default";
			}, 2500);
		};
		
		var resetTableOptionsButton = document.createElement("button");
		
		resetTableOptionsButton.innerHTML = "Reset current choices to true default";
		resetTableOptionsButton.classList.add("button");
		
		resetTableOptionsButton.onclick = () => {
			localStorage.removeItem("tableOptions");
			
			window.salesDataDate = {
				localFromDate: new Date(document.getElementById("fromDateTimeInput").value),
				localToDate: new Date(document.getElementById("toDateTimeInput").value)
			};
		
			this.showGetSalesData();
			resetTableOptionsButton.innerHTML = "Addional options reset";
			setTimeout(() => {
				resetTableOptionsButton.innerHTML = "Reset current choices to true default";
			}, 2500);
		};
		
		
		saveAddionalOptionsContainer.appendChild(saveTableOptionsButton);
		saveAddionalOptionsContainer.appendChild(document.createElement("br"));
		saveAddionalOptionsContainer.appendChild(resetTableOptionsButton);


// Submit button

		var submitContainer = document.createElement("div");
		submitContainer.style.textAlign = "center";
		submitContainer.style.marginTop = "50px";


		var submitButton = document.createElement("button");
		submitButton.innerText = "Submit Request";
		submitButton.classList.add("button");
		submitButton.style.padding = "5px 10px";


		submitButton.onclick = () => {
			var fromDateTimeInput = document.getElementById("fromDateTimeInput");
			var toDateTimeInput = document.getElementById("toDateTimeInput");

			var fromDate = new Date(fromDateTimeInput.value);
			var toDate = new Date(toDateTimeInput.value);


			if (fromDate == "Invalid Date" || toDate == "Invalid Date") {
				alert("Invalid Date:\nEither or both From Date and To Date are invalid");
				return 0;
			}

			if (fromDate > toDate) {
				alert("From Date excedes To Date:\nTo Date must be later than From Date\n\"" + fromDate.toLocaleString() + "\" is greater than \"" + toDate.toLocaleString() + "\"");
				return 0;
			}

			window.salesDataDate = {
				fromDate: convertToSQLDateTime(fromDate),
				toDate: convertToSQLDateTime(toDate),
				localFromDate: fromDate,
				localToDate: toDate,
				customDateFormat: customDateTimeFormatInput.value
			};

			$.ajax({
				url: "getSalesData.php",
				type: "POST",
				dataType: "JSON",
				data: {fromDate: convertToSQLDateTime(fromDate), toDate: convertToSQLDateTime(toDate)},
				success: function(response){

					if (response != 0) {
					// get table display options
						var tableOptionsElements = document.querySelectorAll("[data-table-options]");

						var tableOptions = {
							"convertToDollar": {
								"when": {
									"displaying": false,
									"downloading": false
								}
							},
							"displayTotalColumn": {
								"when": {
									"displaying": false,
									"downloading": false
								}
							},
							"displayTotalRow": {
								"when": {
									"displaying": false,
									"downloading": false
								}
							},
							"displayDateTime": {
								"when": {
									"displaying": false,
									"downloading": false
								}
							}
						};
				
						tableOptionsElements.forEach(optionElement => {
							tableOptions[optionElement.getAttribute("data-table-options-apply")].when[optionElement.getAttribute("data-table-options-when")] = optionElement.checked;
						});
						
						modal.displayTable(convertJsonSalesDataToTable(response), tableOptions);
					}
					else
						alert("No data to return");
				}
			});

		}

		submitContainer.appendChild(submitButton);


		this.content.appendChild(title);

		this.content.appendChild(dateInputDiscription);

		this.content.appendChild(fromInputContainer);
		this.content.appendChild(toInputContainer);


		this.content.appendChild(addionalOptionsDiscription);
		this.content.appendChild(tableOptionsContainer);

		this.content.appendChild(saveAddionalOptionsDiscription);
		this.content.appendChild(saveAddionalOptionsContainer);
		

		this.content.appendChild(submitContainer);

		updateGetSalesData(document.getElementById("toDateTimeInput"), "now");

		document.getElementById("fromQuickOptionSelectDropDown").style.left = document.getElementById("fromDropDownbutton").getBoundingClientRect().left + "px";
		document.getElementById("fromQuickOptionSelectDropDown").style.top = document.getElementById("fromDropDownbutton").getBoundingClientRect().top + document.getElementById("fromDropDownbutton").getBoundingClientRect().height + "px";
		
		document.getElementById("toQuickOptionSelectDropDown").style.left = document.getElementById("toDropDownbutton").getBoundingClientRect().left + "px";
		document.getElementById("toQuickOptionSelectDropDown").style.top = document.getElementById("toDropDownbutton").getBoundingClientRect().top + document.getElementById("toDropDownbutton").getBoundingClientRect().height + "px";
	}











	displayTable (tables, tableOptions) {

		
		this.clearContent();

		var title = document.createElement("h2");
		title.innerText = "Sales Data";
		title.style.textAlign = "center";
		title.style.marginTop = "50px";

		this.content.appendChild(title);
		

		// make new object from tables
		var downloadTables = JSON.parse(JSON.stringify(tables));
		

	// for each table
		Object.keys(tables).forEach(tableVersion => {

			
			var tableOptionsTr = document.createElement("tr");
			var tableOptionsCell = document.createElement("td");
			tableOptionsCell.colSpan = "9999";
				

				
			// display table version if there are more than one
			if (Object.keys(tables).length > 1) {
				tableOptionsCell.innerText = "Item config version: " + tableVersion;
			}


			var printButton = document.createElement("button");
			printButton.innerText = "Print table";
			printButton.classList.add("button");
			printButton.style.float = "right";

			printButton.onclick = (event) => {

				var table = event.target.parentElement.parentElement.parentElement;

				var printTable = document.createElement("table");
				printTable.classList.add("printTable");

				for (var rowIndex = 1; rowIndex < table.children.length; rowIndex++) {
					printTable.appendChild(table.children[rowIndex].cloneNode());
					printTable.children[rowIndex - 1].innerHTML = table.children[rowIndex].innerHTML;
				}

				// hide all elements
				for (var elementIndex = 0; elementIndex < document.body.children.length; elementIndex++) {
					if (!["SCRIPT", "STYLE"].includes(document.body.children[elementIndex].tagName)) {
						document.body.children[elementIndex].style.display = "none";
					}
				}

				// make description and options for this view
				// <div id="printOrEditDescription"><h2>Print and or edit table</h2><p>You can edit the quantity field by simply clicking on the cell and start typing, when you are done just press enter, and it will automatically process the new values.<br>Note that you can use math operators in the editable fields, however "+" and "-" are the only ones allowed.<br>Example: "1+2"</p><button class="button">Print</button></div>

				document.body.appendChild(printTable);
				window.print();
					
				printTable.remove();

				// unhide all elements
				for (var elementIndex = 0; elementIndex < document.body.children.length; elementIndex++) {
					if (!["SCRIPT", "STYLE"].includes(document.body.children[elementIndex].tagName)) {
						document.body.children[elementIndex].style.display = "block";
					}
				}
			};


			var downloadButton = document.createElement("button");
			downloadButton.innerText = "Download table";
			downloadButton.classList.add("button");
			downloadButton.style.float = "right";


			downloadButton.setAttribute("data-table-data", JSON.stringify(downloadTables[tableVersion].map(entry => entry.slice(1, entry.length))));

			downloadButton.setAttribute("data-table-header", JSON.stringify(["Item title", "Quantity", "Price"]));

			downloadButton.onclick = (event) => {

				var table = JSON.parse(event.target.getAttribute("data-table-data"));
				var csvTable = "";

				// make table header
				csvTable += JSON.parse(event.target.getAttribute("data-table-header")).join(",") + "\n";


				table.forEach(row => {

					for (var rowValueIndex = 0; rowValueIndex < row.length; rowValueIndex++) {
						if (typeof row[rowValueIndex] === "string" && row[rowValueIndex].includes(",")) {
							row[rowValueIndex] = "\"" + row[rowValueIndex] + "\"";
						}
					}

					csvTable += row.join(",") + "\n";

				});


				var a = document.createElement("a");
				a.href = URL.createObjectURL(new Blob([csvTable]));


				var locale = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
                var options = {timeZoneName: "short"};


				var fileName = prompt("Name this file", "Sales data from " + window.salesDataDate.localFromDate.toLocaleString(locale, options).replaceAll("/", "_").replaceAll(":", "_") + " to " + window.salesDataDate.localToDate.toLocaleString(locale, options).replaceAll("/", "_").replaceAll(":", "_") + ".csv");

				if (fileName === "") fileName = "Sales data from " + window.salesDataDate.localFromDate.toLocaleString(locale, options).replaceAll("/", "_").replaceAll(":", "_") + " to " + window.salesDataDate.localToDate.toLocaleString(locale, options).replaceAll("/", "_").replaceAll(":", "_") + ".csv";

				if (fileName.substring(fileName.length - 4, fileName.length) != ".csv") fileName += ".csv";

				a.setAttribute("download", fileName);
				a.style.display = "none";
				document.body.appendChild(a);
				a.click();
				a.remove();

			};


			tableOptionsCell.appendChild(downloadButton);
			tableOptionsCell.appendChild(printButton);


			tableOptionsTr.appendChild(tableOptionsCell);



			var table = document.createElement("table");
			table.style.borderCollapse = "collapse";
			table.style.borderStyle = "ridge";
			table.style.marginLeft = "auto";
			table.style.marginRight = "auto";
			table.style.marginBottom = "50px";



			var tableHeader = document.createElement("tr");
			tableHeader.innerHTML = "<td>Item title</td><td>Quantity</td><td>Price</td>";




			// apply table options
			// when displaying
			tables[tableVersion].forEach(entry => {

				if (tableOptions.displayTotalColumn.when.displaying) {

					if (tableHeader.children[tableHeader.children.length - 1].innerText != "Total") {
						tableHeader.innerHTML += "<td>Total</td>";
					}

					if (entry[0].type === "money") {
						entry.push(parseInt(entry[entry.length - 2]));
					}
					else
						entry.push(parseInt(entry[entry.length - 2]) * parseInt(entry[entry.length - 1]));
				}



				if (tableOptions.displayTotalRow.when.displaying) {
					
					if (tables[tableVersion][tables[tableVersion].length - 1][1] != "Total") {
						// add new row

						if (tableOptions.displayTotalColumn.when.displaying) {
							tables[tableVersion].push([{}, "Total", 0, "", 0]);
						}
						else
							tables[tableVersion].push([{}, "Total", 0, ""]);
					}



					if (tableOptions.displayTotalColumn.when.displaying) {
						if (entry[0].type != "money") {

							tables[tableVersion][tables[tableVersion].length - 1][2] = parseInt(entry[2]) + parseInt(tables[tableVersion][tables[tableVersion].length - 1][2]);
						}

						tables[tableVersion][tables[tableVersion].length - 1][4] = parseInt(entry[4]) + parseInt(tables[tableVersion][tables[tableVersion].length - 1][4]);
					}
					
				}



				for (var tableCellIndex = 2; tableCellIndex < entry.length; tableCellIndex++) {

					if (tableOptions.convertToDollar.when.displaying) {
						if (entry[0].type === "money" || tableCellIndex > 2) {

							entry[tableCellIndex] = centToDollar(entry[tableCellIndex]);
						}
					}
				}


				// display date time
				if (tableOptions.displayDateTime.when.displaying) {

					if (table.getAttribute("displayDateTime") != 1) {
						var dateTimeElement = document.createElement("tr");


						var masterText = "Sales from:<br>%from%<br>To:<br>%to%";
						var customFormatText = window.salesDataDate.customDateFormat;
						
						var dateRange = [window.salesDataDate.localFromDate, window.salesDataDate.localToDate];

						for (var dateRangeIndex = 0; dateRangeIndex < dateRange.length; dateRangeIndex++) {
							var date = new Date(dateRange[dateRangeIndex]);

							if (date == "Invalid Date") {
								dateRange[dateRangeIndex] = "Invalid Date";
								continue;
							}
							
							dateRange[dateRangeIndex] = dateFromFormat(customFormatText, date);
						}

						masterText = masterText.replaceAll("%from%", dateRange[0]);
						masterText = masterText.replaceAll("%to%", dateRange[1]);

						dateTimeElement.innerHTML = "<td colspan=9999>" + masterText + "</td>";
						
						table.appendChild(dateTimeElement);
						table.setAttribute("displayDateTime", 1);
					}
				}
			});


			// when downloading
			downloadTables[tableVersion].forEach(entry => {

				if (tableOptions.displayTotalColumn.when.downloading) {
		
					// this is horrific and so is everything about this table but soon I'll be changing how I store sales data and I'll have to rewrite so whatever
					if (!JSON.parse(downloadButton.getAttribute("data-table-header")).includes("Total")) {
						downloadButton.setAttribute("data-table-header", JSON.stringify(["Item title", "Quantity", "Price", "Total"]));
					}

					if (entry[0].type === "money") {
						entry.push(parseInt(entry[entry.length - 2]));
					}
					else
						entry.push(parseInt(entry[entry.length - 2]) * parseInt(entry[entry.length - 1]));
				}



				if (tableOptions.displayTotalRow.when.downloading) {
						
					if (downloadTables[tableVersion][downloadTables[tableVersion].length - 1][1] != "Total") {
						// add new row

						if (tableOptions.displayTotalColumn.when.downloading) {
							downloadTables[tableVersion].push([{}, "Total", 0, "", 0]);
						}
						else
							downloadTables[tableVersion].push([{}, "Total", 0, ""]);
					}


					if (tableOptions.displayTotalColumn.when.downloading) {
						if (entry[0].type != "money") {

							downloadTables[tableVersion][downloadTables[tableVersion].length - 1][2] = parseInt(entry[2]) + parseInt(downloadTables[tableVersion][downloadTables[tableVersion].length - 1][2]);
						}

						downloadTables[tableVersion][downloadTables[tableVersion].length - 1][4] = parseInt(entry[4]) + parseInt(downloadTables[tableVersion][downloadTables[tableVersion].length - 1][4]);
					}
				}



				for (var tableCellIndex = 2; tableCellIndex < entry.length; tableCellIndex++) {

					if (tableOptions.convertToDollar.when.downloading) {
						if (entry[0].type === "money" || tableCellIndex > 2) {

							entry[tableCellIndex] = centToDollar(entry[tableCellIndex]);
						}
					}
				}
			});


		// for total row at bottom
			if (tableOptions.convertToDollar.when.displaying && tableOptions.displayTotalRow.when.displaying) {
				tables[tableVersion][tables[tableVersion].length - 1][4] = centToDollar(tables[tableVersion][tables[tableVersion].length - 1][4]);
			}

			
			// for total row at bottom
			if (tableOptions.convertToDollar.when.downloading && tableOptions.displayTotalRow.when.downloading) {
				downloadTables[tableVersion][downloadTables[tableVersion].length - 1][4] = centToDollar(downloadTables[tableVersion][downloadTables[tableVersion].length - 1][4]);
			}

			downloadButton.setAttribute("data-table-data", JSON.stringify(downloadTables[tableVersion].map(entry => entry.slice(1, entry.length))));


			tables[tableVersion].forEach(tableRow => {
				var tr = document.createElement("tr");


				for (var tableCellIndex = 1; tableCellIndex < tableRow.length; tableCellIndex++) {
					var td = document.createElement("td");

					
					if (tableCellIndex > 2 && tableRow[tableCellIndex][0] === "$") {
						td.style.textAlign = "right";
					}
					
					if (typeof tableRow[tableCellIndex] === "string") td.innerText = wordWrap(tableRow[tableCellIndex], 50, "\n");
					else
						td.innerText = tableRow[tableCellIndex];
					
					if (tableCellIndex > 1 && td.innerText[0] === "$") {
						td.innerHTML = td.innerText.replaceAll("$", "<span style='float: left; margin-left: 5px;'>$</span>");
					}

					tr.appendChild(td);
				}

				table.appendChild(tr);
			});
			
			
			if (table.getAttribute("displayDateTime") == 1) table.insertBefore(tableHeader, table.children[1]);
			else table.insertBefore(tableHeader, table.children[0]);

			table.insertBefore(tableOptionsTr, table.children[0]);

			this.content.appendChild(table);
		});
	}


























	async editCurrentItemConfig () {
		this.clearContent();


		var title = document.createElement("h2");
		title.innerText = "Edit Current Item Config";
		title.style.textAlign = "center";
		title.style.marginTop = "50px";

		this.content.appendChild(title);





		var textContainer = document.createElement("div");


		var currentItemConfigVersion = document.createElement("p");
		currentItemConfigVersion.id = "currentItemConfigVersion";
		


	// is mouse over
		var mouseInside = {
			"textArea": false,
			"lineNumberColumn": false
		};


		var textEditorTable = document.createElement("table");
		textEditorTable.style.borderCollapse = "collapse";

		textEditorTable.classList.add("textEditor");




		var editorRow = document.createElement("tr");


		var lineNumberCell = document.createElement("td");
		lineNumberCell.style.padding = "0px";

	// line numbers
		var lineNumberColumn = document.createElement("pre");

		lineNumberColumn.id = "lineNumberColumn";


		lineNumberColumn.addEventListener("mouseover", function (event) {
			mouseInside.lineNumberColumn = true;
		}, false);

		lineNumberColumn.addEventListener("mouseleave", function (event) {
			mouseInside.lineNumberColumn = false;
		}, false);

		lineNumberColumn.onscroll = () => {
			if (mouseInside.lineNumberColumn) {
				textArea.scrollTop = lineNumberColumn.scrollTop;
			}
		};

		lineNumberCell.appendChild(lineNumberColumn);






		var textAreaCell = document.createElement("td");
		textAreaCell.style.padding = "0px";
		textAreaCell.style.width = "100%";


		var textArea = document.createElement("textarea");

		textArea.id = "currentItemConfigTextArea";

		textArea.classList.add("textEditorField");

		textArea.addEventListener("mouseover", function (event) {
			mouseInside.textArea = true
		}, false);

		textArea.addEventListener("mouseleave", function (event) {
			mouseInside.textArea = false;
		}, false);

		textArea.onscroll = () => {
			if (mouseInside.textArea) {
				lineNumberColumn.scrollTop = textArea.scrollTop;
			}
		};


		// textArea.setAttribute("data-config-origin", JSON.stringify({}));

		
	// get cursor position
		textArea.onclick = () => {
			var selectionStart = $("#currentItemConfigTextArea").prop("selectionStart");

			var selectionEnd = $("#currentItemConfigTextArea").prop("selectionEnd");

			var textBeforeSelectionStart = currentItemConfigTextArea.value.substring(0, selectionStart);
			var textBeforeSelectionEnd = currentItemConfigTextArea.value.substring(0, selectionEnd);

			var linesBeforeSelectionStart = textBeforeSelectionStart.split("\n");
			var linesBeforeSelectionEnd = textBeforeSelectionEnd.split("\n");

			cursorPositionElement.innerText = "Ln " + linesBeforeSelectionStart.length + ", Col " + parseInt(linesBeforeSelectionStart[linesBeforeSelectionStart.length - 1].length + 1);

			if (selectionStart != selectionEnd) {
				cursorPositionElement.innerText += " (" + (selectionEnd - selectionStart) + " selected)"
			}


			var selectedElements = document.getElementsByClassName("selectedLine");


			for (var elementIndex = selectedElements.length - 1; elementIndex >= 0; elementIndex--) {
				selectedElements[elementIndex].classList.remove("selectedLine");
			}


			// show selected lines
			for (var lineIndex = linesBeforeSelectionStart.length; lineIndex < linesBeforeSelectionEnd.length + 1; lineIndex++) {
				lineNumberColumn.children[lineIndex - 1].classList.add("selectedLine");
			}
		};


		$.ajax({
			url: "../includes/getItemConfig.php",
			type: "POST",
			dataType: "JSON",
			success: function(itemConfig) {
				itemConfig[0].config = JSON.parse(itemConfig[0].config);

				// textArea.setAttribute("data-config-origin", JSON.stringify(itemConfig[0]));

				var lines = JSON.stringify(itemConfig[0].config, null, 4);

				currentItemConfigTextArea.innerHTML = lines;

				currentItemConfigVersion.innerText = "Current item config version: " + itemConfig[0].version;



				lineNumberColumn.innerHTML = [...Array(lines.split("\n").length).keys()].map(x => "<div>" + (x += 1) + "</div>").join("");
				
				lineNumberColumn.children[lineNumberColumn.children.length - 1].style.paddingLeft = "15px";

				lineNumberColumn.style.height = currentItemConfigTextArea.offsetHeight;

				

				

			// get cursor position
				$("#currentItemConfigTextArea").on("keyup", function() {
					var selectionStart = $("#currentItemConfigTextArea").prop("selectionStart");

					var selectionEnd = $("#currentItemConfigTextArea").prop("selectionEnd");

					var textBeforeSelectionStart = currentItemConfigTextArea.value.substring(0, selectionStart);
					var textBeforeSelectionEnd = currentItemConfigTextArea.value.substring(0, selectionEnd);

					var linesBeforeSelectionStart = textBeforeSelectionStart.split("\n");
					var linesBeforeSelectionEnd = textBeforeSelectionEnd.split("\n");

					cursorPositionElement.innerText = "Ln " + linesBeforeSelectionStart.length + ", Col " + parseInt(linesBeforeSelectionStart[linesBeforeSelectionStart.length - 1].length + 1);

					if (selectionStart != selectionEnd) {
						cursorPositionElement.innerText += " (" + (selectionEnd - selectionStart) + " selected)"
					}

					var selectedElements = document.getElementsByClassName("selectedLine");


					for (var elementIndex = selectedElements.length - 1; elementIndex >= 0; elementIndex--) {
						selectedElements[elementIndex].classList.remove("selectedLine");
					}


					// show selected lines
					for (var lineIndex = linesBeforeSelectionStart.length; lineIndex < linesBeforeSelectionEnd.length + 1; lineIndex++) {
						lineNumberColumn.children[lineIndex - 1].classList.add("selectedLine");
					}
				});
			}
		});



		textAreaCell.appendChild(textArea);





		editorRow.appendChild(lineNumberCell);
		editorRow.appendChild(textAreaCell);

		
		textEditorTable.appendChild(editorRow);
		








	// cursor position
		var cursorPositionElement = document.createElement("span");

		cursorPositionElement.id = "cursorPositionElement";
		cursorPositionElement.style.float = "right";

		cursorPositionElement.innerText = "Ln 1, Col 1";

	// error
		var errorElement = document.createElement("span");

		errorElement.id = "errorElement";
		errorElement.style.color = "red";




	// reset textarea
		var resetButton = document.createElement("button");
		resetButton.classList.add("button");

		resetButton.innerText = "Reset text";

		resetButton.onclick = () => {
			if (confirm("Are you sure you want to remove all text then get and paste the current item config?") == true) {
				$.ajax({
					url: "../includes/getItemConfig.php",
					type: "POST",
					dataType: "JSON",
					success: function(itemConfig) {
						itemConfig[0].config = JSON.parse(itemConfig[0].config);

						// textArea.setAttribute("data-config-origin", JSON.stringify(itemConfig[0]));
		
						currentItemConfigTextArea.value = JSON.stringify(itemConfig[0].config, null, 4);
		
						currentItemConfigVersion.innerText = "Current item config version: " + itemConfig[0].version;

						cursorPositionElement.innerText = "Ln 1, Col 1";

						errorElement.innerText = "";
					}
				});
			}
		};
	
	// beautify textarea
		var beautifyButton = document.createElement("button");
		beautifyButton.classList.add("button");

		beautifyButton.innerText = "Beautify text";

		beautifyButton.onclick = () => {

			try {
				var json = JSON.parse(currentItemConfigTextArea.value);

				currentItemConfigTextArea.value = JSON.stringify(json, null, 4);

				errorElement.innerText = "";
			} catch (error) {
				errorElement.innerText = "\nCannot beautify due to an error:\n" + error.message;
			}
		};

	// check for error
		var errorCheckButton = document.createElement("button");
		errorCheckButton.classList.add("button");

		errorCheckButton.id = "errorCheckButton";

		errorCheckButton.innerText = "Error check";

		errorCheckButton.onclick = () => {

			try {
			// when no error
				JSON.parse(currentItemConfigTextArea.value);

				errorElement.innerHTML = "<span class='backgroundAnimated'>No error</span>";

				errorElement.setAttribute("data-error", 0);

				var errorElements = document.getElementsByClassName("errorLine");

				for (var elementIndex = errorElements.length - 1; elementIndex >= 0; elementIndex--) {
					errorElements[elementIndex].classList.remove("errorLine");
				}

				setTimeout(() => {
					if (errorElement.getAttribute("data-error") == "0") {
						errorElement.innerText = "";
					}
				}, 5000)
			} catch (error) {
			// when error

				errorElement.setAttribute("data-error", 1);
				errorElement.innerText = "\n" + error.message;
				errorElement.scrollIntoView();

				if (error.message.substring(0, 11) === "JSON.parse:") {
						// clear all errors
					var errorElements = document.getElementsByClassName("errorLine");

					for (var elementIndex = errorElements.length - 1; elementIndex >= 0; elementIndex--) {
						errorElements[elementIndex].classList.remove("errorLine");
					}


					var indexOf = error.message.split(" ").indexOf("line");
					// get line number
					var errorOnLine = error.message.split(" ")[indexOf + 1];

					var button = document.createElement("button");
					button.innerText = "Go to";
					button.classList.add("button");

					var offset = -5;

					if (errorOnLine - 1 + offset < 0) {
						offset = 0;
					}

					var errorLineElement = lineNumberColumn.children[errorOnLine - 1 + offset];

					lineNumberColumn.children[errorOnLine - 1].classList.add("errorLine");


					button.onclick = () => {
						mouseInside.textArea = true;
						mouseInside.lineNumberColumn = true;

						textArea.scrollTop = errorLineElement.offsetTop;
						lineNumberColumn.scrollTop = errorLineElement.offsetTop;

						mouseInside.textArea = false;
						mouseInside.lineNumberColumn = false;
					};

					errorElement.appendChild(button);
				}
			}
		};







	// upload changes container
		var uploadChangesContainer = document.createElement("div");

		uploadChangesContainer.style.textAlign = "center";
		uploadChangesContainer.style.marginTop = "25px";


		var uploadChangesButton = document.createElement("button");
		uploadChangesButton.classList.add("button");

		uploadChangesButton.innerText = "Upload changes";


		uploadChangesButton.onclick = () => {

			// var configOrigin = document.getElementById("currentItemConfigTextArea").getAttribute("data-config-origin");

			var editedConfig = currentItemConfigTextArea.value;

			try {
				JSON.parse(editedConfig);

				if (confirm("Are you sure you want to upload?") == true) {
					$.ajax({
						url: "updateItemConfig.php",
						type: "POST",
						dataType: "JSON",
						data: {itemConfig: editedConfig},
						success: function(response){
							alert(response);
							modal.disable();
						}
					});
				}
			} catch (error) {
				alert("Invalid json");
				
				errorCheckButton.click();
			}

				

		// check if both configs are valid json
			// try {
			// 	configOrigin = JSON.parse(configOrigin).config.items;
			// } catch (error) {
			// 	alert("Error in origin config, cannot do anymore... Please consider copying your changes and saving them elsewhere then come back and try again.\n\nIf you know how and want to... you can open the console and see the error.");
			// 	console.error(error);
			// 	return 1;
			// }

		// 	try {
		// 		editedConfig = JSON.parse(editedConfig).items;
		// 	} catch (error) {
		// 		document.getElementById("errorCheckButton").click();
		// 		return 1;
		// 	}

		// // clear error field
		// 	if (document.getElementById("errorElement").getAttribute("data-error") == "1") {
		// 		document.getElementById("errorElement").innerText = "";
		// 	}


		// compare changes between the original item config and the new item config
/*
upload new config instead of updating:
if number of items change or if all items don't have the same dataName as origin
if any price changes
    check for case when price is int or string
if any dataName changes
if any interface is removed
    identified by interface.dataName
if any interface's choice is removed
    identified by choice.dataName
if any interface's type is changed
*/
/*
			var checks = {
				"dataName": ""
			};


			
			for (var itemIndex = 0; itemIndex < ((configOrigin.length < editedConfig.length) ? configOrigin.length : editedConfig.length); itemIndex++) {
				// console.log(itemIndex);
			}


			if (configOrigin.length < editedConfig.length) {
				for (var itemIndex = 0; itemIndex < configOrigin.length; itemIndex++) {
					console.log(itemIndex);
				}
			}
			*/
		};




		textContainer.appendChild(currentItemConfigVersion);
		
		textContainer.appendChild(textEditorTable);
		
		textContainer.appendChild(cursorPositionElement);

		textContainer.appendChild(resetButton);
		textContainer.appendChild(beautifyButton);
		textContainer.appendChild(errorCheckButton);

		textContainer.appendChild(errorElement);


		uploadChangesContainer.appendChild(uploadChangesButton);


		this.content.appendChild(textContainer);

		this.content.appendChild(uploadChangesContainer);
	}
}



function updateGetSalesData (dateTimeElement, instruction) {

	var dateNow = Date.now();


	if (instruction == undefined) instruction = "";

	if (instruction.includes("prompt")) {
		var answer = prompt("Value... must be a number");

		if (answer == null || !Number.isInteger(parseInt(answer))) {
			return 0;
		}

		instruction = instruction.replaceAll("prompt", answer);
	}

	instruction = instruction.replaceAll("now", dateNow);
	dateNow = eval(instruction)

	var date = new Date(dateNow);

	dateTimeElement.value = convertDateTimeToHTMLFormat(date);


	// anytime this updates, trigger input event
	dateTimeElement.dispatchEvent(new Event("input"));

}


function deselectAllDropDowns (className, orgin) {
	var dropDowns = document.getElementsByClassName(className);
	
	for (var i = 0; i < dropDowns.length; i++) {

		if (orgin.getAttribute("data-for") == dropDowns[i].children[0].getAttribute("data-for")) continue;
		dropDowns[i].children[1].classList.add("hidden");
	}

	document.getElementById(orgin.getAttribute("data-for") + "_Container").classList.toggle("hidden");
}
