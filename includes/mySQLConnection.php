<?php

class MySQLConnection {

	public function __construct() {
		$this->connection = mysqli_connect("localhost", "testUser", "password", "salesData");
	}

	// This will be called at the end of the script.
	public function __destruct() {
		mysqli_close($this->connection);
	}

	public function query($query) {
		return mysqli_query($this->connection, $query);
	}
}
?>
