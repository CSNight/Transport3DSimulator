define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    /**　　* CarModelPositionChangedEvent constructor 构造器　　*　　
     * * @param type 事件类型　　
     * * @param bubbles 是否毛票　　
     * * @param cancelable 是否可取消　　*/
    var LightModelPositionChangedEvent = function (type, bubbles, cancelable) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
    };
    /**　　* Event 时间事件声明　　*　　
     * @event changed　　*/
    BASE.extend(LightModelPositionChangedEvent, {
        changed: "changed"
    });
    /**　　* Event 方法　　*　　
     * * @method toString　　*/
    BASE.extend(LightModelPositionChangedEvent.prototype, {
        toString: function () {
            return "[LightModelPositionChangedEvent type =" + this.type + "bubbles =" + this.bubbles + "cancelable =" + this.cancelable + "]";
        }
    });
    var LightModel = function (info) {
        this.id = BASE.guid();
        this.g_id = BASE.guid();
        this.y_id = BASE.guid();
        this.r_id = BASE.guid();
        this.info = info;
        var listenerMap = {};
        listenerMap[LightModelPositionChangedEvent.changed] = [];
        BASE.extend(this, {
            light_id: info.light_id,
            green: {
                interval: 0,
                pos: info.green_geo,
                entity: {
                    id: this.g_id,
                    group_id: info.light_id,
                    direct: info.direct,
                    name: "",
                    description: "",
                    position: Cesium.Cartesian3.fromDegrees(info.green_geo.x, info.green_geo.y, info.green_geo.z),
                    billboard: new Cesium.BillboardGraphics({
                        image: "images/lensflare_alpha_g.png",
                        width: 50,
                        height: 50,
                        color: new Cesium.Color(1, 1, 1, 1),
                        scaleByDistance: new Cesium.NearFarScalar(10, 4, 1500, 0.0)
                    })
                }
            },
            red: {
                interval: 0,
                pos: info.red_geo,
                entity: {
                    id: this.r_id,
                    group_id: info.light_id,
                    direct: info.direct,
                    name: "",
                    description: "",
                    position: Cesium.Cartesian3.fromDegrees(info.red_geo.x, info.red_geo.y, info.red_geo.z),
                    billboard: new Cesium.BillboardGraphics({
                        image: "images/lensflare_alpha_r.png",
                        width: 50,
                        height: 50,
                        color: new Cesium.Color(1, 1, 1, 1),
                        scaleByDistance: new Cesium.NearFarScalar(10, 4, 1500, 0.0)
                    })
                }
            },
            yellow: {
                interval: 0,
                pos: info.yellow_geo,
                entity: {
                    id: this.y_id,
                    group_id: info.light_id,
                    direct: info.direct,
                    name: "",
                    description: "",
                    position: Cesium.Cartesian3.fromDegrees(info.yellow_geo.x, info.yellow_geo.y, info.yellow_geo.z),
                    billboard: new Cesium.BillboardGraphics({
                        image: "images/lensflare_alpha_y.png",
                        width: 50,
                        height: 50,
                        color: new Cesium.Color(1, 1, 1, 1),
                        scaleByDistance: new Cesium.NearFarScalar(10, 4, 1500, 0.0)
                    })
                }
            },
            stopwatch: new Stopwatch(),
            current_phase: info.current_phase,
            current_id: "",
            handler: listenerMap
        });
        var lightThis = this;

        this.stopwatch.start();
    };

    function get_next(current_phase) {
        switch (current_phase) {
            case"green":
                return "yellow";
            case"yellow":
                return "red";
            case"red":
                return "green";
        }
    }

    function get_phase(current_phase) {
        var next_phase = "";
        switch (current_phase) {
            case"1":
                next_phase = "2";
                break;
            case"2":
                next_phase = "3";
                break;
            case"3":
                next_phase = "4";
                break;
            case"4":
                next_phase = "5";
                break;
        }
        var phase_color = {
            "1": "green",
            "2": "yellow",
            "3": "red",
            "4": "red",
            "5": "red"
        };
        return phase_color[next_phase];
    }

    BASE.extend(LightModel.prototype, {
        addEventListener: function (type, listener, useCapture) {
            if (type === LightModelPositionChangedEvent.changed) {
                if (!listener) {
                    alert("Listener is null");
                }
                this.handler[type].push(listener);
            }
        }, removeEventListener: function (type, listener) {
            if (type === LightModelPositionChangedEvent.changed) {
                if (!listener) {
                    this.handler[type] = [];
                } else {
                    var listeners = this.handler[type];
                    for (var index = 0; index < listeners.length; index++) {
                        if (listeners[index] === listener) {
                            listeners.splice(index, 1);
                            break;
                        }
                    }
                }
            }
        }, getTotalRunTime: function () {
            this.stopwatch.elapsedMilliseconds.toLocaleString('hh:mm:ss.fff');
        }, clearTime: function () {
            this.stopwatch.reset();
            this.stopwatch.start();
        }
    });
    return {
        LightModel: LightModel
    }
});