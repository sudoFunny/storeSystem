<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);
?>

<!DOCTYPE html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager Panel</title>
</head>
<body onload="init()" style="font-family: LiberationSans;">

    <div id="container" style="margin-top: 100px;">
    
        <table id="table" style="margin-left: auto; margin-right: auto; text-align: center;">
			<tr>
                <td colspan=2><h1>Manager Panel</h1></td>
            </tr>
            
            <tr>
                <td colspan=2><button class="thicc button" onclick="modal.enable(); modal.showGetSalesData();">Get sales data</button></td>
            </tr>
            
            <tr>
                <td colspan=2><button class="thicc button" ondblclick="flushPool()" title="Remove all orders yet to be filled">Flush order pool</button></td>
            </tr>
        </table>
        
        
        
        
        
        
        
        
        <table style="margin-left: auto; margin-right: auto; text-align: center;" class="leaveMeAlone">
			<tr>
                <td colspan=2><p>Item Config Stuff</p></td>
            </tr>
            
            <tr>
                <td class="leaveMeAlone">Action</td>
                <td class="leaveMeAlone">Option</td>
            </tr>



			<!--<tr>
                <td><button class="thicc" ondblclick="editItemConfig()">Edit Item Config</button></td>
            </tr>-->
            
            
            <tr>
                <td><label for="editCurrentItemConfig">Edit current Item Config</label></td>
                <td>
					<button id="editCurrentItemConfig" onclick="modal.enable(); modal.editCurrentItemConfig();" class="thicc button">Edit current Item Config</button>
                </td>
            </tr>


            <tr>
                <td><label for="uploadNewItemConfig">Upload new Item Config</label></td>
                <td>
					<button onclick="document.getElementById('uploadNewItemConfig').click();" class="thicc button">Browse files</button>
					<input id="uploadNewItemConfig" type="file" name="file" accept=".json" style="display: none;"/>
                </td>
            </tr>
            
        </table>
    </div>
    
</body>
</html>


<script src="../includes/jquery.min.js"></script>
<script src="ModalHandler.js"></script>
<script src="functions.js"></script>
<script>

function init () {
	document.getElementById("uploadNewItemConfig").addEventListener("change", handleFileSelect, false);
    // document.getElementById("rollBackOptions").selectedIndex = 0;



// for testing

// document.getElementsByClassName("thicc")[0].click();
// document.getElementById("fromDropDownbutton").click();
// document.getElementById("fromQuickOptionSelectDropDown").children[1].children[3].children[0].click();
}



var modal = new Modal();





var table = document.getElementById("table");



function flushPool () {
    if (confirm("Are you sure you want to remove all orders yet to be filled?") == true) {
        $.ajax({
            url: "flushPool.php",
            type: "POST",
            dataType: "JSON",
            data: {pool: "unfilled"},
            success: function(response){
                alert(response);
            }
        });
    }
}


function deleteSalesData () {
    if (document.getElementById("recordsToDelete").value != "No data") {
        if (confirm("Are you sure you want to delete the sales data of " + document.getElementById("recordsToDelete").value + "?") == true) {
            $.ajax({
                url: "deleteSalesData.php",
                type: "POST",
                dataType: "JSON",
                data: {record: document.getElementById("recordsToDelete").value},
                success: function(response){
                    alert(response);
                    window.location.reload();
                }
            });
        }
    }
    else
        alert("No data");
}

function uploadSalesData () {
    if (confirm("Are you sure you want to upload new sales data? This will overwrite the current data!") == true) {
        // post to php script
    }
}


