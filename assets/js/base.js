/**
 * Created by QiuHuang on 2017/9/12.
 */
 var Base = {};
 (function ($, Base) {
    "use strict";
    $.extend(Base, {
        loading: function (opt) {
            layer.load($.extend({
                time: 2000
            }), opt);
        },
        layerOpen: function (opt) {
            var loading = layer.load({time: 3600000});
            layer.open($.extend({
                type: 2,
                title: null,
                closeBtn: 0,
                area: ['100%', '100%'],
                scrollbar: false,
                content: opt.url,
                end: function () {
                    layer.close(loading);
                }
            }, opt));
        },
        layerAlert: function (msg, callback) {
            // callback的参数为index, 可以使用layer.close(index)来关闭弹框
            layer.alert(msg, {icon: 7}, callback);
        },
        layerMsg: function (msg) {
            layer.msg(msg, {icon: 7});
        },
        layerConfirm: function (msg, callback) {
            // callback的参数为index, 可以使用layer.close(index)来关闭确认框
            layer.confirm(msg, callback);
        },
        layerCloseSelf: function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        // 判断是否为空
        isNullOrEmpty: function (obj) {
            if ((typeof (obj) == "string" && obj == "") || obj == null || obj == undefined) {
                return true;
            } else {
                return false;
            }
        },
        // 获取url地址参数
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        // 对象深拷贝,可以深拷贝对象和数组
        deepCopy: function (obj) {
            var str,
            newObj = obj.constructor === Array ? [] : {};
            if (typeof obj !== 'object') {
                return;
            } else if (window.JSON) {
                str = JSON.stringify(obj),      //系列化对象
                    newObj = JSON.parse(str);   //还原
                } else {
                    for (var i in obj) {
                        newObj[i] = typeof obj[i] === 'object' ?
                        Base.deepCopy(obj[i]) : obj[i];
                    }
                }
                return newObj;
            },
        // 格式化JSON
        jsonFormat: function(value){
            return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
        },
        // 日期比较
        dateCompare: function (startDate, endDate) {
            var _startDate = new Date(startDate.replace(/\-/g, '\/')).getTime(),
            _endDate = new Date(endDate.replace(/\-/g, '\/')).getTime();
            if (_startDate > _endDate) {
                return -1;
            } else if (_startDate == _endDate) {
                return 0;
            } else {
                return 1;
            }
        },
        // 格式化日期, 调用Base.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
        dateFormat: function(date, format){
            var v = "";
            if (typeof date == "string" || typeof date != "object") {
                return;
            }
            var year  = date.getFullYear();
            var month  = date.getMonth()+1;
            var day   = date.getDate();
            var hour  = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var weekDay = date.getDay();
            var ms   = date.getMilliseconds();

            var weekDayString = "";
            if (weekDay == 1) {
                weekDayString = "星期一";
            } else if (weekDay == 2) {
                weekDayString = "星期二";
            } else if (weekDay == 3) {
                weekDayString = "星期三";
            } else if (weekDay == 4) {
                weekDayString = "星期四";
            } else if (weekDay == 5) {
                weekDayString = "星期五";
            } else if (weekDay == 6) {
                weekDayString = "星期六";
            } else if (weekDay == 7) {
                weekDayString = "星期日";
            }

            v = format;
            //Year
            v = v.replace(/yyyy/g, year);
            v = v.replace(/YYYY/g, year);
            v = v.replace(/yy/g, (year+"").substring(2,4));
            v = v.replace(/YY/g, (year+"").substring(2,4));
            //Month
            var monthStr = ("0"+month);
            v = v.replace(/MM/g, monthStr.substring(monthStr.length-2));
            //Day
            var dayStr = ("0"+day);
            v = v.replace(/dd/g, dayStr.substring(dayStr.length-2));
            //hour
            var hourStr = ("0"+hour);
            v = v.replace(/HH/g, hourStr.substring(hourStr.length-2));
            v = v.replace(/hh/g, hourStr.substring(hourStr.length-2));
            //minute
            var minuteStr = ("0"+minute);
            v = v.replace(/mm/g, minuteStr.substring(minuteStr.length-2));
            //Millisecond
            v = v.replace(/sss/g, ms);
            v = v.replace(/SSS/g, ms);
            //second
            var secondStr = ("0"+second);
            v = v.replace(/ss/g, secondStr.substring(secondStr.length-2));
            v = v.replace(/SS/g, secondStr.substring(secondStr.length-2));
            //weekDay
            v = v.replace(/E/g, weekDayString);
            return v;
        },
        // 星期转化
        toWeek: function(week){
            var res = '';
            switch(parseInt(week)){
                case 0:
                res = '周日';
                break;
                case 1:
                res = '周一';
                break;
                case 2:
                res = '周二';
                break;
                case 3:
                res = '周三';
                break;
                case 4:
                res = '周四';
                break;
                case 5:
                res = '周五';
                break;
                case 6:
                res = '周六';
                break;
            }
            return res;
        },
        // 个位数转双位数
        toDoubleDigit: function(number){
            var res = '';
            parseInt(number)<10 ? res='0'+number : res = number;
            return number;
        },
        // 验证11位手机号码是否有效
        checkTelephone: function (phone) {
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        // 验证邮箱是否合法
        checkEmail: function (email) {
            var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (reg.test(email)) {
                return true;
            } else {
                return false;
            }
        },
        // 获取字符长度(1个汉字=2个字符)
        getStrLength: function (str) {
            if (str == null) return 0;
            if (typeof str != "string") {
                str += "";
            }
            return str.replace(/[^\x00-\xff]/g, "01").length;
        },
        // 输入上限限制，flag--true区分中英文(1汉字=2字符), false不区分中英文
        strInputLimit: function (obj, maxnum, inputObj, flag) {
            var inputnum = 0, len = 0;
            if (flag) {   
                //按字符计算,1个汉字=2个字符
                for (var i = 0; i < obj.val().length; i++) {
                    var zh = obj.val()[i];
                    zh = zh.replace(/[\u4e00-\u9fa5]/g, "");//匹配中文字符
                    if (zh) {
                        inputnum++;
                    } else {
                        inputnum += 2;
                    }
                }
                len = i;
            } else { 
                //中文或英文都当作1个字计算(不区分中英文)
                inputnum = obj.val().length;
                len = inputnum;
            }
            inputObj.text(inputnum);
            var remain = maxnum - inputnum;
            if (remain < 0) {
                obj.val(obj.val().substring(0, maxnum));
                inputObj.text(maxnum);
            }
        },
        // 输入上限限制(粘贴)，flag--true区分中英文(1汉字=2字符), false不区分中英文
        strPasteLimit: function (obj, maxnum, inputObj, flag) {
            if (delay == undefined) {
                var delay = 10;
            }
            setTimeout(function () {
                var inputnum = 0, _inputnum = 0, len = 0;
                if (flag) {   
                    //按字符计算,1个汉字=2个字符
                    for (var i = 0; i < obj.val().length; i++) {
                        var zh = obj.val()[i];
                        zh = zh.replace(/[\u4e00-\u9fa5]/g, ""); //匹配中文字符
                        _inputnum = inputnum;
                        if (zh) {
                            inputnum++;
                        }
                        else {
                            inputnum += 2;
                        }
                        if (inputnum > maxnum) {
                            len = i;
                            obj.val(obj.val().substr(0, len));
                            break;
                        }
                    }
                } else {   
                    //中文或英文都当作1个字计算(不区分中英文)
                    _inputnum = obj.val().length;
                    if (_inputnum > maxnum) {
                        obj.val(obj.val().substring(0, maxnum));
                        inputObj.text(maxnum);
                    }
                }
                inputObj.text(_inputnum);
            }, delay);
        },
        // 只允许输入数字
        onlyNum: function(obj){
            obj.value = obj.value.replace(/\D+/g, '');
        },
        // 只允许输入数字和小数点，小数位数最多n位
        onlyNumAndPoint: function(obj, n){
            obj.value = obj.value.replace(/[^\d.]/g, "");   //先把非数字的都替换掉，除了数字和.
            obj.value = obj.value.replace(/^\./g, "");  //必须保证第一个为数字而不是.       
            obj.value = obj.value.replace(/\.{2,}/g, ".");  //保证只有出现一个.而没有多个.
            obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");   //保证.只出现一次，而不能出现两次以上
            // 最多保留n位小数
            if(n){
                // var reg = /.\.\d{3,}/g;
                var reg = /[.]\d{3,}/g;
                if(reg.test(obj.value)){
                    obj.value = obj.value.substr(0, obj.value.length-1);
                }
            }
        },
        // 特殊字符转义
        htmlEscape: function (string) {
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        },
        // ajax请求
        ajaxGet: function (opt) {
            $.ajax($.extend({
                type: 'GET',
                url: opt.url,
                data: opt.data,
                success: opt.success,
                error: opt.error
            }, opt));
        },
        ajaxPost: function (opt) {
            $.ajax($.extend({
                type: 'POST',
                url: opt.url,
                data: opt.data,
                success: opt.success,
                error: opt.error
            }, opt));
        },
        // promise异步编程
        ajaxPromise(opt){
            return new Promise((resolve, reject)=>{
                $.ajax($extend({
                    type: 'get',
                    url: opt.url,
                    data: opt.data,
                    success: function(res){
                        resolve(res);
                    },
                    error: function(xhr,status,error){
                        reject(error);
                    }
                }, opt));
            });
        },
        // 精确到小数点后n位(四舍五入)
        numberAccurate(data, n){
            return (Math.round(data*Math.pow(10,n))/Math.pow(10,n)).toFixed(n);
        },
        // 精确到小数点后n位(直接丢弃)
        numberAccurate2(data, n){
            // return Math.floor(data * Math.pow(10,n)) / Math.pow(10,n);  //小数位为0会舍弃
            data = String(data);
	        return data.substring(0, data.indexOf(".")+(n+1)); //这种方法会返回字符串类型
        },
    });
})(jQuery, Base);

// form表单参数系列化(JSON格式)
$.fn.serializeJson=function(){
    var resData={};
    var dataArr=this.serializeArray();
    $.each(dataArr, function(index, item){
        if(resData[item.name]){
            if($.isArray(resData[item.name])){
                resData[item.name].push(item.value);
            }else{
                resData[item.name] = [resData[item.name], item.value];
            }
        }else{
            resData[item.name] = item.value;
        }
    });
    return resData;
};