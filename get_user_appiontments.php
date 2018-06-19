<?php

// Get user appointments from database

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['UserId']))
{
	$user_id = $_POST['UserId'];
	$today = new DateTime();
	$interval = new DateInterval('P3W'); //3 weeks
	$dtDate = $today->add($interval);
    $date = $dtDate->format('Y-m-d');
	
	// 3 weeks max from the current date
    $get_user_appointments_query = "SELECT *
									FROM appointments
									WHERE user_id = '$user_id' AND date < '$date'";

	$user_appointments_arr = array();
							   
    if($run_query=mysqli_query($conn,$get_user_appointments_query))
    {
        $query_num_rows=mysqli_num_rows($run_query);
        if($query_num_rows==0)
        {
            echo json_encode('No appointments found');
        }
        else 
        {
			$index = 0;
			
            while($row = mysqli_fetch_array($run_query, MYSQL_ASSOC))
			{
				$user_appointment_object = array();
				
				$user_appointment_object['id'] = $row['id'];
				$user_appointment_object['date'] = $row['date'];
				$user_appointment_object['s_time'] = $row['s_time'];
				$user_appointment_object['duration'] = $row['duration'];
				$user_appointment_object['description'] = $row['description'];
				$user_appointment_object['approved'] = $row['approved'];

				$user_appointments_arr[$index] = $user_appointment_object;

				$index++;
			}
			$user_appointments_arr = json_encode($user_appointments_arr);
			echo "success" . $user_appointments_arr;
        }	    
    }
    else
    {
        echo json_encode("error");
    }
}
else
{
     echo json_encode('error');
}


	
?>