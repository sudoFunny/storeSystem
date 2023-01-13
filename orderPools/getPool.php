<?php


$poolType = $_POST["poolType"];


if ($poolType == "unfilled") echo file_get_contents("unfilled.json");
else echo 0;

?>