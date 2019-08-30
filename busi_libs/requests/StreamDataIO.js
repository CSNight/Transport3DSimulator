define(function (require) {
    var TickProcess = require('busi_libs/events/TickProcess');
    var FlowController = require('busi_libs/plugins/FlowController');
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var Trajectory = require('busi_libs/plugins/Trajectory');
    var init = function () {
        //初始化GPS定时器
        $('.lp-static').html("车辆监控列表");
        globalScene.STREAM_CAR_LIST = {};
        globalScene.globalTimer = new Timer(1000, null);
        globalScene.globalTimer.addEventListener('timer', TickProcess.TickStreamEvent);
        //获取公交车辆列表
        var getLineCars = new SRAjax(function (res) {
            if (res.response) {
                for (let line in res.response) {
                    globalScene.LineCarMap = res.response;
                    $('#line_sel').append('<option value="' + line + '">' + line + '路</option>');
                }
                FlowController.init();
            }
        });
        getLineCars.StreamREST({
            params: JSON.stringify({
                "RqType": "getCarList"
            })
        });
        globalScene.carDynamicLayer.updateInterval = 500;
        globalScene.line_filter = "all";
        CarListPlugin.clear();
        //公交线路下拉切换事件
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
            }
            if (globalScene.stream_type === 'his') {
                Trajectory.build_list();
            }
        });
    };

    return {
        init: init
    }
});