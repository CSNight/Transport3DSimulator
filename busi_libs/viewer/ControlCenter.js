define(function (require) {
    var MainScene = require('busi_libs/viewer/MainScene');
    var SceneProcess = require('busi_libs/events/SceneProcess');
    var MeasureAll = require('busi_libs/plugins/MeasureAll');
    var AnalysisAll = require('busi_libs/plugins/AnalysisAll');
    globalScene = {
        scene: null,
        primitive_dynamic: null,
        Viewer: null,
        carDynamicLayer: null,
        LineCarMap: null,//公交线路车辆Map
        map: null,
        LayerDic: {},
        models: {},
        baseMap: null,
        Lights_on: true,//信号灯全局FLag
        Pop_on: false,//气泡全局FLag
        Interval: 1000,
        stream_type: "stream",
        speed_lim: 60//限速阈值
    };
    MainScene.init('cesiumContainer', function (e) {
        MainScene.switchBase(true, "");
        //注册左键点击事件
        MainScene.sceneEventRegister("l_click", SceneProcess.LeftClick);
        init_plugin_stat();
        //测量、分析控件初始化
        MeasureAll.init();
        AnalysisAll.init();
        controlAction();
        //限速警告弹窗初始化
        Metro.notify.setup({container: $(".notify-container"), width: 300, distance: "10vh"});
        $('#spr').on('input', function () {
            $('#spi').text($(this).val());
            globalScene.speed_lim = $(this).val();
        })
    });

    function controlAction() {
        //停止全部绘制控件
        globalScene.deactiveAll = function () {
            globalScene.handlerDis && globalScene.handlerDis.deactivate();
            globalScene.handlerArea && globalScene.handlerArea.deactivate();
            globalScene.handlerHeight && globalScene.handlerHeight.deactivate();
            globalScene.viewshedHandler && globalScene.viewshedHandler.deactivate();
            globalScene.profileLine && globalScene.profileLine.deactivate();
        };
        //清空所有控件绘制内容
        globalScene.clearAll = function () {
            globalScene.handlerDis && globalScene.handlerDis.clear();
            globalScene.handlerArea && globalScene.handlerArea.clear();
            globalScene.handlerHeight && globalScene.handlerHeight.clear();
            globalScene.profileLine && globalScene.profileLine.clear();
        };
    }

    function init_plugin_stat() {
        function setClose(selector, target, parent) {
            $(selector).on('click', function () {
                $(target).hide();
                if (parent) {
                    $(parent).removeClass('active');
                }
            });
        }

        setClose('.data-tab ul .close', '.data-panel', '.rtop-tool ul li.data');
        $(window).resize(function () {
            $('.lp-main').height($('.left-panel').height() - 88);
            $('.lp-info').height($('.lp-main').height() - 250);
        });
    }
});