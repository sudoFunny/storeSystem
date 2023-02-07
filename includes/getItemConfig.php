<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();

if (is_numeric($_POST["itemConfigVersion"])) {
	$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs WHERE version=" . intval($_POST["itemConfigVersion"]) . ";");
}
else
	$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs ORDER BY version DESC LIMIT 1;");

echo json_encode($row = mysqli_fetch_assoc($response));
?>