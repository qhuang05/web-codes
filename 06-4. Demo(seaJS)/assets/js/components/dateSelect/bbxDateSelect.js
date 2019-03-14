/**
 * Created by hqh on 2017/2/17.
 */

define(function(require, exports, module){
    exports.bbxDateSelect = function(){
        require('zepto');
        require('assets/js/components/dateSelect/spinningwheel');
        var cm = require('assets/js/common/common');
        //初始化页面当前时间
        var curTime = new Date();
        $('li.time input').val('现在出发 ' + cm.doubleNumber(curTime.getHours()) + ':' + cm.doubleNumber(curTime.getMinutes())).data('value', cm.formatDate(curTime, 'yyyy-MM-dd HH:mm'));

        //选择出发日期
        $('li.time input').off('click').on('click', function(event){
            $('li.time').removeClass('active');
            $(this).parents('li').addClass('active');
            var tabFlag = $(event.target).attr('flag');     //标识业务类型, 0-城际拼车 1-城际包车 2-小件快递 3-市内打车
            _bbxDatePicker(curTime, tabFlag);
        });

        function _bbxDatePicker(curTime, tabFlag){
            var datesData = generateDateList(curTime, tabFlag);
            showTimePicker(datesData);
            showSlotsBySelectedValue(curTime);
            $('#sw-wrapper').on('touchend', function(){
                setTimeout(function(){
                    showSlotsBySelectedValue(curTime);
                }, 100);
            });
        }

        //根据当前时间 生成日期列表数据
        function generateDateList(curTime, tabFlag){
            var datesData = {};
            datesData.minutes = {
                0: {value: 0, text: '00'},
                10: {value: 10, text: '10'},
                20: {value: 20, text: '20'},
                30: {value: 30, text: '30'},
                40: {value: 40, text: '40'},
                50: {value: 50, text: '50'}
            };
            datesData.hours = {};
            datesData.dates = {};
            for(var i=0; i<24; i++){
                datesData.hours[i] = {value: i, text: cm.doubleNumber(i)};
            }

            var datesArr = [];
            datesArr[0] = {
                value: cm.formatDate(curTime, 'yyyy/MM/dd HH:mm'),
                text: '现在出发'
            };

            var totalDays = 0;
            switch(parseInt(tabFlag)){
                case 3:     // 市内打车只能预约5天之内的时间
                    totalDays = 5;
                    break;
                default:    // 城际、快递只能预约15天之内的时间
                    totalDays = 15;
                    break;
            }

            if(!(curTime.getHours() == 23 && curTime.getMinutes() >= 50)){    //当前日期在23:50之前时, 日期列表显示今天的数据
                var item = {
                    value: cm.formatDate(curTime, 'yyyy/MM/dd'),
                    text: cm.formatDate(curTime, 'MM月dd日') + ' 今天'
                }
                datesArr.push(item);
            }
            for(var i=1; i<totalDays; i++){
                var timeStamp = curTime.getTime();
                var _curTime = new Date(timeStamp);
                var date = new Date(_curTime.setDate(_curTime.getDate() + i));
                var weekText = '';
                switch(i){
                    case 1:
                        weekText = '明天';
                        break;
                    case 2:
                        weekText = '后天';
                        break;
                    default:
                        weekText = cm.toWeekString(date.getDay());
                        break;
                }
                var item = {
                    value: cm.formatDate(date, 'yyyy/MM/dd'),
                    text: cm.formatDate(date, 'MM月dd日') + ' ' + weekText
                };
                datesArr.push(item);
            }
            for(var i=0; i<datesArr.length; i++){
                datesData.dates[i] = datesArr[i];
            }
            console.log('生成日期列表数据：' + JSON.stringify(datesData));
            return datesData;
        }

        //打开日期选择控件
        function showTimePicker(datesData){
            SpinningWheel.addSlot(datesData.dates, 'date');
            SpinningWheel.addSlot(datesData.hours, 'hour');
            SpinningWheel.addSlot(datesData.minutes, 'minute');
            SpinningWheel.open();
            SpinningWheel.setCancelAction(cancel);
            SpinningWheel.setDoneAction(done);
        }

        //根据选中的日期判断日期显示与隐藏(比如:当选择'现在出发'时只显示日期,小时和分钟隐藏)
        function showSlotsBySelectedValue(curTime){
            var selectedDate = SpinningWheel.getSelectedValues();
            console.log('当前选中的日期是：' + JSON.stringify(selectedDate));
            if(selectedDate.keys[0] == 0){  //日期选择第1列('现在出发')时, 隐藏小时和分钟数(第2、3列)
                $('.sw-hour, .sw-minute').hide();
            } else{
                $('.sw-hour, .sw-minute').css({'display': 'table-cell'});
                if(selectedDate.keys[0] == 1 && selectedDate.values[0].text.indexOf('今天') != -1){   //日期选择第2列时,若第2列的日期是今天, 选择的小时和分钟数(第2、3列)不能早于当前时间
                    var curHour = curTime.getHours(),
                        curMinute = curTime.getMinutes();
                    if(parseInt(selectedDate.values[1].value) < curHour){
                        SpinningWheel.scrollToValue(1, curHour);
                        var bMinute = parseInt(curMinute/10) * 10 + 10;
                        SpinningWheel.scrollToValue(2, bMinute);
                    }
                    if(parseInt(selectedDate.values[1].value) == curHour){
                        if(parseInt(selectedDate.values[2].value) < curMinute){
                            var bMinute = parseInt(curMinute/10) * 10 + 10;
                            SpinningWheel.scrollToValue(2, bMinute);
                        }
                    }
                }
            }
        }

        //确定
        function done(){
            var result = SpinningWheel.getSelectedValues();
            var date = result.values[0],
                hour = result.values[1],
                minute = result.values[2];
            var key = date.text;
            var time = '', timeText = '';
            if(key.indexOf('现在出发') != -1){
                time = date.value;
                timeText = '现在出发 ' + time.split(' ')[1];
            } else if(key.indexOf('今天') != -1){
                time = date.value + ' ' + hour.text + ':' + minute.text;
                timeText = '今天 ' + hour.text + ':' + minute.text;
            } else if(key.indexOf('明天') != -1){
                time = date.value + ' ' + hour.text + ':' + minute.text;
                timeText = '明天 ' + hour.text + ':' + minute.text;
            } else if(key.indexOf('后天') != -1){
                time = date.value + ' ' + hour.text + ':' + minute.text;
                timeText = '后天 ' + hour.text + ':' + minute.text;
            } else{
                time = date.value + ' ' + hour.text + ':' + minute.text;
                timeText = date.text.split(' ')[0] + hour.text + ':' + minute.text;
            }
            setTimeout(function(){
                // 备注: 此处使用setTimeout执行函数解决在某些手机上点击'确认'时日期弹窗无法关闭问题
                var inputTarget = $('li.time.active input');
                inputTarget.val(timeText).data('value', time);
            },500);
        }

        //取消
        function cancel(){
            // console.log('点击了取消！');
        }
    };
});