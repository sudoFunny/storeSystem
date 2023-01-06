<?php




$idToDelete = $_POST["id"];


$unfilled = json_decode(file_get_contents("unfilled.json"));

$deleted = false;
// Delete element by id
for ($i = 0; $i < count($unfilled); $i++) {
    if (strval($unfilled[$i]->{"id"}) == strval($idToDelete)) {
        //unset($unfilled[$i]);
        array_splice($unfilled, $i, 1); 
        file_put_contents("unfilled.json", json_encode($unfilled));
        $deleted = true;
        break;
    }
}

echo json_encode(json_decode("{\"deleted\": $deleted, \"id\": $idToDelete}"));
?>