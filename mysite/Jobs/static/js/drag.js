Base.prototype.drag = function(){
    for (var i=0;i<this.elements.length;i++){
        var element = this.elements[i];
        //鼠标按下事件 
        element.onmousedown = function(e){
             var e= e|| window.event;
             var that = this;//这里的this指向element对象
             
             //获取鼠标点击位置相对于窗体left和top的位移
             var diffX = e.clientX - that.offsetLeft;
             var diffY = e.clientY - that.offsetTop;
             
             //鼠标移动事件
             document.onmousemove = function(e){
                 var e = e||window.event;
                 //在移动过程中窗体的offsetLeft、offsetTop会随着事件触发位置的e.clientX、e.clientY变化而变化，但diffX、diffY是固定不变的
                 //故使用e.clientX - diffX可以获取移动后窗体的left值，top值同理
                 var left = e.clientX - diffX ;
                 var top = e.clientY - diffY;
                 
                 //设置移动的位置不得超过浏览器的边缘
                 //使用offsetWidth、offsetHeight可以获得窗体自身的宽度、高度
                 //窗体距左的偏移量加上窗体自身的宽度不超过浏览器的宽度
                 if(left < 0){
                     left = 0;
                 }else if(left > window.InnerWidth - that.offsetWidth){
                     left = window.InnerWidth - that.offsetWidth;
                 } 
                //窗体距上的偏移量加上窗体自身的高度不超过浏览器的高度
                 if(top < 0){
                     top = 0;
                 }else if(top > window.InnerHeight - that.offsetHeight){
                     top = window.InnerHeight - that.offsetHeight;
                 }
                //设置窗体移动后的偏移量
                 that.style.left = left + 'px';
                 that.style.top = top + 'px'; 
             }
             
             //鼠标放开事件
             document.onmouseup = function(){
                 //清空事件
                 this.onmousemove = null;//这里的this指向document对象
                 this.onmouseup = null;

             } 
        
         };
    }
    return this;
} 
