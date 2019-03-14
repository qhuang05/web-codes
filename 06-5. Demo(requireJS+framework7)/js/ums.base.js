define(function(){
	"use strict";
	var main = {};
	$.extend(main, {
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
                        Qhuang.deepCopy(obj[i]) : obj[i];
                    }
                }
                return newObj;
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
        // 格式化JSON
        jsonFormat: function(value){
            return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
        },
        // 格式化日期, 调用Qhuang.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
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
        }
	});
	return main;
});