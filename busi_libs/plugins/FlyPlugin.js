define(function (require) {
    var init = function () {
        setHtmlFrame();
    };
    var setHtmlFrame = function () {
        var html = '<ul><span class="close"><i class="iconfont icon-guanbi2"></i></span>';
        for (var key in Config.destination) {
            html += '<li id="' + key + '"><a href="javascript:">' + Config.destination[key].name + '</a></li>';
            var html_item = '<div class="data-inf-box" id="inf_' + key + '" style="display:none;"></div>';
            $('.data-inf').append(html_item);
            items = Config.destination[key].item;
            for (var k in items) {
                $('#inf_' + key).append('<dl id="' + k + '"><dt><img src="' + items[k].res + '" alt=""></dt><dd>' + items[k].name + '</dd></dl>');
            }
        }
        html += '</ul>';
        $('.data-tab').append(html);
        setTabs('.data-tab ul li', '.data-inf');
        $('.data-inf-box').find('dl').click(function () {
            var id = $(this).attr('id');
            var pid = $(this).parent().attr('id');
            var pos = Config.destination[pid.replace('inf_', '')].item[id].pos;
            buildFly(pos);
        });
        $('.data-tab ul li').eq(0).click();
    };

    function buildFly(pos) {
        globalScene.Viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(pos.x, pos.y, pos.z + 100)
        })
    }

    function setTabs(selector, target) {
        $(selector).on('click', function () {
            var index = $(this).attr('id');
            $(this).addClass('active').siblings().removeClass('active');
            $(target).find('#inf_' + index).show().siblings().hide();
        });
    }

    return {
        init: init
    }
});