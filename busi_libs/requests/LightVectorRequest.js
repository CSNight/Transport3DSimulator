define(function (require) {
    var LightModelBase = require('busi_libs/models/LightModelBase');
    var BASE = require('busi_libs/utils/BaseFunc');
    function query(datestr) {
        var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
                name: "LightsLine_" + datestr + "@LightsVector",
                attributeFilter: "SMID>0"
            },
            datasetNames: ["LightsVector:LightsLine_" + datestr],
            foIndex:0,
            toIndex:10000
        });
        L.supermap
            .featureService(Config.lightsData)
            .getFeaturesBySQL(sqlParam, function (serviceResult) {
                if (serviceResult.result === undefined) {
                    globalScene.Lights_on = false;
                    $('.lpc-lights')[0].checked = false;
                    alert("未查询到对应的信号灯数据集");
                    return;
                }

                var features = serviceResult.result.features.features;
                features.forEach(function (feature) {
                    if (feature.properties.ISOPEN === 'false') {
                        return;
                    }
                    var coordinates = feature.geometry.coordinates;
                    var coors = [];
                    coordinates.forEach(function (coor) {
                        coors.push({
                            x: coor[0],
                            y: coor[1],
                            z: coor[2]
                        });
                    });
                    coors.sort(function (a, b) {
                        return a.z > b.z ? 1 : -1;
                    });
                    var cycle = {};
                    for (var i = 1; i < 13; i++) {
                        cycle["P" + i] = parseInt(feature.properties["P" + i]);
                    }
                    var info = {
                        cross_id: feature.properties.CROSS_ID,
                        light_id: feature.properties.LIGHT_ID,
                        is_open: feature.properties.ISOPEN,
                        ct: feature.properties.CT,
                        model_id: feature.properties.MODEL_ID,
                        model_type: feature.properties.MODEL_TYPE,
                        direct: feature.properties.DIRECT,
                        green_geo: coors[0],
                        yellow_geo: coors[1],
                        red_geo: coors[2],
                        cycle: cycle,
                        current_phase: "P" + feature.properties.INITPHASE
                    };
                    var Light = new LightModelBase.LightModel(info);
                    globalScene.Lights_List.add(Light);
                });
            });
    }

    return {
        query: query
    }
});