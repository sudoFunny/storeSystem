<?php
include("../includes/mySQLConnection.php");
$mySQLConnection = new MySQLConnection();
$response = $mySQLConnection->query("SELECT version, config FROM itemConfigs ORDER BY version DESC LIMIT 1;");

$itemConfigVersion = null;

echo json_encode($row = mysqli_fetch_assoc($response));
?>