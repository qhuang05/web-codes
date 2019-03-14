(function (doc, win) {
  var docEl = win.document.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var dpr = 0;
  var scale = 0;

  // 对iOS设备进行dpr的判断，对于Android系列，始终认为其dpr为1
  if (!dpr && !scale) {
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/[iphone|ipad]/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if(isIPhone) {
      dpr = devicePixelRatio;
  } else {
      dpr = 1;
  }   
  scale = 1 / dpr;
}

  /**
    * ================================================
    *   设置data-dpr和viewport
    × ================================================
    */
    docEl.setAttribute('data-dpr', dpr);
  // 动态改写meta:viewport标签
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        document.documentElement.firstElementChild.appendChild(metaEl);
    } else {
        metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    }

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
