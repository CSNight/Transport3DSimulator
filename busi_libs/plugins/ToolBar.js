define(function (require) {
    var init = function () {
        var ModelList = require('busi_libs/plugins/ModelList');
        var FlyPlugin = require('busi_libs/plugins/FlyPlugin');
        var FlyManager = require('busi_libs/plugins/FlyManager');
        FlyPlugin.init();
        ModelList.init();
        FlyManager.init();
        $('.rtop-tool ul li').on('click', function () {
            $('.measure-panel').hide();
            $('.analysis-panel').hide();
            $('.fly-panel').hide();
            $('#toolbar').hide();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active').siblings().removeClass('active');
            }
            $('.rtop-tool ul li.layer').hasClass('active') ? $('.layer-panel').show() : $('.layer-panel').hide();
            $('.rtop-tool ul li.data').hasClass('active') ? $('.data-panel').show() : $('.data-panel').hide();
            $('.rtop-tool ul li.confScene').hasClass('active') ? $('#toolbar').show() : $('#toolbar').hide();
            $('.rtop-tool ul li.fly').hasClass('active') ? $('.fly-panel').show() : $('.fly-panel').hide();
        });
        $('.rtop-t06').click(function () {
            var MainScene = require('busi_libs/viewer/MainScene');
            MainScene.flyToHome();
        });
        $('.rtop-t08').click(function () {
            $('#stopList').change();
        });

        $('#toolOnOff').click(function () {
            if (!$(this).hasClass('rtop-t08')) {
                $(this).removeClass('rtop-t09').addClass('rtop-t08');
                $('.rtop-tool').width(48);
                $('.rtop-tool ul').css('margin-left', -243);
            } else {
                $(this).removeClass('rtop-t08').addClass('rtop-t09');
                $('.rtop-tool').width(300);
                $('.rtop-tool ul').css('margin-left', 0);
            }
        });
        $('.manage').click(function () {
            if (globalScene.globalTimer) {
                globalScene.globalTimer.stop();
            }
            window.open(window.location.origin + "/Transport3DSimulator/manage.html");
        });

    };
    return {
        init: init
    }
});