define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    /**　　* CarModelPositionChangedEvent constructor 构造器　　*　　
     * * @param type 事件类型　　
     * * @param bubbles 是否毛票　　
     * * @param cancelable 是否可取消　　*/
    var CarModelPositionChangedEvent = function (type, bubbles, cancelable) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
    };
    /**　　* Event 时间事件声明　　*　　
     * @event changed　　*/
    BASE.extend(CarModelPositionChangedEvent, {
        changed: "changed"
    });
    /**　　* Event 方法　　*　　
     * * @method toString　　*/
    BASE.extend(CarModelPositionChangedEvent.prototype, {
        toString: function () {
            return "[CarModelPositionChangedEvent type =" + this.type + "bubbles =" + this.bubbles + "cancelable =" + this.cancelable + "]";
        }
    });
    var CarModel = function (url, info) {
        this.id = BASE.guid();
        this.url = url;
        this.info = info;
        var listenerMap = {};
        listenerMap[CarModelPositionChangedEvent.changed] = [];
        BASE.extend(this, {
            car_id: info.car_id,
            pos: {x: info.x, y: info.y, z: info.z},
            segment: info.segment_id,
            lane: info.lane,
            heading: info.direction,
            node_index: 0,
            node_list: [{x: info.x, y: info.y, z: info.z}],
            speed: info.speed,
            run_state: info.is_running,
            distance: info.mileage * 1.61,
            stopwatch: new Stopwatch(),
            trajectory: info.trajectory,
            obj_state: new Cesium.DynamicObjectState({
                longitude: info.x,
                latitude: info.y,
                altitude: info.z,
                scale: new Cesium.Cartesian3(1, 1, 1),
                startDirection: info.direction / 180 * Math.PI - Math.PI / 2,
                id: info.car_id,
                description: info
            }),
            handler: listenerMap
        });
        this.stopwatch.start();
    };
    var positionChangedEvent = new CarModelPositionChangedEvent(CarModelPositionChangedEvent.changed, false, false);
    BASE.extend(CarModel.prototype, {
        addEventListener: function (type, listener, useCapture) {
            if (type === CarModelPositionChangedEvent.changed) {
                if (!listener) {
                    alert("Listener is null");
                }
                this.handler[type].push(listener);
            }
        }, removeEventListener: function (type, listener) {
            if (type === CarModelPositionChangedEvent.changed) {
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
        }, setPoistion: function (pos) {
            var carThis = this;
            if (pos && pos.hasOwnProperty("x") && pos.hasOwnProperty("y") && pos.hasOwnProperty("z")) {
                if (BASE.isNumber(pos.x) && BASE.isNumber(pos.y) && BASE.isNumber(pos.z)) {
                    this.pos = pos;
                }
                if (this.handler[CarModelPositionChangedEvent.changed].length === 0) {
                    return;
                }
                dispatchListener(carThis.handler[CarModelPositionChangedEvent.changed], {
                    instance: this,
                    event: positionChangedEvent
                });

                function dispatchListener(listeners, event) {
                    for (var prop in listeners) {
                        listeners[prop](event);
                    }
                }
            }
        }, getTotalRunTime: function () {
            this.stopwatch.elapsedMilliseconds.toLocaleString('hh:mm:ss.fff');
        }, updateInfo: function (info) {
            var carThis = this;
            carThis.info = info;
            carThis.pos = {x: info.x, y: info.y, z: info.z};
            carThis.segment = info.segment_id;
            carThis.lane = info.lane;
            carThis.heading = info.direction;
            carThis.node_index = carThis.node_index + 1;
            carThis.node_list.push(carThis.pos);
            carThis.run_state = info.is_running;
            carThis.distance = info.mileage * 1.61;
            carThis.speed = info.speed;
            carThis.trajectory = info.trajectory;
            carThis.obj_state = new Cesium.DynamicObjectState({
                longitude: info.x,
                latitude: info.y,
                altitude: info.z,
                scale: new Cesium.Cartesian3(1, 1, 1),
                id: info.car_id,
                description: info
            });
            // if (carThis.node_index.length === 2) {
            //     carThis.obj_state['heading'] = info.direction / 180 * Math.PI;
            // }
        }, getCarInfo: function () {
            var carThis = this;

            function carSpeed() {
                var time = carThis.stopwatch.elapsedMilliseconds / 1000;
                if (time !== 0 && carThis.run_state) {
                    return BASE.parseFixed(carThis.distance / 1000 / time * 3600, 3) + "km/h";
                } else if (!carThis.run_state) {
                    return "0m/s";
                } else {
                    return "0m/s";
                }
            }

            return {
                id: carThis.id,
                node_index: carThis.node_index,
                pos: carThis.pos,
                run_state: carThis.run_state,
                total_time: carThis.getTotalRunTime(),
                distance: carThis.distance,
                speed: carSpeed(),
                isWaitStop: carThis.isWaitStop
            };
        }, clearTime: function () {
            this.stopwatch.reset();
            this.stopwatch.start();
            this.node_list = [];
        }
    });
    return {
        CarModel: CarModel
    }

});