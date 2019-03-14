/**
 * Created by hqh on 2017/3/26.
 */

define(function(require, exports, module){
    require('zepto');
    require('sui-mobile');
    // 获取当前时间
    var time = require('assets/js/components/dateSelect/bbxDateSelect');   
    var cityObject = {};
    // 初始化页面事件
    exports.initBase = function(){
        //点击头部-后退
        $(document).on('click', '#back', function(){
            $.router.back();
        });

        //点击头部-记录
        $('#toOrderList').off('click').on('click', function(){
            $.router.load('order-list.html');
        });

        // 合乘-拼车人数
        $('#intercityPartPanel a.reduce-btn').off('click').on('click', function(){
            var curValue = parseInt($('#pinNumber').val());
            if(curValue <=1 ){
                return false;
            } else{
                $('#pinNumber').val(--curValue);
            }
        });
        $('#intercityPartPanel a.add-btn').off('click').on('click', function(){
            var curValue = parseInt($('#pinNumber').val());
            $('#pinNumber').val(++curValue);
        });

        //包车-车型选择
        $('#carsType li').off('click').on('click', function(){
            $('#carsType li').removeClass('active');
            $(this).addClass('active');
        });

        //包车-行程选择
        $('#tripType li').off('click').on('click', function(){
            $('#tripType li').removeClass('active');
            $(this).addClass('active');
        });

        $('#forSelfBtn').off('click').on('click', function(){
            $.router.load('order-result.html');
        });
    };

    // 初始化选择城市面板
    exports.initCityPannel = function() {
        // 百度地图api对象
        var local = new BMap.LocalSearch();
        var myGeo = new BMap.Geocoder();
        var city = new String();    // 城市列表选中的城市
        var isDetailFlag = false;   // 是否是详细城市
        var isIncity = false;       // 是否是市内单
        var options = { // 搜索回调函数
            onSearchComplete: function(results){
                // 判断状态是否正确
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    flushAddrList(results);
                }
            }
        };
        
        /**
         * 点击bar左边城市
         */
        $(document).on('click', '.already-selected .city-select-hook', function() {
            $('#location_city_name').val("");
            $("#cityRouter .bar").removeClass("already-selected");
            $("#city_list").removeClass("com-hide");
            $("#address_list").addClass("com-hide");
        });

        /**
         * 点击出发地/目的地，进入地址选择列表
         */
        $(document).on("click", '.item-location', function() {
            if($(".item-location span[name='start_address']").attr('data-state') == "false") {  // 还未定位成功
                return;
            }
            var addressObj = $(this).find('.address-link');
            var addressType = addressObj.attr("name");
            var targetPanel = $(this).closest("section.tab");
            $('.city-select .city-input').val('');
            $("#address_list > ul").empty();
            $("#order_address").removeAttr("disabled"); // 还原
            isDetailFlag = false;           // 还原
            $("#order_address").val("");    // 清空具体地址列表
            $("#cityRouter .bar").removeClass("already-selected");
            $('.city-select-hook').attr("data-from", "intercity");
            if(addressType == "start_address") {    // 出发地
                $("#city_list").addClass("com-hide");   // 先隐藏城市列表
                city = addressObj.attr("data-city");
                $('#location_city').text(city);
                $("#cityRouter .bar").addClass("already-selected");
                $("#address_list").removeClass("com-hide"); // 显示具体地址列表
                $("#order_address").focus();
                // 初始化搜索对象
                var map = new BMap.Map("l-map");
                myGeo = new BMap.Geocoder();
                myGeo.getPoint(city, function(point){
                    if (point) {
                        map.centerAndZoom(point, 11);
                    }else{
                        alert('地图中找不到您所在的地方');
                    }
                });
                local = new BMap.LocalSearch(map,options);
                var isDetail = detailStartCity(city,0); // 详细地址
                if(isDetail) {  // 详细地址
                    isDetailFlag = true; 
                    $("#order_address").attr("disabled",true);
                    $("#order_address").val(city);
                    local.search(city,{
                        forceLocal:true
                    });
                } else {
                    // 去除详细地址限制
                    $("#order_address").removeAttr("disabled");
                    $("#order_address").val("");
                    flushStartCityList();   // 加载出发地城市列表
                }
            } else if(addressType == "end_address") {   // 目的地
                var startCity = $('.tab.active .start-address').find(".address-link").attr('data-city');
                var endCity = $(this).find(".address-link").attr('data-city');
                flushEndCityList(startCity);    // 加载目的地城市
                if(endCity == "") {             // 还没选择过目的地，进入城市选择面板
                    $("#city_list").removeClass("com-hide");
                    $("#address_list").addClass("com-hide");
                } else {                        // 有选择过目的地，默认带入城市，进入具体地址输入面板
                    $("#cityRouter .bar").addClass("already-selected");
                    $("#address_list").removeClass("com-hide"); // 显示具体地址列表
                    $("#order_address").focus();
                    // 初始化搜索对象
                    var map = new BMap.Map("l-map");
                    myGeo = new BMap.Geocoder();
                    myGeo.getPoint(endCity, function(point){
                        if (point) {
                            map.centerAndZoom(point, 11);
                        }else{
                            alert('地图中找不到您所在的地方');
                        }
                    });
                    local = new BMap.LocalSearch(map,options);
                    var isDetail = detailStartCity(endCity,0);  // 详细地址
                    if(isDetail) {  // 详细地址
                        isDetailFlag = true; 
                        $("#order_address").attr("disabled",true);
                        $("#order_address").val(endCity);
                        local.search(endCity,{
                            forceLocal:true
                        });
                    } else {
                        // 去除详细地址限制
                        $("#order_address").removeAttr("disabled");
                    }
                }
            }
            $("#cityRouter").attr("data-address-type", addressType);
            $("#cityRouter").attr("data-target", targetPanel.attr("id"));
            $.router.load("#cityRouter");
        });
        
        /**
         * 输入具体地址触发具体地址加载列表事件
         */
        $(document).on("input","#order_address",function() {
            var detail = $("#order_address").val();
            detail = city + detail;
            local.search(detail,{
                forceLocal:true
            });
        });
        
        /**
         * 点击城市列表中的城市
         */
        $(document).on("click", ".content .city-wrapper-hook .city-detail", function() {
            getCityTemplate($(this));
        });

        // 点击获取城市(通用)
        function getCityTemplate(elem) {
            city = elem.attr("data-name");
            $('#location_city').text(city);
            $("#cityRouter .bar").addClass("already-selected");
            $("#address_list").removeClass("com-hide");
            $("#city_list").addClass("com-hide");
            $("#order_address").focus();
            var isDetail = detailStartCity(city,0); // 详细地址
            // 初始化搜索对象
            var map = new BMap.Map("l-map");
            myGeo.getPoint(city, function(point){
                if (point) {
                    map.centerAndZoom(point, 11);
                }else{
                    alert('地图中找不到您所在的地方');
                }
            });
            local = new BMap.LocalSearch(map,options);
            if(isDetail) {
                isDetailFlag = true; 
                $("#order_address").attr("disabled",true);
                $("#order_address").val(city);
                local.search(city,{
                    forceLocal:true
                });
            } else {
                // 去除详细地址限制
                $("#order_address").removeAttr("disabled");
                $("#order_address").val("");
            }
        }
        
        
        // 选择详细地址
        $(document).on("click","#address_list .pos-list li", function(e) {
            var address = $(this).attr("data-desc");
            address = city + " " + address;
            var lat = $(this).attr("data-lat");
            var lng = $(this).attr("data-lng");
            var addressType = $("#cityRouter").attr("data-address-type");
            var target = null;
            target = $("#intercityPartPanel,#intercityAllPanel").find("span[name='" + addressType + "']");
            target.find(".address").text(address);
            target.attr("data-lng", lng);
            target.attr("data-lat", lat);
            target.attr("data-city", city);
            target.parent().removeClass("invalid");
            $.router.back();
            return ;
        });

        // 匹配搜索的城市
        $(document).on('input propertychange', '.city-input', function() {
            //字母匹配
            var val = $(this).val();
            if(val) {
                $('#location_list dd').each(function(){
                    var content = $(this).text().indexOf(val);
                    if(content >= 0){
                        $(this).show();
                        flag = true;
                    }else{
                        $(this).hide();
                    }
                });
            }else { // 没有输入时，展示所有
                $('#location_list dd').each(function() {
                    $(this).show();
                });
            }
        });
        
        // 点击城市
        $(document).on('click', '#location_list .city-item', function() {
            if($(this).attr("data-node-count") == 1) {
                getCityTemplate($(this).siblings().find('.city-detail'));
            } else {
                $(this).siblings('section').toggleClass('com-hide');
            }
        });

        // 切换选择地级市
        $(document).on('click', '.open-city dd ul li', function() {
            $('.open-city li').removeClass('on');
            $(this).addClass('on');
        });
        
        /**
         * 刷新详细地址列表
         */
        function flushAddrList(autocompleteResult) {
            var target = $("#address_list > .pos-list");
            target.empty();
            var results = autocompleteResult;
            var l = results.getCurrentNumPois();
            var lng,lat,desc,address,province,cityname,detailAddress;
            if(isDetailFlag) {// 详细地址
                var isAccurate = false;
                for(var i=0; i<l; i++) {
                    if(results.getPoi(i).isAccurate) {  // 精准匹配
                        isAccurate = true;
                        lng = results.getPoi(i).point.lng;
                        lat =  results.getPoi(i).point.lat;
                        desc =  results.getPoi(i).title;
                        address =  results.getPoi(i).address;
                        province =  results.getPoi(i).province;
                        cityname =  results.getPoi(i).city;
                        // 判断，避免出现重复
                        if(address.indexOf(cityname) == -1) {
                            detailAddress = cityname + address;
                        } else {
                            detailAddress = address;
                        }
                        if(address.indexOf(province) == -1) {
                            detailAddress = province + detailAddress;
                        } 
                        target.append('<li data-isDetail=1 class="active-bf4" data-lng="'+lng+'" data-lat="'+lat+'" data-desc="' + desc + '" data-city="' + city + '"><dl><dt class="iconfont">&#xe634;</dt><dd><h3>' + desc + '</h3><p>' + detailAddress + '</p></dd></dl></li>');
                        break;
                    }
                }
                if(!isAccurate) {   // 没有精准匹配，取第一个
                    lng = results.getPoi(0).point.lng;
                    lat = results.getPoi(0).point.lat;
                    desc = results.getPoi(0).title;
                    address = results.getPoi(0).address;
                    province = results.getPoi(0).province;
                    cityname = results.getPoi(0).city;
                    // 判断，避免出现重复
                    if(address.indexOf(cityname) == -1) {
                        detailAddress = cityname + address;
                    } else {
                        detailAddress = address;
                    }
                    if(address.indexOf(province) == -1) {
                        detailAddress = province + detailAddress;
                    } 
                    target.append('<li data-isDetail=1 class="active-bf4" data-lng="'+lng+'" data-lat="'+lat+'" data-desc="' + desc + '" data-city="' + city + '"><dl><dt class="iconfont">&#xe634;</dt><dd><h3>' + desc + '</h3><p>' + detailAddress + '</p></dd></dl></li>');
                }
            } else {
                for(var i=0; i<l; i++) {
                    lng = results.getPoi(i).point.lng;
                    lat = results.getPoi(i).point.lat;
                    desc = results.getPoi(i).title;
                    address = results.getPoi(i).address;
                    province = results.getPoi(i).province;
                    cityname = results.getPoi(i).city;
                    // 判断，避免出现重复
                    if(address.indexOf(cityname) == -1) {
                        detailAddress = cityname + address;
                    } else {
                        detailAddress = address;
                    }
                    if(address.indexOf(province) == -1) {
                        detailAddress = province + detailAddress;
                    } 
                    if(city != '') {
                        target.append('<li class="active-bf4" data-lng="'+lng+'" data-lat="'+lat+'" data-desc="' + desc + '" data-city="' + city + '"><dl><dt class="iconfont">&#xe634;</dt><dd><h3>' + desc + '</h3><p>' + detailAddress + '</p></dd></dl></li>');
                    }
                }
            } 
        }
        
        /**
         * 加载出发地
         */
        function flushStartCityList() {
            $("#location_list").empty().append('<dt>开通城市</dt>');
            var list = exports.getStartLineList();
            $(".current-hook").removeClass("exit");
            for(var key in list) {
                var len = list[key].length;
                if(len != 0) {
                    var nodeName = key;
                    var str = "<dd><span class='city-item' data-node-count='"+len+"' data-name='"+nodeName+"'>"+nodeName+"</span>";
                    str = str + "<section class='com-hide'><ul>";
                    for(var num in list[key]) {
                        var city = list[key][num];
                        str = str + "<li class='city-detail' data-name="+city.name+">"+city.name+"</li>";
                    }
                    str = str + "</ul></section></dd>";
                    $("#location_list").append(str);
                }
            }
        }
        
        /**
         * 加载目的地城市
         */
        function flushEndCityList(city) {
            $("#location_list").empty().append('<dt>开通城市</dt>');
            // $.ajax({
            //     type: 'POST',
            //     url: '',
            //     data: param,
            //     dataType: 'json',
            //     success: function(res){
            //         console.log('获取开通目的地城市列表：'+JSON.stringify(res));
                    
            //     },
            //     error: function(xhr,error,status){
                    
            //     }
            // });
            // var list = cities;
            // console.log(exports.getEndLineList());
            var list = exports.getEndLineList(city);
            var currentCity = $("#hiddenLotCity").attr("data-city");
            $(".current-hook").removeClass("exit");
            for(var key in list) {
                var len = list[key].length;
                if(len != 0) {
                    var nodeName = key;
                    var str = "<dd><span class='city-item' data-node-count='"+len+"' data-name='"+nodeName+"'>"+nodeName+"</span>";
                    str = str + "<section class='com-hide'><ul>";
                    for(var num in list[key]) {
                        var city = list[key][num];
                        str = str + "<li class='city-detail' data-name="+city.name+">"+city.name+"</li>";
                    }
                    str = str + "</ul></section></dd>";
                    $("#location_list").append(str);
                }

            }
        }
        
        /**
         * 选择具体地址
         */
        function chooseAddressAction() {
            var addressBelong = $("#cityRouter").attr("data-address-belong");
            var targetPanel = null;
            if(addressBelong.indexOf("intercity") != -1) {
                targetPanel = $("section.tab").find("span[data-belong='" + addressBelong + "']").parents("section.intercity-tab");
            } else {
                targetPanel = $("section.tab").find("span[data-belong='" + addressBelong + "']").parents("section.tab");
            }
            // flushOrderPanelData(targetPanel);
        }
    };

    /**
     * 检查是否是详细地址-出发地
     * @param cityName
     * @param type 1是市内，0城际
     * @returns 是详细地址返回true，否则false
     */
    function detailStartCity(cityName,type) {
        var l = cityObject.length;
        var currentCity;
        for(var i=0; i<l; i++) {
            currentCity = cityObject[i].cn_name;
            if(cityName == currentCity &&cityObject[i].is_detail == "1" && cityObject[i].is_city == type) {
                return true;
            }
        }
        return false;
    }

    // 通过浏览器定位当前城市
    exports.loctionCity = function() {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(rs){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var city = rs.address.city,
                    province = rs.address.provinc,
                    district = rs.address.district,
                    target = $('.start-address').find('span[name="start_address"]');
                exports.initLocation(target, rs);
            }
            else {
                $.alert('failed'+this.getStatus());
            }        
        },{enableHighAccuracy: true});
    };

    // 初始化地址
    exports.initLocation = function(target, rs) {
        var addressComponents = rs.address,
            address,
            lng,
            lat;
        address = addressComponents.city + " " + addressComponents.district + addressComponents.street + addressComponents.street_number;
        lng = rs.point.lng;
        lat = rs.point.lat;
        target.find('.positioning').hide();
        target.find(".address").text(address);
        target.attr("data-lng", lng);
        target.attr("data-lat", lat);
        target.attr("data-city", addressComponents.city);
        target.attr("data-province", rs.address.province);
        target.attr('data-state', true);
        $("#hiddenLotCity").attr("data-province", addressComponents.province);
        $("#hiddenLotCity").attr("data-city", addressComponents.city);
    };

    // 获取当前定位城市的开通线路
    exports.getStartLineList = function() {
        var result = cities.app_citys;
        var cityKey = {};
        for(var i = 0; i < result.length; i++) {
            var citychild = result[i].child_citys;
            var cityvalue = [];
            for(var j = 0; j < citychild.length; j++) {
                var cityarr = citychild[j];
                if(cityarr.is_city == "1") {
                    cityvalue[j] = {
                        "city": cityarr.city,
                        "is_city": cityarr.is_city,
                        "name": cityarr.name                    
                    }
                }
            }
            cityKey[result[i].name] = cityvalue;
        }
        return cityKey;
    };

    // 获取起始地下的目的地址的key-value（传入的city为起始地址的二级城市名称）
    exports.getEndLineList = function(city) {
        var result = cities.app_citys;
        var list = {};
        for(var i = 0; i < result.length; i++) {    
            var cityvalue = result[i].child_citys;
            for(var j = 0; j < cityvalue.length; j++) {
                var arr2 = [];
                var childcity = result[i].child_citys[j].to_cities;
                for(var z = 0; z< childcity.length; z++){
                    var arr1 = [];
                    var endtocity = childcity[z].child_citys;
                    for(var t = 0; t < endtocity.length; t++) {
                        if(endtocity[t].is_incity == "1") {
                             arr1[t] = {
                                "city": endtocity[t].city,
                                "is_incity": endtocity[t].is_incity,
                                "name": endtocity[t].name        
                            };
                        }
                    }
                    arr2[childcity[z].name] = arr1;
                }
                list[result[i].child_citys[j].name] = arr2;
            }
        }
        return list[city];
    };

    //下单结果初始页面
    exports.resultInit = function(){
        $.modal({
            'title': '<i class="iconfont custom-close" id="orderSuccessModal">&#xe610;</i>',
            'text': '<p>订单已放入您的订单列表<br/>快去服务吧！</p>',
            extraClass: 'custom-modal modal-block',
            verticalButtons: true,
            buttons: [
                {
                    text: '马上服务'
                },
                {
                    text: '继续下单',
                    onClick: function(){
                        exports.cancelOrder(1);
                    }
                }
            ]
        });
        $('#orderSuccessModal').on('click', function(){
            $.closeModal();
        });
    };

    $(document).on('pageInit', '#orderCreatePage', function(e, id, page){
        // console.log(11);
    });

    time.bbxDateSelect();
    exports.initBase();
    exports.loctionCity();
    exports.initCityPannel();

    $(document).on('pageInit', '#orderResultPage', function(e, id, page){
        exports.resultInit();
    });
});