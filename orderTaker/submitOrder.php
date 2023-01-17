<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();
// $response = $mySQLConnection->query("SELECT version, dateTime FROM itemConfigs;");

$json = $_POST["data"];
$clientItemConfigVersion = $_POST["itemConfigVersion"];

// Incoming json
$parsedJson = json_decode($json, false);

// Unfilled order json
$unfilledJson = json_decode(file_get_contents("../orderPools/unfilled.json"));

// Generate customer id; based on max id value of the orders in unfilled pool and filled pool
$max["id"] = 0;
    // unfilled
for ($i = 0; $i < count($unfilledJson); $i++) {
    if ($unfilledJson[$i]->{"id"} >= $max["id"]) $max["id"] = $unfilledJson[$i]->{"id"} + 1;
}

// remove donations
// I should remove any order with an item that has an interface.type == "money"
/*for ($i = 0; $i < count($parsedJson); $i++) {
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
}*/

date_default_timezone_set("UTC");

$dateTime = date("Y-n-d h:i:s");
if ($clientItemConfigVersion == "null") {
	$mySQLConnection->query("INSERT INTO orders (orderId, itemConfigVersion, dateTime, completed, contents) VALUES ('" . $max["id"] . "', '$dateTime', 0, '$json')");
}
else
	$mySQLConnection->query("INSERT INTO orders (orderId, itemConfigVersion, dateTime, completed, contents) VALUES ('" . $max["id"] . "', '$clientItemConfigVersion', '$dateTime', 0, '$json')");






$parsedJson["id"] = $max["id"];

array_push($unfilledJson, $parsedJson);

// Write new array
$file = fopen("../orderPools/unfilled.json", "w") or die("Unable to open file!");
fwrite($file, json_encode($unfilledJson));
fclose($file);


// Return customer id
echo '{"message": "Order number is ' . $max["id"] . '"}';
?>