function handleFileSelect(event) {
	var reader = new FileReader()
	reader.onload = handleFileLoad;
	reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {

    if (document.getElementById("uploadNewItemConfig").files[0].name.split(".").pop() != "json") {
        alert("File extension is not json");
        return;
    }

    if (event.target.result == "") {
        alert("Empty file");
        return;
    }

	try {
		JSON.parse(event.target.result);

		var numberOfChars = 50;
        if (confirm("Are you sure you want to upload the file \"" + document.getElementById("uploadNewItemConfig").files[0].name + "\" with the first " + numberOfChars + " characters being \"" + event.target.result.substring(0, numberOfChars) + "\"\n and having been last modified on " + new Date(document.getElementById("uploadNewItemConfig").files[0].lastModified)) == true) {
			$.ajax({
                url: "updateItemConfig.php",
                type: "POST",
                dataType: "JSON",
                data: {itemConfig: event.target.result},
                success: function(response){
                    alert(response);
                    window.location.reload();
                }
            });
        }
		
	} catch (error) {
		alert("Invaild json");
	}
}





// function editItemConfig () {
// 	window.location = "editItemConfig";
// }



function removeAllChildren (parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}
</script>


<style src="../includes/styles/LiberationFonts.css"></style>
<style>

td {
	padding: 3px;
}

.button {
	/* width: 100%; */
	border-style: ridge;
	cursor: pointer;
	padding: 5px 10px;
}

.button:hover {
	background-color: lightBlue;
}

.buttonPadding {
	padding: 5px 10px;
}

/* td:not(.leaveMeAlone){
    padding-bottom: 50px;
} */

.thicc {
	width: 100%;
}



	.modal {
		/* display: none; */
		position: fixed;
		z-index: 1;
		padding-top: 100px;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgb(0,0,0);
		background-color: rgba(0,0,0,0.4);
	}

	
	.modal-container {
		background-color: #fefefe;
		margin: auto;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;

		margin-bottom: 200px;
	}

	
	.close {
		color: #aaaaaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover, .close:focus {
		color: #000;
		text-decoration: none;
		cursor: pointer;
	}








.dropbtn:hover, .dropbtn:focus {
  background-color: lightBlue;
}

.dropdown {
  /* position: relative; */
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content-container {
/* To make it so when you click away it will do the same */
	/* display: none; Hidden by default */
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	padding-top: 100px; /* Location of the box */
	left: 0;
	top: 0;
	width: 100%; /* Full width */
	height: 100%; /* Full height */
	overflow: auto; /* Enable scroll if needed */
	background-color: rgb(0,0,0); /* Fallback color */
	background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.dropdown-content button {
  color: black;
  padding: 5px 10px;
  text-decoration: none;
  display: block;
  
  width: 100%;
  border-style: none;
  text-align: left;
  cursor: pointer;
}

.dropdown-content > :not(:first-child, :last-child) {
	margin-top: 10px;
	margin-bottom: 10px;
}

.dropdown-content > :first-child {
	margin-top: 0px;
	margin-bottom: 0px;
}

.dropdown-content > :last-child {
	margin-top: 0px;
	margin-bottom: 0px;
}

.dropdown button:hover {
	background-color: lightBlue;
}

.hidden {
	display: none;
}





table:not(.leaveMeAlone) > tr:nth-child(even) {
    background-color: #bebebe;
}



.textEditorField {
	border-style: none;
	outline: none;
}

.textEditorField:focus {
	/* outline: lightblue solid 2px; */
}

.textEditor > *, #currentItemConfigTextArea {
	font-size: 14px;
}

.textEditor:focus-within {
	outline: lightblue solid 2px;
}

#lineNumberColumn {
	border-style: none;
	outline: none;
	scrollbar-width: none;
	height: 500px;
	
	overflow-x: hidden;
	overflow-y: auto;

	text-align: right;
	cursor: default;
	margin: 0px;
}

/* no scrollbar on chrome */
#lineNumberColumn::-webkit-scrollbar{
	display: none;
}


#currentItemConfigTextArea {
	width: 100%;
	resize: none;
	min-height: 500px;
	padding: 0px;
	margin: 0px;
	white-space: pre;
	overflow-wrap: normal;
	overflow-x: auto;
}


.selectedLine {
	background-color: orchid;
	font-weight: bold;
}

.errorLine {
	background-color: red;
	font-weight: bold;
}


.dateTimeInput {
    outline: none;
    border-style: ridge;
}

.dateTimeInput:focus {
    outline: lightblue solid 2px;
    border: ridge lightBlue 2px;
}


@keyframes fade {
	0% {
		color: rgba(0, 255, 0, 1);
	}
	100% {
		color: rgba(0, 255, 0, 0);
	}
}

.backgroundAnimated {
	animation: fade 5s ease-in-out;
}
</style>
