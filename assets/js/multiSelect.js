/**
 * Created by QiuHuang on 2019/8/20.
 * 自定义开发的下拉框搜索，支持搜索，支持数据接口请求(也可以不请求接口，直接前端一次性渲染)，支持单选、多选。
 */
(function($){
    $.fn.multiSelect = function(opt){
        opt = $.extend({
            init: '', 		 //初始选中
            multiple: true,  //默认多选
            isSearch: false, //是否支持搜索
            isAjax: false,   //是否支持后台接口请求
            url: null,      //后台接口请求地址
            params: {},     //后台接口请求参数
            placeholder: ['关键字搜索', '请先输入搜索关键字'],
            isShowCheckbox: true, 	//多选时是否显示选择框
            isShowClear: true, //是否显示清除icon
        },{},opt);
        let $self = $(this), 
            $customSelect = null,
            $optionList = null,
            $noResult = null;
        $self.attr('multiple', 'multiple');
        let dom = {
            init: function(){
                $customSelect =
                    $(`<div class="custom-select-box">
                        <div class="cont">
                            <div class="option-selected">
                                <input type="text" class="selected" placeholder="请选择" readonly>
                                <i class="icon-moredown"></i>
                            </div>
                            <div class="option-box">
                                ${opt.isSearch ? `<div class="search-box">
                                    <input type="text" class="keyword" placeholder="${opt.placeholder[0]}">
                                    ${opt.isShowClear ? `<i class="icon-checkout_close clear"></i>` : ''}
                                    <i class="icon-search search"></i>
                                </div>` : ''}
                                <div class="option-list scroll-bar">
                                    <ul></ul>
                                    <div class="no-result">请先输入搜索关键字</div>
                                </div>
                            </div>
                        </div>
                    </div>`);
                $self.after($customSelect);
                $customSelect.data('selected',[]);
                
                $optionList = $customSelect.find('.option-list ul');
                $noResult = $customSelect.find('.no-result');
                if(opt.isAjax){ //是否支持接口请求
                    $optionList.hide();
                    $('.no-result').show();      
                } else{
                    dom.initOptionList();
                    dom.initSelected();
                    $optionList.show();
                    $('.no-result').hide();
                }
                // 初始化下拉框的宽度,有设置则使用设置值，没有跟原生select宽度一样
                if(opt.width){
                    $customSelect.css('width', opt.width+'px');
                } else{
                    let selectWidth = $self.parent().width();
                    $customSelect.css('width', selectWidth+'px');
                }
                $self.hide();
            },            
            // 初始化下拉框数据
            initOptionList: function(){
                var optionHtml = '',
                    hasSelected = $customSelect.data('selected');
                $self.find('option').each(function(){
                    let _val = $(this).val(),
                        _text = $(this).text();
                    let isChecked = hasSelected.some(item=>item.id==_val);
                    optionHtml += 
                        `<li data-id="${_val}" data-txt="${_text}" ${isChecked ? 'selected' : ''}>
                            <label><input type="checkbox" value="${_val}" style="${opt.multiple&&opt.isShowCheckbox ? '' : 'display:none'}" ${isChecked ? 'checked' : ''}/>${_text}</label>
                        </li>`;
                });
                $optionList.html(optionHtml);
            },
            // 初始化选中
            initSelected(){
                if(opt.init && opt.init.length){
                    console.log(opt.init);
                    let initValue = typeof opt.init == 'string' ? opt.init.split(',') : opt.init, 
                        hasSelected = [], selectedTxts=[];
                    for(let i=0; i<initValue.length; i++){
                        let $optionObj = $customSelect.find(`li[data-id="${initValue[i]}"]`);
                        let optionText = $optionObj.attr('data-txt');
                        $optionObj.addClass('selected').find('input').prop('checked', true);
                        hasSelected.push({
                            id: initValue[i],
                            name: optionText
                        });
                        selectedTxts.push(optionText);
                    }
                    $customSelect.find('input.selected').val(selectedTxts.join(',')).attr('title', selectedTxts);
                    $customSelect.data('selected', hasSelected);
                }
            },
            // 开始搜索
            startSearch: function(keyword){
                if(keyword){
                    $noResult.html('搜索中...').show();
                    $optionList.hide();
                    $.ajax({
                        type: 'post',
                        url: opt.url,
                        data: Object.assign(opt.params, {keyword}),
                        success: function(res){
                            if(res.status>0){
                                if(res.data&&!$.isEmptyObject(res.data)){
                                    let options = '';
                                    //对返回结果进行数据格式兼容，数组/json
                                    let resData = res.data.constructor==Array ? res.data.constructor : Object.values(res.data);
                                    for(let i=0; i<resData.length; i++){
                                        options += `<option value="${resData[i].id}">${resData[i].name}</option>`;
                                    }
                                    $self.html(options);
                                    dom.initOptionList();
                                    $noResult.html(opt.placeholder[1]).hide();
                                    $optionList.show();
                                } else{
                                    $optionList.hide();
                                    $noResult.html('没有匹配到任何结果');
                                }
                            } else{
                                promptInfo(res.msg);
                            }
                        }
                    })
                } else{
                    $noResult.show();
                    $optionList.hide();
                }
            },
            // 计算下拉框位置
            initPos: function(e){
                if($customSelect.closest('.popup').length){
                    let $popup = $customSelect.closest('.popup'),
                        contWidth = $customSelect.width(),
                        popupX = 0, 
                        popupY = 0,
                        posX = $customSelect.offset().left,
                        posY = $customSelect.offset().top;
                    if($popup.length){
                        popupX = $popup.offset().left,
                        popupY = $popup.offset().top;
                    }
                    $customSelect.find('.option-box').css({
                        'position': 'fixed',
                        'left': (posX-popupX)+ 'px',
                        'top': (posY-popupY+30) + 'px',
                        'width': contWidth + 'px'
                    });
                }
            }      
        };
        dom.init();
    
        $(document).on('click', function(){
            $customSelect.find('.option-box').hide();
        });
        $customSelect.on('click', '.option-box', function(e){
            e.stopPropagation();
        });
        $customSelect.on('click', '.option-selected', function(e){		
            $('.custom-select-box').removeClass('current');
            $customSelect.addClass('current');
            dom.initPos(e);
            $customSelect.find('.option-box').toggle();
            $(`.custom-select-box:not('.current') .option-box`).hide();
            if(opt.isAjax){
                $optionList.hide();
                $noResult.html(opt.placeholder[1]).show();
                $customSelect.find('.search-box input').val('');
            }
            e.stopPropagation();
        });
        // 选项选中
        $customSelect.on('change', '.option-list li input[type="checkbox"]', function(){
            let hasSelected = $customSelect.data('selected');
            let $li = $(this).closest('li');
            if($(this).prop('checked')){
                console.log('checked...');
                if(!opt.multiple){ //单选或者多选时选中了'请选择'时,清空当前选中的项
                    $optionList.find('li').removeClass('selected');
                    hasSelected = [];
                } else{
                    if($(this).val()==''){ //多选时选中了'请选择'时,清空当前选中的项
                        $optionList.find('li').removeClass('selected');
                        hasSelected = [];
                    } else{ //将'请选择'选项去除选中
                        $optionList.find('li[data-id=""]').removeClass('selected').find('input').prop('checked', false);
                        let _index = hasSelected.findIndex(item=>!item.id);
                        if(_index>-1){
                            hasSelected.splice(_index, 1);
                        }
                    }
                }
                $li.addClass('selected');
                // 添加进已选择中
                let _id = $(this).val(),
                    _txt = $li.attr('data-txt');
                hasSelected.push({
                    id: _id,
                    name: _txt
                });
            } else{
                console.log('uncheck...');
                $li.removeClass('selected');
                // 从已选择中移除
                let _id = $(this).val();
                let _index = hasSelected.findIndex(item=>item.id==_id);
                hasSelected.splice(_index,1);
            }
            console.log('当前选中的：');
            console.log(hasSelected);
            $customSelect.data('selected', hasSelected);
            let selectedTxt = hasSelected.map(item=>item.name).join(',');
            $customSelect.find('input.selected').val(selectedTxt).attr('title', selectedTxt);
            if(opt.multiple){
                $self.val(hasSelected.map(item=>item.id));
            } else{
                $self.val(hasSelected[0].id);
            }
        });
        // 关键字搜索
        $customSelect.on('click', '.search-box .search', function(){
            let keyword = $(this).siblings('input').val();
            if(opt.isAjax){
                dom.startSearch(keyword);
            } else{
                $optionItems = $optionList.find('li').hide();
                $optionItems.each(function(){
                    let itemText = $(this).text();
                    if(itemText.indexOf(keyword)>-1){
                        $(this).show();
                    }
                });
            }
        });
        $customSelect.on('keydown', 'input.keyword', function(e){
            if(e.keyCode == 13){
                $customSelect.find('.search-box .search').click();
            }
        });
        $customSelect.on('input prototypeChange', 'input.keyword', function(){
            let keyword = $(this).val();
            if(keyword==''){
                if(opt.isAjax){
                    $optionList.hide();
                    $noResult.html(opt.placeholder[1]).show();
                } else{
                    $optionList.find('li').show();
                }
            }
        });
        // 清空搜索关键字 
        $customSelect.on('click', '.search-box .clear', function(){
            $(this).siblings('input').val('');
            $customSelect.find('.search-box .search').click();
        })
    }
})(jQuery);