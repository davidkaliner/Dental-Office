<?php

// Get user info according to login credentials

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['LoginData']))
{
    $login = $_POST['LoginData'];
    $username = $login['Username'];
    $password = $login['Password'];
	
    $login_query = "SELECT privilege, user_id
					FROM users
					WHERE user_name='$username' AND password='$password'";
	
	$result = array();
	
    if($run_query = mysqli_query($conn,$login_query))
    {
        $query_num_rows=mysqli_num_rows($run_query);
		
        if($query_num_rows == 0)
        {
            echo json_encode('Failed username or password not found');
        }
        else 
        {
			$row = mysqli_fetch_array($run_query, MYSQL_ASSOC);
            $privilege = $row['privilege'];
            $user_id = $row['user_id'];
			array_push($result, $privilege);
			array_push($result, $user_id);
			
			if($privilege == '1')
			{
				$credentials_query = "SELECT client_id, api_key, discovery_docs, scopes
									  FROM credentials
									  WHERE id='1'";
				
				if($run_query1 = mysqli_query($conn,$credentials_query))
				{
					$query_num_rows1 = mysqli_num_rows($run_query1);
					
					if($query_num_rows1 == 0)
					{
						echo json_encode('Failed to get credentials');
					}
					else 
					{
						$row1 = mysqli_fetch_array($run_query1, MYSQL_ASSOC);
						$client_id = $row1['client_id'];
						$api_key = $row1['api_key'];
						$discovery_docs = $row1['discovery_docs'];
						$scopes = $row1['scopes'];
						array_push($result, $client_id);
						array_push($result, $api_key);
						array_push($result, $discovery_docs);
						array_push($result, $scopes);
						$result = json_encode($result);
						echo "success" . $result;
					}
				}
				else
				{
					echo json_encode("database error");
				}
			}
			else
			{
				$result = json_encode($result);
				echo "success" . $result;
			}
        }	    
    }
    else
    {
        echo json_encode("database error");
    }
}
else
{
     echo json_encode('No login data');
}
?>