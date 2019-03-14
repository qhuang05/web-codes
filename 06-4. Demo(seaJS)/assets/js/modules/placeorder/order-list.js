/**
 * Created by hqh on 2017/3/26.
 */

define(function(require, exports, module){
    require('zepto');
    require('sui-mobile');
    var tab0 = {}, tab1= {};    // tab0标识'他人服务', tab1标识'自己服务'
    tab0.loading = false;
    tab1.loading = false;
    tab0.itemsPerLoad = 4;
    tab1.itemsPerLoad = 4;
    tab0.maxItems = 20;
    tab1.maxItems = 20;

    exports.getOrderList = function(curTab, curTabIndex){
        switch(parseInt(curTabIndex)) {
            case 0:             //他人服务订单
                tab0.lastIndex = $('#otherOrderList li').length;
                for (var i = tab0.lastIndex; i < tab0.lastIndex + tab0.itemsPerLoad; i++) {
                    var content =
                        '<li class="order-card clearfix">' +
                        '<div class="head">' +
                        '<span class="price gray">200元</span>' +
                        '<span class="state green">等待抢单 ></span>' +
                        '</div>' +
                        '<div class="body">' +
                        '<p class="order-time">' +
                        '<i class="iconfont icon-bbx">&#xe63e;</i>' +
                        '<span class="time">2017-03-15 19:25</span>' +
                        '<span class="type">' +
                        '<em>合乘</em>/<span>2人</span>' +
                        '</span>' +
                        '</p>' +
                        '<p class="address start-address">' +
                        '<i class="iconfont icon-bbx">&#xe634;</i>' +
                        '<span>厦门市前埔南区文心东路50号</span>' +
                        '</p>' +
                        '<p class="address end-address">' +
                        '<i class="iconfont icon-bbx">&#xe634;</i>' +
                        '<span>漳州九龙公园华祥苑</span>' +
                        '</p>' +
                        '</div>' +
                        '</li>';
                    $('#otherOrderList').append(content);
                }
                break;
            case 1:             //自己服务订单
                var html = '';
                tab1.lastIndex = $('#myOrderList li').length;
                for (var i = tab1.lastIndex; i < tab1.lastIndex + tab1.itemsPerLoad; i++) {
                    html +=
                        '<li class="order-card clearfix">' +
                        '<div class="head">' +
                        '<span class="price gray">200元</span>' +
                        '<span class="state green">等待抢单 ></span>' +
                        '</div>' +
                        '<div class="body">' +
                        '<p class="order-time">' +
                        '<i class="iconfont icon-bbx">&#xe63e;</i>' +
                        '<span class="time">2017-03-15 19:25</span>' +
                        '<span class="type">' +
                        '<em>合乘</em>/<span>2人</span>' +
                        '</span>' +
                        '</p>' +
                        '<p class="address start-address">' +
                        '<i class="iconfont icon-bbx">&#xe634;</i>' +
                        '<span>厦门市前埔南区文心东路50号</span>' +
                        '</p>' +
                        '<p class="address end-address">' +
                        '<i class="iconfont icon-bbx">&#xe634;</i>' +
                        '<span>漳州九龙公园华祥苑</span>' +
                        '</p>' +
                        '</div>' +
                        '</li>';
                }
                $('#myOrderList').append(html);
                break;
        }
    };

    exports.dataInit = function(page){
        exports.getOrderList(tab0, 0);
        exports.getOrderList(tab1, 1);

        // 上拉 加载数据(无限滚动)
        $(page).off('infinite').on('infinite', function(){
            var curTabIndex = $('.tab.active').index();
            switch(curTabIndex){
                case 0:             // 他人服务订单
                    if(tab0.loading) return;
                    tab0.loading = true;
                    tab0.lastIndex = $('#otherOrderList li').length;
                    setTimeout(function(){      // 模拟1s的加载过程
                        tab0.loading = false;
                        if(tab0.lastIndex >= tab0.maxItems){
                            $('#otherOrders .infinite-scroll-preloader').hide();
                            $('#otherOrders p.end-message').show();
                            if(tab1.lastIndex >= tab1.maxItems){
                                $.detachInfiniteScroll($('.infinite-scroll'));
                            }
                            return;
                        }
                        exports.getOrderList(tab0, 0);
                        $.refreshScroller();    //容器发生改变,如果是js滚动，需要刷新滚动
                    }, 1000);
                    break;
                case 1:             // 自己服务订单
                    if(tab1.loading) return;
                    tab1.loading = true;
                    tab1.lastIndex = $('#myOrderList li').length;
                    setTimeout(function(){      // 模拟1s的加载过程
                        tab1.loading = false;
                        if(tab1.lastIndex >= tab1.maxItems){
                            $('#myOrders .infinite-scroll-preloader').hide();
                            $('#myOrders p.end-message').show();
                            if(tab0.lastIndex >= tab0.maxItems){
                                $.detachInfiniteScroll($('.infinite-scroll'));
                            }
                            return;
                        }
                        exports.getOrderList(tab1, 1);
                        $.refreshScroller();
                    }, 1000);
                    break;
            }
        });

        //下拉 刷新数据
        $(page).off('refresh').on('refresh', '.pull-to-refresh-content',function() {
            var curTabIndex = $('.tab.active').index();
            switch(curTabIndex){
                case 0:             // 他人服务订单
                    setTimeout(function(){          // 模拟2s的加载过程
                        $('#otherOrderList').empty();
                        exports.getOrderList(tab0, 0);
                        $.pullToRefreshDone('.pull-to-refresh-content');
                        $.attachInfiniteScroll($('.infinite-scroll'));
                        $('#otherOrders .infinite-scroll-preloader').show();
                        $('#otherOrders p.end-message').hide();
                    }, 2000);
                    break;
                case 1:             // 自己服务订单
                    setTimeout(function(){          // 模拟2s的加载过程
                        $('#myOrderList').empty();
                        exports.getOrderList(tab1, 1);
                        $.pullToRefreshDone('.pull-to-refresh-content');
                        $.attachInfiniteScroll($('.infinite-scroll'));
                        $('#myOrders .infinite-scroll-preloader').show();
                        $('#myOrders p.end-message').hide();
                    }, 2000);
                    break;
            }
        });

        //后退
        $('#back').off('click').on('click', function(){
            $.router.back();
        });
    };

    $(document).on('pageInit', '#orderListPage', function(e, id, page){
        exports.dataInit(page);
    });
});
