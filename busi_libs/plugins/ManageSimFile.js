function validateForm() {
    var csv_file = document.getElementById('file_up').files[0];
    var keyword = $("#keyword").val();
    var data_info = $("#data_info").val();
    var progress = $("#progress").data("progress");
    $('.loading').show();
    if (keyword === "" || data_info === "" || !TextCheck(keyword) || !TextCheck(data_info)) {
        $('#info').html("信息为空或包含非法字符！");
        $('.login-form').removeClass("disabled");
        progress.val(0);
        $(".login-form")[0].reset();
        $('.loading').hide();
        return "";
    }
    buttonUpload(csv_file, function () {
        var up_progress = progress.val();
        if (up_progress !== 100) {
            alert("上传失败！");
            $('.loading').hide();
            return "";
        } else {
            $.ajax({
                url: "http://localhost:8020/TransSimServices/DataProcess",
                type: "GET",
                data: {params: JSON.stringify({"RqType": "CheckExist", "file_name": csv_file.name})},
                timeout: 0,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                success: function (result) {
                    if (result != null) {
                        if (eval("(" + result + ")").status === "Found") {
                            ImportToEs(csv_file.name, keyword, data_info);
                        }
                    } else {
                        alert("Services Failure!");
                        $('.loading').hide();
                    }
                },
                error: function (jqXHR, textStatus) {
                    alert("Services Failure!");
                    $('.loading').hide();
                }
            });
        }
    });
}

var _msfTable = null;
getTable();

function getTable() {
    _msfTable = $('#file_list').DataTable({
        columns: [
            {"data": "id", "title": "编号", "width": "200px"},
            {
                "data": "csv_name",
                "render": function (data, type, full, meta) {
                    return '<a id="' + data + '">' + data + '</a>';
                },
                "title": "文件名",
                "width": "400px"
            },
            {"data": 'keyword', "title": "关键词", "width": "100px"},
            {"data": "size", "title": "总帧数", "width": "150px"},
            {"data": "op_time", "title": "上传时间", "width": "270px", "type": "datetime"},
            {
                "data": "btn", "title": "操作", "width": "100px",
                "render": function (data, type, full, meta) {
                    return '<a name="' + data + '" href="javascript:;" class="del fg-blue"><span class="mif-bin ml-4"></span></a>';
                }
            }
        ], "language": {//自定义语言提示
            "processing": "处理中...",
            "lengthMenu": "显示 _MENU_ 项结果",
            "zeroRecords": "没有找到相应的结果",
            "info": "第 _START_ 至 _END_ 行，共 _TOTAL_ 行",
            "infoEmpty": "第 0 至 0 项结果，共 0 项",
            "infoFiltered": "(由 _MAX_ 项结果过滤)",
            "infoPostFix": "",
            "search": "搜索:",
            "searchPlaceholder": "请输入要搜索内容...",
            "url": "",
            "thousands": "'",
            "emptyTable": "表中数据为空",
            "loadingRecords": "载入中...",
            "infoThousands": ",",
            "paginate": {
                "first": "首页",
                "previous": "上页",
                "next": "下页",
                "last": "末页"
            }
        }
    });
    _msfTable.rows().remove().draw();
    loadTable();
}

function loadTable() {
    _msfTable.rows().remove().draw();
    $.ajax({
        url: "http://localhost:8020/TransSimServices/DataProcess",
        type: "GET",
        data: {params: JSON.stringify({"RqType": "FindHistory"})},
        timeout: 0,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (result) {
            if (result != null) {
                var csv_list = eval('(' + result + ')');
                var files = [];
                csv_list.forEach(function (data) {
                    var tmp = {
                        "id": data.id.substring(0, 8),
                        "csv_name": data.csv_name,
                        "keyword": data.keyword,
                        "size": data.size,
                        "op_time": data.op_time,
                        "btn": data.id
                    };
                    files.push(tmp);
                });
                _msfTable.rows().remove().draw();
                $('.del').unbind();
                _msfTable.rows.add(files).draw(false);
                bindEvent();
                $('#file_list tbody').on('click', 'tr', function () {
                    $(this).toggleClass('selected');
                });
                $('.dataTables_paginate').click(function () {
                    bindEvent();
                });
            } else {

            }
        },
        error: function (jqXHR, textStatus) {

        }
    });
}

