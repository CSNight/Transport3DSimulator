define(function (require) {
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var BASE = require('busi_libs/utils/BaseFunc');
    var INTERVAL = 1000;
    var init = function () {
        clear();
        if (globalScene.globalTimer !== null) {
            setHtmlFrame();
        }
    };
    var setHtmlFrame = function () {
        $('.lp-info').height($('.lp-main').height() - 280);
        $('.lp-info').niceScroll({
            'cursorwidth': '6px',
            'cursorcolor': '#999',
            'cursorborderradius': 0,
            'cursorborder': 0,
            'background': '',
            'cursoropacitymax': 0.8,
            'mousescrollstep': 100
        });
        var frame_speed = INTERVAL;
        var html_btn = '<div class="lpd-btn play"><a href="javascript:"><i class="iconfont icon-bofang"></i>启动</a></div>';
        html_btn += '<div class="lpd-btn stop"><a href="javascript:"><i class="iconfont icon-tingzhi-shixin"></i>停止</a></div>';
        html_btn += '<div class="lpd-btn reset"><a href="javascript:"><i class="iconfont icon-icon-yuanxk"></i>重置</a></div>';
        //html_btn += '<div class="lpd-inp">倍速：<input type="type" value="' + frame_speed / INTERVAL + '"></div>';
        $('.lp-ctrl').html(html_btn);
        $('.play').click(function () {
            start();
        });
        $('.stop').click(function () {
            stop();
        });
        $('.reset').click(function () {
            reset(true);
            CarListPlugin.statistic(0, 0, 0);
        });
        $('.lpd-inp').find('input').change(function (e) {
            var factor = parseFloat($('.lpd-inp').find('input').val());
            if (BASE.isNumber(factor)) {
                stop();
                if (factor > 1 && factor <= 10) {
                    speed_up(factor);
                } else if (factor > 10) {
                    alert('Invalid Input!');
                } else if (factor >= 0.1 && factor <= 1) {
                    speed_down(factor);
                } else {
                    alert('Invalid Input!');
                }
                start();
            } else {
                alert('Invalid Input!');
            }
        });
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
        $('.lp-ctrl').html('');
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