<?php


$poolType = $_POST["poolType"];


if ($poolType == "unfilled") echo file_get_contents("unfilled.json");
else if ($poolType == "filled") echo file_get_contents("filled.json");
else echo 0;

?>