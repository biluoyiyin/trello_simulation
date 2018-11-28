"use strict";


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
})

function createGroup(){
    var data_to_back = {};
    data_to_back["groupName"] = $(".newgroupname").val();
    $.post("addGroup", data_to_back, function (Date){
        if (Date == "group existed."){
            alert("group existed.");
        } else if(Date == "success") {
            /*
            var groupname = $(".newgroupname").val();
            var con = $(".container")[0];
            var newdiv = document.createElement("div");
            newdiv.classname = "grouplist";
            var a = document.createElement("a");
            a.href = ".?group=" + groupname;
            $(a).text(" gourp name:  " + groupname +" " );
            var bu = document.createElement("button");
            bu.name = "deltask";
            bu.type = "button";
            bu.value = groupname;
            $(bu).text("leave this group");
            newdiv.appendChild(a);
            newdiv.appendChild(bu);
            con.appendChild(newdiv);
            console.log(newdiv);
            */
            location.reload();
        }
    })
}

function invite(){
    var data_to_back = {};
    if ($(this).parent().find('input').val() == $("#user")[0].getAttribute("name")){
        alert("cannot invite yourself.");
        return
    }
    data_to_back["f_username"] = $(this).parent().find('input').val();
    data_to_back["groupname"] = $(this).parent().parent().children().find('button').val();
    $.post("invite", data_to_back, function (Date){
        if (Date != "success"){
            alert(Date);
        } else {
            location.reload();
        }
    })
}

$("button[name='deltask']").on("click", function(e){
    var data_to_back = {};
    data_to_back["groupname"] = this.value;
    $.post("leave", data_to_back, function (Date){
        if (Date != "success"){
            alert(Date);
        } else {
            location.reload();
        }
    })
})

$(".creatBord").on("click", createGroup);

$(".invite").on("click", invite);

