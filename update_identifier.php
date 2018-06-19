<?php

// Update appointment identifier

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['identifier']) && isset($_POST['id']))
{
	mysqli_set_charset($conn, "utf8");
	
	$identifier = $_POST['identifier'];
	$id = $_POST['id'];


	$update_identifier = "UPDATE appointments
						  SET appointment_identifier = '$identifier'
						  WHERE id = '$id'";
	
	$stmt = mysqli_prepare($conn, $update_identifier);
		
	if($stmt)
	{
		$result = mysqli_stmt_execute($stmt);
		if($result)
		{
			echo json_encode("success");
		}
		else
		{
			echo json_encode("Error executing");
		}
	}
	else
	{
		echo json_encode("Error preparing");
	}
}
?>	