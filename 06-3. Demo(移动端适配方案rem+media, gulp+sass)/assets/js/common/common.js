/**
 * Created by hqh on 2017/2/17.
 */

//用于定义宏变量或公用常量
var macro_orderRefreshTime = 1200000,               // 订单刷新频率
    macro_driverRefreshTime = 1200000;              // 司机刷新频率

//判断json对象是否为空
function isEmptyObj(obj){
    for(var key in obj){
        return false;
    }
    return true;
}

//为页面动态添加js文件
function loadScript(url, flag) {
    /*var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.setAttribute('flag', flag);
    document.body.appendChild(script);*/
    var $script = $('<script></script>');
    $script.attr('src', url);
    $script.attr('flag', flag);
    $(document).find('script:last-child').before($script);
}

//获取url中的携带的参数值
function getRequestParam(){
    var str = location.search;      //获取url中"?"后的字符串
    var params = {};
    if(str.indexOf('?') != -1){
        str = str.substr(1);
        var strArr = str.split('&');
        for(var i=0; i<strArr.length; i++){
            var res = strArr[i].split('='),
                key = res[0],
                value = res[1];
            params[key] = value;
        }
    }
    return params;
}