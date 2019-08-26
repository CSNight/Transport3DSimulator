define(function (require) {
    var BASE = require('busi_libs/utils/BaseFunc');
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");
    var TickProcess = require('busi_libs/events/TickProcess');
    var ProgressBar = require('busi_libs/plugins/ProgressBar');
    /**
     * @param {bool} isCleanDb all/es
     * @param {string} data_type simulate/stream
     **/
    var SimCsvAndDBHisClear = function (isCleanDb, data_type) {
        var clear = new SRAjax(function (res) {
            if (res.response) {
                return res.response;
            }
        });
        clear.DataREST({
            params: JSON.stringify({
                "RqType": "ResetIndices",
                "data_type": data_type
            })
        });
    };
    var SimCSVSearch = function () {
        var search = new SRAjax(function (res) {
            if (res.response) {
                var csv_list = eval('(' + res.response + ')');
                for (var i = 0; i < csv_list.length; i++) {
                    $('#file-sele').append('<option value="' + csv_list[i].csv_name + '">' + csv_list[i].keyword + '</option>');
                }
            }
            $('#file-sele').change(function () {
                var index = $('#file-sele')[0].options.selectedIndex;
                if (index !== -1) {
                    SimFileInfo($('#file-sele')[0].options[index].value);
                }
            });
            if($('#file-sele')[0].options.length!==0){
                $("#file-sele").val($('#file-sele')[0].options[0].value);
                $("#file-sele").trigger('change');
            }
        });
        search.DataREST({
            params: JSON.stringify({
                "RqType": "FindHistory"
            })
        });
    };
    /**
     * @param {string} re_t all/es
     **/
    var SimDataRest = function (re_t) {
        var reset = new SRAjax(function (res) {
            if (res.response) {
                return res.response;
            }
        });
        reset.DataREST({
            params: JSON.stringify({
                "RqType": "ResetIndices",
                "reset_type": re_t
            })
        });
    };
    var SimFileInfo = function (file_name) {
        var getInfo = new SRAjax(GetInfoCall);
        getInfo.DataREST({
            params: JSON.stringify({
                "RqType": "GetMetaData",
                "file_name": file_name
            })
        });

        function GetInfoCall(result) {
            if (result.response) {
                var res = eval("(" + result.response + ")");
                $('.lp-des').html(res["info"]);
                var loc = [res['loc'].split(',')[0] / 1000000, res['loc'].split(',')[1] / 1000000];
                globalScene.Viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(loc[0], loc[1], 500)
                });
                $('.lp-static').html("车辆监控列表");
                globalScene.SIM_CAR_LIST = {};
                globalScene.globalTimer = new Timer(1000, null);
                globalScene.globalTimer.total_count = res["total_time"];
                globalScene.globalTimer.file_id = res["id"];
                globalScene.globalTimer.start_timestamp = BASE.DateToTimestamp(res["op_time"], res["start_time"] - 1);
                globalScene.globalTimer.addEventListener('timer', TickProcess.TickFrameEvent);
                var datestr=eval("("+result.request.params+")").file_name.split("_")[1];
                var Lights = require('busi_libs/requests/LightVectorRequest');
                globalScene.Lights_List=new BASE.List();
                Lights.query(datestr);
                ProgressBar.init(BASE.DateToTimestamp(datestr.substring(0, 4) + "-" + datestr.substring(4, 6) + "-" + datestr.substring(6, 8), +28800));
            }
        }
    };

    return {
        SimDataRest: SimDataRest,
        SimCsvAndDBHisClear: SimCsvAndDBHisClear,
        SimCSVSearch: SimCSVSearch
    }
});