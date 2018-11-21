define(function () {
    var parseFixed = function (num, sep) {
        return Math.round(num * Math.pow(10, sep)) / Math.pow(10, sep);
    };
    /**
     * @return {number}
     */
    var DistanceCal = function (x1, y1, x2, y2, z1, z2) {
        var a = y1 * Math.PI / 180.0 - y2 * Math.PI / 180.0;
        var b = x1 * Math.PI / 180.0 - x2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(y1 * Math.PI / 180.0) * Math.cos(y2 * Math.PI / 180.0) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000 * 1000;
        return Math.sqrt(Math.pow(s, 2) + Math.pow((z2 - z1), 2));
    };
    var isNumber = function (obj) {
        return obj === +obj
    };
    var guid = function () {
        /**
         * @return {string}
         */
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16)
                .substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-"
            + S4() + S4() + S4());
    };
    var data_to_timestamp = function (date, offset) {
        var d = new Date(date.split(" ")[0]);
        return timestamp = Math.round(d.getTime()) - 28800 * 1000 + offset * 1000;
    };
    var base64decode = function (str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };

    var base64encode = function (str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    };

    /**　　* Extend 扩展类，对象的属性或者方法　　*　　
     * * @param target 目标对象　　
     * * @param methods 这里改成param也许更合适，表示承载着对象，方法的对象，用于target的扩展　
     **/
    var extend = function (target, methods) {
        if (!target) {
            target = {};
        }
        for (var prop in methods) {
            target[prop] = methods[prop];
        }
        return target;
    };
    /**
     * @see http://download.oracle.com/javase/6/docs/api/java/util/Collection.html
     * @constructor
     * @private
     */
    var Collection = function Collection() {
    };
    extend(Collection.prototype, {
        add: function () {
        }, addAll: function (c) {
        }, isEmpty: function () {
        }, iterator: function () {
        }, size: function () {
        }, toArray: function () {
        }, remove: function (e) {
        }
    });

    var IndexOutOfBoundsException = (function (Error) {
        function IndexOutOfBoundsException(message) {
            Error.call(this);
            this.message = message || '';
        }

        if (Error) IndexOutOfBoundsException.__proto__ = Error;
        IndexOutOfBoundsException.prototype = Object.create(Error && Error.prototype);
        IndexOutOfBoundsException.prototype.constructor = IndexOutOfBoundsException;
        var staticAccessors = {name: {configurable: true}};
        /**
         * @type {string}
         */
        staticAccessors.name.get = function () {
            return 'IndexOutOfBoundsException'
        };
        Object.defineProperties(IndexOutOfBoundsException, staticAccessors);
        return IndexOutOfBoundsException;
    }(Error));

    /**
     * @see http://download.oracle.com/javase/6/docs/api/java/util/Iterator.html
     * @constructor
     * @private
     */
    var Iterator = function Iterator() {
    };
    extend(Iterator.prototype, {
        hasNext: function () {
        }, next: function () {
        }, remove: function () {
        }
    });
    /**
     * @see http://download.oracle.com/javase/6/docs/api/java/util/List.html
     * @extends {javascript.util.Collection}
     * @constructor
     * @private
     */
    var List = (function (Collection$$1) {
        function List() {
            Collection$$1.apply(this, arguments);
        }

        if (Collection$$1) List.__proto__ = Collection$$1;
        List.prototype = Object.create(Collection$$1 && Collection$$1.prototype);
        List.prototype.constructor = List;
        extend(List.prototype, {
            get: function () {
            }, set: function (index, ele) {
            }, isEmpty: function () {
            }
        });

        return List;
    }(Collection));

    /**
     * @param {string=} message Optional message
     * @extends {Error}
     * @constructor
     * @private
     */
    function NoSuchElementException(message) {
        this.message = message || '';
    }

    NoSuchElementException.prototype = new Error();
    /**
     * @type {string}
     */
    NoSuchElementException.prototype.name = 'NoSuchElementException';
    /**
     * @see http://download.oracle.com/javase/6/docs/api/java/util/ArrayList.html
     *
     * @extends List
     * @private
     */
    var ArrayList = (function (List$$1) {
        function ArrayList() {
            List$$1.call(this);
            this.array_ = [];
            if (arguments[0] instanceof Collection) {
                this.addAll(arguments[0]);
            }
        }

        if (List$$1) ArrayList.__proto__ = List$$1;
        ArrayList.prototype = Object.create(List$$1 && List$$1.prototype);
        extend(ArrayList.prototype, {
            constructor: ArrayList,
            ensureCapacity: function () {
            }, interfaces_: function () {
                return [List$$1, Collection]
            }, add: function add(e) {
                if (arguments.length === 1) {
                    this.array_.push(e);
                } else {
                    this.array_.splice(arguments[0], arguments[1]);
                }
                return true
            }, clear: function () {
                this.array_ = [];
            }, addAll: function (c) {
                var this$1 = this;
                for (var i = c.iterator(); i.hasNext();) {
                    this$1.add(i.next());
                }
                return true
            }, set: function (index, element) {
                var oldElement = this.array_[index];
                this.array_[index] = element;
                return oldElement
            }, iterator: function () {
                return new Iterator_(this)
            }, get: function (index) {
                if (index < 0 || index >= this.size()) {
                    throw new IndexOutOfBoundsException()
                }
                return this.array_[index]
            }, isEmpty: function () {
                return this.array_.length === 0
            }, size: function () {
                return this.array_.length
            }, toArray: function () {
                var this$1 = this;
                var array = [];
                for (var i = 0, len = this.array_.length; i < len; i++) {
                    array.push(this$1.array_[i]);
                }
                return array;
            }, remove: function (o) {
                var this$1 = this;
                var found = false;
                for (var i = 0, len = this.array_.length; i < len; i++) {
                    if (this$1.array_[i] === o) {
                        this$1.array_.splice(i, 1);
                        found = true;
                        break;
                    }
                }
                return found;
            }, index: function (o) {
                var this$1 = this;
                var found = -1;
                for (var i = 0, len = this.array_.length; i < len; i++) {
                    if (this$1.array_[i] === o) {
                        found = i;
                        break;
                    }
                }
                return found;
            }, indexOfKey: function (k, v) {
                var this$1 = this;
                var found = -1;
                for (var i = 0, len = this.array_.length; i < len; i++) {
                    if (this$1.array_[i][k] === v) {
                        found = i;
                        break;
                    }
                }
                return found;
            }, diff: function (arr, k, x) {
                arr_tmp = [];
                arr.forEach(function (val) {
                    arr_tmp.push(val[x][k]);
                });
                var this$1 = this;
                var diff_cur = [];
                for (var v = 0; v < this$1.array_.length; v++) {
                    if (arr_tmp.indexOf(this$1.array_[v][k]) < 0) {
                        diff_cur.push(this$1.array_[v][k]);
                    }
                }
                return diff_cur;
            }, removeAt: function (o) {
                var this$1 = this;
                var found;
                if (o < 0 || o >= this.size()) {
                    throw new IndexOutOfBoundsException();
                }
                this$1.array_.splice(o, 1);
                found = true;
                return found;
            }
        });
        return ArrayList;
    }(List));
    /**
     * @extends {Iterator}
     * @param {ArrayList} arrayList
     * @constructor
     * @private
     */
    var Iterator_ = (function (Iterator$$1) {
        function Iterator_(arrayList) {
            Iterator$$1.call(this);
            this.arrayList_ = arrayList;
            this.position_ = 0;
        }

        if (Iterator$$1) Iterator_.__proto__ = Iterator$$1;
        Iterator_.prototype = Object.create(Iterator$$1 && Iterator$$1.prototype);
        extend(Iterator_.prototype, {
            constructor: Iterator_,
            next: function () {
                if (this.position_ === this.arrayList_.size()) {
                    throw new NoSuchElementException()
                }
                return this.arrayList_.get(this.position_++)
            }, hasNext: function () {
                return this.position_ < this.arrayList_.size();
            }, set: function (element) {
                return this.arrayList_.set(this.position_ - 1, element)
            }, remove: function () {
                this.arrayList_.remove(this.arrayList_.get(this.position_));
            }
        });
        return Iterator_;
    }(Iterator));
    return {
        parseFixed: parseFixed,
        extend: extend,
        guid: guid,
        isNumber: isNumber,
        DistanceCal: DistanceCal,
        base64decode: base64decode,
        base64encode: base64encode,
        DateToTimestamp: data_to_timestamp,
        List: ArrayList
    };
});


