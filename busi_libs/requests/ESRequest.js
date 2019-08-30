define(function () {
    //仿真轨迹查询条件构造
    var es_sim_request = function (startT, endT, sim_option) {
        if (startT > endT) {
            return;
        }
        return {
            index: sim_option.ident,
            type: sim_option.es_type,
            preference: "_primary",
            body: {
                query: {
                    bool: {
                        must: {match: {ident: sim_option.ident}},
                        filter: {
                            range: eval("(" + "{'" + sim_option.range_field + "':{gt:" + startT + ",lte:" + endT + "}}" + ")")
                        }
                    }
                },
                sort: {
                    frame_id: "ASC"
                },
                size: 10000
            }
        };
    };
    var es_request_func = function (search, callback, rej) {
        var liveESService = new SuperMap.ElasticSearch(Config.ESService);
        liveESService.search(search).then(callback, rej);
    };
    return {
        search_builder: es_sim_request,
        es_request_func: es_request_func
    }
});