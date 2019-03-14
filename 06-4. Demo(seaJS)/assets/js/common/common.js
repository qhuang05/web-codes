/**
 * Created by hqh on 2017/2/17.
 */

define(function(require, exports, module){
    require('zepto');
    //格式化日期 @param date 日期 @param format 格式化样式,例如yyyy-MM-dd HH:mm:ss  @return 格式化后的结果
    exports.formatDate = function(date, format) {
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
    };

    //将个位数字转化为双位数
    exports.doubleNumber = function(number){
        if(parseInt(number) < 10){
            number = '0' + number;
        }
        return number;
    };

    //将一周中的某一天转化为星期几
    exports.toWeekString = function(i){
        var str = '';
        switch(parseInt(i)){
            case 0:
                str = '星期日';
                break;
            case 1:
                str = '星期一';
                break;
            case 2:
                str = '星期二';
                break;
            case 3:
                str = '星期三';
                break;
            case 4:
                str = '星期四';
                break;
            case 5:
                str = '星期五';
                break;
            case 6:
                str = '星期六';
                break;
        }
        return str;
    };

    //判断移动端是否安装了某个APP, 有则打开, 无则打开下载页面
    exports.checkHasApp = function(iosAPP, androidAPP, downloadURL){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            var loadDateTime = new Date();
            window.setTimeout(function() {
                var timeOutDateTime = new Date();
                if (timeOutDateTime - loadDateTime < 5000) {
                    window.location.href = url;
                } else {
                    window.close();
                }
            }, 25);
            window.location.href = iosAPP;
        } else if (navigator.userAgent.match(/android/i)) {
            var state = null;
            try {
                state = window.open(androidAPP, '_blank');
            } catch(e) {}
            if (state) {
                window.close();
            } else {
                window.location.href = downloadURL;
            }
        }
    };

    //为页面动态添加js文件
    exports.loadScript = function(url, flag){
        var $script = $('<script></script>');
        $script.attr('src', url);
        $script.attr('flag', flag);
        $(document).find('script:last-child').before($script);
    };

    //获取url中的携带的参数值
    exports.getRequestParam = function(){
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
    };
});