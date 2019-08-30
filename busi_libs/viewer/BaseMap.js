define(function (require) {
    var ThemeProcess = require("busi_libs/events/ThemeProcess");
    var initMap = function () {
        var BASE = require('busi_libs/utils/BaseFunc');
        if (!globalScene.map) {
            globalScene.map = L.map('map', {
                preferCanvas: true,
                center: [45.774, 126.60],
                maxZoom: 18,
                minZoom: 1,
                zoom: 10,
                crs: L.CRS.EPSG3857,
                attributionControl: false
            });
            //鼠标移动事件-显示当前位置经纬度
            globalScene.map.addEventListener("mousemove", function (e) {
                $('.latlng_control').html(BASE.parseFixed(e.latlng.lng, 6) + "," + BASE.parseFixed(e.latlng.lat, 6));
            });
            L.supermap.tiledMapLayer(Config.vectorMap).addTo(globalScene.map);
            var latlng_control = L.control({position: "bottomright"});
            latlng_control.onAdd = function () {
                let me = this;
                me._div = L.DomUtil.create('div');
                me._div.style.width = "250px";
                me._div.style.height = "20px";
                me._div.style.position = "absolute";
                me._div.style.right = "20px";
                me._div.style.bottom = "0px";
                $("<div class='latlng_control' style='font-size: 14px'></div>").appendTo(me._div);
                return me._div;
            };
            latlng_control.addTo(globalScene.map);
            var theme_control = L.control({position: "topright"});
            theme_control.onAdd = function () {
                let me = this;
                me._div = L.DomUtil.create('div');
                me._div.style.width = "120px";
                me._div.style.height = "50px";
                me._div.style.position = "absolute";
                me._div.style.right = "20px";
                me._div.style.fontSize = "14px";
                me._div.style.fontWeight = "bold";
                $("<div style='width:100%'>断面车流量专题:</div><select id='theme_select'><option value='none'>无</option><option value='dmcl_w'>调整前</option><option value='dmcl_y'>调整后</option></select>").appendTo(me._div);
                return me._div;
            };
            theme_control.addTo(globalScene.map);
            //宏观图层切换功能
            $('#theme_select').change(function () {
                let index = $('#theme_select')[0].options.selectedIndex;
                let map_theme = $('#theme_select')[0].options[index].value;
                if (globalScene.themeLayer) {
                    globalScene.map.removeLayer(globalScene.themeLayer);
                    globalScene.themeLayer = undefined;
                }
                if (map_theme === 'none') {

                } else {
                    let options = {};
                    options['transparent'] = true;
                    options['zIndex'] = 100;
                    globalScene.themeLayer = L.supermap.tiledMapLayer(Config.theme[map_theme], options);
                    globalScene.map.addLayer(globalScene.themeLayer);
                    globalScene.map.setView(new L.latLng(45.729, 126.550), 14)
                }
            });
            $('#profile').hide();
        }
        ThemeProcess.init();
    };
    var handleMapEvent = function (div, map) {
        if (!div || !map) {
            return;
        }
        div.addEventListener('mouseover', function () {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
        });
        div.addEventListener('mouseout', function () {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.enable();
        });
    };
    return {
        init: initMap,
        handle_event: handleMapEvent
    };
});


