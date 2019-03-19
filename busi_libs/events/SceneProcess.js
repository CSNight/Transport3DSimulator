define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    var left_click = function (e) {
        if (globalScene.Viewer.selectedEntity && globalScene.Viewer.selectedEntity.primitive) {
            if (!globalScene.Viewer.selectedEntity.primitive._description) {
                return;
            }
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
            var trackedEntity = null;
            var pickedObject = globalScene.scene.pick(e.position);
            if (pickedObject) {
                var selectedPrimitive = pickedObject.primitive; // 选中的图元
                var ownerGroup = selectedPrimitive._ownerGroup; // 图元所在的组信息
                var stateList = ownerGroup.stateList; // 状态信息列表
                var state = stateList.get(pickedObject.id);
                if (!trackedEntity) {
                    trackedEntity = globalScene.Viewer.entities.add({
                        id: 'tracked-entity',
                        position: state.position,
                        point: {
                            pixelSize: 1,
                            show: true // 不能设为false
                        },
                        viewFrom: new Cesium.Cartesian3(-100, -150, 100) // 观察位置的偏移量
                    });
                } else {
                    trackedEntity.position = state.position;
                }
                globalScene.Viewer.trackedEntity = trackedEntity;
            } else {
                globalScene.Viewer.trackedEntity = null;
            }
        } else {
            globalScene.Viewer.entities.removeById('tracked-entity');
            globalScene.Viewer.trackedEntity = null;
            $('.lpi-box').removeClass('active');
            $('.lpi-box').show();
            $('.lp-select').html('');
        }
    };


    return {
        LeftClick: left_click
    }
});