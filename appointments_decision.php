<?php

// Approve or Decline Patient appointments

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['answer']) && isset($_POST['id']))
{
	mysqli_set_charset($conn, "utf8");
	
	$answer = $_POST['answer'];
	$id = $_POST['id'];

	if($answer == '1')
	{
		$update_appointment = "UPDATE appointments
							   SET date = new_date, s_time = new_s_time, duration = new_duration, new_date = '', new_s_time = '', new_duration = '', approved = '1'
							   WHERE id = '$id'";
		
		$stmt = mysqli_prepare($conn, $update_appointment);
			
		if($stmt)
		{
			$result = mysqli_stmt_execute($stmt);
			
			if($result)
			{
				$get_appointment_query = "SELECT *
										  FROM appointments
										  WHERE id = '$id'";
 
				if($run_query = mysqli_query($conn,$get_appointment_query))
				{
					$user_id = $row['user_id'];
					$get_phone_number_query = "SELECT phone_number
										       FROM users
										       WHERE user_id = '$user_id'";
					if($run_query1 = mysqli_query($conn,$get_phone_number_query))
					{
						$row_phone_num = mysqli_fetch_array($run_query1, MYSQL_ASSOC);
						$appointment_arr['summary'] = $row['name'] + " " + row_phone_num['phone_number'];
						$appointment_arr['description'] = $row['description'];
						$date = $row['date'];
						$s_time = $row['s_time'];
						$dtStart = new dateTime($date + $s_time);
						$dtEnd = date_sub($dtStart, date_interval_create_from_date_string($row['duration']));
						$appointment_arr['s_dateTime'] = $dtStart->format(DateTime::ATOM);
						$appointment_arr['e_dateTime'] = $dtEnd->format(DateTime::ATOM);
						$appointment_arr = json_encode($appointment_arr);
						echo "success" . $appointment_arr;
					}
					else
					{
						echo json_encode("database error");
					}
				}
				else
				{
					echo json_encode("database error");
				}
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
	else if($answer == '0')
	{
		$get_appointment_query = "SELECT date
							      FROM appointments
							      WHERE id = '$id'";
 
		if($run_query1 = mysqli_query($conn,$get_appointment_query))
		{
			$row = mysqli_fetch_array($run_query1, MYSQL_ASSOC);
			if($row['date'] == NULL)
			{
				$appointment_query = "DELETE 
									  FROM appointments
							          WHERE id = '$id'";
			}
			else
			{
				$appointment_query = "UPDATE appointments
							          SET new_date = '', new_s_time = '', new_duration = ''
							          WHERE id = '$id'";
			}
			$stmt1 = mysqli_prepare($conn, $appointment_query);
			
			if($stmt1)
			{
				$result1 = mysqli_stmt_execute($stmt1);
				
				if($result1)
				{
					echo json_encode('declined');
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
		else
		{
			echo json_encode('database error');
		}
	}
	else
	{
		echo json_encode('answer error');
		exit();
	}
}
else
{
	 echo json_encode('error not set');
}
?>