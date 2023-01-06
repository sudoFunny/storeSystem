<?php

$pool = $_POST["pool"];


if ($pool == "unfilled") {
    file_put_contents("../orderPools/unfilled.json", "[]");

    echo json_encode("Unfilled pool reset");
}
else if ($pool == "filled") {
    file_put_contents("../orderPools/filled.json", "[]");

    echo json_encode("Filled pool reset");
}
else if ($pool == "all") {
    file_put_contents("../orderPools/unfilled.json", "[]");
    file_put_contents("../orderPools/filled.json", "[]");

    echo json_encode("All pools reset");
}
else
    echo json_encode("Error");
?>