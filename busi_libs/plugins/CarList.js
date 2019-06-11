define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    var sim_add = function (car_model) {
        var car_id = BASE.base64decode(car_model.car_id);
        var html_item = '<div class="lpi-box" id="' + car_id + '">';
        html_item += '<div class="lpib-list"><p><i class="iconfont icon-qiche"></i></p>';
        html_item += '<p>在线</p></div>\n';
        html_item += '<div class="lpib-list" style="width: 90px"><p><a href="javascript:">Mod' + car_id + '</a></p>';
        var off = car_model.run_state ? 'lp-on' : 'lp-off';
        html_item += '<p>状态:<i class="iconfont icon-yuan-copy ' + off + '"></i></p></div>';
        html_item += '<div class="lpib-list" style="width: 120px"><p>加速度:' + BASE.parseFixed(car_model.info.acceleration, 1) + ' m2/s</p>';
        html_item += '<p>速度: ' + BASE.parseFixed(car_model.speed, 1) + ' km/h</p></div>';
        html_item += '<div class="lpib-list"><p>运行时间:' + Math.round(car_model.stopwatch.getElapsed() / 1000) + 's</p>';//
        html_item += '<p>运行里程:' + BASE.parseFixed(car_model.distance, 2) + 'km</p></div>';
        html_item += '</div>';
        $('.lp-info').append(html_item);
        $('#' + car_id).click(function () {
            globalScene.carDynamicLayer.setUnSelected();
            if (!$(this).hasClass('active')) {
                $(this).addClass("active");
                $(this).siblings().removeClass('active');
            }
            var index = globalScene.SIM_CAR_LIST.indexOfKey('car_id', BASE.base64encode($(this).attr('id')));
            var car_model = globalScene.SIM_CAR_LIST.get(index);
            globalScene.Viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(car_model.pos.x, car_model.pos.y, car_model.pos.z + 100)
            });
            var pick_col = globalScene.Viewer.scene.context._pickObjects;
            for (var key in pick_col) {
                var car = pick_col[key].primitive._description;
                if(!car){
                    continue;
                }
                if (car.car_id === BASE.base64encode($(this).attr('id'))) {
                    var trackedEntity = null;
                    var selectedPrimitive = pick_col[key].primitive; // 选中的图元
                    var ownerGroup = selectedPrimitive._ownerGroup; // 图元所在的组信息
                    var stateList = ownerGroup.stateList; // 状态信息列表
                    var state = stateList.get(pick_col[key].id);
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
                        globalScene.Viewer._selectedEntity = trackedEntity;
                        var selectionIndicatorViewModel = defined(globalScene.Viewer._selectionIndicator) ? globalScene.Viewer._selectionIndicator.viewModel : undefined;
                        if (defined(trackedEntity)) {
                            if (defined(selectionIndicatorViewModel)) {
                                selectionIndicatorViewModel.animateAppear();
                            }
                        } else if (defined(selectionIndicatorViewModel)) {
                            selectionIndicatorViewModel.animateDepart();
                        }
                        globalScene.Viewer._selectedEntityChanged.raiseEvent(trackedEntity);
                    } else {
                        trackedEntity.position = state.position;
                    }
                    globalScene.Viewer.trackedEntity = trackedEntity;
                    break;
                } else {
                    globalScene.Viewer.trackedEntity = null;
                    globalScene.Viewer._selectedEntity = null;
                }
            }
        });
    };
    var stream_add = function (car_model) {
        var car_id = car_model.car_id;
        var html_item = '<div class="lpi-box" id="' + car_id + '">';
        html_item += '<div class="lpib-list"><p><i class="iconfont icon-qiche"></i></p>';
        html_item += '<p>在线</p></div>\n';
        html_item += '<div class="lpib-list" style="width: 90px"><p><a href="javascript:">' + car_id + '</a></p>';
        var off = car_model.run_state ? 'lp-on' : 'lp-off';
        html_item += '<p>状态:<i class="iconfont icon-yuan-copy ' + off + '"></i></p></div>';
        var st_car = "无";
        if (car_model.info["stop_json"] !== null) {
            st_car = car_model.info["stop_json"]["stop_status"] === 1 ? "是" : "否"
        }
        html_item += '<div class="lpib-list" style="width: 120px"><p style="color:yellow">到站状态:' + st_car + '</p>';
        html_item += '<p>速度: ' + BASE.parseFixed(car_model.speed, 1) + ' km/h</p></div>';
        html_item += '<div class="lpib-list"><p>运行时间:' + Math.round(car_model.stopwatch.getElapsed() / 1000) + 's</p>';//
        html_item += '<p>运行里程:' + BASE.parseFixed(car_model.distance, 2) + 'km</p></div>';
        html_item += '</div>';
        $('.lp-info').append(html_item);
        $('#' + car_id).click(function () {
            globalScene.carDynamicLayer.setUnSelected();
            if (!$(this).hasClass('active')) {
                $(this).addClass("active");
                $(this).siblings().removeClass('active');
            }
            var car_model = globalScene.STREAM_CAR_LIST[$(this).attr('id')];
            globalScene.Viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(car_model.pos.x, car_model.pos.y, car_model.pos.z + 100)
            });
            var pick_col = globalScene.Viewer.scene.context._pickObjects;
            for (var key in pick_col) {
                var car = pick_col[key].primitive._description;
                if (car) {
                    if (car.car_id === $(this).attr('id')) {
                        var trackedEntity = null;
                        var selectedPrimitive = pick_col[key].primitive; // 选中的图元
                        var ownerGroup = selectedPrimitive._ownerGroup; // 图元所在的组信息
                        var stateList = ownerGroup.stateList; // 状态信息列表
                        var state = stateList.get(pick_col[key].id);
                        if (!trackedEntity) {
                            trackedEntity = globalScene.Viewer.entities.add({
                                id: 'tracked-entity',
                                position: state.position,
                                point: {
                                    pixelSize: 1,
                                    show: true // 不能设为false
                                },
                               // 观察位置的偏移量
                            });
                            globalScene.Viewer._selectedEntity = trackedEntity;
                            var selectionIndicatorViewModel = defined(globalScene.Viewer._selectionIndicator) ? globalScene.Viewer._selectionIndicator.viewModel : undefined;
                            if (defined(trackedEntity)) {
                                if (defined(selectionIndicatorViewModel)) {
                                    selectionIndicatorViewModel.animateAppear();
                                }
                            } else if (defined(selectionIndicatorViewModel)) {
                                selectionIndicatorViewModel.animateDepart();
                            }
                            globalScene.Viewer._selectedEntityChanged.raiseEvent(trackedEntity);
                        } else {
                            trackedEntity.position = state.position;
                        }
                        globalScene.Viewer.trackedEntity = trackedEntity;
                        break;
                    } else {
                        globalScene.Viewer.trackedEntity = null;
                        globalScene.Viewer._selectedEntity = null;
                    }
                }
            }
        });
    };

    function defined(value) {
        return value !== undefined && value !== null;
    }

    var sim_remove = function (car_model) {
        var car_id = BASE.base64decode(car_model.car_id);
        if ($('#' + car_id).length == 0) {
            console.log(car_id);
        }
        $('#' + car_id).remove();
    };
    var stream_remove = function (car_model) {
        var car_id = car_model.car_id;
        if ($('#' + car_id).length == 0) {
            console.log(car_id);
        }
        $('#' + car_id).remove();
    };
    var clear = function () {
        $('.lp-info').html('');
        $('.lp-select').html('');
    };
    var sim_update = function (car_model) {
        var car_id = BASE.base64decode(car_model.car_id);
        var html_item = '<div class="lpib-list"><p><i class="iconfont icon-qiche"></i></p>';
        html_item += '<p>在线</p></div>\n';
        html_item += '<div class="lpib-list" style="width: 90px"><p><a href="javascript:">Mod' + car_id + '</a></p>';
        var off = car_model.run_state ? 'lp-on' : 'lp-off';
        html_item += '<p>状态:<i class="iconfont icon-yuan-copy ' + off + '"></i></p></div>';
        html_item += '<div class="lpib-list" style="width: 120px"><p>加速度:' + BASE.parseFixed(car_model.info.acceleration, 1) + ' m2/s</p>';
        html_item += '<p>速度: ' + BASE.parseFixed(car_model.speed, 1) + ' km/h</p></div>';
        html_item += '<div class="lpib-list"><p>运行时间:' + Math.round(car_model.stopwatch.getElapsed() / 1000) + 's</p>';
        html_item += '<p>运行里程:' + BASE.parseFixed(car_model.distance, 2) + 'km</p></div>';
        $('#' + car_id).html(html_item);
    };
    var stream_update = function (car_model) {
        var car_id = car_model.car_id;
        var html_item = '<div class="lpib-list"><p><i class="iconfont icon-qiche"></i></p>';
        html_item += '<p>在线</p></div>\n';
        html_item += '<div class="lpib-list" style="width: 90px"><p><a href="javascript:">' + car_id + '</a></p>';
        var off = car_model.run_state ? 'lp-on' : 'lp-off';
        html_item += '<p>状态:<i class="iconfont icon-yuan-copy ' + off + '"></i></p></div>';
        var st_car = "无";
        if (car_model.info["stop_json"] !== null) {
            st_car = car_model.info["stop_json"]["stop_status"] === 1 ? "是" : "否"
        }
        html_item += '<div class="lpib-list" style="width: 120px"><p style="color:yellow">到站状态:' + st_car + '</p>';
        html_item += '<p>速度: ' + BASE.parseFixed(car_model.speed, 1) + ' km/h</p></div>';
        html_item += '<div class="lpib-list"><p>运行时间:' + Math.round(car_model.stopwatch.getElapsed() / 1000) + 's</p>';
        html_item += '<p>运行里程:' + BASE.parseFixed(car_model.distance, 2) + 'km</p></div>';
        $('#' + car_id).html(html_item);
    };
    var statistic = function (add, update, del) {
        var car_count = $('.lpi-box').length;
        var html = "车辆总数：" + car_count + " 新增车辆：" + add + " 更新车辆：" + update + " 移除车辆：" + del;
        $('.lp-statistic').html(html);
    };
    return {
        sim_add: sim_add,
        sim_update: sim_update,
        sim_remove: sim_remove,
        stream_add: stream_add,
        stream_update: stream_update,
        stream_remove: stream_remove,
        clear: clear,
        statistic: statistic
    }
});