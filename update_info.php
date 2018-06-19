<?php

// Update the client information

header('Access-Control-Allow-Origin: *');

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['updateInfoData']))
{
	mysqli_set_charset($conn, "utf8");
	
    $update_info = $_POST['updateInfoData'];
    $user_id = $update_info['UserId'];
    $name = $update_info['Name'];
    $username = $update_info['Username'];
    $password = $update_info['Password'];
    $phoneNum = $update_info['Phone'];
    $email = $update_info['Email'];
    
    $update_info = array($name,$username,$password,$phoneNum,$email);
    
    if(empty($update_info[0]) and empty($update_info[1]) and empty($update_info[2]) and empty($update_info[3]) and empty($update_info[4]))
    {
        echo json_encode("Please fill one of the fields");
        exit();
    }
	
    $get_info_query = "SELECT *
                       FROM users
                       WHERE user_id='$user_id'";
    
    if($info = mysqli_query($conn,$get_info_query))
    {
        $info_row = mysqli_fetch_array($info, MYSQL_ASSOC);
		
        if($username == $info_row['user_name'])
        {
            echo json_encode('User name already exists');
            exit();
        }
        else if($phoneNum == $info_row['phone_number'])
        {
            echo json_encode('Phone number already exists');
            exit();
        }
        else if($email == $info_row['email'])
        {
            echo json_encode('Email already exists');
            exit();
        }
        
        if(empty($name))
        {
            $name = $info_row['name'];
        }
        if(empty($username))
        {
            $username = $info_row['user_name'];
        }
        if(empty($password))
        {
            $password = $info_row['password'];
        }
        if(empty($phoneNum))
        {
            $phoneNum = $info_row['phone_number'];
        }
        if(empty($email))
        {
            $email = $info_row['email'];
        }
        
        $insert_new_info_query = "UPDATE users
                                  SET name = '$name', user_name = '$username', password = '$password', phone_number = '$phoneNum', email = '$email'
                                  WHERE User_Id = '$user_id'";
            
        $stmt = mysqli_prepare($conn, $insert_new_info_query) or die(mysqli_error($conn));

        $result = mysqli_stmt_execute($stmt);

        if($result)
        {
            echo json_encode('Info updated successfully');
        }
        else
        {
            echo json_encode('Error updating');
        } 
    }
    else
    {
        echo json_encode('Error getting information from database');
    }
}
?>