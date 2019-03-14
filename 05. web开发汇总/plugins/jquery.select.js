$(function(){
     $.selectSuggest = function(target, data, selectOnlyone, itemSelectFunction) {
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

        var showClickTextFunction = function() {
            currentItem = null;
            $('#' + target).val(this.innerHTML);
            $('#' + target).attr('data',$(this).attr('id'));
            $('#' + suggestContainerId).hide();
        };
        
        var inputChange = function() {
            var inputValue = $('#' + target).val();
            inputValue = inputValue.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            var matcher = new RegExp(inputValue, "i");
            return $.grep(data,
            function(value) {
                return matcher.test(value.text);
            });
        };

        $('#' + target).unbind("focus").bind("focus", function() {
        	$(this).css("ime-mode", "disabled");/*CSS3 Standard*/
        	$(this).css("-webkit-ime-mode", "disabled");/*Chrome Safari*/
        	$(this).css("-moz-ime-mode", "disabled");/*Mozilla Firefox*/
        	$(this).css("-o-ime-mode", "disabled");/*Opera*/
        	$(this).css("-ms-ime-mode", "disabled");/*Internet Explorer*/
            $(this).trigger('click');
        });
        $('#' + target).unbind("blur").bind("blur", function() {
            if(!$('#' + suggestContainerId).is(":hidden")){
                if (currentItem) {
                    currentItem.trigger("click");
                }
                currentItem = null;
            }
        });

        //键盘按键，对回车、退格键处理
        $('#' + target).unbind("keydown").bind("keydown", function(event){
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
        $('#' + target).unbind("keyup").bind("keyup", function(e){
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

        $('#' + target).unbind("click").bind("click", function() {
            if (defaulOption.alwaysShowALL) {
                _initItems(data);
            } else {
                _initItems(inputChange());
            }
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
            windowClick();
            $(this).select();
        });
        _initItems(data);

        //点击其它区域，关闭弹出下拉框
        function windowClick(){
            $(window).unbind("click").bind("click", function(e){
               var clickTarget = $(e.target);
               if (!clickTarget.is($('#' + target))) {
                   $('#' + suggestContainerId).hide();
               }
           });
        }

        // 点击下拉图标
        $('.com-select-icon').unbind("click").bind("click", function(){
            $(this).siblings('#' + target).trigger('click');
        });

    };
});
