<?php

include("mySQLConnection.php");
$mySQLConnection = new MySQLConnection();

$mySQLConnection->query("UPDATE orders SET completed=1 WHERE recordId=" . $_POST["recordId"] . ";");

echo 1;
?>