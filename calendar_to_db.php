<?php

// Sync the google calendar appointments to the database

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['calendarAppointments']))
{
	mysqli_set_charset($conn, "utf8");
	
	$events = $_POST['calendarAppointments'];

	$sync_array = array();
	
	$identifiers_arr = array();
	
	$appointment_identifierin_query = "SELECT appointment_identifier
									   FROM appointments";
	
	if($run_query = mysqli_query($conn,$appointment_identifierin_query))
    {
		while($row = mysqli_fetch_array($run_query, MYSQL_ASSOC))
		{
			array_push($identifiers_arr, $row['appointment_identifier']);
		}
		
		foreach ($events as $event) 
		{
			$identifier = $event['id'];
			if(in_array($identifier, $identifiers_arr))
			{
				continue;
			}
			$summary = $event['summary'];
			$phone_number = preg_replace("/[^0-9]/", '', $summary);
			$dtStart = DateTime::createFromFormat(DateTime::ISO8601, $event['start']['dateTime']);
			$dtEnd = DateTime::createFromFormat(DateTime::ISO8601, $event['end']['dateTime']);
			$start = $dtStart->format('H:i');
			$end = $dtEnd->format('H:i');
			$dtDuration = date_diff($dtStart, $dtEnd);
			$duration = $dtDuration->format('%h:%I');
			$date = $dtStart->format('Y-m-d');
			if (array_key_exists('description', $event)) {
				$description = $event['description'];
			}
			else
				$description = "";
			
			$details_query = "SELECT user_id, name
							  FROM users
							  WHERE phone_number = '$phone_number'";
							  
			if($run_query = mysqli_query($conn,$details_query))
			{
				$query_num_rows=mysqli_num_rows($run_query);
				if($query_num_rows==0)
				{
					array_push($sync_array, $phone_number . " not found");
				}
				else
				{
					$row = mysqli_fetch_array($run_query, MYSQL_ASSOC);
					$user_id = $row['user_id'];
					$name = $row['name'];
					$insert_appointment = "INSERT INTO 	`appointments`(`id`,`user_id`,`name`,`date`, `s_time`, `duration`, `description`, `approved`, `appointment_identifier`) VALUES (NULL, '$user_id', '$name', '$date', '$start', '$duration', '$description', '1', '$identifier')";

					$stmt = mysqli_prepare($conn, $insert_appointment);

					if($stmt)
					{
						$answer = mysqli_stmt_execute($stmt);
						
						if($answer)
						{
							array_push($sync_array, $user_id . " inserted");
						}
						else
						{
							array_push($sync_array, $insert_appointment . " error inserting");
						}
					}
					else
					{
						array_push($sync_array, $user_id . " error preparing");
					}
				}	    
			}
			else
			{
				array_push($sync_array, $phone_number . " databaseError");
			}
		}
		echo json_encode($sync_array);
	}
	else
	{
		echo json_encode("databaseError");
	}
}	
?>