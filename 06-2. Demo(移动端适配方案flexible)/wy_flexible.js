(function (doc, win) {
  var docEl = win.document.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

  /**
    * ================================================
    * 设置根元素font-size
    * 当设计图为750px时，html根元素font-size=75px; 
    × ================================================
    */
    var refreshRem = function () {
        var clientWidth = win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
        console.log('clientWidth: ' + clientWidth);
        if (!clientWidth) return;
        var width = clientWidth;
        var fz = width/10;
        docEl.style.fontSize = fz + 'px';
    };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, refreshRem, false);
    // doc.addEventListener('DOMContentLoaded', refreshRem, false);
    refreshRem();
})(document, window);
