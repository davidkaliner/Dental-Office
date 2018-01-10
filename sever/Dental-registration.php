<?php
header('Access-Control-Allow-Origin: *');
session_start();

$mysql_host='localhost';
$mysql_user='root';
$mysql_pass='';
$mysql_db='Dental_database';
$conn = new mysqli($mysql_host, $mysql_user, $mysql_pass);

if (mysqli_connect_errno())
{
	printf("Connection failed: ",mysqli_connect_error());
	exit();
} 

$conn->select_db ( $mysql_db );

if(isset($_POST['mydata']))
{
	$request=$_POST['mydata'];
    $name = $request['Name'];
    $user = $request['Username'];
    $pass = $request['Password'];
    $privil = $request['Privilege'];
        
	if($name != '' && $user != '' && $pass !='' && $privil != '')
	{	
		$query = "INSERT INTO `users_login` (Name,Username,Password,Privilege)    
                  VALUES('$name','$user','$pass','$privil')";
        if(mysqli_query($conn, $query))
            echo json_encode("New user registerd");
        else
            echo json_encode("Error");
	}
	
}
?>