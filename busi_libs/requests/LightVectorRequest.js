define(function (require) {
    var LightModelBase = require('busi_libs/models/LightModelBase');
    var BASE = require('busi_libs/utils/BaseFunc');
    function query(datestr) {
        var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
                name: "LightsLine_"+datestr+"@LightsVector",
                attributeFilter: "SMID>0"
            },
            datasetNames: ["LightsVector:LightsLine_"+datestr]
        });
        L.supermap
            .featureService('http://localhost:8090/iserver/services/data-LightsVector/rest/data')
            .getFeaturesBySQL(sqlParam, function (serviceResult) {
                if(serviceResult.result===undefined){
                    globalScene.Lights_on=false;
                    $('.lpc-lights')[0].checked=false;
                    return;
                }
                globalScene.Lights_List=new BASE.List();
                var features = serviceResult.result.features.features;
                features.forEach(function (feature) {
                    var coordinates = feature.geometry.coordinates;
                    var coors = [];
                    coordinates.forEach(function (coor) {
                        coors.push({
                            x: coor[0],
                            y: coor[1],
                            z: coor[2]-117
                        });
                    });
                    coors.sort(function (a, b) {
                        return a.z > b.z ? 1 : -1;
                    });
                    var info = {
                        light_id: feature.properties.LIGHTID,
                        g_interval: parseInt(feature.properties.G_INTERVAL),
                        green_geo: coors[0],
                        y_interval: parseInt(feature.properties.Y_INTERVAL),
                        yellow_geo: coors[1],
                        r_interval: parseInt(feature.properties.R_INTERVAL),
                        red_geo: coors[2],
                        direct: feature.properties.DIRECT,
                        current_phase: feature.properties.INIT_PHASE
                    };
                    var Light = new LightModelBase.LightModel(info);
                    globalScene.Lights_List.add(Light);
                })
            });
    }

    return {
        query: query
    }
});