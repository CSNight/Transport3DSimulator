define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    var left_click = function () {
        //globalScene.carDynamicLayer.setUnSelected();
        if (globalScene.Viewer.selectedEntity && globalScene.Viewer.selectedEntity.primitive) {
            var car_id = globalScene.Viewer.selectedEntity.primitive._description.car_id;
            if (car_id.indexOf("黑") === -1) {
                car_id = BASE.base64decode(car_id);
            }
            if (!$('#' + car_id).hasClass('active')) {
                $('#' + car_id).addClass("active");

                $('#' + car_id).siblings().removeClass('active');
                $('.lp-select').html('');
                var clo = $('#' + car_id).clone();
                $(clo).addClass("clo_sel");
                $('.lp-select').append(clo);
                $('#' + car_id).hide();
                $('.clo_sel').show();
            }
            if (globalScene.Interval) {
                clearInterval(globalScene.Interval);
                globalScene.Interval = undefined;
                globalScene.focus = -1;
            }
            // globalScene.Interval = setInterval(function flow(pos) {
            //     globalScene.focus = globalScene.SIM_CAR_LIST.indexOfKey('car_id', BASE.base64encode(car_id));
            //     var car_obj = globalScene.SIM_CAR_LIST.get(globalScene.focus);
            //     globalScene.Viewer.camera.flyTo({
            //         destination: Cesium.Cartesian3.fromDegrees(car_obj.pos.x, car_obj.pos.y, car_obj.pos.z + 100),
            //         duration: 0.3
            //     });
            // }, 100);
        } else {
            globalScene.carDynamicLayer.setUnSelected();
            clearInterval(globalScene.Interval);
            globalScene.Interval = undefined;
            globalScene.focus = -1;
            $('.lpi-box').removeClass('active');
            $('.lpi-box').show();
            $('.lp-select').html('');
        }
    };


    return {
        LeftClick: left_click
    }
});