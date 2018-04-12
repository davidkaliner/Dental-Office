/*global $ document alert */

var mainFunction = (function()
{
    function userLogin(){
        var url = 'http://b4a54c41.ngrok.io';
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
    }
    
    function registerUser(){
        var url = 'http://b4a54c41.ngrok.io';
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
    
    $(document).ready(function(){
        $("#login-page").show();
        $("#main-page").hide();
        $("#calender-page").hide();
         
        $(document.body).on('click',"#SubmitLogin",function () {
            userLogin();
        });
    
        $(document.body).on('click',"#Register",function () {
            registerUser();
        });
    
        $(document.body).on('click',"#AppointmentButton",function () {
            $("#login-page").hide();
            $("#main-page").hide();
            $("#calender-page").show();
        });  
    });
    
}());
