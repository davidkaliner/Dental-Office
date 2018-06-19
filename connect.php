<?php

// connect to the database

function connect()
{
	$mysql_host = 'localhost';
	$mysql_user = 'root';
	$mysql_pass = '';
	$mysql_db = 'Dental_database';
	$conn = new mysqli($mysql_host, $mysql_user, $mysql_pass, $mysql_db);
	return $conn;
}
?>