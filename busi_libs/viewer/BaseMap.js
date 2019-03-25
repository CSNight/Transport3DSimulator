define(function () {
    var initMap = function () {
        var BASE = require('busi_libs/utils/BaseFunc');
        if (!globalScene.map) {
            globalScene.map = L.map('map', {
                center: [45.774, 126.60],
                maxZoom: 15,
                minZoom: 1,
                zoom: 10,
                crs: L.CRS.EPSG3857,
                attributionControl: false
            });

            globalScene.map.addEventListener("mousemove", function (e) {
                $('.latlng_control').html(BASE.parseFixed(e.latlng.lng, 6) + "," + BASE.parseFixed(e.latlng.lat, 6));
            });
            L.supermap.tiledMapLayer(Config.vectorMap).addTo(globalScene.map);
            var latlng_control = L.control({position: "bottomright"});
            latlng_control.onAdd = function () {
                var me = this;
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
            $('#profile').hide();
        }
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


