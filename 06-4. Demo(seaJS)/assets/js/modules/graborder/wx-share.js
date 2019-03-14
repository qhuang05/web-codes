/**
 * Created by hqh on 2017/3/31.
 */
define(function(require, exports, module){
    require('zepto');
    require('sui-mobile');

    // 调用微信分享
    // exports.wxShare = function(data) {
        var data = JSON.parse($('#grabInfo').text()).sign_package;
        // var data = data.sign_package;
        // var url = data.sign_package.url;
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2f385e733417ea4c&redirect_uri=http%3A%2F%2Fsharedev.bbxhc.com%2Fpub%2Fdriver_share%2Forder&response_type=code&scope=snsapi_login&state=17553676khmKmrUAxSXwMHBgkGUg0BBVcBAgUPDBcHA11TCF1YUlJRBA9QDVNSAgYMCANCCEsRHwUCAwYIAQYHVFJPRx8&connect_redirect=1#wechat_redirect";
        wx.config({
            debug: true,
            appId: data.signInfo.appId,
            timestamp: data.signInfo.timestamp,
            nonceStr: data.signInfo.nonceStr,
            signature: data.signInfo.signature,
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage"
            ]
        });
        wx.ready(function(){
            // 朋友
            wx.onMenuShareAppMessage({
                title: "帮邦行朋友", // 分享标题
                desc: '1', // 分享描述
                link: url, // 分享链接
                imgUrl: 'https://mmbiz.qlogo.cn/mmbiz_png/a2TVcunPAJKhBIAJEZELOiaaZbWEoB1CEFFwoW70k1YkYbo7ibK5NLkf1eY21sM5jht025MSAM3d5JhA5kJTxa5g/0?wx_fmt=png', // 分享图标
                success: function() {
                   // $.toast('分享成功！', 2000, "custom-toast");
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

            // 朋友圈
            wx.onMenuShareTimeline({
                title: '帮邦行朋友圈', // 分享标题
                link: url, // 分享链接
                imgUrl: 'https://mmbiz.qlogo.cn/mmbiz_png/a2TVcunPAJKhBIAJEZELOiaaZbWEoB1CEFFwoW70k1YkYbo7ibK5NLkf1eY21sM5jht025MSAM3d5JhA5kJTxa5g/0?wx_fmt=png', // 分享图标
                success: function() {
                    // $.toast('分享成功！', 2000, "custom-toast");
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    // }

    // 微信分享
    
    exports.wxShare(data);
});