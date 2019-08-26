define(function () {
    var currentRoute = null;
    var init = function () {
        setHtml();
    };
    var setHtml = function () {
        var html = '<label style="margin-bottom: 10px">飞行管理：</label><br/><br/>\n' +
            '        <span type="button" id="play" class="button black" title="开始"></span>' +
            '        <span type="button" id="pause" class="button black" title="暂停"></span>' +
            '        <span type="button" id="stop" class="button black" title="停止"></span>' +
            '        <div style="width: 150px;">' +
            '            <select id="stopList" class="form-control" style="width: 100%;">' +
            '            </select>' +
            '        </div>';
        $('.fly-panel').append(html);
        var menu = document.getElementById('stopList');
        var fpfUrl = {
            '新阳廊道': './resource/ld_2.fpf',
            '康安路': './resource/ld_1.fpf',
            '西大直街': "./resource/ld_3.fpf"
        };
        for (var key in fpfUrl) {
            var option = document.createElement('option');
            option.innerHTML = key;
            option.value = fpfUrl[key];
            menu.appendChild(option);
        }
        $('#play').click(function () {
            globalScene.flyManager && globalScene.flyManager.play();
        });
        $('#pause').click(function () {
            globalScene.flyManager && globalScene.flyManager.pause();
        });
        $('#stop').click(function () {
            globalScene.flyManager && globalScene.flyManager.stop();
        });

        $('#show-line').change(function () {
            currentRoute.isLineVisible = $(this).prop('checked');
        });

        $('#show-stop').change(function () {
            currentRoute.isStopVisible = $(this).prop('checked');
        });
        $('#stopList').change(function () { //注册站点切换事件
            globalScene.flyManager && globalScene.flyManager.stop();
            fly_init($('#stopList').val());
        });
    };
    var fly_init = function (url) {
        globalScene.flyManager = null;
        var routes = new Cesium.RouteCollection();
        //添加fpf飞行文件，fpf由SuperMap iDesktop生成
        routes.fromFile(url);
        //初始化飞行管理
        globalScene.flyManager = new Cesium.FlyManager({
            scene: globalScene.scene,
            routes: routes
        });
        //注册站点到达事件
        globalScene.flyManager.stopArrived.addEventListener(function (routeStop) {
            routeStop.waitTime = 0.5; // 在每个站点处停留1s
        });
        globalScene.flyManager.readyPromise.then(function () { // 飞行路线就绪
            currentRoute = globalScene.flyManager.currentRoute;
            currentRoute.isLineVisible = true;
            currentRoute.isStopVisible = true;
        });
    };
    return {
        init: init
    }
});