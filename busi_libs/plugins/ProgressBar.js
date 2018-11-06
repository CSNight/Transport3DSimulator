define(function (require) {
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var BASE = require('busi_libs/utils/BaseFunc');
    var INTERVAL = 1000;
    var init = function (s) {
        clear();
        if (globalScene.globalTimer !== null) {
            setHtmlFrame(s);
        }
    };
    var setHtmlFrame = function (s) {
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
        var frame_count = globalScene.globalTimer.total_count;
        var frame_speed = INTERVAL;
        var frame_start = new Date(s).toLocaleString();
        var frame_end = new Date(s + frame_count * 1000).toLocaleString();
        var html_date = '<div style="float:left;width:43%">S:' + frame_start + '</div>';
        html_date += '<div style="float:right;margin-right: 25px;width: 43%">E:' + frame_end + '</div>';
        $('.lp-date').html(html_date);
        var html_line = '<div class="time-l st">0</div>';
        html_line += '<div class="time-m"><span></span></div>';
        html_line += '<div class="time-l en">' + frame_count + '(s)</div>';
        $('.lp-timeline').html(html_line);
        var html_btn = '<div class="lpd-btn play"><a href="javascript:"><i class="iconfont icon-bofang"></i>启动</a></div>';
        html_btn += '<div class="lpd-btn stop"><a href="javascript:"><i class="iconfont icon-tingzhi-shixin"></i>停止</a></div>';
        html_btn += '<div class="lpd-btn reset"><a href="javascript:"><i class="iconfont icon-icon-yuanxk"></i>重置</a></div>';
        html_btn += '<div class="lpd-inp">倍速：<input type="type" value="' + frame_speed / INTERVAL + '"></div>';
        $('.lp-ctrl').html(html_btn);
        $('.play').click(function () {
            start();
        });
        $('.stop').click(function () {
            stop();
        });
        $('.reset').click(function () {
            reset(true);
            $('.st').html('0');
            $('.en').html(frame_count + '(s)');
            CarListPlugin.statistic(0, 0, 0);
            $('.time-m').find('span').css('left', 0);
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
        globalScene.globalTimer.addEventListener('timer', function (e) {
            var per = globalScene.globalTimer.currentCount / globalScene.globalTimer.total_count;
            $('.st').html(globalScene.globalTimer.currentCount);
            $('.en').html(globalScene.globalTimer.total_count - globalScene.globalTimer.currentCount + "(s)");
            $('.time-m').find('span').css('left', $('.time-m').width() * per);
        });
        globalScene.globalTimer.addEventListener('timerComplete', function () {
            reset(false);
        });
    };
    var start = function () {
        if (globalScene.globalTimer.currentCount === 0) {
            globalScene.carDynamicLayer.clearAll();
            CarListPlugin.clear();
            if (globalScene.Interval) {
                globalScene.carDynamicLayer.setUnSelected();
                $('.lpib-list').removeClass('active');
                $('.lp-select').html('');
                clearInterval(globalScene.Interval);
                globalScene.Interval = undefined;
                globalScene.focus = -1;
            }
        }
        if (globalScene.globalTimer.currentCount === globalScene.globalTimer.total_count) {
            reset();
        }
        globalScene.globalTimer.start();
        $('#file-sele').attr('disabled', true)
    };
    var stop = function () {
        if (globalScene.Interval) {
            clearInterval(globalScene.Interval);
            globalScene.Interval = undefined;
            globalScene.focus = -1;
            globalScene.carDynamicLayer.setUnSelected();
            $('.lpib-list').removeClass('active');
            $('.lp-select').html('');
        }
        globalScene.globalTimer.stop();
        $('#file-sele').attr('disabled', false);
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
        if (globalScene.Interval) {
            clearInterval(globalScene.Interval);
            globalScene.focus = -1;
        }
        globalScene.globalTimer.reset();
    };

    function clear() {
        $('.lp-date').html('');
        $('.lp-info').html('');
        $('.lp-ctrl').html('');
        $('.lp-timeline').html('');
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