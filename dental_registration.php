<?php

// new client registration

header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; utf-8');  

include 'connect.php';

$conn = connect();

if(!$conn)
{
	echo json_encode("Error connecting to database");
	exit();
}

if(isset($_POST['registerData']))
{
	
	mysqli_set_charset($conn, "utf8");
	
    $register_info = $_POST['registerData'];
    $name = $register_info['Name'];
    $username = $register_info['Username'];
    $password = $register_info['Password'];
    $privilege = $register_info['Privilege'];
    $phoneNum = $register_info['Phone'];
    $email = $register_info['Email'];
    
    foreach(array($name,$username,$password,$phoneNum,$email) as $register_info)
    {
        if(empty($register_info))
        {
            echo json_encode("Please fill all fields");
            exit();
        }
    }

    $get_info_query = "SELECT user_name, phone_number, email
                       FROM users";
    
    if($info=mysqli_query($conn,$get_info_query))
    {
        while($info_row = mysqli_fetch_array($info, MYSQL_ASSOC))
        {
            if($username == $info_row['user_name'])
            {
                echo json_encode('username already exists');
                exit();
            }
            else if($phoneNum == $info_row['phone_number'])
            {
                echo json_encode('phone number already exists');
                exit();
            }
            else if($email == $info_row['email'])
            {
                echo json_encode('email already exists');
                exit();
            }
        }
        
        $insert_new_info_query="INSERT INTO users(name, user_name, password, privilege, phone_number, email)
                                VALUE('$name', '$username', '$password', '$privilege', '$phoneNum', '$email')";

        $stmt = mysqli_prepare($conn, $insert_new_info_query) or die(mysqli_error($conn));

        $result = mysqli_stmt_execute($stmt);

        if($result)
        {
            echo json_encode('Registered successfully');
        }
        else
        {
            echo json_encode('Error registering');
        }
 
    }
    else
    {
        echo json_encode('Error getting information from database');
    }
}
?>