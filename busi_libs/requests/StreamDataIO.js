define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    var TickProcess = require('busi_libs/events/TickProcess');
    var FlowController = require('busi_libs/plugins/FlowController');
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");
    var CarModelBase = new require('busi_libs/models/CarModelBase');
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var init = function () {
        $('.lp-static').html("车辆监控列表");
        globalScene.STREAM_CAR_LIST = {};
        globalScene.globalTimer = new Timer(2000, null);
        globalScene.globalTimer.addEventListener('timer', TickProcess.TickStreamEvent);
        globalScene.globalTimer.addEventListener('timer', function () {
            var getLine = new SRAjax(function (res) {
                if (res.response) {
                    for (var i = 0; i < res.response.length; i++) {
                        if (globalScene.lineCol.indexOf(res.response[i]) === -1) {
                            globalScene.lineCol.push(res.response[i]);
                            $('#line_sel').append('<option value="' + res.response[i] + '">' + res.response[i] + '路</option>');
                        }
                    }
                }
            });
            getLine.StreamREST({
                params: JSON.stringify({
                    "RqType": "GetLine"
                })
            });
        });
        globalScene.carDynamicLayer.updateInterval = 3000;
        FlowController.init();
        globalScene.line_filter = "all";
        globalScene.lineCol = [];
        CarListPlugin.clear();
        $('#line_sel').change(function () {
            var index = $('#line_sel')[0].options.selectedIndex;
            if (index !== -1) {
                globalScene.globalTimer.stop();
                globalScene.line_filter = $('#line_sel')[0].options[index].value;
                $('.lp-info').html('');
                $('.lp-select').html('');
                globalScene.carDynamicLayer.setUnSelected();
                globalScene.carDynamicLayer.clearAllState();
                globalScene.STREAM_CAR_LIST = {};
                InitGps();
            }
        });
    };
    var InitGps = function () {
        var stream = new SRAjax(function (res) {
            if (res.response) {
                var stat = parserMapToCar(res.response);
                CarListPlugin.statistic(stat.count_n, stat.count_o, stat.count_d);
                var state = [];
                for (var key in globalScene.STREAM_CAR_LIST) {
                    var car_obj = globalScene.STREAM_CAR_LIST[key];
                    state.push(car_obj.obj_state);
                }
                globalScene.carDynamicLayer.updateObjectWithModel(car_obj.url, state);
            }
            globalScene.globalTimer.start();
        });
        stream.StreamREST({
            params: JSON.stringify({
                "RqType": "GetAll",
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
        init: init
    }
});