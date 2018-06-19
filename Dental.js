var mainFunction = (function()
{
    var url = 'http://ec2-18-221-134-60.us-east-2.compute.amazonaws.com';
    var CLIENT_ID;
    var API_KEY;
    var DISCOVERY_DOCS;
    var SCOPES;
    var authorizeButton;
    var signoutButton;
    var UserID;
	var getPatientAppointmentsInterval;
	var syncCalendarToDBTimeOut;
	var getMyAppiontmentsInterval;
	var checksignedIn = 0;
	var BackGroundColorArr = [];
	var AppointmentChoiceId;
	var patientIdArr = [];
	var changeInfoDurationArr = [];
    //-----------------------Login doctor or patient-----------------------------------------------  
    function userLogin(){
        var dataLogin = {
              Username: document.getElementById('LoginUsername').value,
              Password: document.getElementById('LoginPassword').value
        };
        var LoginDataObj = {LoginData: dataLogin};
        $.ajax({
            type: "POST",
            url: url + '/dental_login.php',
            data: LoginDataObj,
            success: function(response) {
                response = response.trim();
                if(response.startsWith("success"))
                {
                    response = response.replace("success", "");
                    response = JSON.parse(response);
                    UserID = response[1];
                    if(response[0] == '1')
                    {
						CLIENT_ID = response[2];
						API_KEY = response[3];
						DISCOVERY_DOCS = [response[4]];
						SCOPES = response[5];
                        alert("Found doctor");
                        handleClientLoad();
                    }
                    else if(response[0] == '0')
                    {
                        alert("Found patient")
                        $("#login-page").hide();
                        $("#main-page").show();
						UserName = document.getElementById('LoginUsername').value;
						document.getElementById('HelloUserName').textContent = "Hello, " + UserName;
						getMyAppiontmentsInterval = setInterval(getAppointments,60000);
                    }
				}
                else
                {
                    alert(response);
                }
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    }
	//-----------------------Update personal information-------------------------------------------  
    function updatePersonalInfo(){
        var updateMyInfo = {
            UserId: UserID,
            Name: document.getElementById('updateName').value,
            Username: document.getElementById('updateUsername').value,
            Password: document.getElementById('updatePassword').value,
            Phone: document.getElementById('updatePhoneNum').value,
            Email: document.getElementById('updateEmail').value   
        };
        var updateInfoDataObj = {updateInfoData: updateMyInfo};
       
       $.ajax({
            type: "POST",
            url: url + '/update_info.php',
            data: updateInfoDataObj,
            success: function(response){
                response = response.trim();
                response = response.replace(/\"/g, "");
                alert(response);
                if(response == "Info updated successfully")
                {
                    $("#main-page").show();
                    $("#update-info").hide();
                }
            }
       });
    }
	//-----------------------Register new patient--------------------------------------------------    
    function registerUser(){
        var registerationObj = {
            Name: document.getElementById('registerName').value,
            Username: document.getElementById('registerUsername').value,
            Password: document.getElementById('registerPassword').value,
            Privilege: '0',
            Phone: document.getElementById('registerPhoneNum').value,
            Email: document.getElementById('registerEmail').value
        };
        var registerDataObj = {registerData: registerationObj};

        $.ajax({
            type: "POST",
            url: url + '/dental_registration.php',
            data: registerDataObj,
            success: function(response){
                response = response.trim();
                response = response.replace(/\"/g, "");
                alert(response);
                if(response == "Registered successfully")
                {
                    $("#login-page").show();
                    $("#register-info").hide();
                }
            },
            error: function(response){
                alert(response);
            }
        });
    }
	//-----------------------Schedule new appointment by patient-----------------------------------  
	function ScheduleAppointment(){
        var myAppointment = $('#datetimepicker12').data();
		if(document.getElementById("userDescription").value = "")
		{
			alert("please insert reason");
			return;
		}
		var myAppointmentObj = {
			appointment : myAppointment.date, 
			UserId : UserID, 
			description : document.getElementById("userDescription").value
		};
		$.ajax({
            type: "POST",
            url: url + '/new_appiontment_scheduler.php',
            data: myAppointmentObj,
            success: function(response){
                response = response.trim();
                response = response.replace(/\"/g, "");
                if(response == "success")
                {
					alert("Sent to doctor for approval");
					$("#patient-calender-page").hide();
					$("#main-page").show();
                }
				else
				{
					alert(response);
				}
            },
            error: function(response){
                alert(response);
            }
        });
	}
	//-----------------------Get patient appointments from database--------------------------------    
	function getAppointments(){
		var userAppointmentObj = {UserId : UserID};
		$.ajax({
            type: "POST",
            url: url + '/get_user_appiontments.php',
            data: userAppointmentObj,
            success: function(response){
                response = response.trim();
                if(response.startsWith("success"))
                {
					response = response.replace('success','');
					response = JSON.parse(response);
					ShowAppointments(response);
                }
				else
				{
					alert(response);
				}
            },
            error: function(response){
                alert(response);
            }
        });
	}
	//-----------------------Show patient appointments table---------------------------------------	
	function ShowAppointments(Appointments){
		$("#upcomingAppointments").html('');
		if(Appointments == null)
		{
			return;
		}
			
		var TitleArr = ["#", "Date", "StartTime", "Duration", "Description", "Approved"];
		var val = 0;
		var tempArr = [];
		var table = $('<table class="table"></table>');
		var thead = $('<thead></thead>');
		var MyCols = 6;
		var row = $('<tr></tr>');
		for(var k = 0; k < TitleArr.length; k++)
		{
			var col = $('<th scope="col">'+ TitleArr[k] +'</th>');
			row.append(col);
		}
		thead.append(row);
		table.append(thead); // Add titles of the table

		var tbody = $('<tbody></tbody>');
		
		var datepickercols = [];
			
		patientIdArr[0] = "";
		
		changeInfoDurationArr[0] = "";
		
		for(var i = 0; i < Appointments.length; i++) // Get info from database and add to table
		{
			var num = val + 1;
			patientIdArr[num] = Appointments[val].id;
			tempArr[0] = Appointments[val].date;
			tempArr[1] = Appointments[val].s_time;
			tempArr[2] = Appointments[val].duration;
			tempArr[3] = Appointments[val].description;
			tempArr[4] = Appointments[val].approved;
			
			changeInfoDurationArr[num] = Appointments[val].duration;
			tempArr[1] = tempArr[1].split('.')[0];
			tempArr[2] = tempArr[2].split('.')[0];
			
			var row = $('<tr></tr>');
			
			var rowId = $('<th scope="row">'+ num +'</th>');
			row.append(rowId);
			
			for(var j = 0; j < MyCols - 1; j++)
			{
				var col = $('<td>'+ tempArr[j] +'</td>');
				row.append(col);
			}
			if(j == MyCols - 1) // Add tow buttons for date change and to update
			{
				datepickercols[val] = $('<td><div class="input-append date form_datetime"><input size="16" type="text" value="" readonly><span class="add-on"><i class="icon-remove"></i></span><span class="add-on"><i class="icon-calendar"></i></span></div></td>');
				row.append(datepickercols[val]);
				var col = $('<td><button id="updateBtn" class="updateBtnStyle">update</button></td>');
				row.append(col);
			}
			tbody.append(row);
			val++;
			tempArr = [];
		}
		table.append(tbody);
		$('#upcomingAppointments').append(table);
		for(var s = 0; s < datepickercols.length; s++)
		{
			$(".form_datetime", datepickercols[val]).datetimepicker({
				format: "dd MM yyyy - hh:ii",
				autoclose: true,
				todayBtn: true,
				pickerPosition: "bottom-left"
			});
		}
	}
	//-----------------------Load auth2 of the google calendar-------------------------------------    
    function handleClientLoad() { 
        gapi.load('client:auth2', initClient);
    }
	//-----------------------Init auth2 client-----------------------------------------------------
    function initClient() {
        gapi.client.init({
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
        }).then(function () {
			// Listen for sign-in state changes.
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
			// Handle the initial sign-in state.
			updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			authorizeButton.onclick = handleAuthClick();
			signoutButton.onclick = handleSignoutClick();
        });
    }
	//-----------------------Check if google accout signed in successfully-------------------------   
    function updateSigninStatus(isSignedIn){
        if (isSignedIn && checksignedIn == 0) 
        {
			checksignedIn++;
        }
		else if(isSignedIn && checksignedIn == 1)
		{
			authorizeButton.style.display = 'none';
			signoutButton.style.display = 'block';
			$("#login-page").hide();
			$("#google-calender-page").show();
			getPatientAppointmentsInterval = setInterval(DoctorAppointments,60000);
			syncCalendarToDBInterval = setInterval(syncCalendarToDatabase,60000);
		}
        else 
        {
			authorizeButton.style.display = 'block';
			signoutButton.style.display = 'none';
        }
    }
	//-----------------------Authrize google account button----------------------------------------    
    function handleAuthClick(){
        gapi.auth2.getAuthInstance().signIn();
    }
	//-----------------------SignOut google account button-----------------------------------------   
    function handleSignoutClick(){
        gapi.auth2.getAuthInstance().signOut();
    }
	//-----------------------Get calendar upcoming appointments------------------------------------    
    function syncCalendarToDatabase(){
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 30,
          'orderBy': 'startTime'
        }).then(function(response){
            var events = response.result.items;
            if (events.length > 0) 
            {
				var syncEventsObj = {calendarAppointments : events};
				$.ajax({
					type: "POST",
					url: url + '/calendar_to_db.php',
					data: syncEventsObj,
					success: function(response){

					},
					error: function(response){

					}
				});	
            }
        });
    }
	//-----------------------Appointments from the database---------------------------------------- 
	function DoctorAppointments()
	{
		var AppointObj = {AppointBit: true};
		$("#Appointments").html('');
		$.ajax({
			type: "POST",
			url: url + '/appointments_from_db.php',
			data: AppointObj,
			success: function(response){
				response = response.trim();
				if(response.startsWith("success"))
				{
					response = response.replace('success','');
					response = JSON.parse(response);
					Appointments = response;
					var container = $('<div class="contianer">');
					var row = $('<div class="row">');
					var listGroup = $('<div class="col-xs-8 list-group">');		
					for(var i = 0; i < Appointments.length; i++)
					{
						var id = Appointments[i].id; 			
						var name = Appointments[i].name; 
						var date = Appointments[i].date;
						var newDate = Appointments[i].new_date;
						var startTime = Appointments[i].s_time;
						if(startTime != null)
						{
							startTime = startTime.split('.')[0];
						}
						else
						{
							startTime = "";
						}
						var newStartTime = Appointments[i].new_s_time;
						newStartTime = newStartTime.split('.')[0];
						var duration = Appointments[i].duration;
						if(duration != null)
						{
							duration = duration.split('.')[0];
						}
						else
						{
							duration = "";
						}
						var newDuration = Appointments[i].new_duration;
						newDuration = newDuration.split('.')[0];			
						var description = Appointments[i].description;
						var button = $('<button type="button" class="list-group-item" id="'+ id +'"><label class="list-group-item-heading">' + name + '</label><label class="list-group-item-heading">' + date + '->' + newDate +'</label><label class="list-group-item-heading">' + startTime + '->' + newStartTime +'</label><label class="list-group-item-heading">' + duration + '->' + newDuration +'</label><label class="list-group-item-heading">' + description + '</label></button>');
						var buttonColor = ChooseButtonColor();
						button.css('backgroundColor', buttonColor);
						button.css('margin-top', '20px');
						var rgb = button.css('backgroundColor');
						var brightness = lightOrDark(rgb);
						if(brightness == "light")
						{
							button.children()[0].style.color = "black";
							button.children()[1].style.color = "black";
						}
						else
						{
							button.children()[0].style.color = "white";
							button.children()[1].style.color = "white";
						}
						BackGroundColorArr.push(buttonColor);
						listGroup.append(button);
					}
					row.append(listGroup);
					container.append(row);
					$('#Appointments').append(container);
					$("#Appointments").show();
				}
			}
		});
	}
	//-----------------------Choose a background color---------------------------------------------	
	function ChooseButtonColor(){
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		for (var j = 0; j < BackGroundColorArr.length; j++) {
			if(BackGroundColorArr[j] == color)
				color = ChooseButtonColor();
		}
		return color;
	}
	//-----------------------Choose a text background color----------------------------------------
	function lightOrDark(bgcolor){
		var r, b, g, hsp; 
		var a = bgcolor;

		if(a.match(/^rgb/)) 
		{
		  a = a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
		  r = a[1];
		  g = a[2];
		  b = a[3];
		} 
		else {
		  a = +("0x" + a.slice(1).replace(a.length < 5 && /./g, '$&$&'));
		  r = a >> 16;
		  g = a >> 8 & 255;
		  b = a & 255;
		}

		hsp = Math.sqrt(
		  0.299 * (r * r) +
		  0.587 * (g * g) +
		  0.114 * (b * b)
		);

		if(hsp > 127.5) 
		{
		  return "light";
		} 
		else 
		{
		  return "dark";
		}
	}
	//-----------------------Approve or decline an appointment-------------------------------------	
	function updateAppointment(result){
        var answerObj = {id : AppointmentChoiceId, answer : result};
		$('#AppointmentChoiceId').hide();
        $.ajax({
            type: "POST",
            url: url + '/appointments_decision.php',
            data: answerObj,
            success: function(response){
                response = response.trim();
				if(response.startsWith("success"))
				{
					response = response.replace('success','');
					response = JSON.parse(response);
					addApprovedAppointment(response);
				}
            },
            error: function(response){
                alert(response);
            }
        });
	}
	
	function addApprovedAppointment(response){
		SCOPES = "https://www.googleapis.com/auth/calendar";
		var event = {
			'summary': response['summary'],
			'description': response['description'],
			'start': {
				'dateTime': response['s_dateTime'],
				'timeZone': 'Asia/Jerusalem'
			},
			'end': {
				'dateTime': response['e_dateTime'],
				'timeZone': 'Asia/Jerusalem'
			}
		};

		var request = gapi.client.calendar.events.insert({
			'calendarId': 'primary',
			'resource': event
		});

		request.execute(function(event) {
			alert("event created");
			SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
			var updateIdentifierObj = {identifier : event.id, id : AppointmentChoiceId};
			$.ajax({
				type: "POST",
				url: url + '/update_identifier.php',
				data: updateIdentifierObj,
				success: function(response){
					alert(response);
				},
				error: function(response){
					alert(response);
				}
			});
		});
	}
	//-----------------------Change Appointment----------------------------------------------------
	function updatePatientInfo(appointment_id, changeDate, myDuration){
		var updateInfoObj = {id : appointment_id, date : changeDate, duration : myDuration};
		$.ajax({
			type: "POST",
			url: url + '/update_appointment.php',
			data: updateInfoObj,
			success: function(response){
				response = response.trim();
                response = response.replace(/\"/g, "");
                if(response == "success")
                {
					alert("Sent to doctor for approval");
                }
			},
			error: function(response){
				alert(response);
			}
		});
	}
	//-----------------------Get about us info-----------------------------------------------------
	function AboutUsInfo(){
		var aboutusObj = {aboutUsBit : true};
        $.ajax({
            type: "POST",
            url: url + '/about_us.php',
            data: aboutusObj,
            success: function(response){
                response = response.trim();
				response = JSON.parse(response);
				document.getElementsByClassName("AboutUsTitle").value = response[0];
				document.getElementsByClassName("AboutUsInfo").value = response[1];
				document.getElementsByClassName("AboutUsContactName").value = response[2];
				document.getElementsByClassName("AboutUsContactEmail").value = response[3];
            },
            error: function(response){
                alert(response);
            }
        });
	}
	//-----------------------On page start---------------------------------------------------------
    $(document).ready(function(){
        authorizeButton = document.getElementById('authorize-button');
        signoutButton = document.getElementById('signout-button');
        $("#login-page").show();
        $("#google-calender-page").hide();
        $("#patient-calender-page").hide();
        $("#main-page").hide();
        $("#update-info-page").hide();
        $("#register-info-page").hide();
		$("#about-us-page").hide();
        frame = document.getElementById('googleIframe');
	//-------------------------------------------Doctor side---------------------------------------
		//-------------------Submit login credentials----------------------------------------------       
        $(document.body).on('click',"#SubmitLogin",function () {
            userLogin();
        });
		//-------------------Enter registeration page----------------------------------------------
        $(document.body).on('click',"#RegisterPage",function () {
            $("#register-info-page").show();
            $("#login-page").hide();
        });
		//-------------------Register new patient--------------------------------------------------
        $(document.body).on('click',"#registerInfo",function () {
            registerUser();
        });
		//-------------------Go back from registeration page to login page-------------------------     
        $(document.body).on('click',"#BackRegisterInfo",function () {
            $("#login-page").show();
            $("#register-info-page").hide();
        });
		//-------------------Choose an appointment to accept or reject-----------------------------
		$(document).on("click", ".list-group-item", function(){ // Choose the event to manage
			AppointmentChoiceId = $(this).attr("id");
			document.getElementById('patientName').innerHTML = $(this).children()[0].textContent;
			document.getElementById('appointDate').innerHTML = $(this).children()[1].textContent;
			document.getElementById('appointStime').innerHTML = $(this).children()[2].textContent;
			document.getElementById('appointDuration').innerHTML = $(this).children()[3].textContent;
			document.getElementById('appointDes').innerHTML = $(this).children()[4].textContent;
			$('#appointmentModal').modal('show');
		});
		//-------------------Approve a patient appointment-----------------------------------------       
        $(document.body).on('click',"#ApproveApoint",function (){
			updateAppointment('1');
        });
        //-------------------Decline a patient appointment----------------------------------------- 
        $(document.body).on('click',"#DeclineApoint",function (){
			updateAppointment('0');
        });
		//-------------------Logout from system----------------------------------------------------      
        $(document.body).on('click',"#signout-button",function (){
            $("#google-calender-page").hide();
            $("#login-page").show();
        });
	//-------------------------------------------Patient side--------------------------------------
		//-------------------Send new date and time to the doctor----------------------------------		
		$(document).on("click", "#updateBtn", function(){ // Edit expense properties button
			$(this).disabled = true;
			var row = $(this).parent().parent();
			var id = row.children("th")[0].textContent;
			var changeDate = $(".form_datetime")[id-1].firstChild.value;
			var appointment_id = patientIdArr[id];
			var myDuration = changeInfoDurationArr[id];
			updatePatientInfo(appointment_id, changeDate, myDuration);
		});
		//-------------------Enter datepick page---------------------------------------------------
        $(document.body).on('click',"#NewAppointmentBtn",function () {
            $("#patient-calender-page").show();
            $("#main-page").hide();
        }); 
		//-------------------Choose date and time--------------------------------------------------       
        $('#datetimepicker12').datetimepicker({
            inline: true,
            sideBySide: true
        });		
		//-------------------Send new appointment date and time to the doctor----------------------       
        $(document.body).on('click',"#SendDatePick",function () {
			ScheduleAppointment();
        });
		//-------------------Go back from datepick page to the main page---------------------------       
        $(document.body).on('click',"#BackDatePick",function () {
            $("#main-page").show();
            $("#patient-calender-page").hide();
        });
		//-------------------Enter about us page---------------------------------------------------
        $(document.body).on('click',"#AboutUsBtn",function () {
			AboutUsInfo();
            $("#about-us-page").show();
            $("#main-page").hide();
        });
		//-------------------Go back from about us page to the main page---------------------------      
        $(document.body).on('click',"#BackAboutUS",function () {
            $("#main-page").show();
            $("#about-us-page").hide();
        });	
		//-------------------Enter update info page------------------------------------------------       
        $(document.body).on('click',"#UpdateInfoBtn",function () {
            $("#update-info-page").show();
            $("#main-page").hide();
        });
		//-------------------Update info in the database-------------------------------------------        
        $(document.body).on('click',"#UpdateNewInfo",function () {
            updatePersonalInfo();
        });		
		//-------------------Go back from update info page to the mainpage-------------------------        
         $(document.body).on('click',"#BackUpdateInfo",function () {
            $("#main-page").show(); 
            $("#update-info-page").hide();
        });
		//-------------------LogOut from system patient--------------------------------------------
        $(document.body).on('click',"#LogoutBtn",function (){
            $("#main-page").hide();
            $("#login-page").show();
        });  
    });
}());