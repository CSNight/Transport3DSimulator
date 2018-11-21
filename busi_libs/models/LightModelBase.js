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
            cross_id: info.cross_id,
            is_open: info.is_open,
            ct: info.ct,
            model_id: info.model_id,
            model_type: info.model_type,
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
            cycle:info.cycle,
            stopwatch: new Stopwatch(),
            init_phase:info.current_phase,
            current_phase: info.current_phase,
            current_id: "",
            timer:null,
            handler: listenerMap
        });
        var lightThis = this;
        var init_color=get_color(lightThis.current_phase);
        lightThis[init_color].interval=lightThis.cycle[lightThis.current_phase];
        var current_entity=lightThis[init_color].entity;
        if(lightThis[init_color].interval!==0) {
            globalScene.Viewer.entities.add(current_entity);
            lightThis.current_id = current_entity.id;
        }
        lightThis.timer=new Timer(lightThis[init_color].interval*1000,1);
        function recursion(e) {
            if (lightThis.current_id !== "") {
                globalScene.Viewer.entities.removeById(lightThis.current_id);
            }
            lightThis.current_phase = get_phase(lightThis.current_phase);
            var next_color = get_color(lightThis.current_phase);
            lightThis[next_color].interval = lightThis.cycle[lightThis.current_phase];
            var next_entity = lightThis[next_color].entity;
            if (lightThis[next_color].interval !== 0) {
                globalScene.Viewer.entities.add(next_entity);
                lightThis.current_id = next_entity.id;
            }
            lightThis.timer = new Timer(lightThis[next_color].interval * 1000, 1);
            lightThis.timer.addEventListener('timerComplete', recursion);
            lightThis.timer.start();
        }
        lightThis.timer.addEventListener('timerComplete',recursion);
        this.stopwatch.start();
    };

    function get_color(current_phase) {
        switch (current_phase) {
            case"P1":
                return "green";
            case"P2":
                return "yellow";
            case"P3":
            case"P4":
            case"P5":
            case"P6":
            case"P7":
            case"P8":
            case"P9":
            case"P10":
            case"P11":
            case"P12":
                return "red";
        }
    }

    function get_phase(current_phase) {
        var tmp = current_phase.substring(1);
        var index = parseInt(tmp) === 12 ? 1 : parseInt(tmp) + 1;
        return "P" + index;
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