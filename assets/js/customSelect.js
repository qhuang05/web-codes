/**
 * Created by QiuHuang on 2018/9/12.
 */
(function($){
    $.fn.customSelect = function(opt){
        var $self = $(this),
            targetId = $(this).attr('id');
        opt = $.extend({
            data: opt.data,
            url: opt.url,
            params: opt.params,
            multiple: false
        },opt);
        var dom = {
            init: function(){
                var selecthtml = 
                    `<input type="text" class="select-input" readonly/>
                    <div class="dropdown-box">
                        <input type="text" class="keywords-input" /><i>搜索</i>
                        <ul></ul>
                    </div>`;
                $self.html(selecthtml);
                opt.data ? dom.setData(opt.data) : dom.getData();
            },
            getData: function(){
                $.ajax({
                    type: 'post',
                    url: opt.url,
                    data: opt.params,
                    dataType: 'json',
                    success: function(res){
                        dom.setData(res);
                    }
                });
            },
            setData: function(data){
                var listhtml = '';
                for(var i=0;i<data.length; i++){
                    listhtml +=
                    `<li data-id="${data[i].id}"><span>${data[i].name}</span><i>√</i></li>`;
                }
                $self.find('ul').html(listhtml);
            },
            keywordsSearch: function(keywords){
                $self.find('li').hide();
                $self.find('li').each(function(){
                    let liText = $(this).find('span').text();
                    if(liText.indexOf(keywords) > -1){
                        $(this).show();
                    }
                });
            }
        };
        dom.init();
        // 操作事件
        var $dropdown = $self.find('.dropdown-box');
        var $selectInput = $self.find('.select-input');
        $self.on('click', 'li', function(){
            if(opt.multiple){
                $(this).toggleClass('active');
                let ids = [], txts = [];
                $dropdown.find('li.active').each(function(){
                    ids.push($(this).attr('data-id'));
                    txts.push($(this).find('span').text());
                });
                $selectInput.val(txts.join(','));
                $selectInput.attr('ids',ids.join(','));
            } else{
                $(this).addClass('active').siblings('li').removeClass('active');
                $selectInput.val($(this).find('span').text());
                $selectInput.attr($(this).attr('data-id'));
                $dropdown.hide();
            }
        });
        $self.on('input propertychange', '.keywords-input', function(){
            var keywords = $(this).val().trim();
            dom.keywordsSearch(keywords);
        });
        $self.on('click', '.keywords-input+i', function(){
            let keywords = $('.keywords-input').val().trim();
            dom.keywordsSearch(keywords);
        });
        $self.on('click', '.select-input', function(){
            $dropdown.toggle();
            return false;
        });
        $self.on('click', '.dropdown-box', function(){
            return false;
        });
        $(document).on('click', function(){
            $dropdown.hide();
        });
    }
})(jQuery);