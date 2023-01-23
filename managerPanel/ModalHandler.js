



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

		var description = document.createElement("p");
		description.innerText = "Get sales data";




// from div
		var fromInputContainer = document.createElement("div");

// from date input
		var labelForFromDateTimeInput = document.createElement("label");
		labelForFromDateTimeInput.htmlFor = "fromDateTimeInput";
		labelForFromDateTimeInput.innerHTML = "From<br>";

		var fromDateTimeInput = document.createElement("input");
		fromDateTimeInput.type = "datetime-local";
		fromDateTimeInput.id = "fromDateTimeInput";
		fromDateTimeInput.step = 1; // show seconds will show... bit odd but ok I guess :/
		fromDateTimeInput.max = convertDateTimeToHTMLFormat(new Date(Date.now()));
		

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

// to datetime input
		var labelForToDateTimeInput = document.createElement("label");
		labelForToDateTimeInput.htmlFor = "toDateTimeInput";
		labelForToDateTimeInput.innerHTML = "To<br>";

		var toDateTimeInput = document.createElement("input");
		toDateTimeInput.type = "datetime-local";
		toDateTimeInput.id = "toDateTimeInput";
		toDateTimeInput.step = 1; // show seconds will show... bit odd but ok I guess :/
		toDateTimeInput.max = convertDateTimeToHTMLFormat(new Date(Date.now()));

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

		var tableOptionsContainer = document.createElement("div");
		tableOptionsContainer.style.marginTop = "25px";
		

		var tableOptionsTable = document.createElement("table");
		tableOptionsTable.style.borderCollapse = "collapse";
		tableOptionsTable.style.textAlign = "center";

		var tableOptionsTableOptionsTr = document.createElement("tr");
		tableOptionsTableOptionsTr.innerHTML = "\
		<td></td>\
		<td style='padding-left: 20px; padding-right: 20px;'>" + wordWrap("Apply when displaying", 5, "<br>") + "</td>\
		<td style='padding-left: 20px; padding-right: 20px;'>" + wordWrap("Apply when downloading", 5, "<br>") + "</td>\
		";


		tableOptionsTable.appendChild(tableOptionsTableOptionsTr);


		var tableOptionsTemplate = [
			{
				"label": "Convert cent to dollar",
				"options": [
					{
						"id": "",
						"checked": true,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "convertToDollar",
							"data-table-options-when": "displaying"
						}
					},
					{
						"id": "",
						"checked": true,
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
						"checked": true,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "displayTotalColumn",
							"data-table-options-when": "displaying"
						}
					},
					{
						"id": "",
						"checked": true,
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
						"checked": true,
						"attributes":
						{
							"data-table-options": "",
							"data-table-options-apply": "displayTotalRow",
							"data-table-options-when": "displaying"
						}
					},
					{
						"id": "",
						"checked": true,
						"attributes":
							{
								"data-table-options": "",
								"data-table-options-apply": "displayTotalRow",
								"data-table-options-when": "downloading"
							}
					}
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
				
				Object.keys(entryOption.attributes).forEach(attributeKey => {
					optionElement.setAttribute(attributeKey, entryOption.attributes[attributeKey]);
				});

				optionElementCell.appendChild(optionElement);
				entry.appendChild(optionElementCell);
			});


			tableOptionsTable.appendChild(entry);
		});

		
		tableOptionsContainer.appendChild(tableOptionsTable);



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

			window.salesDataDate = {fromDate: convertToSQLDateTime(fromDate), toDate: convertToSQLDateTime(toDate)};

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
									"displaying": null,
									"downloading": null
								}
							},
							"displayTotalColumn": {
								"when": {
									"displaying": null,
									"downloading": null
								}
							},
							"displayTotalRow": {
								"when": {
									"displaying": null,
									"downloading": null
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
		this.content.appendChild(description);

		this.content.appendChild(fromInputContainer);
		this.content.appendChild(toInputContainer);

		this.content.appendChild(tableOptionsContainer);

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

		var description = document.createElement("p");
		description.innerText = "Display sales data";

		this.content.appendChild(title);
		this.content.appendChild(description);


		// make new object from tables
		var downloadTables = JSON.parse(JSON.stringify(tables));
		

	// for each table
		Object.keys(tables).forEach(tableVersion => {

			var tableOptionsTr = document.createElement("tr");

			
			// display table version if there are more than one
			if (Object.keys(tables).length > 1) {
				var tableVersionCell = document.createElement("td");
				tableVersionCell.innerText = "Item config version: " + tableVersion;

				tableOptionsTr.appendChild(tableVersionCell);
			}


			var downloadButton = document.createElement("button");
			downloadButton.innerText = "Click me to download the following table";
			downloadButton.classList.add("button");


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


				var fileName = prompt("Name this file", "Sales data from " + window.salesDataDate.fromDate + " to " + window.salesDataDate.fromDate + ".csv");

				if (fileName === "") fileName = "Sales data from " + window.salesDataDate.fromDate + " to " + window.salesDataDate.fromDate + ".csv";

				if (fileName.substring(fileName.length-4, fileName.length) != ".csv") fileName += ".csv";

                a.setAttribute("download", fileName);
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                a.remove();

			};

			var downloadTableCell = document.createElement("td");
			downloadTableCell.colSpan = "9999";
			
			downloadTableCell.appendChild(downloadButton);
			tableOptionsTr.appendChild(downloadTableCell);



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
			
			

			table.insertBefore(tableHeader, table.children[0]);

			
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

		var description = document.createElement("p");
		description.innerText = "Edit current item config";

		this.content.appendChild(title);
		this.content.appendChild(description);





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

		// lineNumberColumn.classList.add("textEditor");

		lineNumberColumn.style.borderStyle = "none";
		lineNumberColumn.style.outline = "none";
		lineNumberColumn.style.scrollbarWidth = "none";

		lineNumberColumn.style.height = "500px";

		lineNumberColumn.style.overflowX = "hidden";
		lineNumberColumn.style.overflowY = "auto";
		lineNumberColumn.style.textAlign = "right";

		lineNumberColumn.style.cursor = "default";
		lineNumberColumn.style.margin = "0px";


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
		// textArea.classList.add("textEditor");

		textArea.style.width = "100%";
		textArea.style.resize = "none";
		textArea.style.minHeight = "500px";

		textArea.style.padding = "0px";
		textArea.style.margin = "0px";

		// no word wrap
		textArea.style.whiteSpace = "pre";
		textArea.style.overflowWrap = "normal";
		textArea.style.overflowX = "scroll";


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
			var cursorPosition = $("#currentItemConfigTextArea").prop("selectionStart");

			var textBeforeCursorPosition = currentItemConfigTextArea.value.substring(0, cursorPosition);

			var lines = textBeforeCursorPosition.split("\n");

			cursorPositionElement.innerText = "Ln " + lines.length + ", Col " + parseInt(lines[lines.length - 1].length + 1);


			var selectedElements = document.getElementsByClassName("selectedLine");
			
			for (var elementIndex = 0; elementIndex < selectedElements.length; elementIndex++) {
				selectedElements[elementIndex].classList.remove("selectedLine");
			}


			lineNumberColumn.children[lines.length - 1].classList.add("selectedLine");
		};


		// getCurrentItemConfig();
		$.ajax({
			url: "getCurrentItemConfig.php",
			type: "POST",
			dataType: "JSON",
			success: function(itemConfig) {
				itemConfig.config = JSON.parse(itemConfig.config);

				// textArea.setAttribute("data-config-origin", JSON.stringify(itemConfig));

				var lines = JSON.stringify(itemConfig.config, null, 4);

				currentItemConfigTextArea.innerHTML = lines;

				currentItemConfigVersion.innerText = "Current item config version: " + itemConfig.version;



				lineNumberColumn.innerHTML = [...Array(lines.split("\n").length).keys()].map(x => "<div>" + (x += 1) + "</div>").join("");
				
				lineNumberColumn.children[lineNumberColumn.children.length - 1].style.paddingLeft = "15px";

				lineNumberColumn.style.height = currentItemConfigTextArea.offsetHeight;

				

				

			// get cursor position
				$("#currentItemConfigTextArea").on("keyup", function() {
					var cursorPosition = $("#currentItemConfigTextArea").prop("selectionStart");
		
					var textBeforeCursorPosition = currentItemConfigTextArea.value.substring(0, cursorPosition);
		
					var lines = textBeforeCursorPosition.split("\n");

					cursorPositionElement.innerText = "Ln " + lines.length + ", Col " + parseInt(lines[lines.length - 1].length + 1);
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
		// errorElement.style.float = "left";
		errorElement.style.color = "red";




	// reset textarea
		var resetButton = document.createElement("button");
		resetButton.classList.add("button");

		resetButton.innerText = "Reset text";

		resetButton.onclick = () => {
			if (confirm("Are you sure you want to remove all text then get and paste the current item config?") == true) {
				$.ajax({
					url: "getCurrentItemConfig.php",
					type: "POST",
					dataType: "JSON",
					success: function(itemConfig) {
						itemConfig.config = JSON.parse(itemConfig.config);

						// textArea.setAttribute("data-config-origin", JSON.stringify(itemConfig));
		
						document.getElementById("currentItemConfigTextArea").value = JSON.stringify(itemConfig.config, null, 4);
		
						document.getElementById("currentItemConfigVersion").innerText = "Current item config version: " + itemConfig.version;

						document.getElementById("cursorPositionElement").innerText = "Ln 1, Col 1";

						document.getElementById("errorElement").innerText = "";
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
				var json = JSON.parse(document.getElementById("currentItemConfigTextArea").value);

				document.getElementById("currentItemConfigTextArea").value = JSON.stringify(json, null, 4);

				document.getElementById("errorElement").innerText = "";
			} catch (error) {
				document.getElementById("errorElement").innerText = "\nCannot beautify due to an error:\n" + error.message;
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
				JSON.parse(document.getElementById("currentItemConfigTextArea").value);

				errorElement.innerHTML = "<span class='backgroundAnimated'>No error</span>";

				errorElement.setAttribute("data-error", 0);

				var errorElements = document.getElementsByClassName("errorLine");
			
				for (var elementIndex = 0; elementIndex < errorElements.length; elementIndex++) {
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
					var indexOf = error.message.split(" ").indexOf("line");
					// get line number
					var errorOnLine = error.message.split(" ")[indexOf + 1];
					// var errorOnColumn = 


					var button = document.createElement("button");
					button.innerText = "Go to";
					button.classList.add("button");


					button.onclick = () => {

						var errorLineElement = lineNumberColumn.children[errorOnLine - 1];

						errorLineElement.classList.add("errorLine");

						mouseInside.textArea = true;
						mouseInside.lineNumberColumn = true;

						textArea.scrollTop = errorLineElement.scrollTop;
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

			var editedConfig = document.getElementById("currentItemConfigTextArea").value;

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
}


function deselectAllDropDowns (className, orgin) {
	var dropDowns = document.getElementsByClassName(className);
	
	for (var i = 0; i < dropDowns.length; i++) {

		if (orgin.getAttribute("data-for") == dropDowns[i].children[0].getAttribute("data-for")) continue;
		dropDowns[i].children[1].classList.add("hidden");
	}

	document.getElementById(orgin.getAttribute("data-for") + "_Container").classList.toggle("hidden");
}
