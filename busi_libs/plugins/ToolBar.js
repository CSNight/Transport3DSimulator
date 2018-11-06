define(function (require) {
    var init = function () {
        var ModelList = require('busi_libs/plugins/ModelList');
        var FlyPlugin = require('busi_libs/plugins/FlyPlugin');
        FlyPlugin.init();
        ModelList.init();
        $('.rtop-tool ul li').on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active').siblings().removeClass('active');
            }
            $('.rtop-tool ul li.layer').hasClass('active') ? $('.layer-panel').show() : $('.layer-panel').hide();
            $('.rtop-tool ul li.data').hasClass('active') ? $('.data-panel').show() : $('.data-panel').hide();
        });
        $('.rtop-t06').click(function () {
            var MainScene = require('busi_libs/viewer/MainScene');
            MainScene.flyToHome();
        });
        $('.manage').click(function () {
            if (globalScene.globalTimer) {
                globalScene.globalTimer.stop();
            }
            window.open(window.location.origin + "/Transport3DSimulator/manage.html");
        });
        $('.rtop-t07').click(function () {
            if ($('#toolbar').hasClass('op')) {
                $('#toolbar').hide();
                $('#toolbar').removeClass('op');
            } else {
                $('#toolbar').show();
                $('#toolbar').addClass('op');
            }

        });
    };
    return {
        init: init
    }
});