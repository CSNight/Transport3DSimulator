define(function (require) {
    var CarModelBase = new require('busi_libs/models/CarModelBase');
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var ES = new require('busi_libs/requests/ESRequest');
    var BASE = require('busi_libs/utils/BaseFunc');
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");
    var TickFrameEvent = function (e) {
        var search = ES.search_builder(e.times - 1000, e.times, {
            index: "trans_sim",
            "es_type": "car_trajectory",
            "range_field": "timestamp",
            "ident": e.file_id
        });
        ES.es_request_func(search, function (es) {
            var stat = parseJsonToCar(es.hits.hits);
            CarListPlugin.statistic(stat.count_n, stat.count_o, stat.count_d);
            var urls = {};
            for (var i = 0; i < Config.CarModelUrls.length; i++) {
                urls[Config.CarModelUrls[i]] = [];
            }
            for (var i = 0; i < globalScene.SIM_CAR_LIST.size(); i++) {
                var st = globalScene.SIM_CAR_LIST.get(i).obj_state;
                urls[globalScene.SIM_CAR_LIST.get(i).url].push(st);
            }

            for (var key in urls) {
                globalScene.carDynamicLayer.updateObjectWithModel(key, urls[key]);
            }
            if(globalScene.Pop_on){
                for (var i = 0; i < globalScene.SIM_CAR_LIST.size(); i++) {
                    globalScene.Viewer.entities.removeById(globalScene.SIM_CAR_LIST.get(i).car_id);
                }
                for (var i = 0; i < globalScene.SIM_CAR_LIST.size(); i++) {
                    var car_model=globalScene.SIM_CAR_LIST.get(i);
                    globalScene.Viewer.entities.add({
                        id: car_model.car_id,
                        position: Cesium.Cartesian3.fromDegrees(car_model.pos.x, car_model.pos.y, car_model.pos.z + 10),
                        label: {
                            text: 'Mod'+BASE.base64decode(car_model.info.car_id),
                            font: '15px Helvetica',
                            fillColor: Cesium.Color.RED,
                            outlineColor: Cesium.Color.RED,
                            outlineWidth: 1,
                            distanceDisplayCondition: 'm',
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE
                        }
                    });
                }
            }else {
                for (var i = 0; i < globalScene.SIM_CAR_LIST.size(); i++) {
                    globalScene.Viewer.entities.removeById(globalScene.SIM_CAR_LIST.get(i).car_id);
                }
            }

        }, function (error) {
            console.log(error);
        })
    };
    var parseJsonToCar = function (es_json) {
        var car_stat = {
            count_n: 0,
            count_o: 0,
            count_d: 0
        };

        es_json.forEach(function (item) {
            var _source = item._source;
            if (globalScene.SIM_CAR_LIST.indexOfKey("car_id", _source.car_id) === -1) {
                var new_car = new CarModelBase.CarModel(_source.car_class, _source);
                globalScene.SIM_CAR_LIST.add(new_car);
                CarListPlugin.sim_add(new_car);
                car_stat.count_n = car_stat.count_n + 1;
            } else {
                var car_index = globalScene.SIM_CAR_LIST.indexOfKey("car_id", _source.car_id);
                var car_model=globalScene.SIM_CAR_LIST.get(car_index);
                car_model.updateInfo(_source);
                if (car_index < 0) {
                    alert(_source.car_id);
                }
                CarListPlugin.sim_update(globalScene.SIM_CAR_LIST.get(car_index));
                car_stat.count_o = car_stat.count_o + 1;
            }
        });
        //删除跑出
        var dif = globalScene.SIM_CAR_LIST.diff(es_json, "car_id", "_source");
        car_stat.count_d = dif.length;
        dif.forEach(function (cur) {
            var index=globalScene.SIM_CAR_LIST.indexOfKey("car_id",cur);
            var car_mo=globalScene.SIM_CAR_LIST.get(index);
            globalScene.carDynamicLayer.deleteObjects(car_mo.url, [cur]);
            CarListPlugin.sim_remove(car_mo);
            globalScene.Viewer.entities.removeById(car_mo.car_id);
            globalScene.SIM_CAR_LIST.removeAt(index);
        });
        return car_stat;
    };
    var TickStreamEvent = function (e) {
        var stream = new SRAjax(function (res) {
            if (res.response) {
                var stat = parserMapToCar(res.response);
                CarListPlugin.statistic(stat.count_n, stat.count_o, stat.count_d);
                var state = [];
                // for (var key in globalScene.STREAM_CAR_LIST) {
                //     if (globalScene.STREAM_CAR_LIST[key].info.hasOwnProperty("stop_json")) {
                //         globalScene.Viewer.entities.removeById(key);
                //     }
                // }
                for (var key in globalScene.STREAM_CAR_LIST) {
                    var car_obj = globalScene.STREAM_CAR_LIST[key];
                    state.push(car_obj.obj_state);
                    // if (car_obj.info.hasOwnProperty("stop_json")) {
                    //     globalScene.Viewer.entities.add({
                    //         id: car_obj.car_id,
                    //         position: Cesium.Cartesian3.fromDegrees(car_obj.pos.x, car_obj.pos.y, car_obj.pos.z + 10),
                    //         label: {
                    //             text: car_obj.info.line_id,
                    //             font: '15px Helvetica',
                    //             fillColor: Cesium.Color.RED,
                    //             outlineColor: Cesium.Color.RED,
                    //             outlineWidth: 1,
                    //             distanceDisplayCondition: 'm',
                    //             style: Cesium.LabelStyle.FILL_AND_OUTLINE
                    //         }
                    //     });
                    // }
                }
                globalScene.carDynamicLayer.updateObjectWithModel(car_obj.url, state);
            }
        });
        stream.StreamREST({
            params: JSON.stringify({
                "RqType": "GetGPS",
                "filter": globalScene.line_filter
            })
        });
    };
    var parserMapToCar = function (data_flow) {
        var car_stat = {
            count_n: 0,
            count_o: 0,
            count_d: 0
        };
        for (var key in data_flow) {
            var car_obj = data_flow[key];
            if (car_obj['stop_json'] !== null) {
                var line_id = car_obj["stop_json"]["line_id"];
                if (globalScene.lineCol.indexOf(line_id) === -1) {
                    globalScene.lineCol.push(line_id);
                    $('#line_sel').append('<option value="' + line_id + '">' + line_id + '路</option>');
                }
            }
            if (!globalScene.STREAM_CAR_LIST.hasOwnProperty(car_obj.car_id)) {
                var new_car = new CarModelBase.CarModel(car_obj.car_class, car_obj);
                globalScene.STREAM_CAR_LIST[key] = new_car;
                CarListPlugin.stream_add(new_car);
                car_stat.count_n = car_stat.count_n + 1;
            } else {
                globalScene.STREAM_CAR_LIST[car_obj.car_id].updateInfo(car_obj);
                CarListPlugin.stream_update(globalScene.STREAM_CAR_LIST[car_obj.car_id]);
                car_stat.count_o = car_stat.count_o + 1;
            }
        }
        return car_stat
    };

    return {
        TickFrameEvent: TickFrameEvent,
        TickStreamEvent: TickStreamEvent
    }
});