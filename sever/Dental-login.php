<?php
//require 'reciveing_data.php';
//require 'sending_data.php';
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

if(isset($_POST['mydata1']))
{
    $login = $_POST['mydata1'];
    $username = $login['Username'];
    $password = $login['Password'];
    $query="SELECT Privilege
            FROM users_login
            WHERE Username='$username' AND Password='$password'";

    if($run_query=mysqli_query($conn,$query))
    {
        $query_num_rows=mysqli_num_rows($run_query);
        if($query_num_rows==0)
        {
            echo json_encode('Username or password not found');
        }
        else 
        {
            echo json_encode('Found');
        }	

    }
    else
    {

        printf("error: %s\n",mysqli_error($conn));
    }
}
else
{
     echo json_encode('error');
}



?>