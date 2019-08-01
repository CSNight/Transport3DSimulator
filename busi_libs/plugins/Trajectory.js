define(function () {
    var CarListPlugin = require('busi_libs/plugins/CarList');
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");
    let init = function () {
        $('.history-boxs').hide();
        init_box();
        init_select();
    };
    var frame_index = 0;
    var frame_start = 0;
    let his_markers = null;
    let HIS_TIMER = new Timer(1000, null);
    let open = function () {
        clear();
        globalScene.stream_type = "his";
        $('.history-boxs').show();
        build_list();
        $("#his_stop").val(moment().format('YYYY-MM-DD HH:mm:ss'));
    };
    let init_box = function () {
        let box_html = '<div class="box-head">历史轨迹查询<span id="close_his"><i class="iconfont icon-guanbi4"></i></span></div>';
        box_html += '<div class="lp-file his_time"><div class="file-txt">选择起止时间</div></div>';
        box_html += '<div class="scroll-info" style="display: none"></div>';
        box_html += '<div class="lp-ctr bot his_ctr" style="display: none;margin-top: 10px">';
        box_html += '<div class="lpd-btn history his_text">历史轨迹：</div>';
        box_html += '<div class="lpd-btn play his_clear" style="margin-right: 8px"><a href="javascript:;">清空</a></div>';
        box_html += '<div class="lpd-btn play ctr_s his_play"><a href="javascript:;"><i class="iconfont icon-bofang"></i>播放</a></div>';
        box_html += '<div class="lpd-btn stop ctr_s his_stop" style="display:none;"><a href="javascript:;"><i class="iconfont icon-tingzhi-shixin"></i>停止</a></div>';
        box_html += '</div>';
        $('.history-boxs').append(box_html);
        $('.scroll-info').height($('.lp-main').height() - 300);
        $('#close_his').click(function () {
            clear();
            $('.history-boxs').hide();
            globalScene.stream_type = "stream";
        });
        $('.his_play').click(function () {
            $('.his_stop').show();
            $(this).hide();
            start();
        });
        $('.his_stop').click(function () {
            $('.his_play').show();
            $(this).hide();
            stop();
        });
        $('.his_clear').click(function () {
            stop();
            removeCurrent();
        });
    };
    let init_select = function () {
        var html_date = '<div class="date_pick">';
        html_date += '<div class="c-datepicker-date-editor J-datepicker-range-between30 mt10">';
        html_date += '<i class="c-datepicker-range__icon kxiconfont icon-clock"></i>';
        html_date += '<input placeholder="开始日期" name="" class="c-datepicker-data-input" value="" id="his_start">';
        html_date += '<span class="c-datepicker-range-separator">-</span>';
        html_date += '<input placeholder="结束日期" name="" class="c-datepicker-data-input" value="" id="his_stop">';
        html_date += '</div></div>';
        $('.his_time').append(html_date);
        $('.date_pick').datePicker({
            isRange: true,
            between: 1,
        });
    };
    let build_list = function () {
        $('.scroll-info').hide();
        $('.his_ctr').hide();
        $('.scroll-info').html('');
        if (globalScene.line_filter === 'all') {
            return;
        }
        let cars = globalScene.LineCarMap[globalScene.line_filter];
        for (let i = 0; i < cars.length; i++) {
            let html_car = '<div class="scroll-box">';
            html_car += '<div class="scroll-list"><p><i class="iconfont icon-qiche"></i></p></div>';
            html_car += '<div class="scroll-list"><p id="his_car_id">' + cars[i] + '</p></div>';
            html_car += '<div class="scroll-list"><p>' + globalScene.line_filter + '路</p></div>';
            html_car += '<div class="scroll-list find_his"><span><a href="javascript:;"><i class="iconfont icon-sousuo"></i>查询</span></a></div></div>';
            $('.scroll-info').append(html_car);
        }
        $('.scroll-info').show();
        $('.scroll-info').niceScroll({
            'cursorwidth': '6px',
            'cursorcolor': '#999',
            'cursorborderradius': 0,
            'cursorborder': 0,
            'background': '',
            'cursoropacitymax': 0.8,
            'mousescrollstep': 100
        });
        $('.find_his').unbind().click(function () {
            removeCurrent();
            let car_id = $(this).siblings().find('#his_car_id').text();
            let time_st = $('#his_start').val();
            let time_en = $('#his_stop').val();
            var date_st = new Date(Date.parse(time_st));
            var date_en = new Date(Date.parse(time_en));
            if (time_en === '' || time_st === '') {
                alert("请选择查询时间范围！");
                return;
            }
            let days = date_en.getDay() - date_st.getDay();
            let hours = date_en.getHours() - date_st.getHours();
            if (days > 0 || (days === 0 && hours > 3)) {
                alert("暂不支持跨天查询,查询跨度最长3小时，请重新输入！");
                return;
            }
            if (time_st === '2019-07-21 10:42:33' && time_en === '2019-07-21 10:52:33' && car_id === '黑AR6970') {
                $.get('resource/res.json', function (jsData) {
                    let len = jsData.poi_count;
                    let key_st = jsData.start_time;
                    frame_index = frame_start = parseInt(key_st);
                    HIS_TIMER = new Timer(500, null);
                    HIS_TIMER.addEventListener('timer', tick);
                    globalScene.globalTimer.addEventListener('timerComplete', function () {
                        $('.his_stop').click();
                        frame_index = frame_start;
                    });
                    HIS_TIMER.start_timestamp = frame_start * 1000;
                    HIS_TIMER.total_count = len;
                    HIS_TIMER.file_id = guid();
                    his_markers = jsData.markers;
                    getLine(jsData.markers, len, key_st);
                    $('.his_text').text("历史轨迹：" + car_id);
                    $('.his_ctr').show();
                });
            } else {
                var getLineCars = new SRAjax(function (res) {
                    if (res.response) {
                        let len = res.response.poi_count;
                        let key_st = res.response.start_time;
                        frame_index = frame_start = parseInt(key_st);
                        if (len > 0) {
                            HIS_TIMER = new Timer(500, null);
                            HIS_TIMER.addEventListener('timer', tick);
                            globalScene.globalTimer.addEventListener('timerComplete', function () {
                                $('.his_stop').click();
                                frame_index = frame_start;
                            });
                            HIS_TIMER.start_timestamp = frame_start * 1000;
                            HIS_TIMER.total_count = len;
                            HIS_TIMER.file_id = guid();
                            his_markers = res.response.markers;
                            getLine(res.response.markers, len, key_st);
                            $('.his_text').text("历史轨迹：" + car_id);
                            $('.his_ctr').show();
                        } else {
                            alert("未查询到历史轨迹");
                        }
                    } else {
                        alert("查询失败！，请检查参数");
                    }
                });
                getLineCars.StreamREST({
                    params: JSON.stringify({
                        "RqType": "getHis",
                        "car_id": car_id,
                        "date": time_st.substring(0, 7).replace("-", ''),
                        start_t: time_st,
                        end_t: time_en
                    })
                });
            }
        });
    };
    let start = function () {
        globalScene.globalTimer.stop();
        globalScene.carDynamicLayer.clearAll();
        CarListPlugin.clear();
        HIS_TIMER.start();
    };
    let stop = function () {
        globalScene.globalTimer.stop();
        globalScene.carDynamicLayer.clearAll();
        HIS_TIMER.stop();
    };
    let removeCurrent = function () {
        $('.his_play').show();
        $('.his_stop').hide();
        $('.his_ctr').hide();
        $('.his_text').text('');
        stop();
        frame_start = 0;
        frame_index = 0;
        his_markers = null;
        if (HIS_TIMER.file_id !== '') {
            globalScene.Viewer.entities.removeById(HIS_TIMER.file_id);
        }
    };
    let clear = function () {
        $('.lp-info').html('');
        frame_start = 0;
        frame_index = 0;
        $('.scroll-info').html('');
        $('#his_start').val('');
        $('#his_stop').val('');
        $('.scroll-info').hide();
        $('.his_play').show();
        $('.his_stop').hide();
        $('.his_ctr').hide();
        $('.his_text').text('');
        stop();
        his_markers = null;
        if (HIS_TIMER.file_id !== '') {
            globalScene.Viewer.entities.removeById(HIS_TIMER.file_id);
        }
    };
    let getLine = function (markers, len, key_st) {
        let points = [];
        for (let i = 0; i < len; i = i + 2) {
            let item = markers[frame_start + i];
            let dash = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z + 6);
            points.push(dash);
        }
        globalScene.Viewer.entities.add({
            id: HIS_TIMER.file_id,
            name: 'Blue dashed line',
            polyline: {
                positions: points,
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.RED
                })
            }
        });
        globalScene.carDynamicLayer.updateInterval = 500;
        globalScene.Viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(markers[key_st].x, markers[key_st].y, 100)
        });
    };
    let tick = function (e) {
        let marker = his_markers[frame_index];
        let obj_state = new Cesium.DynamicObjectState({
            id: e.file_id,
            longitude: marker.x,
            latitude: marker.y,
            altitude: marker.z,
            scale: new Cesium.Cartesian3(1, 1, 1),
        });
        globalScene.carDynamicLayer.updateObjectWithModel(Config.CarModelUrls[0], [obj_state]);
        frame_index++;
    };
    let guid = function () {
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
    return {
        open: open,
        init: init,
        build_list: build_list
    }
});