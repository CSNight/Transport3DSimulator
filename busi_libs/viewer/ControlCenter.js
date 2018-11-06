define(function (require) {
    var MainScene = require('busi_libs/viewer/MainScene');
    var SceneProcess = require('busi_libs/events/SceneProcess');


    MainScene.init('cesiumContainer', function (e) {
        MainScene.switchBase(true, "");
        MainScene.sceneEventRegister("l_click", SceneProcess.LeftClick);
        init_plugin_stat();
    });

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