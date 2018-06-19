<?php

// New appointment sechduling by the client

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['appointment']) && isset($_POST['UserId']) && isset($_POST['description']))
{
	mysqli_set_charset($conn, "utf8");
	
	$user_id = $_POST['UserId'];
	
	$details_query = "SELECT name
					  FROM users
					  WHERE user_id = '$user_id'";
						  
	if($run_query=mysqli_query($conn,$details_query))
	{
		$query_num_rows=mysqli_num_rows($run_query);
		if($query_num_rows==0)
		{
			echo json_encode("Can't find name of user");
		}
		else
		{
			$row = mysqli_fetch_array($run_query, MYSQL_ASSOC);
            $name = $row['name'];
			$appointment = $_POST['appointment'];
			$dt = new dateTime($appointment);
			$date = $dt->format('Y-m-d');
			$start = $dt->format('H:i');
			$dtDuration = new dateTime("12:15:00");
			$duration = $dtDuration->format('s:i');
			$description = $_POST['description'];

			$insert_appointment = "INSERT INTO `appointments`(`id`,`user_id`,`name`,`new_date`, `new_s_time`, `new_duration`, `description`, `approved`) VALUES (NULL, '$user_id', '$name', '$date', '$start', '$duration', '$description', '0')";
			
			$stmt = mysqli_prepare($conn, $insert_appointment);
			
			if($stmt)
			{
				$result = mysqli_stmt_execute($stmt);
				
				if($result)
				{
					echo json_encode('success');
				}
				else
				{
					echo json_encode('error executing');
				}
			}
			else
			{
				echo json_encode('error preparing');
			}
		}
	}
	else
	{
		echo json_encode('Database error');
	}
}

	
?>