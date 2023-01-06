<?php
include("../includes/mySQLConnection.php");

/*
$newItemConfigDataOrPath = $_POST["newItemConfig"];



$configVersions = scandir("../records/previousItemConfigs/");
$highestVersion = 0;

for ($i = 0; $i < count($configVersions); $i++) {
	if ($configVersions[$i] == "." || $configVersions[$i] == "..") continue;
	if (intval($configVersions[$i]) >= $highestVersion) $highestVersion = intval($configVersions[$i]) + 1;
}



// get outdated data from includes/itemConfig.json and write its contents to new file in records/previousItemConfigs with a new name
file_put_contents("../records/previousItemConfigs/" . $highestVersion, file_get_contents("../includes/itemConfig.json"));




// write new data to includes/itemConfig.json
// json_decode and then json_encode so the file size is smaller... just removing whitespace, it saves to ~1/3 of the OG

if ($_POST["uploadFromPath"] == "false") {
	file_put_contents("../includes/itemConfig.json", json_encode(json_decode($newItemConfigDataOrPath)));
	echo '"The uploading and updating of the new Item Config was successful"';
	return;
}
else if ($_POST["uploadFromPath"] == "true") {
	file_put_contents("../includes/itemConfig.json", file_get_contents($newItemConfigDataOrPath));
	echo '"The roll back was successful"';
	return;
}

echo '"Error"';
*/


date_default_timezone_set("UTC");

$dateTime = date("Y-n-d h:i:s");

$itemConfig = addslashes(json_encode(json_decode($_POST["itemConfig"])));

$mySQLConnection = new MySQLConnection();
$mySQLConnection->query("INSERT INTO itemConfigs (dateTime, config) VALUES ('$dateTime', '$itemConfig');");

echo '"The uploading and updating of the new Item Config was successful"';

?>