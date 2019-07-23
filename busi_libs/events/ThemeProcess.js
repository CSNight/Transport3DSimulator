define(function () {
    var init = function () {
        if (globalScene.map !== null) {
            if (globalScene.heatLayer) {
                if (globalScene.map.hasLayer(globalScene.heatLayer)) {
                    globalScene.map.removeLayer(globalScene.heatLayer);
                    globalScene.heatLayer = undefined;
                }
            }
            globalScene.heatLayer = L.supermap.echartsLayer(option);
            globalScene.map.addLayer(globalScene.heatLayer)
        }
    };
    var option = {
        visualMap: {
            show: false,
            top: 'top',
            min: 0,
            max: 5,
            seriesIndex: 0,
            calculable: true,
            inRange: {
                color: ['blue', 'blue', 'green', 'yellow', 'red']
            }
        },
        series: [{
            type: 'heatmap',
            coordinateSystem: 'leaflet',
            data: [],
            pointSize: 5,
            blurSize: 6
        }]
    };
    let updateData = function (data) {
        if (globalScene.isMapOpen === true && globalScene.heatLayer && globalScene.map) {
            var items = [];
            var len = data.length;
            for (var k = 0; k < len; k++) {
                var _source = data[k]._source;
                items.push([_source['x'], _source['y'], 10])
            }
            globalScene.heatLayer.setOption({
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'leaflet',
                    data: items,
                    pointSize: 5,
                    blurSize: 6
                }]
            })
        }
    };

    return {init: init, updateData: updateData}
});