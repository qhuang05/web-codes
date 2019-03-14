/**
 * Created by hqh on 2017/3/26.
 */

define(function(require, exports, module){
    require('zepto');
    require('sui-mobile');
    //取消订单
    exports.cancelOrder = function(orderId){
        $.toast('正在取消订单' + orderId);
    };

    exports.dataInit = function(){
        //后退
        $('#back').off('click').on('click', function(){
            $.router.back();
        });

        //取消订单
        $('#cancel').off('click').on('click', function(){
            $.modal({
                title: '',
                text: '<p class="message">每天只能取消<em class="color-orange">3笔</em>订单<br/>是否确认取消</p>',
                extraClass: 'custom-modal',
                verticalButtons: false,
                buttons: [
                    {
                        text: '取消'
                    },
                    {
                        text: '确认',
                        onClick: function(){
                            exports.cancelOrder(1);
                        }
                    }
                ],
            });
        });

        //联系司机

    };

    $(document).on('pageInit', '#orderDetailPage', function(e, id, page){
        exports.dataInit();
    });
});