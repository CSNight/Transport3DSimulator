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
        //第一次运行
        if (globalScene.globalTimer.currentCount === 0) {
            //清空图层
            globalScene.carDynamicLayer.clearAllState();
            globalScene.carDynamicLayer.setUnSelected();
            //清空列表
            CarListPlugin.clear();
            $('.lpib-list').removeClass('active');
            $('.lp-select').html('');
            //初始化信号灯并启动
            globalScene.Viewer.entities.removeAll();
            for(var i=0;i<globalScene.Lights_List.size();i++){
                globalScene.Lights_List.get(i).init();
            }
            for(var i=0;i<globalScene.Lights_List.size();i++){
                globalScene.Lights_List.get(i).start();
            }
        }
        //运行到末尾重置
        else if (globalScene.globalTimer.currentCount === globalScene.globalTimer.total_count) {
            reset();
        }else{
            //中间暂停后启动信号灯
            for(var i=0;i<globalScene.Lights_List.size();i++){
                globalScene.Lights_List.get(i).start();
            }
        }
        globalScene.globalTimer.start();
        $('#file-sele').attr('disabled', true)
    };
    var stop = function () {
        globalScene.globalTimer.stop();
        $('#file-sele').attr('disabled', false);
        for(var i=0;i<globalScene.Lights_List.size();i++){
            globalScene.Lights_List.get(i).stop();
        }
    };
    var speed_up = function (factor) {
        for(var i=0;i<globalScene.Lights_List.size();i++){
            globalScene.Lights_List.get(i).stop();
        }
        globalScene.globalTimer.delay = globalScene.Interval / factor;
        for(var i=0;i<globalScene.Lights_List.size();i++){
            globalScene.Lights_List.get(i).start();
        }
        //globalScene.carDynamicLayer.updateInterval = INTERVAL / factor * 2;
    };
    var speed_down = function (factor) {
        for(var i=0;i<globalScene.Lights_List.size();i++){
            globalScene.Lights_List.get(i).stop();
        }
        globalScene.globalTimer.delay = globalScene.Interval * (1 / factor);
        //globalScene.carDynamicLayer.updateInterval = INTERVAL * (1 / factor) * 2;
        for(var i=0;i<globalScene.Lights_List.size();i++){
            globalScene.Lights_List.get(i).start();
        }
    };
    var reset = function () {
        var isCleanScene = arguments[0] ? arguments[0] : true;
        //停止时重置整个场景
        if (isCleanScene) {
            //初始化场景，重建动态图层
            globalScene.carDynamicLayer.clearAllState();
            CarListPlugin.clear();
            for (var i = 0; i < globalScene.Lights_List.size(); i++) {
                globalScene.Lights_List.get(i).stop();
            }
            globalScene.Viewer.entities.removeAll();
        }
        for (var i = 0; i < globalScene.Lights_List.size(); i++) {
            globalScene.Lights_List.get(i).init();
        }
        //全局计时器运行中则启动信号灯
        if (globalScene.globalTimer.running) {
            for (var i = 0; i < globalScene.Lights_List.size(); i++) {
                globalScene.Lights_List.get(i).start();
            }
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