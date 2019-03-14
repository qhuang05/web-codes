/**
 * Created by hqh on 17/11/17.
 */

//全局函数。调用方法$.myFunction1()、$.myFunction2()
(function($){
    $.myFunction1 = function(){
        alert('全局myFunction1');
    },
    $.myFunction2 = function(){
        alert('全局myFunction2');
    }
})(jQuery);


//以选择器为操作对象的函数。调用方法$('#div1').myFunction1()、$('#div1').myFunction2()
(function($){
    $.fn.objFunction1 = function(){
        alert('选择器函数objFunction1');
    };
    $.fn.objFunction2 = function(){
        alert('选择器函数objFunction2');
    }
})(jQuery);


//实战方案 —— 使用命名空间开发jQuery插件
var Qhuang = {};
(function($, Qhuang){
    'use strict'
    $.extend(Qhuang, {
        myPlugin1: function(){
            alert('这是我的插件函数myPlugin1');
        },
        myPlugin2: function(){
            alert('这是我的插件函数myPlugin2');
        }
    });
    $.fn.myPlugin3 = function(){
        alert('这是我的插件函数myPlugin3 - 选择器函数' + this);
    };
    $.fn.myPlugin4 = function(){
        alert('这是我的插件函数myPlugin4 - 选择器函数' + this);
    }
})(jQuery, Qhuang);