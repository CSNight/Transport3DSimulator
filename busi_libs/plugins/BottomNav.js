define(function (require) {
    var init = function () {
        setHtmlFrame();
    };
    var setHtmlFrame = function () {
        var LeftPanel = require('busi_libs/plugins/LeftPanel');
        var html = '<div class="bbot-navs"><ul>';
        html += '<li class="one"><a href="javascript:"><i class="iconfont icon-qiche"></i></a></li>';
        html += '<li class="two"><a href="javascript:"><i class="iconfont icon-c-gps"></i></a></li>';
        html += '<li class="thr"><a href="javascript:"><i class="iconfont icon-diqiu"></i></a></li>';
        html += '</ul></div>';
        $('.map-container').append(html);
        $('.left-panel').hide();
        $('.bbot-navs ul li.one').on('click', function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active')
            } else {
                $(this).removeClass('active')
            }
            if (!$(this).hasClass('running')||$('.bbot-navs ul li.two').hasClass('running')) {
                LeftPanel.init('sim');
                $(this).addClass('running');
                setClose('.lp-head .close', '.left-panel', '.bbot-navs ul li:first-child');
                $('.bbot-navs ul li.two').removeClass('running');
            }
            $('.bbot-navs ul li.two').removeClass('active');
            $(this).hasClass('active') ? $('.left-panel').show() : $('.left-panel').hide();
        });
        $('.bbot-navs ul li.two').on('click', function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active')
            } else {
                $(this).removeClass('active')
            }
            if (!$(this).hasClass('running')||$('.bbot-navs ul li.one').hasClass('running')) {
                LeftPanel.init('stream');
                $(this).addClass('running');
                setClose('.lp-head .close', '.left-panel', '.bbot-navs ul li:nth-child(2)');
                $('.bbot-navs ul li.one').removeClass('running');
            }
            $('.bbot-navs ul li.one').removeClass('active');
            $(this).hasClass('active') ? $('.left-panel').show() : $('.left-panel').hide();
        });
        $('.bbot-navs ul li.thr').click(function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active')
            } else {
                $(this).removeClass('active')
            }
            $(this).hasClass('active') ? mapOn() : mapOff();
        });

        function setClose(selector, target, parent) {
            $(selector).on('click', function () {
                $(target).hide();
                if (parent) {
                    $(parent).removeClass('active');
                }
            });
        }

        setClose('.lp-head .close', '.left-panel', '.bbot-navs ul li:first-child');
    };

    function mapOn() {
        var base_map = require('busi_libs/viewer/BaseMap');
        $('.scene-main').css('width', "50%");
        $('.map-main').css('width', "50%");
        $('.map-main').css('display', 'block');
        base_map.init();
    }

    function mapOff() {
        $('.scene-main').css('width', "100%");
        $('.map-main').css('display', 'none');
    }

    return {
        init: init
    }
});