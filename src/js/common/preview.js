define([],function(){
	return (function(doc,win){
    var _preview = function(){
    this.win_w=doc.body.offsetWidth;    //屏幕宽度
    this.win_h=doc.documentElement.clientHeight;    //屏幕高度
    this.index=1000;
    }
    _preview.prototype.init = function(selector,c_selector){
        this.el=$$(selector);
        var pre=this;
        function large(){
            var trans="0.4s cubic-bezier(0.42, 0, 0.61, 0.75)";
            this.style.webkitTransition=trans;
             if(this.className.indexOf('iamlarge')==-1){
                this.className+=' iamlarge';
                var scroll_top=doc.body.scrollTop;  //滚动条上卷高度
                this.style.transition=trans;
                (function(){
                    var scale= pre.win_w>650?650/this.width:pre.win_w/this.width;//pre.win_w/this.width;
                    var imgeh=this.height*scale;
                    var move_y=((pre.win_h-this.height)/2-this.offsetTop+scroll_top)/scale;
                    var move_x=((pre.win_w-this.width)/2-this.offsetLeft)/scale;
                    var tran="scale("+scale+","+scale+") translate3d("+move_x+"px,"+move_y+"px,0)";
                    $$(c_selector)[0].className+=" bg-animation";
                    this.style.zIndex=pre.index;
                    this.style.transform=tran;
                    this.style.webkitTransform=tran;
                    pre.index++;
                }.call(this))
            }else{
                this.className=this.className.replace(' iamlarge','');
                var tran="scale(1,1) translate3d(0,0,0)";
                this.style.transform=tran;
                this.style.webkitTransform=tran;
                $$(c_selector)[0].className=$$(c_selector)[0].className.replace(' bg-animation','');
                setTimeout(function(){
                    this.style.zIndex='auto';
                }.bind(this),400);
            }
        }
        for(var i=0;i<this.el.length;i++){
            this.el[i].addEventListener('click',large);
        }
    }
    function $$(sel){
        return  doc.querySelectorAll(sel);
    }
    var preview=new _preview();
    return preview;
	})(document,window)
});
