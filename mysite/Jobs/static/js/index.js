"use strict";

// add a new board
function makeNewborad(){
    var nb = document.createElement("div");
    nb.className = "board";
    //nb.setAttribute("drag",);
    // set the unique id is the time created.
    nb.setAttribute("name", Date.now());
    return nb;
}

//var newBoard = document.getElementsByClassName("newboard");

// add new one
document.addEventListener('click', function (e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;

    if (target.matches("div.newboard")) {
        var boards = target.parentNode.childNodes[3];
        boards.appendChild(makeNewborad());
  }
})

// code for darggable
function boardMove(event){
    
    var target = this;
    var locaton = this.getBoundingClientRect();
    var cur_top = event.pageY - locaton.top;
    var cur_left = event.pageX - locaton.left;
    
    // define the work area.
    var worksheet = document.getElementById("worksheet");
    var left_border = worksheet.offsetLeft;
    var right_border = worksheet.offsetWidth + left_border;
    var top = worksheet.offsetTop;
    var bottom = top + worksheet.offsetHeight;
    
    // for the top, 1st is 85 - , 2st is 170, 3st is 255, +=85
    // for the left, "to do" is 11, "doing" is 275, "done" is 539, +=264.
    function move (event) {
        var board_x = event.pageX;
        var board_y = event.pageY;
        if (board_x >= left_border && board_x <= right_border && board_y >= 50 && board_x <= 850){
            $(target).css({
                //"opacity" : 0.1,
                "position": "absolute", 
                "top": board_y - cur_top ,
                "left": board_x - cur_left,
            });
        } else {
            document.removeEventListener("mousemove", move, false);
            $(target).css({
                //"opacity" : 0.1,
                "position": "static", 
                //"top": cur_top ,
                //"left": cur_left,
            });
        } 
    }
    
    document.addEventListener("mousemove", move, false);
    
    document.addEventListener("mouseup", function (event) {
        document.removeEventListener("mousemove", move, false);
        
        var seq_x = parseInt((target.offsetLeft + 100 - 11)/264);
        var seq_y = parseInt((target.offsetTop + 36 - 85)/85);
        if (seq_x <= 0){
            seq_x = 0;
        }
        if (seq_y <= 0){
            seq_y = 0;
        }
        console.log(seq_x);
        console.log(seq_y); 
        console.log(worksheet.childNodes[seq_x * 2 + 1].childNodes[3]);
        var par = worksheet.childNodes[seq_x * 2 + 1].childNodes[3];
        par.insertBefore(target, par.childNodes[seq_y]);
        $(target).css({
            "position": "static", 
        });
    })
}
                      
                     
                      

document.addEventListener("mousedown", function (e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;

    if (target.matches("div.board")) {
        target.move = boardMove;
        target.move(event);
    }
})


