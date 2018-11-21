define(function (require) {
    var Cesium = require("Cesium");
    var Zlib = require("Zlib");
    var init = function (container, callback) {
        var viewer = new Cesium.Viewer(container, {
            geocoder: true
        });

        var scene = viewer.scene;
        var widget = viewer.cesiumWidget;
        try {
            var promise = scene.open(Config.scenesUrl.Base);
            Cesium.loadJson(Config.scenesUrl.Base + '/scenes.json').then(function (scenes) {
                var sname = scenes[0].name;
                Cesium.loadJson(Config.scenesUrl.Base + '/scenes/' + sname + '.json').then(function (jsonData) {
                    var cameraPosition = jsonData.camera;
                    var tilt = Cesium.Math.toRadians(cameraPosition.tilt - 90);
                    Cesium.when(promise, function (layer) {
                        scene.camera.setView({
                            destination: new Cesium.Cartesian3.fromDegrees(cameraPosition.longitude, cameraPosition.latitude, cameraPosition.altitude),
                            orientation: {
                                heading: cameraPosition.heading,
                                pitch: tilt,
                                roll: 0
                            }
                        });
                        var carDynamiclayer = new Cesium.DynamicLayer3D(scene.context, Config.CarModelUrls);
                        scene.primitives.add(carDynamiclayer);
                        globalScene = {
                            Viewer: viewer,
                            carDynamicLayer: carDynamiclayer,
                            map: null,
                            isSceneReady: true,
                            LayerDic: {},
                            models: {},
                            baseMap: null,
                            Lights_on: true,
                            Pop_on:false
                        };
                        toolbar(viewer);
                        var ToolBar = require('busi_libs/plugins/ToolBar');
                        var BottomNav = require('busi_libs/plugins/BottomNav');
                        ToolBar.init();
                        BottomNav.init();
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, function (e) {
                        if (widget._showRenderLoopErrors) {
                            var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？';
                            widget.showErrorPanel(title, undefined, e);
                        }
                    });
                });
            });
        }
        catch (e) {
            if (widget._showRenderLoopErrors) {
                var title = '渲染时发生错误，已停止渲染。';
                widget.showErrorPanel(title, undefined, e);
            }
        }
    };
    function toolbar(viewer) {
        var viewModel = {
            brightness: 0,
            contrast: 0,
            hue: 0,
            saturation: 0,
            gamma: 0
        };
        // Convert the viewModel members into knockout observables.
        Cesium.knockout.track(viewModel);
        // Bind the viewModel to the DOM elements of the UI that call for it.
        var toolbar = document.getElementById('toolbar');
        Cesium.knockout.applyBindings(viewModel, toolbar);

        // ake the active imagery layer a subscriber of the viewModel.
        function subscribeLayerParameter(name) {
            Cesium.knockout.getObservable(viewModel, name).subscribe(
                function (newValue) {
                    if (viewer.imageryLayers.length > 1) {
                        for (var i = 0; i < viewer.imageryLayers.length; i++) {
                            var layer = viewer.imageryLayers.get(i);
                            layer[name] = newValue;
                        }
                    }
                }
            );
        }

        subscribeLayerParameter('brightness');
        subscribeLayerParameter('contrast');
        subscribeLayerParameter('hue');
        subscribeLayerParameter('saturation');
        subscribeLayerParameter('gamma');

        // Make the viewModel react to base layer changes.
        function updateViewModel() {
            if (viewer.imageryLayers.length > 1) {
                for (var i = 0; i < viewer.imageryLayers.length; i++) {
                    var layer = viewer.imageryLayers.get(i);
                    viewModel.brightness = layer.brightness;
                    viewModel.contrast = layer.contrast;
                    viewModel.hue = layer.hue;
                    viewModel.saturation = layer.saturation;
                    viewModel.gamma = layer.gamma;
                }
            }
        }
        updateViewModel();
        viewer.imageryLayers.layerAdded.addEventListener(updateViewModel);
        viewer.imageryLayers.layerRemoved.addEventListener(updateViewModel);
        viewer.imageryLayers.layerMoved.addEventListener(updateViewModel);
    }

    var addLayers = function (urls) {
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var imageryProvider = new Cesium.SuperMapImageryProvider({
                url: url
            });
            if (!globalScene.LayerDic.hasOwnProperty(url)) {
                globalScene.LayerDic[url] = globalScene.Viewer.imageryLayers.addImageryProvider(imageryProvider);
            }
        }
    };

    var removeLayers = function (urls) {
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if (globalScene.LayerDic.hasOwnProperty(url)) {
                globalScene.Viewer.imageryLayers.remove(globalScene.LayerDic[url]);
                delete globalScene.LayerDic[url];
            }
        }
    };

    var switchBaseMap = function (isShow, base_type) {
        if (isShow) {
            var imageryProvider = null;
            switch (base_type) {
                case 'bing':
                    imageryProvider = new Cesium.BingMapsImageryProvider({
                        url: Config.bingMap,
                        mapStyle: Cesium.BingMapsStyle.AERIAL,
                        key: Config.BING_MAP_KEY
                    });
                    break;
                case"marble":
                    imageryProvider = new Cesium.SuperMapImageryProvider({
                        url: Config.marbleMap
                    });
                    break;
                default:
                    imageryProvider = new Cesium.TiandituImageryProvider({
                        credit: new Cesium.Credit('天地图全球影像服务     数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局')
                    });
                    break;
            }
            globalScene.baseMap = globalScene.Viewer.imageryLayers.addImageryProvider(imageryProvider);
        } else {
            if (globalScene.baseMap !== null) {
                if (globalScene.Viewer.imageryLayers.contains(globalScene.baseMap)) {
                    globalScene.Viewer.imageryLayers.remove(globalScene.baseMap, true);
                }
            }
        }
    };
    /*
    * 叠加模型，传入模型图层信息集合，包括图层名称和地址信息；飞行至第一个图层范围
    * models:[{"url":"http://www.supermap.com","name":"supermap"}]
    */
    var addModels = function (models, isFly) {
        //场景添加S3M图层服务
        var ModelScene = globalScene.Viewer.scene;
        var cesiumWidget = globalScene.Viewer.cesiumWidget;
        try {
            for (var i = 0; i < models.length; i++) {
                var model = models[i];
                var layer = ModelScene.layers.find(model.name);
                if (!layer) {
                    //图层未叠加，叠加并飞行
                    var promise = ModelScene.addS3MTilesLayerByScp(model.url, {
                        name: model.name
                    });
                    Cesium.when(promise, function (layer) {
                        if (isFly) {
                            globalScene.Viewer.flyTo(layer);
                        }
                    }, function (e) {
                        if (cesiumWidget._showRenderLoopErrors) {
                            cesiumWidget.showErrorPanel('S3M图层叠加失败。', undefined, e);
                        }
                    });
                }
                else {
                    //第一个图层已叠加，直接飞行至范围
                    if (i === 0) {
                        if (isFly) {
                            globalScene.Viewer.flyTo(layer);
                        }
                    }
                }
                if (!globalScene.models.hasOwnProperty(model.name)) {
                    globalScene.models[model.name] = model.url;
                }
            }
        }
        catch (e) {
            if (cesiumWidget._showRenderLoopErrors) {
                cesiumWidget.showErrorPanel('渲染时发生错误，已停止渲染。', undefined, e);
            }
        }
    };
    /**
     * 移除模型
     */
    var removeModels = function (models) {
        //场景移除S3M图层服务
        var widget = globalScene.Viewer.cesiumWidget;
        try {
            for (var i = 0; i < models.length; i++) {
                var model = models[i];
                delete globalScene.models[model.name];
                globalScene.Viewer.scene.layers.remove(model.name);
            }
        }
        catch (e) {
            if (widget._showRenderLoopErrors) {
                widget.showErrorPanel('S3M图层移除失败', undefined, e);
            }
        }
    };
    /**
     * 清除模型
     */
    var clearModels = function () {
        for (var k in globalScene.models) {
            globalScene.Viewer.scene.layers.remove(k);
            delete globalScene.models[k];
        }
    };

    var flyToBounds = function (west, south, east, north) {
        var bounds = new Cesium.Rectangle.fromDegrees(west, south, east, north);
        //var bounds = new Cesium.Rectangle(west, south, east, north);
        globalScene.Viewer.scene.camera.flyTo({destination: bounds});
    };

    var flyToHome = function (seconds) {
        if (seconds) {
            globalScene.Viewer.scene.camera.flyHome(seconds);
        }
        else {
            globalScene.Viewer.scene.camera.flyHome();
        }
    };

    var sceneEventRegister = function (event_type, func) {
        var handler = new Cesium.ScreenSpaceEventHandler(screen.canvas);
        //click
        switch (event_type) {
            case "l_click":
                handler.setInputAction(func, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                break;
        }
    };
    return {
        init: init,
        addLayers: addLayers,
        removeLayers: removeLayers,
        addModels: addModels,
        removeModels: removeModels,
        clearModels: clearModels,
        switchBase: switchBaseMap,
        flyToHome: flyToHome,
        flyToBounds: flyToBounds,
        sceneEventRegister: sceneEventRegister
    }
});