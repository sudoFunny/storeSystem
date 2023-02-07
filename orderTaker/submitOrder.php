<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();


/**
 * TODO
 * X remove stop using unfilled.json to get id and stop using it altogether
 * _ remove donations
 */





$json = $_POST["data"];
$clientItemConfigVersion = $_POST["itemConfigVersion"];

// Incoming json
$parsedJson = json_decode($json, false);

// Generate order id based on database stuff... completed, orderId
// $response = $mySQLConnection->query("SELECT orderId, completed FROM orders;");

// $thisOrderId = 1;
// while ($row = mysqli_fetch_assoc($response)) {
// 	if ($row["orderId"] >= $thisOrderId && $row["completed"] != 1) $thisOrderId = $row["orderId"] + 1;
// }

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

$dateTime = gmdate("Y-m-d H:i:s");
if ($clientItemConfigVersion == "null") {
	$mySQLConnection->query("INSERT INTO orders (orderId, dateTime, completed, contents) VALUES ('" . $max["id"] . "', '$dateTime', 0, '$json')");
}
else
	$mySQLConnection->query("INSERT INTO orders (orderId, itemConfigVersion, dateTime, completed, contents) VALUES ('" . $max["id"] . "', '$clientItemConfigVersion', '$dateTime', 0, '$json')");


// check if client item config version is out of date
$response = $mySQLConnection->query("SELECT version FROM itemConfigs ORDER BY version DESC LIMIT 1;");

$currentItemConfigVersion = mysqli_fetch_assoc($response)["version"];
$updateClientItemConfig = false;

if ($currentItemConfigVersion != null && $clientItemConfigVersion != "" && intval($currentItemConfigVersion) > intval($clientItemConfigVersion)) {
	$updateClientItemConfig = true;
}




$parsedJson["id"] = $max["id"];
// give unfilled order the version of the item config used to generate it
$parsedJson["itemConfigVersion"] = $clientItemConfigVersion;

array_push($unfilledJson, $parsedJson);

// Write new array
$file = fopen("../orderPools/unfilled.json", "w") or die("Unable to open file!");
fwrite($file, json_encode($unfilledJson));
fclose($file);


// Return customer id
$dataToReturn["id"] = $max["id"];
$dataToReturn["updateClientItemConfig"] = $updateClientItemConfig;

echo json_encode($dataToReturn);
?>