define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    var TickProcess = require('busi_libs/events/TickProcess');
    var FlowController = require('busi_libs/plugins/FlowController');
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");
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
        $('#line_sel').change(function () {
            var index = $('#line_sel')[0].options.selectedIndex;
            if (index !== -1) {
                globalScene.globalTimer.stop();
                // for (var key in globalScene.STREAM_CAR_LIST) {
                //     if (globalScene.STREAM_CAR_LIST[key].info.hasOwnProperty("stop_json")) {
                //         globalScene.Viewer.entities.removeById(key);
                //     }
                // }
                globalScene.line_filter = $('#line_sel')[0].options[index].value;
                $('.lp-info').html('');
                $('.lp-select').html('');
                globalScene.carDynamicLayer.setUnSelected();
                globalScene.carDynamicLayer.clearAll();
                globalScene.STREAM_CAR_LIST = {};
                globalScene.globalTimer.start();

            }
        });
    };
    return {
        init: init
    }
});