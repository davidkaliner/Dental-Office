/*global $ document alert */

var mainFunction = (function()
{
   /* $(document).ready(function(){
      var date_input=$('input[name="date"]'); //our date input has the name "date"
      var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
      var options={
        format: 'dd/mm/yyyy',
       container: container,
        todayHighlight: true,
        autoclose: true,
      };
      date_input.datepicker(options);
    })*/
    var url = 'http://ec2-18-221-134-60.us-east-2.compute.amazonaws.com';
    var CLIENT_ID = '512318917553-vukvellsr2371gfrcj197ms2hc1g2hni.apps.googleusercontent.com';
    var API_KEY = '<YOUR_API_KEY>';
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
    
    function userLogin(){
        var dataLogin = {
              Username: document.getElementById('InputUsername').value,
              Password: document.getElementById('InputPassword').value
        };
        var dataObj1 = {mydata1: dataLogin};
        $.ajax({
            type: "POST",
            url: url + '/Dental-login.php',
            data: dataObj1,
            success: function(response) {
                alert(response);
                response = response.trim();
                response = response.replace(/\"/g, "");
                if(response == "Found doctor")
                {
                    $("#login-page").hide();
                    $("#main-page").hide();
                    $("#google-calender-page").show();
                     
                }
                else(response == "Found patient")
                {
                   $("#login-page").hide();
                    $("#main-page").show();
                     
                }
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    }
    
    function registerUser(){
        var dataTest = {
            Name: "test doctor",
            Username: "testdoc",
            Password: "12341234",
            Privilege: "1"
        };
        var dataObj = {mydata: dataTest};

        $.ajax({
            type: "POST",
            url: url + '/Dental-registration.php',
            data: dataObj,
            success: function(response){
                alert(response);
            },
            error: function(response){
                alert(response);
            }
        });
    }
    
    function ScheduleAppointment(){
        
        
    }
    
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }
    
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
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }
    
    function updateSigninStatus(isSignedIn){
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listUpcomingEvents();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }
    
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }
    
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }
    
    function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
    
    function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }
    
    $(document).ready(function(){
        $("#login-page").show();
        $("#calender-page").hide();
        $("#PatientFilesButton").hide();
        $("#main-page").hide();
        $("#update-info").hide();
         
        $(document.body).on('click',"#SubmitLogin",function () {
            userLogin();
        });
    
        $(document.body).on('click',"#Register",function () {
            registerUser();
        });
    
        $(document.body).on('click',"#AppointmentButton",function () {
            $("#login-page").hide();
            $("#main-page").hide();
            $("#PatientFilesButton").hide();
            $("#calender-page").show();
            $("#update-info").hide();
            
        });
        
        $(document.body).on('click',"#PatientFilesButton",function () {
            $("#login-page").hide();
            $("#main-page").hide();
            $("#calender-page").hide();
            $("#patient-files").show();
            $("#update-info").hide();
        });
        
        $(document.body).on('click',"#BackDatePick",function () {
            $("#login-page").hide();
            $("#calender-page").hide();
            $("#patient-files").hide();
            $("#main-page").show();
            $("#update-info").hide();
        });
        
        
        $(document.body).on('click',"#UpdateInfo",function () {
            $("#login-page").hide();
            $("#main-page").hide();
            $("#calender-page").hide();
            $("#PatientFilesButton").hide();
            $("#update-info").show();
        });
        
         $(document.body).on('click',"#BackUpdateInfo",function () {
            $("#login-page").hide();
            $("#calender-page").hide();
            $("#patient-files").hide();
            $("#main-page").show();
            $("#update-info").hide();
        });
        
        $('#datetimepicker12').datetimepicker({
                        inline: true,
                        sideBySide: true
        });
    });
    
    

    
    
}());
