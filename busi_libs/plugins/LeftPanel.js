define(function (require) {
    var init = function (t) {
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
        html += '<div class="lp-search"><input type="text" placeholder="请输入关键字"/><button><i class="iconfont icon-sousuo1"></i></button></div>';
        html += '<div class="lp-statistic"></div><div class="lp-select"></div><div class="lp-info"></div></div>';
        html += '<div class="lp-foot"></div>';
        $('.left-panel').append(html);
        var lp_check="<div><input class='lpc-lights' type='checkbox' checked=checked /><div class='lpc-title'>启用信号灯</div>";
        lp_check+="<input class='lpc-pop' type='checkbox'/><div class='lpc-title'>启用气泡标签</div></div>";
        $('.lp-check').html(lp_check);

        $('.lp-main').height($('.left-panel').height() - 88);
        if (globalScene.globalTimer !== undefined) {
            globalScene.globalTimer.stop();
            globalScene.carDynamicLayer.clearAllState();
        }
        var SimFileIO = require('busi_libs/requests/SimFileIO');
        SimFileIO.SimCSVSearch();
        $('.lpc-lights').click(function () {
            globalScene.Lights_on = $(this)[0].checked;
        });
        $('.lpc-pop').click(function () {
            globalScene.Pop_on = $(this)[0].checked;
        });
    };
    var setStreamHtmlFrame = function () {
        $('.left-panel').html('');
        var html = '<div class="lp-head"><span class="name">实时数据</span>';
        html += '<span class="close"></span></div>';
        html += '<div class="lp-main"><div class="lp-ctrl" style="margin-top:20px"></div>';
        html += '<div class="lp-file"><div class="file-text">选择线路</div>';
        html += '<div class="file-sele"><select name="" id="line_sel"><option value="all">全部</option></select></div> </div>';
        html += '<div class="lp-search"><input type="text" placeholder="请输入关键字"/><button><i class="iconfont icon-sousuo1"></i></button></div>';
        html += '<div class="lp-statistic"></div><div class="lp-select"></div><div class="lp-info"></div></div>';
        html += '<div class="lp-foot"></div>';
        $('.left-panel').append(html);
        $('.lp-main').height($('.left-panel').height() - 88);
        if (globalScene.globalTimer !== undefined) {
            globalScene.globalTimer.stop();
            globalScene.carDynamicLayer.clearAllState();
        }
        var StreamDataIO = require('busi_libs/requests/StreamDataIO');
        StreamDataIO.init();
    };
    return {
        init: init
    }
});