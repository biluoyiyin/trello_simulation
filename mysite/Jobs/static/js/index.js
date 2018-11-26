"use strict";
var todoSeq;
var doingSeq;
var doneSeq;

// add a new board
function makeNewborad(){
    var nb = document.createElement("div");
    var title = document.createElement("div");
    title.textContent = "New task";
    title.className = "ptitle";
    nb.appendChild(title);
    var duetime = document.createElement("div");
    duetime.textContent = "null";
    duetime.className = "duetime";
    nb.appendChild(duetime);
    var describe = document.createElement("div");
    describe.textContent = "";
    describe.className = "pdescribe";
    nb.appendChild(describe);
    nb.className = "board";
    nb.setAttribute("contents", "");
    //set the unique id is the time created.
    nb.setAttribute("name", Date.now());
    nb.setAttribute("tag", "azure");
    var data_to_back = {
        "title": "New task",
        "duetime": "null",
        "tag": "azure",
        "describe": "",
        "contents": "",
    }
    to_back_single(nb, data_to_back);
    return nb;
}


// add new one
document.addEventListener('click', function (e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;

    if (target.matches("div.newboard")) {
        var boards = target.parentNode.childNodes[3];
        var that = makeNewborad()
        boards.appendChild(that);
        boardChange(that.parentNode.getAttribute("name"), null);
    }
})

// code for change tag color
function changeTag(target, color){
    $(target).css("background-color", color);
}
// code for darggable
function boardMove(event){
    var target = this;
    var oldname = this.parentNode.getAttribute("name");
    var locaton = this.getBoundingClientRect();
    var cur_top = event.pageY + window.scrollY - locaton.top;
    var cur_left = event.pageX + window.scrollX - locaton.left;
    
    // define the work area.
    var worksheet = document.getElementById("worksheet");
    var left_border = worksheet.offsetLeft;
    var right_border = worksheet.offsetWidth + left_border;
    var top = worksheet.offsetTop;
    var bottom = top + worksheet.offsetHeight;
    
    // for the top, 1st is 85 - , 2st is 170, 3st is 255, +=85
    // for the left, "to do" is 11, "doing" is 275, "done" is 539, +=264.
    function move (event) {
        var board_x = event.pageX + window.scrollX;
        var board_y = event.pageY + window.scrollY;
        if (board_x >= left_border && board_x <= right_border && board_y >= 50 && board_x <= 850){
            $(target).css({
                //"opacity" : 0.5,
                "position": "absolute", 
                "top": board_y - cur_top + window.scrollY,
                "left": board_x - cur_left + window.scrollX,
            });
        } else {
            document.removeEventListener("mousemove", move, false);
            $(target).css({
                //"opacity" : 0.1,
                "position": "static", 
            });
        } 
    }
    
    function movedone (event) {
        document.removeEventListener("mousemove", move, false);
        
        var seq_x = parseInt((target.offsetLeft + 100 - 11)/264);
        var seq_y = parseInt((target.offsetTop + 36 - 85)/85);
        if (seq_x <= 0){
            seq_x = 0;
        }
        if (seq_y <= 0){
            seq_y = 0;
        }

        var par = worksheet.childNodes[seq_x * 2 + 1].childNodes[3];
        var newName = par.getAttribute("name");
        par.insertBefore(target, par.childNodes[seq_y]);
        $(target).css({
            "position": "static", 
        });

        boardChange(oldname, newName);
        document.removeEventListener("mouseup", movedone, false);
    }
    
    
    document.addEventListener("mousemove", move, false);
    
    document.addEventListener("mouseup", movedone, false);
}
// drag finished

