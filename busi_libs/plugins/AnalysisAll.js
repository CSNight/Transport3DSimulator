define(function () {
    var viewshed3D;
    var profile;
    var profile_handler;
    var init = function () {
        viewshed3DInit();
        viewerPouInit();
        setHtml();
    };
    var setHtml = function () {
        $('.rtop-t04').parent().click(function () {
            if ($(this).hasClass('active')) {
                $('.analysis-panel').show();
            } else {
                $('.analysis-panel').hide();
            }
        });
        $('#sh').click(function () {
            globalScene.deactiveAll();
            globalScene.clearAll();
            activeViewshed();
        });
        $('#po').click(function () {
            globalScene.deactiveAll();
            globalScene.clearAll();
            activeProfile();
        });
        $('#cle').click(function () {
            clear();
        });
    };
    var viewshed3DInit = function () {
        var viewModel = {
            direction: 1.0,
            pitch: 1.0,
            distance: 1.0,
            verticalFov: 1.0,
            horizontalFov: 1.0,
            visibleAreaColor: '#ffffffff',
            invisibleAreaColor: '#ffffffff'
        };
        globalScene.scene.viewFlag = true;
        var viewPosition;
        globalScene.viewshedHandler = new Cesium.PointHandler(globalScene.Viewer);
        //创建可视域分析对象
        viewshed3D = new Cesium.ViewShed3D(globalScene.scene);
        var handler = new Cesium.ScreenSpaceEventHandler(globalScene.scene.canvas);
        //鼠标移动时间回调
        handler.setInputAction(function (e) {
            //若此标记为false，则激活对可视域分析对象的操作
            if (!globalScene.scene.viewFlag) {
                //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
                var position = e.endPosition;
                var last = globalScene.scene.pickPosition(position);
                //计算该点与视口位置点坐标的距离
                var distance = Cesium.Cartesian3.distance(viewPosition, last);
                if (distance > 0) {
                    //将鼠标当前点坐标转化成经纬度
                    var cartographic = Cesium.Cartographic.fromCartesian(last);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    var height = cartographic.height;
                    //通过该点设置可视域分析对象的距离及方向
                    viewshed3D.setDistDirByPoint([longitude, latitude, height]);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(function (e) {
            //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
            globalScene.scene.viewFlag = true;
            viewModel.direction = viewshed3D.direction;
            viewModel.pitch = viewshed3D.pitch;
            viewModel.distance = viewshed3D.distance;
            viewModel.horizontalFov = viewshed3D.horizontalFov;
            viewModel.verticalFov = viewshed3D.verticalFov;
            console.log(viewshed3D);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        globalScene.viewshedHandler.drawCompletedEvent.addEventListener(function (point) {
            var position = point.position._value;
            viewPosition = position;

            //将获取的点的位置转化成经纬度
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;

            if (globalScene.scene.viewFlag) {
                //设置视口位置
                viewshed3D.viewPosition = [longitude, latitude, height];
                viewshed3D.build();
                //将标记置为false以激活鼠标移动回调里面的设置可视域操作
                globalScene.scene.viewFlag = false;
            }
        });
    };
    var activeViewshed = function () {
        if (globalScene.viewshedHandler.active) {
            return;
        }
        clear();
        //激活绘制点类
        globalScene.viewshedHandler.activate();
    };
    var viewerPouInit = function () {
        profile = new Cesium.Profile(globalScene.scene);
        globalScene.profileLine = new Cesium.DrawHandler(globalScene.Viewer, Cesium.DrawMode.Line);
        globalScene.profileLine.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                globalScene.Viewer.enableCursorStyle = false;
                globalScene.Viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            } else {
                globalScene.Viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        profile_handler = new Cesium.ScreenSpaceEventHandler(globalScene.scene.canvas);

        globalScene.profileLine.drawEvt.addEventListener(function (result) {
            var line = result.object;
            var startPoint = line._positions[0];
            var endPoint = line._positions[line._positions.length - 1];

            var scartographic = Cesium.Cartographic.fromCartesian(startPoint);
            var slongitude = Cesium.Math.toDegrees(scartographic.longitude);
            var slatitude = Cesium.Math.toDegrees(scartographic.latitude);
            var sheight = scartographic.height;

            var ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
            var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            var eheight = ecartographic.height;
            //设置坡面分析的开始和结束位置
            profile.startPoint = [slongitude, slatitude, sheight];
            profile.endPoint = [elongitude, elatitude, eheight];
            profile.extendHeight = 40;
            //分析完毕的回调函数
            profile.getBuffer(function (buffer) {
                var canvas = document.getElementById("pro");
                canvas.height = profile._textureHeight;
                canvas.width = profile._textureWidth;
                var ctx = canvas.getContext("2d");
                var imgData = ctx.createImageData(profile._textureWidth, profile._textureHeight);
                imgData.data.set(buffer);
                //在canvas上绘制图片
                ctx.putImageData(imgData, 0, 0);
                $("#pro").show();
                $("#pro").width(600);
                $("#pro").height(450);
            });
            profile.build();
        });
    };
    var activeProfile = function () {
        clear();
        if (globalScene.profileLine.active) {
            return;
        } else {
            globalScene.profileLine.activate();
            //由于剖面分析只能绘制直线，此处绘制时单击两次就触发结束事件
            profile_handler.setInputAction(function (e) {
                if (globalScene.profileLine.polyline._actualPositions.length == 2) {
                    var result = {};
                    result.object = globalScene.profileLine.polyline;
                    globalScene.profileLine.drawEvt.raiseEvent(result);
                    globalScene.profileLine.deactivate();
                    profile_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    };
    var clear = function () {
        globalScene.deactiveAll();
        globalScene.clearAll();
        globalScene.Viewer.entities.removeAll();
        viewshed3D.distance = 0.1;
        globalScene.scene.viewFlag = true;
        $('#pro').hide();
    };
    return {
        init: init,
        activeViewshed: activeViewshed,
        clear: clear,
        activeProfile: activeProfile
    }
});