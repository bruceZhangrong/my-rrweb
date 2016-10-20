define(["common/jquery.min",'common/doT.min'], function($,doT){
    //doT模板渲染函数
       var $ = jQuery;
    function renderDot(selector,data){
        var tmpl = document.querySelector(selector);
        if(tmpl != undefined){
            var doTtmpl = doT.template(tmpl.innerHTML);
            return doTtmpl(data);
        }else{
            throw new Error('template: ['+selector+'] is not exsits!');
        }
    }

    function renderTo(selTo, selFrom, data) {
        var data_module = renderDot(selFrom, data);
        $(selTo).html(data_module);
    }

    return {
        "renderDot" : renderDot,
        "renderTo" : renderTo,
    };
});