// show the detial box
function editableDiv(){
    var target = this;
    var data_to_back = {};
    var OTitle = target.childNodes[0].textContent;
    var tag = target.getAttribute("tag");
    var duetime = target.childNodes[1].textContent;
    var desc = target.childNodes[2].textContent;
    var con_detail = target.getAttribute("contents");
    $("#datepicker").datepicker();
    if(duetime){
        $("#datepicker").val(duetime);
    }
    
    $(".eTitle").text(OTitle);
    $(".duetime").val(duetime);
    $("input[name='tagColor'][value='"+tag+"']").prop('checked', true);
    $(".Input_des").val(desc);
    $(".det1").val(con_detail);
    
    
    $(".cover").css({
        "z-index": "100",
        "display": "block",
    });
    
    $(".tag").on("click", function (e){
        e.stopPropagation() 
    })
    
    $(".ediDiv").on("click", function (e){
        return false;
    })
    
    // delete this task
    $(".delTask").on("click", function (e){
        target.parentNode.removeChild(target);
        $(".ediDiv").off();
        $(document).trigger("click");
    })
    
    // close the detail board
    $(document).one("click", function (e){
        var change = false;
        $(".delTask").off();
        $(".ediDiv").off();
        var new_time = $("#datepicker").datepicker('getDate');
        var new_day = $.datepicker.formatDate("dd-mm-yy", new_time);
        
        //check whether title changes
        if ($(".eTitle").text() != OTitle){
            change = true;
            target.childNodes[0].textContent = $(".eTitle").text();
            data_to_back["title"] = $(".eTitle").text();
        }
        
        var new_tag = $("input[name = 'tagColor']:checked").val();
        if (new_tag != tag){
            change = true;
            target.setAttribute("tag", new_tag);
            data_to_back["tag"] = new_tag;
            changeTag(target, new_tag);
        }
        
        if (new_day != duetime){
            change = true;
            target.childNodes[1].textContent = new_day;
            data_to_back["duetime"] = new_day;
        }

        //check weather description change
        if ($(".Input_des").val() != desc){
            change = true;
            target.childNodes[2].textContent = $(".Input_des").val();
            data_to_back["describe"] = $(".Input_des").val();
        }
        
        // check weather content change
        if ($(".det1").val() != con_detail){
            change = true;
            target.setAttribute("contents", $(".det1").val());
            data_to_back["contents"] = $(".det1").val();
        }
        if(change){
            to_back_single(target, data_to_back);
        }

        $(".cover").css({
            "z-index": "-100",
            "display": "none",
        });
    })
}


$(".close").click(function(){
    $(".cover").css({
        "z-index": "-100",
        "display": "none",
    })
})
/* every time create and drop elem.
function editableDiv(){
    var target = this;
    var ediDiv = document.createElement("div");
    ediDiv.className = "ediDiv";
    var eTitle = document.createElement("div");
    eTitle.textContent = this.childNodes[0].textContent;
    eTitle.setAttribute("contenteditable", "plaintext-only");
    ediDiv.appendChild(eTitle);
    document.body.appendChild(ediDiv);

    $(".ediDiv").click(function (e){
        return false;
    })
    
    $(document).one("click", function (e){
        target.childNodes[0].textContent = eTitle.textContent;
        document.body.removeChild(ediDiv);
    })
}  
*/
// end of show box

document.addEventListener("mousedown", function (e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;
    var isclick = false;
    
    if(target.matches("div.ptitle") || target.matches("div.pdescribe")){
        target = target.parentNode;
    }
    
    if (target.matches("div.board")) {
        setTimeout(function(){
            if (!isclick){
                // move element; 
                target.move = boardMove;
                target.move(event); 
                target.move = null;
            } else {
                // show the input box;
                target.detail = editableDiv;
                target.detail();
                target.detail = null;
            }
        }, 200);
        $(target).mouseup(function(){
            isclick = true;
        })
    }
})






//  Ajax requeset
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

function to_back_single(elem, data_to_back){  
    data_to_back["name"] = elem.getAttribute("name");
    $.post("addtask", data_to_back, function (Date){
        //console.log(Date);
    })
}

function boardChange(first, second){  
    var data_to_back = {};
    var changed = false;
    var firstlist = document.getElementsByName(first)[0].childNodes;
    var firstSeq = ""
    for (var i=0; i<firstlist.length; ++i){
        firstSeq += firstlist[i].getAttribute("name") + ",";
    }
    
    var Ori_fisrt = check(first);
    if (Ori_fisrt != firstSeq){
        changed = true;
        Ori_fisrt = firstSeq;
        data_to_back[first] = firstSeq;
    }

    if(second && second != first){
        var secondlist = document.getElementsByName(second)[0].childNodes;
        var secondSeq = ""
        for (var i=0; i<secondlist.length; ++i){
            secondSeq += secondlist[i].getAttribute("name") + ",";
        }
        var ori_second = check(second);
        if (ori_second != secondSeq){
            data_to_back[second] = secondSeq;
            ori_second = secondSeq;
        } 
    }
    
    if (changed){
        move_to_Back(data_to_back);
    }
}

function check(name){
    switch(name){
        case "todo":
            return todoSeq;
        case "doing":
            return doingSeq;
        case "done":
            return doneSeq;
    }
}

function move_to_Back(data_to_back){
    data_to_back = JSON.parse(JSON.stringify(data_to_back));
    //console.log(data_to_back);
    $.post("movetask", data_to_back, function (Date){
        //console.log(Date);
    })
}




