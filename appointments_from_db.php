<?php

// Get all unapproved patient appointments

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['AppointBit']))
{
	mysqli_set_charset($conn, "utf8");
	
    $get_appointments_query = "SELECT *
							   FROM appointments
							   WHERE approved = '0'";

	$appointment_arr = array();
							   
    if($run_query = mysqli_query($conn,$get_appointments_query))
    {
        $query_num_rows = mysqli_num_rows($run_query);
        if($query_num_rows == 0)
        {
            echo json_encode('No appointments found');
        }
        else 
        {
			$index = 0;
			
            while($row = mysqli_fetch_array($run_query, MYSQL_ASSOC))
			{
				$appointment_object = array();
						
				$appointment_object['id'] = $row['id'];
				
				$appointment_object['name'] = $row['name'];
				
				$appointment_object['date'] = $row['date'];
				
				if($row['new_date'] != NULL)
					$appointment_object['new_date'] = $row['new_date'];
				else
					$appointment_object['new_date'] = "";
				
				$appointment_object['s_time'] = $row['s_time'];
				
				if($row['new_s_time'] != NULL)
					$appointment_object['new_s_time'] = $row['new_s_time'];
				else
					$appointment_object['new_s_time'] = "";
				
				$appointment_object['duration'] = $row['duration'];
				
				if($row['new_duration'] != NULL)
					$appointment_object['new_duration'] = $row['new_duration'];
				else
					$appointment_object['new_duration'] = "";
				
				$appointment_object['description'] = $row['description'];

				$appointment_arr[$index] = $appointment_object;

				$index++;
			}
			$appointment_arr = json_encode($appointment_arr);
			echo "success" . $appointment_arr;
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