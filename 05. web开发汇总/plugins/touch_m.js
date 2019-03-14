/**
 * Created by hqh on 2016/12/21.
 * 自定义事件(mobile): swipeLeft, swipeRight, swipeUp, swipeDown, tap, longTap
 * 事件主体不支持数组, 数组元素操作须配合each使用(待改进)
 */

(function($){
    var Events = ['swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'tap', 'longTap'];
    Events.forEach(function(eventName){
        $.fn[eventName] = function(callback){
            var self = this;
            var startPos, endPos, disX, disY, gap, time;
            $(self).on('touchstart', function(event){
                event.preventDefault();
                var touch = event.touches[0];
                var startTime = new Date().getTime();
                startPos = {
                    x: touch.pageX,
                    y: touch.pageY,
                    t: startTime
                };
                disX = disY = gap = 0;
            }).on('touchmove', function(event){
                event.preventDefault();
                var touch = event.touches[0];
                endPos = {
                    x: touch.pageX,
                    y: touch.pageY
                };
                disX = endPos.x - startPos.x;
                disY = endPos.y - startPos.y;
                gap = Math.abs(disX) - Math.abs(disY);
            }).on('touchend', function(event){
                event.preventDefault();
                time = new Date().getTime() - startPos.t;
                if(gap > 0){
                    if(disX < -10){
                        var res = 'swipeLeft';
                    } else if(disX > 10){
                        var res = 'swipeRight';
                    }
                } else if(gap < 0){
                    if(disY < -10){
                        var res = 'swipeUp';
                    } else if(disY > 10){
                        var res = 'swipeDown';
                    }
                }
                else if(Math.abs(disX) < 10 && Math.abs(disY) < 10){
                    if(time < 250){
                        res = 'tap';
                    } else{
                        res = 'longTap';
                    }
                }
                if(res == eventName){
                    // console.log('当前触发的事件是： ' + res);
                    callback(self, event);
                }
                disX = disY = gap = 0;
            });
        }
    });
})(window.jQuery || window.Zepto);