function ImportToEs(filename, keyword, data_info) {
    $.ajax({
        url: "http://localhost:8020/TransSimServices/DataProcess",
        type: "GET",
        data: {
            params: JSON.stringify({
                "RqType": "ImportToES",
                "data_type": "simulate",
                "file_name": filename,
                "keyword": keyword,
                "info": data_info
            })
        },
        timeout: 0,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function (result) {
            if (result != null) {
                $(".login-form")[0].reset();
            } else {
                alert("Services Failure!");
            }
            loadTable();
            $('.loading').hide();
        },
        error: function (jqXHR, textStatus) {
            alert("Services Failure!");
            loadTable();
            $('.loading').hide();
        }
    });
}

function bindEvent() {
    $('.del').click(function () {
        $('.loading').show();
        $.ajax({
            url: "http://localhost:8020/TransSimServices/DataProcess",
            type: "GET",
            data: {
                params: JSON.stringify({
                    "RqType": "ResetIndices",
                    "index_name": "trans_sim",
                    "data_type": "simulate",
                    "reset_type": $(this).attr('name')
                })
            },
            timeout: 0,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            success: function (result) {
                if (result !== "") {
                } else {
                    alert("Services Failure!");
                }
                loadTable();
                $('.loading').hide();
            },
            error: function (jqXHR, textStatus) {
                alert("Services Failure!");
                loadTable();
                $('.loading').hide();
            }
        });
    });
}

function buttonUpload(csv_file, callback) {
    if (csv_file === null) {
        return;
    }
    if (csv_file.name.indexOf('[') !== -1 || csv_file.name.indexOf(']') !== -1) {

    } else {
        var reader = new FileReader();
        var step = 2 * 1024 * 1024;
        var total = csv_file.size;
        var cuLoaded = 0;
        console.info("文件大小：" + csv_file.size);
        var startTime = new Date();
        reader.onload = function (e) {
            // 处理读取的结果
            var loaded = e.loaded;
            // 将分段数据上传到服务器
            uploadFile(reader.result, cuLoaded,
                function () {
                    var progress = $("#progress").data("progress");
                    progress.val(Math.floor(100 * cuLoaded / total) + 1);
                    console.info('loaded:' + cuLoaded + 'current:' + loaded);
                    cuLoaded += loaded;
                    if (cuLoaded < total) {
                        readBlob(cuLoaded);
                    } else {
                        console.log('总共用时：' + (new Date().getTime() - startTime.getTime()) / 1000);
                        cuLoaded = total;
                        progress.val(100);
                        callback();
                    }
                });
        };

        // 指定开始位置，分块读取文件
        function readBlob(start) {
            var blob = csv_file.slice(start, start + step);
            reader.readAsArrayBuffer(blob);
        }

        // 开始读取
        readBlob(0);

        // 关键代码上传到服务器
        function uploadFile(result, startIndex, onSuccess) {
            var blob = new Blob([result]);
            // 提交到服务器
            var fd = new FormData();
            fd.append('file', blob);
            fd.append('filename', csv_file.name);
            fd.append('loaded', startIndex);
            var xhr = new XMLHttpRequest();
            xhr.open('post', 'http://localhost:8020/TransSimServices/BigSingleFileUploadServlet', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (onSuccess)
                        onSuccess();
                }
            };
            // 开始发送
            xhr.send(fd);
        }
    }
}

/**
 * @return {boolean}
 */
function TextCheck(val) {
    var reg = /[~#^$@%&!?%*]/gi;
    if (val === '' || val === null || val.indexOf(" ") !== -1 || val.indexOf("	") !== -1) {
        return false;
    } else return val.match(reg) == null;
}