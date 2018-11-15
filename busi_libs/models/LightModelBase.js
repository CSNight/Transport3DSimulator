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
        var listenerMap = {};
        listenerMap[LightModelPositionChangedEvent.changed] = [];
        BASE.extend(this, {
            light_id: info.light_id,
            green: {
                interval: info.g_interval,
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
                        width: 100,
                        height: 100,
                        color: new Cesium.Color(1, 1, 1, 1)
                    })
                }
            },
            red: {
                interval: info.r_interval,
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
                        width: 100,
                        height: 100,
                        color: new Cesium.Color(1, 1, 1, 1)
                    })
                }
            },
            yellow: {
                interval: info.y_interval,
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
                        width: 100,
                        height: 100,
                        color: new Cesium.Color(1, 1, 1, 1)
                    })
                }
            },
            stopwatch: new Stopwatch(),
            current_phase: info.current_phase,
            current_id: "",
            handler: listenerMap
        });
        var lightThis = this;
        //初始相位对象
        var first_phase_obj = this[this.current_phase];
        //场景实体添加
        globalScene.Viewer.entities.add(first_phase_obj.entity);
        //初始化计时器
        this.timer = new Timer(first_phase_obj.interval * 1000, 1);
        //记录当前实体id
        this.current_id = first_phase_obj.entity.id;

        function recursion() {
            //移除当前实体
            globalScene.Viewer.entities.removeById(lightThis.current_id);
            //获取下一相位实体
            var next = get_next(lightThis.current_phase);
            var next_phase_obj = lightThis[next];
            //记录相位实体为当前实体
            lightThis.current_phase = next;
            lightThis.current_id = next_phase_obj.entity.id;
            //场景实体添加
            globalScene.Viewer.entities.add(next_phase_obj.entity);
            //初始化下一相位计时器
            lightThis.timer = new Timer(next_phase_obj.interval, 1);
            lightThis.timer.addEventListener('timerComplete', recursion);
            lightThis.timer.start();
        }

        //添加倒计时结束事件
        this.timer.addEventListener('timerComplete', recursion);
        this.timer.start();
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