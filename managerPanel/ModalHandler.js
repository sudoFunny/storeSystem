



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

		// fromInputContainer.appendChild(labelForFromSecondsInput);
		// fromInputContainer.appendChild(fromSecondsInput);

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

		// toInputContainer.appendChild(labelForToSecondsInput);
		// toInputContainer.appendChild(toSecondsInput);

		toInputContainer.appendChild(toQuickOptionLabel);
		toInputContainer.appendChild(toQuickOptionSelect);







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

			$.ajax({
				url: "getSalesData.php",
				type: "POST",
				dataType: "JSON",
				data: {fromDate: convertToSQLDateTime(fromDate), toDate: convertToSQLDateTime(toDate)},
				success: function(response){
					// alert(response.message);
					// console.log(response);

					if (response != 0)
						convertJsonSalesDataToCSV(response);
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

		this.content.appendChild(submitContainer);

		updateGetSalesData(document.getElementById("toDateTimeInput"), "now");

		document.getElementById("fromQuickOptionSelectDropDown").style.left = document.getElementById("fromDropDownbutton").getBoundingClientRect().left + "px";
		document.getElementById("fromQuickOptionSelectDropDown").style.top = document.getElementById("fromDropDownbutton").getBoundingClientRect().top + document.getElementById("fromDropDownbutton").getBoundingClientRect().height + "px";
		
		document.getElementById("toQuickOptionSelectDropDown").style.left = document.getElementById("toDropDownbutton").getBoundingClientRect().left + "px";
		document.getElementById("toQuickOptionSelectDropDown").style.top = document.getElementById("toDropDownbutton").getBoundingClientRect().top + document.getElementById("toDropDownbutton").getBoundingClientRect().height + "px";
		
		
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

	
	// dateTimeElement.setAttribute("data-date", date.valueOf());
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
