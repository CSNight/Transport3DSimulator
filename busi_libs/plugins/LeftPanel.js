define(function (require) {
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var init = function (t) {
        if (globalScene.globalTimer !== undefined) {
            globalScene.globalTimer.stop();
            globalScene.carDynamicLayer.clearAllState();
        }
        CarListPlugin.clear();
        if (globalScene.SIM_CAR_LIST) {
            for (var key in globalScene.SIM_CAR_LIST) {
                globalScene.Viewer.entities.removeById(globalScene.SIM_CAR_LIST[key].car_id);
            }
        }
        if (globalScene.STREAM_CAR_LIST) {
            for (var key in globalScene.STREAM_CAR_LIST) {
                if (globalScene.STREAM_CAR_LIST[key].info.hasOwnProperty("stop_json")) {
                    globalScene.Viewer.entities.removeById(key);
                }
            }
        }
        switch (t) {
            case 'sim':
                setSimHtmlFrame();
                break;
            case'stream':
                setStreamHtmlFrame();
        }
    };
    var setSimHtmlFrame = function () {
        $('.left-panel').html('');
        var html = '<div class="lp-head"><span class="name">模拟时间</span>';
        html += '<span class="close"></span></div>';
        html += '<div class="lp-main"><div class="lp-file"><div class="file-text">选择模拟文件</div>';
        html += '<div class="file-sele"><select name="" id="file-sele"></select></div> </div>';
        html += '<div class="lp-des"></div>';
        html += '<div class="lp-date"></div><div class="lp-timeline"></div><div class="lp-ctrl"></div><div class="lp-check"></div>';
        html += '<div class="lp-statistic"></div><div class="lp-select"></div><div class="lp-info"></div></div>';
        html += '<div class="lp-foot"></div>';
        $('.left-panel').append(html);
        var lp_check = "<div><input class='lpc-lights' type='checkbox' /><div class='lpc-title'>启用信号灯</div>";
        lp_check += "<input class='lpc-pop' type='checkbox'/><div class='lpc-title'>启用气泡标签</div></div>";
        $('.lp-check').html(lp_check);

        $('.lp-main').height($('.left-panel').height() - 88);
        var SimFileIO = require('busi_libs/requests/SimFileIO');
        SimFileIO.SimCSVSearch();
        //启用信号灯check
        $('.lpc-lights').click(function () {
            globalScene.Lights_on = $(this)[0].checked;
            if (!globalScene.Lights_List) {
                return;
            }
            //实时信号灯控制显隐
            if (globalScene.Lights_List.size() !== 0 && !globalScene.Lights_on) {
                for (let i = 0; i < globalScene.Lights_List.size(); i++) {
                    let cur = globalScene.Lights_List.get(i).current_id;
                    if (cur !== '') {
                        globalScene.Viewer.entities.getById(cur).show = false;
                    }
                }
            } else if (globalScene.Lights_List.size() !== 0 && globalScene.Lights_on) {
                for (let i = 0; i < globalScene.Lights_List.size(); i++) {
                    let cur = globalScene.Lights_List.get(i).current_id;
                    if (cur !== '') {
                        globalScene.Viewer.entities.getById(cur).show = true;
                    }
                }
            }
        });
        //启用气泡check
        $('.lpc-pop').click(function () {
            globalScene.Pop_on = $(this)[0].checked;
        });
    };
    var setStreamHtmlFrame = function () {
        if (globalScene.Lights_on && globalScene.Lights_List) {

            $('.lpc-lights').click();
            for (var i = 0; i < globalScene.Lights_List.size(); i++) {
                globalScene.Lights_List.get(i).stop();
            }
        }
        $('.left-panel').html('');
        let stream_html = '<div class="lp-head" id="head2"><span class="name">实时数据</span><span class="close"></span></div>';
        stream_html += '<div class="lp-main">';
        stream_html += '<div class="lp-ctr top"></div>';
        stream_html += '<div class="lp-file bot"><div class="file-text">选择线路</div><div class="file-sele"><select name="" id="line_sel"><option value="">全部</option></select></div></div>';
        stream_html += '<div class="history-boxs"></div>';
        stream_html += '<div class="lp-statistic"></div><div class="lp-select"></div><div class="lp-info"></div></div></div>';
        stream_html += '<div class="lp-foot"></div>';

        $('.left-panel').append(stream_html);
        $('.lp-main').height($('.left-panel').height() - 88);

        const StreamDataIO = require('busi_libs/requests/StreamDataIO');
        StreamDataIO.init();
    };
    return {
        init: init
    }
});