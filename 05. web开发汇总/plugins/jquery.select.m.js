$(function(){
     $.selectSuggest = function(target, data, selectOnlyone, itemSelectFunction, updateApi) {
        var defaulOption = {
            suggestMaxHeight: '250px',//弹出框最大高度
            itemColor : '#606060',//默认字体颜色
            itemBackgroundColor:'fff',//默认背景颜色
            itemOverColor : '#ffffff',//选中字体颜色
            itemOverBackgroundColor : '#169bdb',//选中背景颜色
            itemPadding : 2 ,//item间距
            fontSize : 12 ,//默认字体大小
            alwaysShowALL : true //点击input是否展示所有可选项
        };
        var maxFontNumber = 0;//最大字数
        var currentItem = null;
        var currentSelection = -1;
        var suggestContainerId = target + "-suggest";
        $("body").eq(0).remove("#"+ suggestContainerId);
        var suggestContainer;
        if ($('#' + suggestContainerId)[0]) {
            suggestContainer = $('#' + suggestContainerId);
            suggestContainer.empty();
        } else {
            suggestContainer = $('<div></div>'); //创建一个子<div>
        }
        suggestContainer.attr('id', suggestContainerId);
        suggestContainer.attr('tabindex', '0');
        suggestContainer.hide();

        //初始化页数
        var totalPage = Math.ceil(data.total/updateApi.perPage);
        $('#' + target).find('.total-page').text(totalPage).end().find('.cur-page').text(1);

        var _initItems = function(items) {
            suggestContainer.empty();
            for (var i = 0; i < items.length; i++) {
                    if(items[i].text.length > maxFontNumber){
                        maxFontNumber = items[i].text.length;
                    }
                var suggestItem = $('<div></div>'); //创建一个子<div>
                for(var key in items[i]) {
                    //遍历对象，obj[key]为当前key对应的值
                    suggestItem.attr($.trim(key.toString()), items[i][key]);
                }
                //suggestItem.attr('id', items[i].id);
                //suggestItem.attr("data2", items[i][""]); //修改新加入属性值
                suggestItem.append(items[i].text);
                suggestItem.css({
                    'padding':defaulOption.itemPadding + 'px',
                    'white-space':'nowrap',
                    'cursor': 'pointer'
                });
                suggestItem.unbind("mouseover").bind("mouseover", function() {
                     $(this).addClass('option-seled').siblings().removeClass('option-seled');
                        currentItem = $(this);
                });
                suggestItem.unbind("mouseout").bind("mouseout", function() {
                    $(this).css({
                        'background-color': defaulOption.itemBackgroundColor,
                        'color': defaulOption.itemColor
                    });
                    currentItem = null;
                });
                suggestItem.bind("click", showClickTextFunction);
                suggestItem.bind("click", itemSelectFunction);
                suggestItem.appendTo(suggestContainer);
                if(i==0 && items.length == 1 && selectOnlyone =="selectone" ){
                	suggestItem.addClass('option-seled').siblings().removeClass('option-seled');
                	currentItem = suggestItem;
                	currentItem.trigger("click");
                }
            }
            suggestContainer.appendTo("body");
        };

        var updateData = function(updateApi, pageIndex){
            // $.ajax({
            //     type: 'post',
            //     url: updateApi.url,
            //     data:JSON.stringify({}),
            //     dataType: 'json',
            //     success:function(res){
            //     }
            // });
            switch(parseInt(pageIndex)){
                case 1:
                    data = {
                        data: [
                            {id: 1, text: "中国联通"},
                            {id: 2, text: "中国移动"},
                            {id: 3, text: "中国建筑"},
                            {id: 4, text: "联想集团"},
                            {id: 5, text: "上海汽车集团"},
                            {id: 6, text: "中国工商银行"},
                            {id: 7, text: "中国建设银行"}
                        ],
                        total: 20
                    };
                    break;
                case 2:
                    data = {
                        data: [
                            {id: 21, text: "厦门联通"},
                            {id: 22, text: "厦门移动"},
                            {id: 23, text: "厦门建筑"},
                            {id: 24, text: "厦门银行"}
                        ],
                        total: 20
                    };
                    break;
                case 3:
                    data = {
                        data: [
                            {id: 31, text: "泉州联通"},
                            {id: 32, text: "泉州移动"},
                            {id: 33, text: "泉州建筑"}
                        ],
                        total: 20
                    }
                    break;
                case 4:
                    data = {
                        data: [
                            {id: 41, text: "江苏联通"},
                            {id: 42, text: "江苏移动"}
                        ],
                        total: 20
                    }
                    break;
            }
            _initItems(data.data);
            $('#' + target).find('.cur-page').text(pageIndex);
        };

        var showClickTextFunction = function() {
            currentItem = null;
            $('#' + target).find('input').val(this.innerHTML);
            $('#' + target).find('input').attr('data',$(this).attr('id'));
            $('#' + suggestContainerId).hide();
        };
        
        var inputChange = function() {
            var inputValue = $('#' + target).find('input').val();
            inputValue = inputValue.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            var matcher = new RegExp(inputValue, "i");
            return $.grep(data.data,
            function(value) {
                return matcher.test(value.text);
            });
        };

        $('#' + target).find('input').unbind("focus").bind("focus", function() {
        	$(this).css("ime-mode", "disabled");/*CSS3 Standard*/
        	$(this).css("-webkit-ime-mode", "disabled");/*Chrome Safari*/
        	$(this).css("-moz-ime-mode", "disabled");/*Mozilla Firefox*/
        	$(this).css("-o-ime-mode", "disabled");/*Opera*/
        	$(this).css("-ms-ime-mode", "disabled");/*Internet Explorer*/
            $(this).trigger('click');
        });
        $('#' + target).find('input').unbind("blur").bind("blur", function() {
            if(!$('#' + suggestContainerId).is(":hidden")){
                if (currentItem) {
                    currentItem.trigger("click");
                }
                currentItem = null;
            }
        });

        //键盘按键，对回车、退格键处理
        $('#' + target).find('input').unbind("keydown").bind("keydown", function(event){
            if(event.keyCode==13){
                if (currentItem) {
                    currentItem.trigger("click");
                }
                currentItem = null;
            } else if(event.keyCode == 8){
            	$(this).val("");
            	$(this).trigger("click");
            }
         });
        // 键盘按键，去除不需要项和对上、下键进行处理
        $('#' + target).find('input').unbind("keyup").bind("keyup", function(e){
        	_initItems(inputChange());
            var suggestContainerLen = suggestContainer.find('div').length;
            switch (e.which) {
                case 38:
                    e.preventDefault();
                    $(suggestContainer).children('div').removeClass('option-seled');
                    if((currentSelection - 1) >= 0){
                        currentSelection--;
                        $(suggestContainer).children().eq(currentSelection).addClass('option-seled');
                        currentItem = $(suggestContainer).children().eq(currentSelection);
                    } else {
                        currentSelection = 0;
                        $(suggestContainer).children(0).eq(currentSelection).addClass('option-seled');
                        currentItem = $(suggestContainer).children(0).eq(currentSelection);
                    }
                    break;
                case 40:
                    e.preventDefault();
                    $(suggestContainer).children('div').removeClass('option-seled');
                    if((currentSelection + 1) < suggestContainerLen){
                        currentSelection++;
                        $(suggestContainer).children().eq(currentSelection).addClass('option-seled');
                        currentItem = $(suggestContainer).children().eq(currentSelection);
                    }
                    break;
            }
        });

        $('#' + target).unbind("click").bind("click", function(e) {
            var clickedTarget = $(e.target);
            if(clickedTarget.is('input')){  //点击输入框时
                if (defaulOption.alwaysShowALL) {
                    _initItems(data.data);
                } else {
                    _initItems(inputChange());
                }
                $('#' + target).find('.control').show();
                var suggestContainerWidth = $('#' + target).innerWidth();
                var suggestContainerLeft = $('#' + target).offset().left;
                var suggestContainerTop = $('#' + target).offset().top + $('#' + target).outerHeight();
                $('#' + suggestContainerId).removeAttr("style");
                var tempWidth = defaulOption.fontSize*maxFontNumber + 2 * defaulOption.itemPadding + 30;
                var containerWidth = Math.max(tempWidth, suggestContainerWidth);
                $('#' + suggestContainerId).css({
                    'border': '1px solid #ccc',
                    'max-height': '250px',
                    'top': suggestContainerTop,
                    'left': suggestContainerLeft,
                    'width': containerWidth,
                    'position': 'absolute',
                    'font-size': defaulOption.fontSize+'px',
                    'font-family':'Arial',
                    'z-index': 99999,
                    'background-color': '#FFFFFF',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'white-space':'nowrap'
                });
                $('#' + suggestContainerId).show();
            } else if(clickedTarget.is('button.prev')){     //点击上一页时
                var curPage = parseInt($('#' + target).find('.cur-page').text());
                if(curPage > 1){
                    updateData(updateApi, curPage-1);
                    $('#' + target).find('input').val('').removeAttr('data');
                }
            } else if(clickedTarget.is('button.next')){     //点击下一页时
                var curPage = parseInt($('#' + target).find('.cur-page').text()),
                    totalPage = parseInt($('#' + target).find('.total-page').text());
                if(curPage < totalPage){
                    updateData(updateApi, curPage + 1);
                    $('#' + target).find('input').val('').removeAttr('data');
                }
            }
            windowClick();
            $('#' + suggestContainerId).show();
        });
        _initItems(data.data);

        //点击其它区域，关闭弹出下拉框
        function windowClick(){
            $(window).unbind("click").bind("click", function(e){
               var clickTarget = $(e.target);
               if(clickTarget.parent().attr('id') != target && clickTarget.parent().parent().attr('id') != target){
                   $('#' + suggestContainerId).hide();
                   $('#' + target).find('.control').hide();
               }
           });
        }

        // 点击下拉图标
        // $('.com-select-icon').unbind("click").bind("click", function(){
        //     $(this).siblings('#' + target).trigger('click');
        // });
    };
});
