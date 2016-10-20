define(['common/exif'],function(EXIF){
    var viewImg,afterWidth,scale;
    return compressImg = function(inputId,scal,num,userid,callback){
        afterWidth = scal;  //压缩尺寸宽度
        scale = scal;   //压缩比例
        var inputFile = document.getElementById(inputId),
            hidCanvas = document.createElement('canvas');
        //生成隐藏画布
        if (!hidCanvas.getContext) {
            alert("对不起，您的浏览器不支持图片压缩及上传功能，请换个浏览器试试~");
            return
        }

        inputFile.addEventListener("change", function () {
            viewImg = [];
            var file_len = this.files.length,time=0;
            if(file_len>num){
                callback.error();
                return;
            }
            if(!callback.start()){
                return;
            }
            for(var i=0;i<file_len;i++){
               getSrc(this,this.files[i],hidCanvas,i,callback,userid);
            }
            var getimgs = setInterval(function(){
                if(viewImg.length>=file_len||time>=300){
                    clearInterval(getimgs);
                    callback.allsuccess(viewImg);
                    return;
                }
                time++;
            },100);
        });
    };
    function getSrc(self,file,canvas,i,callback,userid){
        var p = new Image(),
            reader = new FileReader();
        var hidCtx = canvas.getContext('2d');
        // hidCtx.clearRect(0,0,canvas.width,canvas.height);
        reader.onload = function( evt ){
            var srcString = evt.target.result;

            //安卓获取的base64数据无信息头，加之
            if(srcString.substring(5,10)!="image"){
                p.src = srcString.replace(/(.{5})/,"$1image/jpeg;");
            }else{
                p.src = srcString;
            }
            // var filesize = Math.round(self.files.fileSize/1024*100)/100;
    
            p.onload = function(){
                var upImgWidth = p.width,
                    upImgHeight = p.height;
                var orientation = 1;
                //获取图像的方位信息
                EXIF.getData(p, function() {
                    orientation = parseInt(EXIF.getTag(p, "Orientation"));
                    orientation = orientation ? orientation : 1;
                });
                //压缩换算后的图片高度
                var afterHeight; //= afterWidth*upImgHeight/upImgWidth;
                if(upImgWidth<10||upImgWidth<10){
                  alert("请不要上传过小的图片");
                  viewImg[i] = "";
                  self.value = "";
                  return false;
                }else{
                //不作尺寸修改 修改by Joey_lu 2016-5-5-10
                afterHeight = upImgHeight;
                afterWidth = upImgWidth;
                    if(orientation <= 4){
                        // 设置压缩canvas区域高度及宽度
                        canvas.setAttribute("height",afterHeight);
                        canvas.setAttribute("width",afterWidth);
                        if(orientation == 3 || orientation == 4){
                            hidCtx.translate(afterWidth,afterHeight);
                            hidCtx.rotate(180*Math.PI/180);
                        }
                    }else{
                        // 设置压缩canvas区域高度及宽度
                        canvas.setAttribute("height",afterWidth);
                        canvas.setAttribute("width",afterHeight);

                        if(orientation == 5 || orientation == 6){
                            hidCtx.translate(afterHeight,0);
                            hidCtx.rotate(90*Math.PI/180);
                        }else if(orientation == 7 || orientation == 8){
                            hidCtx.translate(0,afterWidth);
                            hidCtx.rotate(270*Math.PI/180);
                        }
                    }
                // canvas绘制压缩后图片
                drawImageIOSFix(hidCtx,p, 0, 0,upImgWidth,upImgHeight,0,0,afterWidth,afterHeight);
                // 获取压缩后生成的img对象
                self.value = "";
                var name = userid+""+new Date().getTime()+"_"+upImgWidth+"x"+upImgHeight;
                var img = convertCanvasToImage(canvas,scale,name);
                viewImg.push(img);
                callback.onesuccess(img);
                }
            }
        }
        reader.readAsDataURL(file);
    }

    //canvas转图像
    function convertCanvasToImage(canvas,scale,name) {
      var image = new Image();
      image.src = canvas.toDataURL("image/jpeg",scale);
      return {'src':image.src,'name':name};
    }

    /**
     * 以下代码是修复canvas在ios中显示压缩的问题。
     * Detecting vertical squash in loaded image.
     * Fixes a bug which squash image vertically while drawing into canvas for some images.
     * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
     * 
     */
    // function detectVerticalSquash(img) {
    //     var iw = img.naturalWidth, ih = img.naturalHeight;
    //     var canvas = document.createElement('canvas');
    //     canvas.width = 1;
    //     canvas.height = ih;
    //     var ctx = canvas.getContext('2d');
    //     ctx.drawImage(img, 0, 0);
    //     var data = ctx.getImageData(0, 0, 1, ih).data;
    //     // search image edge pixel position in case it is squashed vertically.
    //     var sy = 0;
    //     var ey = ih;
    //     var py = ih;
    //     while (py > sy) {
    //         var alpha = data[(py - 1) * 4 + 3];
    //         if (alpha === 0) {
    //             ey = py;
    //         } else {
    //             sy = py;
    //         }
    //         py = (ey + sy) >> 1;
    //     }
    //     var ratio = (py / ih);
    //     return (ratio===0)?1:ratio;
    // }

    /**
     * A replacement for context.drawImage
     * (args are for source and destination).
     */
    function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = 1;    //detectVerticalSquash(img);
     // Works only if whole image is displayed:
     // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
     // The following works correct also when only a part of the image is displayed:
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, 
                           sw * vertSquashRatio, sh * vertSquashRatio, 
                           dx, dy, dw, dh );
    }
});