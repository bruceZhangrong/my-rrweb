define(['common/tool','common/jweixin-1.0.0'],function($$,wx){
    function loadWx(){
        var isshare = arguments[0]||false;
        var share = arguments[1]||false;
        var noshare = arguments[2]||false;
        if($$.isWeixin()){
            var lurl = encodeURIComponent(location.href.split('#')[0]);
            $$.jsonAjax($$.API.API_LIST.JSSDK_SIGNPACKAGE,{"url":lurl},function(data){
                if(data.ret==0){
                   data.data.debug = false;
                   data.data.jsApiList=[ "onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","hideAllNonBaseMenuItem","showMenuItems"];
                   wx.config(data.data);
                   $("body").append("<div class='SHARE-bg'></div>");
                   wx.ready(function(){
                    if(noshare){
                        wx.hideAllNonBaseMenuItem();
                    }
                    // wx.showMenuItems({menuList: ["menuItem:share:appMessage","menuItem:share:timeline","menuItem:share:qq","menuItem:favorite"]});
                    if(isshare){
                        wxShare(share);
                    }
                   });
                   wx.error(function(res) {
                      // console.log(res);
                   });
                }
            });
        }else{
            if(isshare){
                wxShare(share);
            }
        }
    }
    function noShare(){
        loadWx(false,false,true);
    }
    function wxShare(share){
        var isshow = arguments[1]||false;
        var url = window.location.href;
        // var share = {
        //     // title: '启程无忧', // 分享标题
        //     desc: '启程无忧，移民无忧', // 分享描述
        //     link: window.location.href.replace(/[&]?stoken=[\d|\w]+/,""), // 分享链接
        //     // imgUrl: '', // 分享图标
        // };
        // if(!share.link){
            
        // }
        
        if(!share.flag&&!share.link){   //share.flag标记是否自动获取link
            share.link = url.indexOf("?")>-1?url.replace(/[&]?stoken=[\d|\w]+/,"")+"&share=1":url.replace(/[&]?stoken=[\d|\w]+/,"")+"?share=1"; // 分享链接
        }else{
            try{
                delete share.flag;
            }catch(e){}
        }
        if($$.isWeixin()){
            if(isshow){
                if(!$$.isQc()){
                    $(".SHARE-bg").show();
                }
            }
            $(".SHARE-bg").on("click",function(){
                $(".SHARE-bg").hide();
            });
            // share.link =  url.replace(/[&]?stoken=[\d|\w]+/,"")+"&share=1"; // 分享链接
            // console.log(share)
            wx.showMenuItems({menuList: ["menuItem:share:appMessage","menuItem:share:timeline","menuItem:share:qq","menuItem:favorite"]});
            share.success=function(){
                $(".SHARE-bg").hide();
                $$.showTip("分享成功");
            };
            share.cancel=function(){
                $(".SHARE-bg").hide();
                // $$.showTip("分享取消");
            }
                wx.onMenuShareTimeline(share);
                wx.onMenuShareAppMessage(share);
                wx.onMenuShareQQ(share);
        }else{
            var obj = $$.M();
                obj.desc = share.desc;
                obj.title = share.title;
                obj.url = share.link;
                obj.urlImage = share.imgUrl;
            if($$.isQc()){
                $$.messageApp({'name':'wxshare',body:JSON.stringify(obj)});
            }else if($$.isQcAndroid()){
                $$.messageAppAndroid(JSON.stringify({'name':'wxshare',body:JSON.stringify(obj)}));
            }
        }
    }
    function jsApiCall(params)  //调用微信支付
    {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            params,
            function(res){
                var msg = res.err_msg.split(":")[1];
                if(msg=="ok"){  //支付成功
                    params.success&&params.success();
                }else if(msg=="cancel"){  //支付取消
                    params.cancel&&params.cancel();
                }else if(msg=="fail"){  //支付失败
                    $$.showTip("支付失败,金额不会扣除,请重新支付",function(){
                        params.fail&&params.fail();
                    });
                }
                // $$.showTip(res.err_code+""+res.err_desc+""+res.err_msg,20000);
            }
        );
    }

    // LoadWx();
    function wxPay(params){
        try{
            params.timeStamp = params.timeStamp.toString();
        }catch(e){}
        if($$.isWeixin()){
            if (typeof WeixinJSBridge == "undefined"){
                $(document).on("WeixinJSBridgeReady",function(){
                    jsApiCall(params);
                });
            }else{
                jsApiCall(params);
            }
        } else {
            $$.showTip('请在微信环境中使用!');
        }
    }
    return{
        "wxShare":wxShare,  //微信config
        "loadWx":loadWx,    //加载微信
        "wxPay":wxPay,      //微信支付
        "noShare" : noShare,//禁止微信分享
    }
});