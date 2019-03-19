define(function () {
    var init = function () {
        measureArea();
        measureDis();
        measureHeight();
        setHtml();
    };
    var setHtml = function () {
        $('.rtop-t05').parent().click(function () {
            if ($(this).hasClass('active')) {
                $('.measure-panel').show();
            } else {
                $('.measure-panel').hide();
            }
        });
        $('#ms').click(function () {
            globalScene.deactiveAll();
            globalScene.clearAll();
            activeDis();
        });
        $('#ma').click(function () {
            globalScene.deactiveAll();
            globalScene.clearAll();
            activeArea();
        });
        $('#mh').click(function () {
            globalScene.deactiveAll();
            globalScene.clearAll();
            activeHeight();
        });
        $('#cl').click(function () {
            globalScene.deactiveAll();
            globalScene.clearAll();
        });
    };
    var measureDis = function () {
        //初始化测量距离
        globalScene.handlerDis = new Cesium.MeasureHandler(globalScene.Viewer, Cesium.MeasureMode.Distance, 1);
        //注册测距功能事件
        globalScene.handlerDis.measureEvt.addEventListener(function (result) {
            var dis = Number(result.distance);
            var distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
            globalScene.handlerDis.disLabel.text = '距离:' + distance;

        });
        globalScene.handlerDis.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                globalScene.Viewer.enableCursorStyle = false;
                globalScene.Viewer._element.style.cursor = '';
                $('body').removeClass('measureCur').addClass('measureCur');
            } else {
                globalScene.Viewer.enableCursorStyle = true;
                $('body').removeClass('measureCur');
            }
        });
    };
    var measureArea = function () {
        //初始化测量面积
        globalScene.handlerArea = new Cesium.MeasureHandler(globalScene.Viewer, Cesium.MeasureMode.Area, 1);
        globalScene.handlerArea.measureEvt.addEventListener(function (result) {
            var mj = Number(result.area);
            var area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡';
            globalScene.handlerArea.areaLabel.text = '面积:' + area;
        });
        globalScene.handlerArea.activeEvt.addEventListener(function (isActive) {
            if (isActive === true) {
                globalScene.Viewer.enableCursorStyle = false;
                globalScene.Viewer._element.style.cursor = '';
                $('body').removeClass('measureCur').addClass('measureCur');
            } else {
                globalScene.Viewer.enableCursorStyle = true;
                $('body').removeClass('measureCur');
            }
        });
    };
    var measureHeight = function () {
        //初始化测量高度
        globalScene.handlerHeight = new Cesium.MeasureHandler(globalScene.Viewer, Cesium.MeasureMode.DVH);
        globalScene.handlerHeight.measureEvt.addEventListener(function (result) {
            var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
            var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
            var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
            globalScene.handlerHeight.disLabel.text = '空间距离:' + distance;
            globalScene.handlerHeight.vLabel.text = '垂直高度:' + vHeight;
            globalScene.handlerHeight.hLabel.text = '水平距离:' + hDistance;
        });
        globalScene.handlerHeight.activeEvt.addEventListener(function (isActive) {
            if (isActive === true) {
                globalScene.Viewer.enableCursorStyle = false;
                globalScene.Viewer._element.style.cursor = '';
                $('body').removeClass('measureCur').addClass('measureCur');
            } else {
                globalScene.Viewer.enableCursorStyle = true;
                $('body').removeClass('measureCur');
            }
        });
    };
    var activeDis = function () {
        globalScene.handlerDis && globalScene.handlerDis.activate();
    };

    var activeArea = function () {
        globalScene.handlerArea && globalScene.handlerArea.activate();
    };
    var activeHeight = function () {
        globalScene.handlerHeight && globalScene.handlerHeight.activate();
    };

    return {
        init: init,
        activeDis: activeDis,
        activeArea: activeArea,
        activeHeight: activeHeight
    }
});