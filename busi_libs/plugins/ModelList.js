define(function (require) {
    var SRAjax = require("busi_libs/requests/ServicesRestAjax");

    var init = function () {
        setFrameHtml();
    };
    var setFrameHtml = function () {
        var GetComList = new SRAjax(function (resC) {
            var GetJZList = new SRAjax(function (resJ) {
                var GetDMList = new SRAjax(function (resD) {
                    LayerTreeBuild(resD.response, resJ.response, resC.response);
                });
                GetDMList.ModelREST(Config.scenesUrl.Base);
            });
            GetJZList.ModelREST(Config.scenesUrl.JZ);
        });
        GetComList.ModelREST(Config.scenesUrl.Component);
    };
    var LayerTreeBuild = function (DM, JZ, Com) {
        //名称排序
        DM.sort(function (a, b) {
            return a.name > b.name ? 1 : -1
        });
        JZ.sort(function (a, b) {
            return a.name > b.name ? 1 : -1
        });
        Com.sort(function (a, b) {
            return a.name > b.name ? 1 : -1
        });
        layerTree = new dTree('layerTree');
        layerTree.add(0, -1, '图层控制<span></span>', '', '', '', '', '', true);
        var xzqh_meta = {};
        var index_gl = 1;
        //区划根目录
        for (var key in Config.XZQH) {
            layerTree.add(index_gl, 0, Config.XZQH[key] + '<span class="' + key + '"></span>', '', '', '', '', '', false);
            xzqh_meta[key] = {mc: Config.XZQH[key], index: index_gl, JZ: {}, DM: {}, Com: {}};
            index_gl++;
        }
        //区划内部三种类型（地面、建筑、部件）根目录
        for (var index in Config.XZQH) {
            var pid = xzqh_meta[index].index;
            xzqh_meta[index].DM['index'] = index_gl;
            xzqh_meta[index].DM['models'] = [];
            layerTree.add(index_gl++, pid, '地面<span id="' + index + '_DM" class="DM"><em class="selected"></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
            xzqh_meta[index].JZ['index'] = index_gl;
            xzqh_meta[index].JZ['models'] = [];
            layerTree.add(index_gl++, pid, '建筑<span id="' + index + '_JZ" class="JZ"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
            xzqh_meta[index].Com['index'] = index_gl;
            xzqh_meta[index].Com['models'] = [];
            layerTree.add(index_gl++, pid, '部件<span id="' + index + '_Com" class="Com"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
        }
        //区划分类目录填充
        ModelOrganization(DM, JZ, Com, xzqh_meta, index_gl);
        //矢量目录节点构建
        layerTree.add(index_gl++, 0, '哈尔滨矢量<span id="' + Config.vectorMap + '" class="ImageVector"><em></em></span>',
            '', '', '', 'images/layer.png', 'images/layer.png');
        layerTree.add(index_gl++, 0, '天地图影像<span id="' + Config.vectorMap + '" class="TDT"><em class="selected"></em></span>',
            '', '', '', 'images/layer.png', 'images/layer.png');
        layerTree.add(index_gl, 0, 'Bing影像<span id="' + Config.vectorMap + '" class="BING"><em></em></span>',
            '', '', '', 'images/layer.png', 'images/layer.png');
        document.getElementById('layer-tree').innerHTML = layerTree;
        globalScene.Mol = xzqh_meta;
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
            } else if (name === 'ImageVector') {//矢量
                if (!$('.ImageVector').find('em').hasClass('selected')) {
                    MainScene.addLayers([url]);
                    $('.ImageVector').find('em').addClass('selected');
                } else {
                    MainScene.removeLayers([url]);
                    $('.ImageVector').find('em').removeClass('selected');
                }
            } else if (name === 'TDT') {//底图天地图
                if (!$('.TDT').find('em').hasClass('selected')) {
                    MainScene.switchBase(true, '');
                    $('.TDT').find('em').addClass('selected');
                } else {
                    MainScene.switchBase(false, '');
                    $('.TDT').find('em').removeClass('selected');
                }
            } else if (name === 'BING') {//底图BING
                if (!$('.BING').find('em').hasClass('selected')) {
                    MainScene.switchBase(true, 'bing');
                    $('.BING').find('em').addClass('selected');
                } else {
                    MainScene.switchBase(false, 'bing');
                    $('.BING').find('em').removeClass('selected');
                }
            } else if (name === 'ComponentXHD') {//信号灯
                if (!$('.ComponentXHD').find('em').hasClass('selected')) {
                    toggleFunc(globalScene.Mol.XHD, 'open');
                } else {
                    toggleFunc(globalScene.Mol.XHD, 'close');
                }
            } else if (name.indexOf('TL_') !== -1) {//铁路
                if (!$('.' + name).find('em').hasClass('selected')) {
                    toggleFunc(globalScene.Mol[name], 'open');
                } else {
                    toggleFunc(globalScene.Mol[name], 'close');
                }
            } else if (name === 'DM' || name === 'JZ' || name === 'Com') {
                var qh = url.split('_')[0];
                var dt = globalScene.Mol[qh][name].models;
                if (!$('#' + url).find('em').hasClass('selected')) {
                    for (var x = 0; x < dt.length; x++) {
                        toggleFunc(dt[x], 'open');
                    }
                    $('#' + url).find('em').addClass('selected');
                } else {
                    for (var x = 0; x < dt.length; x++) {
                        toggleFunc(dt[x], 'close');
                    }
                    $('#' + url).find('em').removeClass('selected');
                }
            } else {//子节点
                var qh = name.split('_')[0];//区划id
                var na = name.split('_')[1];//节点类型（JZ,DM,Com）
                var top_index = -1;//子节点父容器节点编号
                var topNodeId = '';//子节点管控父节点（类型总开关）id
                var models = null;
                //获取模型类目列表
                if (na.indexOf('DM') !== -1 || na.indexOf('JT') !== -1) {
                    models = globalScene.Mol[qh].DM.models;
                    top_index = globalScene.Mol[qh].DM.index;
                    topNodeId = qh + "_" + "DM"
                } else if (na.indexOf('JZ') !== -1) {
                    models = globalScene.Mol[qh].JZ.models;
                    top_index = globalScene.Mol[qh].JZ.index;
                    topNodeId = qh + "_" + "JZ"
                } else {
                    models = globalScene.Mol[qh].Com.models;
                    top_index = globalScene.Mol[qh].Com.index;
                    topNodeId = qh + "_" + "Com"
                }
                //模型名称匹配
                for (var y = 0; y < models.length; y++) {
                    if (models[y].name === name) {
                        if ($('.' + name).find('em').hasClass('selected')) {
                            //子节点状态管控及图层管理
                            toggleFunc(models[y], 'close');
                            //父节点状态管控
                            topNodeManage(top_index, topNodeId, 'close', models.length);
                        } else {
                            //子节点状态管控及图层管理
                            toggleFunc(models[y], 'open');
                            //父节点状态管控
                            topNodeManage(top_index, topNodeId, 'open', models.length);
                        }
                    }
                }
            }
        });

        function topNodeManage(top_index, topNodeId, op, mo_len) {
            var parentId = 'dlayerTree' + top_index;
            if (op === 'close') {
                //全关父关
                if ($('#' + parentId).find('span em[class="selected"]').length === 0) {
                    $('#' + topNodeId).find('em').removeClass('selected');
                }
            } else if (op === 'open') {
                //全开父开
                if ($('#' + parentId).find('span em[class="selected"]').length === mo_len) {
                    $('#' + topNodeId).find('em').addClass('selected');
                }
            }
        }

        function toggleFunc(model, op) {
            var name = model.name;
            var url = model.url;
            switch (op) {
                case "open":
                    //排除已打开
                    if (!$('.' + name).find('em').hasClass('selected')) {
                        $('.' + name).find('em').addClass('selected');
                        MainScene.addModels([{
                            url: url, name: name
                        }], false);
                    }
                    break;
                case "close":
                    //排除已关闭
                    if ($('.' + name).find('em').hasClass('selected')) {
                        $('.' + name).find('em').removeClass('selected');
                        MainScene.removeModels([{
                            url: url, name: name
                        }]);
                    }
                    break;
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

    function ModelOrganization(DM, JZ, Com, xzqh_meta, index_gl) {
        var com_xhd = null;
        var com_tl = [];
        for (var i = 0; i < DM.length; i++) {
            var na = DM[i].name;
            if (na.indexOf('_') === -1) {
                com_xhd = DM[i];
                continue;//排除信号灯
            }
            if (na.indexOf("TL") !== -1) {
                com_tl.push(DM[i]);
                continue;//排除铁路
            }
            var qh = na.split('_')[0];
            var meta = xzqh_meta[qh];
            var tit = na.replace(qh, meta.mc).replace("DM", '地面').replace("JT", "交通");
            meta.DM.models.push({name: na, url: DM[i].path + "/config"});
            layerTree.add(index_gl++, meta.DM.index, tit +
                '<span id="' + DM[i].path + "/config" + '" class="' + na + '"><em class="selected"></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
        }
        for (var j = 0; j < JZ.length; j++) {
            var na = JZ[j].name;
            var qh = na.split('_')[0];
            var meta = xzqh_meta[qh];
            var tit = na.replace(qh, meta.mc).replace("JZ_", '');
            meta.JZ.models.push({name: na, url: JZ[j].path + "/config"});
            layerTree.add(index_gl++, meta.JZ.index, tit +
                '<span id="' + JZ[j].path + "/config" + '" class="' + na + '"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
        }
        for (var h = 0; h < Com.length; h++) {
            var na = Com[h].name;
            var qh = na.split('_')[0];
            var meta = xzqh_meta[qh];
            var tit = Config.ModelsScp[na.split('_')[1]];
            meta.Com.models.push({name: na, url: Com[h].path + "/config"});
            layerTree.add(index_gl++, meta.Com.index, tit +
                '<span id="' + Com[h].path + "/config" + '" class="' + na + '"><em></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false
            );
        }
        xzqh_meta.XHD = {index: index_gl, name: com_xhd.name, url: com_xhd.path + "/config"};
        layerTree.add(index_gl++, 0,
            '信号灯<span id="' + com_xhd.path + "/config" + '" class="' + com_xhd.name + '"><em class="selected"></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
        for (var k = 0; k < com_tl.length; k++) {
            xzqh_meta[com_tl[k].name] = {index: index_gl++, name: com_tl[k].name, url: com_tl[k].path + "/config"};
            let name = com_tl[k].name.replace('TL_', '铁路');
            layerTree.add(index_gl++, 0,
                name + '<span id="' + com_xhd.path + "/config" + '" class="' + com_tl[k].name + '"><em class="selected"></em></span>', '', '', '', 'images/layer.png', 'images/layer.png', false);
        }

    }


    return {
        init: init
    }
});