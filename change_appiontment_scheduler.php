<?php

// New appointmnet sechduleing by the client

header('Access-Control-Allow-Origin: *');

$mysql_host='localhost';
$mysql_user='root';
$mysql_pass='';
$mysql_db='dental_database';
$conn = new mysqli($mysql_host, $mysql_user, $mysql_pass);

if (mysqli_connect_errno())
{
	printf("Connection failed: ",mysqli_connect_error());
	exit();
} 

$conn->select_db ( $mysql_db );

if(isset($_POST['appointment']) && isset($_POST['UserId']))
{
	$appointment = $_POST['appointment'];
	$user_id = $login['UserId'];

    $schedule_query = "SELECT *
					   FROM appointments
					   WHERE user_id='$user_id' AND password='$password'";
			
    if($run_query=mysqli_query($conn,$query))
    {
        $query_num_rows=mysqli_num_rows($run_query);
        if($query_num_rows==0)
        {
            echo json_encode('failed Username or password not found');
        }
        else 
        {
            $row = mysqli_fetch_array($run_query, MYSQL_ASSOC);
            $privilege = $row['privilege'];
            $user_id = $row['user_id'];
            $result = array();
            array_push($result, $privilege);
            array_push($result, $user_id);
            echo json_encode($result);
        }	    
    }
	if($answer == '1')
	{
		$update_appointment = "UPDATE appointments
							   SET date = new_date, s_time = new_s_time, e_time = new_e_time, new_date = "", new_s_time = "", new_e_time = ""
							   WHERE id = '$id'";
	}
	else if($answer == '0')
	{
		$update_appointment = "UPDATE appointments
							   SET new_date = "", new_s_time = "", new_e_time = ""
							   WHERE id = '$id'";
	}
	else
	{
		echo json_encode('answer error');
		exit();
	}
	
	$stmt = mysqli_prepare($conn, $update_appointment);
			
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
else
{
	 echo json_encode('error not set');
}

	
?>