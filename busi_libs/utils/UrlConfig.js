var Config = {
    "bingMap": 'https://dev.virtualearth.net',
    "BING_MAP_KEY": 'ArLWvxLVAh1vxsmDZuOxr94On14sA52a_IPUewEz8H7mm3qDQnjWe-OzJtu1PZpZ',
    "marbleMap": 'http://140.1.25.29:8090/iserver/services/map-BlackMarble/rest/maps/BlackMarble',
    "vectorMap": "http://140.1.25.29:8090/iserver/services/map-ChinaAll/rest/maps/哈尔滨",
    "lightsData": "http://140.1.25.29:8090/iserver/services/data-LightsVector/rest/data",
    "scenesUrl": {
        "Base": "http://140.1.25.29:8090/iserver/services/3D-DM/rest/realspace",
        "Component": "http://140.1.25.29:8090/iserver/services/3D-Component/rest/realspace",
        "JZ": "http://140.1.25.29:8090/iserver/services/3D-JZ/rest/realspace"
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
    "DataService": "http://127.0.0.1:8070/",
    "SimServer": "http://127.0.0.1:8020/",
    "ESService": "http://127.0.0.1:9200",
    "CarModelUrls": [
        './resource/BUS_1.s3m', './resource/BUS_2.s3m', './resource/BUS_3.s3m', './resource/BUS_4.s3m', './resource/CAR_1.s3m', './resource/CAR_2.s3m',
        './resource/CAR_3.s3m', './resource/CAR_4.s3m', './resource/CAR_5.s3m', './resource/CAR_6.s3m', './resource/MBUS_1.s3m', './resource/MBUS_2.s3m',
        './resource/TCAR_1.s3m', './resource/TRACK_1.s3m', './resource/TRACK_2.s3m'
    ],
    "ModelsScp": {
        "ComponentLMP": "路名牌",
        "ComponentLD": "路灯",
        "ComponentJTXHD": "交通信号灯",
        "ComponentTQ": "天桥",
        "ComponentSXT": "摄像头",
        "ComponentXDS": "行道树",
        "ComponentZSP": "交通指示牌"
    },
    <!-- 设置交通路况展现形式，False表示以专题图类型展示，True表示以热度图方式展示 -->
    "IsHeatMap": "True",
    <!-- 设置动态图层刷新时间间隔，单位为毫秒 -->
    "DynamicLayerUpdateInterval": "500"
};
