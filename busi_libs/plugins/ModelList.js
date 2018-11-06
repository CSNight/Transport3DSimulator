define(function (require) {
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");

    var init = function () {
        setFrameHtml();
    };
    var setFrameHtml = function () {
        var GetComList = new SRAjax(function (resC) {
            var GetJZList = new SRAjax(function (resJ) {
                LayerTreeBuild(resC.response, resJ.response);
            });
            GetJZList.ModelREST(Config.scenesUrl.JZ);
        });
        GetComList.ModelREST(Config.scenesUrl.Component);
    };
    var LayerTreeBuild = function (Com, JZ) {
        layerTree = new dTree('layerTree');
        layerTree.add(0, -1, '图层控制<span></span>', '', '', '', '', '', 'true');
        layerTree.add(1, 0, '建筑<span id="Build" class="all"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', 'true');
        layerTree.add(2, 0, '部件<span id="Component" class="all"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', 'true');
        for (var i = 0; i < JZ.length; i++) {
            layerTree.add(i + 3, 1, JZ[i].name +
                '<span id="' + JZ[i].path + "/config" + '" class="' + JZ[i].name + ' Build"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png');
        }
        for (var i = 0; i < Com.length; i++) {
            layerTree.add(i + JZ.length + 3, 2, Config.ModelsScp[Com[i].name] +
                '<span id="' + Com[i].path + "/config" + '" class="' + Com[i].name + ' Component"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png'
            );
        }
        document.getElementById('layer-tree').innerHTML = layerTree;
        var MainScene = require('busi_libs/viewer/MainScene');
        $('.dTreeNode').on('click', function (e) {
            var url = $(this).find('span').attr('id');
            var name = $(this).find('span').attr('class');
            // 点击三级开关
            if ($(e.target).attr('id') !== undefined) {
                if ($(e.target).attr('id').indexOf('layerTree') !== -1) {
                    return;
                }
            }
            if (!url || !name) {
                return;
            } else if (url === "Build") {
                if (!$('#Build').find('em').hasClass('selected')) {
                    $('.Build').parent().toArray().forEach(function (node) {
                        node_click(node, 'open');
                    });
                    $('#Build').find('em').addClass('selected');
                } else {
                    $('.Build').parent().toArray().forEach(function (node) {
                        node_click(node, 'close');
                    });
                    $('#Build').find('em').removeClass('selected');
                }
            } else if (url === "Component") {
                if (!$('#Component').find('em').hasClass('selected')) {
                    $('.Component').parent().toArray().forEach(function (node) {
                        node_click(node, 'open');
                    });
                    $('#Component').find('em').addClass('selected');
                } else {
                    $('.Component').parent().toArray().forEach(function (node) {
                        node_click(node, 'close');
                    });
                    $('#Component').find('em').removeClass('selected');
                }
            } else {
                node_click(this, 'single');
            }

        });

        function node_click(node, status) {
            var url = $(node).find('span').attr('id');
            var name = $(node).find('span').attr('class');
            // 点击三级开关
            if (!url || !name) {
                return;
            }
            if (status === 'open') {
                if (!$(node).find('span em').hasClass('selected')) {
                    $(node).find('span em').addClass('selected');
                    if ($(node).find('span').attr('class').indexOf('Component') > -1) {
                        MainScene.addModels([{
                            url: url, name: name
                        }], false);
                    } else {
                        MainScene.addModels([{
                            url: url, name: name
                        }], true);
                    }
                }
            } else if (status === 'close') {
                $(node).find('span em').removeClass('selected');
                MainScene.removeModels([{
                    url: url, name: name
                }]);
            } else {
                if (!$(node).find('span em').hasClass('selected')) {
                    $(node).find('span em').addClass('selected');
                    if ($(node).find('span').attr('class').indexOf('Component') > -1) {
                        MainScene.addModels([{
                            url: url, name: name
                        }], false);
                    } else {
                        MainScene.addModels([{
                            url: url, name: name
                        }], true);
                    }
                } else {
                    $(node).find('span em').removeClass('selected');
                    MainScene.removeModels([{
                        url: url, name: name
                    }]);
                }
                if ($(node).siblings().find('span em[class="selected"]').length === $(node).siblings().length) {
                    if ($(node).find('span').attr('class').indexOf('Build') > -1) {
                        $('#Build').find('em').addClass('selected');
                    } else {
                        $('#Component').find('em').addClass('selected');
                    }
                } else if ($(node).siblings().find('span em[class="selected"]').length === 0) {
                    if ($(node).find('span').attr('class').indexOf('Build') > -1) {
                        $('#Build').find('em').removeClass('selected');
                    } else {
                        $('#Component').find('em').removeClass('selected');
                    }
                }
            }
        }

        $('.layer-tree').niceScroll({
            'cursorwidth': '6px',
            'cursorcolor': '#999',
            'cursorborderradius': 0,
            'cursorborder': 0,
            'background': '',
            'cursoropacitymax': 0.8,
            'mousescrollstep': 100
        });
    };
    return {
        init: init
    }
});