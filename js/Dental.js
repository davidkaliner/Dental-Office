/*global $ document */

$(document).ready(function() {
    $("#login-page").show();
    $("#main-page").hide();
    $("#calender-page").hide();
    
    
    $(document.body).on('click',"#SubmitLogin",function () {
        $("#login-page").hide();
        $("#main-page").show();
});
    
    
    $(document.body).on('click',"#AppointmentButton",function () {
        $("#login-page").hide();
        $("#main-page").hide();
        $("#calender-page").show();
});
   
});
