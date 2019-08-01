var Config = {
    "bingMap": 'https://dev.virtualearth.net',
    "BING_MAP_KEY": 'ArLWvxLVAh1vxsmDZuOxr94On14sA52a_IPUewEz8H7mm3qDQnjWe-OzJtu1PZpZ',
    "marbleMap": 'http://140.1.25.28:8090/iserver/services/map-BlackMarble/rest/maps/BlackMarble',
    "vectorMap": "http://10.1.30.27:8090/iserver/services/map-ChinaAll/rest/maps/哈尔滨",
    "lightsData": "http://10.1.30.27:8090/iserver/services/data-LightsVector/rest/data",
    "theme": {
        "dmcl_w": "http://10.1.30.27:8090/iserver/services/map-hgfz/rest/maps/dmcll_map1",
        "dmcl_y": "http://10.1.30.27:8090/iserver/services/map-hgfz/rest/maps/dmcll_map"
    },
    "scenesUrl": {
        "Base": "http://10.0.9.12:8090/iserver/services/3D-DM/rest/realspace",
        "Component": "http://10.0.9.12:8090/iserver/services/3D-Component/rest/realspace",
        "JZ": "http://10.0.9.12:8090/iserver/services/3D-JZ/rest/realspace"
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
    "DataService": "http://10.1.30.28:8070/",
    "SimServer": "http://10.1.30.28:8020/",
    "ESService": "http://10.1.30.28:9200",
    "CarModelUrls": [
        './resource/BUS_1.s3m', './resource/BUS_2.s3m', './resource/BUS_3.s3m', './resource/BUS_4.s3m', './resource/CAR_1.s3m', './resource/CAR_2.s3m',
        './resource/CAR_3.s3m', './resource/CAR_4.s3m', './resource/CAR_5.s3m', './resource/CAR_6.s3m', './resource/MBUS_1.s3m', './resource/MBUS_2.s3m',
        './resource/TCAR_1.s3m', './resource/TRACK_1.s3m', './resource/TRACK_2.s3m'
    ],
    "ModelsScp": {
        "ComponentLB": "路标",
        "ComponentLMP": "路名牌",
        "ComponentLD": "路灯",
        "ComponentXHD": "交通信号灯",
        "ComponentTQ": "天桥",
        "ComponentSXT": "摄像头",
        "ComponentXDS": "行道树",
        "ComponentZSP": "交通指示牌",
        "ComponentGJZ": "公交站"
    },
    "XZQH": {
        "DL": "道里区",
        "NG": "南岗区",
        "DW": "道外区",
        "PF": "平房区",
        "SB": "松北区",
        "XF": "香坊区"
    }
};
