define(["base"], function(base){
	"use strict";
    // 带搜索功能下拉框
    $.fn.selectPicker = function (opt) {
        var $select = $(this);
        var selectId = $select.attr('id');
        var opt = $.extend({
            width: '',
            height: '400',
            title: '',
            allowSearch: true,
            searchText: '请输入搜索关键字',
            searchInit: true,          //是否初始化选择列表
            searchUpdate: false,     //是否根据搜索关键字更新选择列表
            searchKey: 'QueryValue',
            id: '',
            text: '',
            data: undefined,
            url: undefined,
            param: undefined,
            method: 'GET',
            callbackCancel: undefined,
            callbackOK: undefined
        }, opt);
        var dom = {
            init: function () {
                var $selectPopup = $('<div id="' + selectId + '-popup" class="select-box" style="display:none"></div>');
                var html =
                    '<div class="mask"></div>' +
                    '<div class="content">' +
                        '<div class="content-title">' +
                            '<span class="title">' + opt.title + '</span>' +
                            '<a href="#" class="button button-inline button-cancel">取消</a>' +
                            '<a href="#" class="button button-inline button-confirm">确定</a>' +
                        '</div>' +
                        '<div class="content-body">' +
                            '<div class="search-keywords">' +
                            '<input type="text" class="search-input" placeholder="' + opt.searchText + '"/>' +
                        '</div>' +
                        '<div class="list-block"><ul class="search-list"></ul></div>';
                $selectPopup.html(html);
                var page = $('.view-main').attr('data-page');
                $('.pages [data-page="' + page + '"] .page-content').append($selectPopup);
                //内容高度
                var titleHeight = $selectPopup.find('.content-title').height(),
                    searchHeight = $selectPopup.find('.search-keywords').height(),
                    listHeight = opt.height - titleHeight - searchHeight;
                $selectPopup.find('.content').css('height', opt.height + 'px');
                $selectPopup.find('.search-list').css('height', listHeight + 'px');
            },
            rendeningData: function () {
                dom.loadData();
                console.log(opt.data);
                var $selectPopup = $('#' + selectId + '-popup');
                if (opt.data) {
                    var liHtml = '';
                    $.each(opt.data, function (index, value) {
                        var liOptionInfo = '';
                        for (var key in value) {
                            liOptionInfo += '<div class="item-' + key + '" style="display:none">' + value[key] + '</div>';
                        }
                        liHtml += '<li>' +
                                '<label class="label-radio item-content">' +
                                    '<input type="radio" name="radio-item" value="' + value[opt.id] + '">' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title">' + value[opt.text] + '</div>' +
                                        liOptionInfo +
                                    '</div>' +
                                '</label>' +
                            '</li>'
                    });
                    $selectPopup.find('.search-list').html(liHtml);
                }
            },
            loadData: function () {
                if (!!opt.url) {
                    //app.f7.showIndicator();
                    //app.f7.showPreloader();
                    submitform.ajaxGet({
                        url: opt.url + '?timestamp=' + new Date().getTime(),
                        param: opt.param,
                        type: opt.method,
                        success: function (res) {
                            opt.data = res;
                        }
                    });
                    //app.f7.hideIndicator();
                    //app.f7.hidePreloader();
                }
            },
            popupHide: function (popObj) {
                $('.page-content').css('overflow', 'auto');
                popObj.find('.content').removeClass('slideUp').addClass('slideDown');
                setTimeout(function () {
                    popObj.hide();
                }, 500);
            },
            popupShow: function (popObj) {
                $('.page-content').css('overflow', 'hidden');
                popObj.show();
                popObj.find('.content').removeClass('slideDown').addClass('slideUp');
            }
        };
        dom.init();
        if (opt.searchInit) {
            dom.rendeningData(opt);
        }
        //DOM操作
        var $selectPopup = $('#' + selectId + '-popup');
        $select.off('click').on('click', function () {
            dom.popupShow($selectPopup);
        });
        $selectPopup.on('click', '.mask', function () {
            dom.popupHide($selectPopup);
        });
        $selectPopup.on('click', '.button.button-cancel', function () {
            dom.popupHide($selectPopup);
            if (opt.callbackCancel) { opt.callbackCancel(); }
        });
        $selectPopup.on('click', '.button.button-confirm', function () {
            var $selectedItemObj = $selectPopup.find('.search-list li.active');
            if ($selectedItemObj.length) {
                var selectedText = $selectedItemObj.find('.item-title').text(),
                     selectedValue = $selectedItemObj.find('input').val();
                $select.val(selectedText).attr('data-value', selectedValue);
            }
            dom.popupHide($selectPopup);
            if (opt.callbackOK) { opt.callbackOK($selectedItemObj); }
        });
        $selectPopup.on('click', '.search-list li', function () {
            $selectPopup.find('.search-list li').removeClass('active');
            $(this).addClass('active');
        });
        $selectPopup.on('input propertychange', '.search-input', function () {
            var keywords = $(this).val().trim();
            if (opt.searchUpdate) {
                opt.param[opt.searchKey] = keywords;
                dom.rendeningData(opt);
            } else {
                var $liItems = $selectPopup.find('.search-list li');
                $liItems.hide().removeClass('active');
                $liItems.each(function () {
                    var itemValue = $(this).text();
                    if (itemValue.indexOf(keywords) != -1) {
                        $(this).show();
                    }
                });
            }
        });
        //解决Android搜索框输入时看不见input输入框内容
        var winHeight = $(window).height();
        $(window).on('resize', function () {
            var _wHeight = $(this).height();
            if (winHeight - _wHeight > 50) {  //键盘弹出
                $('body').css('height', winHeight + 'px');
            } else {
                $('body').css('height', '100%');
            }
        });
        return $select;
    };
   
    return {
    	selectPicker: $.fn.selectPicker
    }
});