<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();

$fromDate = $_POST["fromDate"];
$toDate = $_POST["toDate"];

// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

// Note for a future feature? In php script, if any itemConfigVersion is null then grab the itemConfigVerion
// from the order above or below itself... pick the one that has the smallest dateTime difference, if same then
// use the newer order's itemConfigVersion (the record below itself). If no such entry, use the order before if
// it's dateTime difference isn't too large (say 24 hours), if no such entry, just continue with null.
// Be sure to find a way to tell the client that this this happened... or do they need to know?

// $fields = ["recordId", "itemConfigVersion", "contents"];

// $response = $mySQLConnection->query("SELECT " . join(", ", $fields) . " FROM orders WHERE dateTime>='" . $_POST["fromDate"] . "' AND dateTime<='" . $_POST["toDate"] . "';");

// echo "[" . json_encode($fields) . "," . json_encode(mysqli_fetch_all($response)) . "]";




$response = $mySQLConnection->query("SELECT recordId, itemConfigVersion, contents FROM orders WHERE dateTime>='" . $fromDate . "' AND dateTime<='" . $toDate . "';");

$rows = [];
$versions = [];

if (mysqli_num_rows($response) != 0) {
	while($row = mysqli_fetch_assoc($response)) {
		$row["contents"] = json_decode($row["contents"]);
		array_push($rows, $row);

		if (!in_array($row["itemConfigVersion"], $versions)) {
			if (!is_null($row["itemConfigVersion"]) || $row["itemConfigVersion"] != "") {
				array_push($versions, $row["itemConfigVersion"]);
			}
		}
	}
}
else {
	echo 0;
	exit();
}



$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs WHERE version IN (" . join(", ", $versions) . ");");

$itemConfigs = [];

if (mysqli_num_rows($response) != 0) {
	while($row = mysqli_fetch_assoc($response)) {
		$row["config"] = json_decode($row["config"]);
		array_push($itemConfigs, $row);
	}
}
else {
	echo 0;
	exit();
}

array_push($rows, $itemConfigs);




echo json_encode($rows);
exit();





?>
