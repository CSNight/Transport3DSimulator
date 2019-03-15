define(function () {
    var RestQueryAjax = function (callback) {
        this.DataREST = function (data) {
            ResultGet(data, 'TransSimServices', 'DataProcess');
        };
        this.StreamREST = function (data) {
            ResultPost(data, 'TransSimServices', 'StreamServlet');
        };
        this.ModelREST = function (url) {
            $.ajax({
                url: url + "/datas.json",
                type: "GET",
                data: null,
                timeout: 0,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                success: function (result) {
                    if (result != null) {
                        callback(responseBuilder(url, result));
                    } else {
                        callback(responseBuilder(url, '响应错误'));
                    }
                },
                error: function (jqXHR, textStatus) {
                    callback(responseBuilder(url, jqXHR.responseText, 0, textStatus));
                }
            });
        };
        // 返回函数
        RestQueryAjax.prototype = {
            callback: callback
        };
        // 返回值生成器
        var responseBuilder = function (request, response) {
            return {
                request: request,
                response: response
            }
        };

        // POST-Ajax
        var ResultPost = function postQuery(data, restin, method) {
            $.ajax({
                type: 'POST',
                url: Config.DataService + restin + '/' + method,
                data: data,
                dataType: 'json',
                xhrFields: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                success: function (result) {
                    if (result != null) {
                        callback(responseBuilder(data, result));
                    } else {
                        callback(responseBuilder(data, '响应错误'));
                    }
                },
                error: function (jqXHR, textStatus) {
                    callback(responseBuilder(data, jqXHR.responseText, 0, textStatus));
                }
            });
        };

        // GET-Ajax
        var ResultGet = function getQuery(data, restin, method) {
            $.ajax({
                url: Config.SimServer + restin + '/' + method,
                type: "GET",
                data: data,
                timeout: 0,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                success: function (result) {
                    if (result != null) {
                        callback(responseBuilder(data, result));
                    } else {
                        callback(responseBuilder(data, '响应错误'));
                    }
                },
                error: function (jqXHR, textStatus) {
                    callback(responseBuilder(data, jqXHR.responseText, 0, textStatus));
                }
            });
        };
    };
    return RestQueryAjax;
});


