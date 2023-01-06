<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();

$fromDate = $_POST["fromDate"];
$toDate = $_POST["toDate"];

// 	$fromDate = "2022-12-24 13:59:43";
// 	$toDate = "2022-12-29 13:59:41";

// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);

$response = $mySQLConnection->query("SELECT itemConfigVersion, contents FROM orders WHERE dateTime>='" . $fromDate . "' AND dateTime<='" . $toDate . "';");

$rows = [];
$versions = [];

if (mysqli_num_rows($response) != 0) {
	while($row = mysqli_fetch_assoc($response)) {
		$row["contents"] = json_decode($row["contents"]);
		array_push($rows, $row);

		if (!in_array($row["itemConfigVersion"], $versions)) {
			array_push($versions, $row["itemConfigVersion"]);
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
