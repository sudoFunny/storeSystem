<?php
include("../includes/RecordClass.php");
// include("../includes/DatabasesClass.php");
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();
// $response = $mySQLConnection->query("SELECT version, dateTime FROM itemConfigs;");

$json = $_POST["data"];
$clientItemConfigVersion = $_POST["itemConfigVersion"];

// Incoming json
$parsedJson = json_decode($json, false);

// Unfilled order json
$unfilledJson = json_decode(file_get_contents("../orderPools/unfilled.json"));

// Filled order json
$filledJson = json_decode(file_get_contents("../orderPools/filled.json"));


// Generate customer id; based on max id value of the orders in unfilled pool and filled pool
$max["id"] = 0;
    // unfilled
for ($i = 0; $i < count($unfilledJson); $i++) {
    if ($unfilledJson[$i]->{"id"} >= $max["id"]) $max["id"] = $unfilledJson[$i]->{"id"} + 1;
}

    // filled
for ($i = 0; $i < count($filledJson); $i++) {
    if ($filledJson[$i]->{"id"} >= $max["id"]) $max["id"] = $filledJson[$i]->{"id"} + 1;
}



// !	OLD		!
// merge data for sales stats before potentially removing donations
// mergeData();

// NEW
// Add new record to orders database
// $sessionID = 0; // for now
// $ordersDatabase = new Database("localhost", "connor", "10SQLDB", "test");
date_default_timezone_set("UTC");

$dateTime = date("Y-n-d h:i:s");
if ($clientItemConfigVersion == "null") {
	$mySQLConnection->query("INSERT INTO orders (orderId, itemConfigVersion, dateTime, completed, contents) VALUES ('" . $max["id"] . "', '$dateTime', 0, '$json')");
}
else
	$mySQLConnection->query("INSERT INTO orders (orderId, itemConfigVersion, dateTime, completed, contents) VALUES ('" . $max["id"] . "', '$clientItemConfigVersion', '$dateTime', 0, '$json')");




// remove donations
for ($i = 0; $i < count($parsedJson); $i++) {
	if ($parsedJson[$i]->{"name"} == "Donations") {
		unset($parsedJson[$i]);
		if (count($parsedJson) <= 0) {
			echo '{"message": "Donation added"}';
			return;
		}
		// need to reset json object
		$parsedJson = array_values($parsedJson);
		break; // break since there can only be one Donations object
	}
}


$parsedJson["id"] = $max["id"];

array_push($unfilledJson, $parsedJson);

// Write new array
$file = fopen("../orderPools/unfilled.json", "w") or die("Unable to open file!");
fwrite($file, json_encode($unfilledJson));
fclose($file);


// Return customer id
echo '{"message": "Order number is ' . $max["id"] . '"}';












function mergeData () {
	// Merge order with record
	date_default_timezone_set("EST");

	$currentDate = date("Y-n-d");


	if (file_exists("../records/collection/" . $currentDate)) {

		$record = unserialize(file_get_contents("../records/collection/" . $currentDate));
		
		$record = addDataToRecord($record, json_decode($_POST["data"]));
		
		file_put_contents("../records/collection/" . $currentDate, serialize($record));
		
	}
	else {
		
		$record = new Record();

		$record = addDataToRecord($record, json_decode($_POST["data"]));
		
		file_put_contents("../records/collection/" . $currentDate, serialize($record));
	}
}




function addDataToRecord ($record, $inputJson) {

	for ($i = 0; $i < count($inputJson); $i++) {
		
		if ($inputJson[$i]->{"name"} == "Popcorn") {
			$record->popcorn["amount"] = $record->popcorn["amount"] + intval($inputJson[$i]->{"quantity"});
		}
		
		else if ($inputJson[$i]->{"name"} == "Slushie") {
			if ($inputJson[$i]->{"size"} == "small") {
				$record->slushie["small"] = $record->slushie["small"] + 1;
			}
			else if ($inputJson[$i]->{"size"} == "large") {
				$record->slushie["large"] = $record->slushie["large"] + 1;
			}
			else if ($inputJson[$i]->{"size"} == "jumbo") {
				$record->slushie["jumbo"] = $record->slushie["jumbo"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Tea") {
			if ($inputJson[$i]->{"size"} == "small") {
				$record->tea["small"] = $record->tea["small"] + 1;
			}
			else if ($inputJson[$i]->{"size"} == "large") {
				$record->tea["large"] = $record->tea["large"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Lemonade") {
			if ($inputJson[$i]->{"size"} == "small") {
				$record->lemonade["small"] = $record->lemonade["small"] + 1;
			}
			else if ($inputJson[$i]->{"size"} == "large") {
				$record->lemonade["large"] = $record->lemonade["large"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Coffee") {
			if ($inputJson[$i]->{"size"} == "small") {
				$record->coffee["small"] = $record->coffee["small"] + 1;
			}
			else if ($inputJson[$i]->{"size"} == "large") {
				$record->coffee["large"] = $record->coffee["large"] + 1;
			}
			else if ($inputJson[$i]->{"size"} == "jumbo") {
				$record->coffee["jumbo"] = $record->coffee["jumbo"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Dippin' Dots") {
			if ($inputJson[$i]->{"flavor"}[0] == "Cotton Candy") {
				$record->dipinDots["cottonCandy"] = $record->dipinDots["cottonCandy"] + 1;
			}
			else if ($inputJson[$i]->{"flavor"}[0] == "Cookies n' Cream") {
				$record->dipinDots["cookiesAndCream"] = $record->dipinDots["cookiesAndCream"] + 1;
			}
			else if ($inputJson[$i]->{"flavor"}[0] == "Cookie Dough") {
				$record->dipinDots["cookieDough"] = $record->dipinDots["cookieDough"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Cookies") {
			if ($inputJson[$i]->{"type"} == "Chocolate") {
				$record->cookies["chocolate"] = $record->cookies["chocolate"] + 1;
			}
			else if ($inputJson[$i]->{"type"} == "Sugar") {
				$record->cookies["sugar"] = $record->cookies["sugar"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Hot Chocolate") {
			// with toppings
			if (count($inputJson[$i]->{"toppings"}) > 0) {
				$record->hotChocolate["withToppings"] = $record->hotChocolate["withToppings"] + 1;
			}
			else {
				$record->hotChocolate["withoutToppings"] = $record->hotChocolate["withoutToppings"] + 1;
			}
		}
		
		else if ($inputJson[$i]->{"name"} == "Donations") {
			$record->donations["amount"] = $record->donations["amount"] + intval($inputJson[$i]->{"amount"});
		}
	}

	return $record;
}




?>
