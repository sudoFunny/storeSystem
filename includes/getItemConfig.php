<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();

$wantedItemConfigVersion = json_decode($_POST["itemConfigVersion"]);

if (is_array($wantedItemConfigVersion) && !empty($wantedItemConfigVersion) && $wantedItemConfigVersion != 0) {
	$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs WHERE version IN (" . join(", ", $wantedItemConfigVersion) . ");");
}
else
	$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs ORDER BY version DESC LIMIT 1;");

echo json_encode(mysqli_fetch_all($response, MYSQLI_ASSOC));
?>