<?php

include("mySQLConnection.php");
$mySQLConnection = new MySQLConnection();

$fields = ["recordId", "orderId", "itemConfigVersion", "contents"];

$response = $mySQLConnection->query("SELECT " . join(", ", $fields) . " FROM orders WHERE completed=0;");

echo "[" . json_encode($fields) . "," . json_encode(mysqli_fetch_all($response)) . "]";
?>