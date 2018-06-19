<?php

// Get about us info

header('Access-Control-Allow-Origin: *');

if(isset($_POST['aboutUsBit']))
{
    $about_us = array();
	
	$about_us_title = "Our Mission";
	$about_us_info = "We are a husband and wife team, working together with over 30 years experience as dentists. We are both graduates of Temple University in Philadelphia. We made aliya in 1998 and settled in the north. We believe in providing high quality treatment to all people while maintaining affordable pricing. We bring with us our unique perspective and Zionist ideals. We look forward to seeing you.
	Feel free to contact us with any question!";
	$about_us_contact_name = "Dr. Michele Kaliner: 054-4523001
							  Dr. Richard Kaliner: 054-5938111";
	$about_us_contact_email = "kalinerwork@gmail.com";						  
	array_push($about_us, $about_us_title);
	array_push($about_us, $about_us_info);
	array_push($about_us, $about_us_contact_name);
	array_push($about_us, $about_us_contact_email);
	echo json_encode($about_us);
}
?>