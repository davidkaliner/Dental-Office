<?php

// Update appointment

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['date']) && isset($_POST['id']) && isset($_POST['duration']))
{
	mysqli_set_charset($conn, "utf8");
	
	$date = $_POST['date'];
	$date = str_replace("-","", $date); 
	$dt = new dateTime($date);
	$new_date = $dt->format("Y-m-d");
	$new_s_time = $dt->format("H:i");
	$new_duration = $_POST['duration'];
	
	$id = $_POST['id'];

	$change_appointment_date = "UPDATE appointments
								SET new_date = '$new_date', new_s_time = '$new_s_time', new_duration = '$new_duration'
								WHERE id = '$id'";
	
	$stmt = mysqli_prepare($conn, $change_appointment_date);
		
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