define(function (require) {
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var BASE = require('busi_libs/utils/BaseFunc');
    var Trajectory = require('busi_libs/plugins/Trajectory');
    var INTERVAL = 1000;
    var init = function () {
        clear();
        if (globalScene.globalTimer !== null) {
            setHtmlFrame();
        }
    };
    var setHtmlFrame = function () {
        $('.lp-info').height($('.lp-main').height()-180);
        $('.lp-info').niceScroll({
            'cursorwidth': '6px',
            'cursorcolor': '#999',
            'cursorborderradius': 0,
            'cursorborder': 0,
            'background': '',
            'cursoropacitymax': 0.8,
            'mousescrollstep': 100
        });
        let html_btn = '<div class="lpd-btn stream_play"><a href="javascript:;"><i class="iconfont icon-bofang"></i>启动</a></div>';
        html_btn += '<div class="lpd-btn stream_stop"><a href="javascript:;"><i class="iconfont icon-tingzhi-shixin"></i>停止</a></div>';
        html_btn += '<div class="lpd-btn stream_reset"><a href="javascript:;">重置</a></div>';
        html_btn += '<div class="lpd-btn history"><a href="javascript:;">历史轨迹</a></div>';
        $('.lp-ctr.top').html(html_btn);
        $('.stream_play').click(function () {
            start();
        });
        $('.stream_stop').click(function () {
            stop();
        });
        $('.stream_reset').click(function () {
            reset(true);
            CarListPlugin.statistic(0, 0, 0);
        });
        $(".history").click(function () {
            stop();
            Trajectory.open();
        });
        Trajectory.init();
    };
    var start = function () {
        if (globalScene.globalTimer.currentCount === 0) {
            globalScene.carDynamicLayer.clearAll();
            CarListPlugin.clear();
        }
        globalScene.globalTimer.start();
    };
    var stop = function () {
        globalScene.globalTimer.stop();
    };
    var speed_up = function (factor) {
        globalScene.globalTimer.delay = INTERVAL / factor;
        //globalScene.carDynamicLayer.updateInterval = INTERVAL / factor * 2;
    };
    var speed_down = function (factor) {
        globalScene.globalTimer.delay = INTERVAL * (1 / factor);
        //globalScene.carDynamicLayer.updateInterval = INTERVAL * (1 / factor) * 2;
    };
    var reset = function () {
        var isCleanScene = arguments[0] ? arguments[0] : true;
        if (isCleanScene) {
            globalScene.carDynamicLayer.clearAll();
            CarListPlugin.clear();
        }
        globalScene.globalTimer.reset();
    };

    function clear() {
        $('.lp-info').html('');
        $('.lp-ctr').html('');
        $('.lp-statistic').html('');
    }

    return {
        init: init,
        start: start,
        stop: stop,
        reset: reset,
        speed_up: speed_up,
        speed_down: speed_down,
        setHtmlFrame: setHtmlFrame
    }
});