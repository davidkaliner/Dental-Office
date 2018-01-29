/*global $ document alert */

$(document).ready(function() {
    $("#login-page").show();
    $("#main-page").hide();
    $("#calender-page").hide();
     
    
    $(document.body).on('click',"#SubmitLogin",function () {
       var url = 'http://4024c384.ngrok.io';
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
                if(response == "Found")
                {
                   $("#login-page").hide();
                    $("#main-page").show(); 
                }
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    });
    
    
    $(document.body).on('click',"#AppointmentButton",function () {
        $("#login-page").hide();
        $("#main-page").hide();
        $("#calender-page").show();
    });
    
 function a(){
     var url = 'http://e422b9cb.ngrok.io';
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
        success: function(response) {
            alert(response);
        },
        error: function(response) {
            alert(response);
        }
    });
 }
 
$(document.body).on('click',"#Register",function () {
         a();
});
    
    
    
    
    
    
    
    
    /*
    $("Register").click(function(){
        $.post("Dental-registration.php",
        {
          Name: "test doctor",
          Username: "testdoc",
          Password: "12341234",
          Privilege: "1"
        },
        function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
        });
        
        alert("clicked!")
    });*/
    
   
    
    
 /*   
    
    $.post( 
    'Dental-registration.php', // location of your php script
    { Name: "testdoc", user_id: testdoc , Password: "12341234" , Privilege: "1" }, // any data you want to send to the script
    function( data ){  // a function to deal with the returned information

        $( 'body ').append( data );

    });
    */
   
});
