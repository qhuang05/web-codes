/**
 * Created by hqh on 2017/3/31.
 */
define(function(require, exports, module){
    require('zepto');
    require('sui-mobile');
    var common = require('assets/js/common/common');
    exports.dataInit = function(){          //抢单页面相关操作
        //点击抢单按钮
        $('#grabBtn').on('click', function(){
            $.popup('.popup-register');
            // $.popup('.popup-recharge');
            // $.router.load('grab-result.html');
        });

        //输入手机号码, 检测'获取验证码'按钮是否可用
        $('#telephone').on('input propertychange',function(){
            if($(this).val().length != 11){
                $('#getCodeBtn').addClass('invalid');
            } else{
                $('#getCodeBtn').removeClass('invalid');
            }
            exports.checkRegisterBtnStatus();
        });

        //输入验证码
        $('#code').on('input propertychange', function(){
           exports.checkRegisterBtnStatus();
        });

        //点击获取验证码
        $('#getCodeBtn').on('click', function(){
            if($(this).hasClass('invalid')){
                return;
            } else{
                var telephone = $('#telephone').val();
                exports.getCode(telephone);
                exports.codeTimeCount(5);
            }
        });

        //司机欠费, 打开司机端
        $('#toDriverApp').on('click', function(){
            var iosAPP = 'http://www.baidu.com',
                androidAPP = 'http://www.hao123.com',
                downloadURL = 'http://download.bbxpc.com/weixin';
            common.checkIsApp(iosApp, androidAPP, downloadURL);
        });
    };
    
    exports.resultInit = function(data){                    //抢单结果页面相关操作
        
    };

    exports.getCode = function(telephone){              //获取验证码
        // $.ajax({});
    };

    exports.codeTimeCount = function(seconds){         //获取验证码时间倒计时
        var timer = null;
        _timeCount(seconds, timer);
        function _timeCount(seconds, timer){
            if(seconds == 0){
                clearTimeout(timer);
                $('#telephone').removeAttr('disabled');
                $('#getCodeBtn').removeClass('invalid').text('获取验证码');
            } else{
                $('#telephone').attr('disabled', 'disabled');
                timer = setTimeout(function(){
                    $('#getCodeBtn').text('正在发送(' + seconds + ')').addClass('invalid');
                    _timeCount(--seconds, timer);
                }, 1000);
            }
        }
    };

    exports.checkRegisterBtnStatus = function(){         //检测注册按钮是否可用
        var telephone = $('#telephone').val(),
            code = $('#code').val();
        if(telephone.length != 11 || code.length !=4){
            $('#registerBtn').addClass('invalid');
        } else{
            $('#registerBtn').removeClass('invalid');
        }
    };

    exports.grabOrder = function(){                         //抢单
        // $.ajax();
    };

    $(document).on('pageInit', '#orderGrabPage', function(e, id, page){
        exports.dataInit();
    });

    $(document).on('pageInit', '#grabResultPage', function(e, id, page){
        exports.resultInit();
    });
});