<?php
//require 'reciveing_data.php';
//require 'sending_data.php';
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


$username=$_POST['user'];
$password=$_POST['pass'];
$query="SELECT permissions
		FROM users_login
		WHERE username='$Username' AND password='$Password'";
if($run_query=mysqli_query($conn,$query))
{
	$query_num_rows=mysqli_num_rows($run_query);
	if($query_num_rows==0)
	{
		echo 'Username or password not found';
	}
	else 
	{
		echo 'Found'
	}	

}
else
{
	
	printf("error: %s\n",mysqli_error($conn));
}



?>