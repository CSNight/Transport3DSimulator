var Config = {
    "bingMap": 'https://dev.virtualearth.net',
    "BING_MAP_KEY": 'ArLWvxLVAh1vxsmDZuOxr94On14sA52a_IPUewEz8H7mm3qDQnjWe-OzJtu1PZpZ',
    "marbleMap": 'http://localhost:8090/iserver/services/map-BlackMarble/rest/maps/BlackMarble',
    "vectorMap": "http://localhost:8090/iserver/services/map-ChinaAll/rest/maps/哈尔滨",
    "scenesUrl": {
        "Base": "http://localhost:8090/iserver/services/3D-DM/rest/realspace",
        "Component": "http://localhost:8090/iserver/services/3D-Component/rest/realspace",
        "JZ": "http://localhost:8090/iserver/services/3D-JZ/rest/realspace"
    },
    "destination": {
        "MyScene": {
            name: "我的场景",
            item: {
                "sfy": {
                    name: "索菲亚大教堂",
                    res: './images/sfy.png',
                    pos: {x: 126.620994, y: 45.768271, z: 100}//{x: 0, y: 0, z: 0}
                }
            }
        }
    },
    "DataService": "http://localhost:8020/",
    "ESService": "http://localhost:9200",
    "CarModelUrls": [
        './resource/qiche1.s3m', './resource/qiche2.s3m', './resource/qiche3.s3m', './resource/qiche4.s3m', './resource/qiche5.s3m', './resource/qiche6.s3m',
        './resource/qiche7.s3m', './resource/qiche8.s3m', './resource/qiche9.s3m', './resource/qiche10.s3m', './resource/qiche11.s3m', './resource/qiche12.s3m',
        './resource/qiche13.s3m', './resource/qiche14.s3m', './resource/qiche15.s3m', './resource/qiche16.s3m'
    ],
    "ModelsScp": {
        "ComponentGJCZ": "公交车站",
        "ComponentLD": "路灯",
        "ComponentJTXHD": "交通信号灯",
        "ComponentGGP": "广告牌",
        "ComponentJTGT": "交通岗亭",
        "ComponentCZCTKD": "出租车停靠站",
        "ComponentXCL": "宣传栏",
        "ComponentJTZSP": "交通指示牌",
        "ComponentLJX": "垃圾箱"
    },
    <!-- 设置交通路况展现形式，False表示以专题图类型展示，True表示以热度图方式展示 -->
    "IsHeatMap": "True",
    <!-- 设置红绿灯变化时间间隔，单位为秒 -->
    "LightChangeTime": "20",
    <!-- 设置动态图层刷新时间间隔，单位为毫秒 -->
    "DynamicLayerUpdateInterval": "500"
};
require.config({
    baseUrl: '',
    waitSeconds: 0,
    paths: {
        'Cesium': '3d_libs/Cesium/Cesium',
        'Zlib': '3d_libs/Cesium/Workers/zlib.min',
        'BaseFunc': 'busi_libs/utils/BaseFunc',
        'Timer': "busi_libs/utils/Timer",
        'ControlCenter': "busi_libs/viewer/ControlCenter",
        'iclient-leaflet': "js_libs/supermap-libs/iclient9-leaflet"
    },
    shim: {
        Cesium: {
            exports: 'Cesium'
        },
        Zlib: {
            exports: 'Zlib'
        }
    }
});