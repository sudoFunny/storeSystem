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
            
            <!-- <tr>
                <td class="leaveMeAlone">Action</td>
                <td class="leaveMeAlone">Option</td>
            </tr> -->
            
            
            <tr>
                <td colspan=2><button class="thicc button" onclick="modal.enable(); modal.showGetSalesData()">Get sales data</button></td>
            </tr>
            
            
            <tr>
                <td><button class="thicc" ondblclick="flushPools()">Flush pool</button></td>
                <td>
            
                <select id="pools" class="thicc">
                    <option value="unfilled">Unfilled</option>
                </select>
                </td>
            </tr>
        </table>
        
        
        
        
        
        
        
        
        <table style="margin-left: auto; margin-right: auto; text-align: center;">
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
                <td><span>Upload new Item Config</span></td>
                <td>
					<input id="fileInput" type="file" name="file" accept=".json"/>
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
	document.getElementById("fileInput").addEventListener("change", handleFileSelect, false);
    // document.getElementById("rollBackOptions").selectedIndex = 0;



// for testing

// document.getElementsByClassName("thicc")[0].click();
// document.getElementById("fromDropDownbutton").click();
// document.getElementById("fromQuickOptionSelectDropDown").children[1].children[3].children[0].click();
}



var modal = new Modal();





var table = document.getElementById("table");



function flushPools () {
    if (confirm("Are you sure you want to flush " + document.getElementById("pools").value + " pool(s)?") == true) {
        $.ajax({
            url: "flushPool.php",
            type: "POST",
            dataType: "JSON",
            data: {pool: document.getElementById("pools").value},
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

    if (document.getElementById("fileInput").files[0].name.split(".").pop() != "json") {
        alert("File extension is not json");
        return;
    }

    if (event.target.result == "") {
        alert("Empty file");
        return;
    }


    if (/^[\],:{}\s]*$/.test(event.target.result.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // Json is json
        var numberOfChars = 50;
        if (confirm("Are you sure you want to upload the file \"" + document.getElementById("fileInput").files[0].name + "\" with the first " + numberOfChars + " characters being \"" + event.target.result.substring(0, numberOfChars) + "\"\n and having been last modified on " + new Date(document.getElementById("fileInput").files[0].lastModified)) == true) {
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


    }
    else {
        // Json is not json
        alert("Invaild json");
        return;
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

.button {
	/* width: 100%; */
	border-style: none;
	cursor: pointer;
    padding: 5px 10px;
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





tr:nth-child(even) {
    background-color: #bebebe;
}
</style>
