//实例化
define(function(require, exports, module) {

    var app = BI.app,
        util = BI.util;

    //页面筛选逻辑类
    var PageFilter = require('./pagefilter');
    var translate = require('./translate');
    var tbodytem = _.template(require('../online/template.html'));

    var helpObject = require('../../commModule/helpInfo.js');
    var loadScreen = new(require('../../commModule/loadScreen.js'))(app);
    var utils = require('../../commModule/utils.js');

    //新增页面
    function PageIncrease() {
        this.init.apply(this, arguments);
    }
    PageIncrease.prototype = {


        //初始化
        init: function() {
            var me = this;

            $("#tip_board").html($('#tiptemplate').html());

            $(".timetype").append($(helpObject.strForOnLine)).css('position', 'relative');

            $('.icon:eq(1)').hover(function() {

                $('.helps').css("display", "block"); //粒度后面的帮助信息

            }, function() {

                $('.helps').css("display", "none");

            });

            //初始化图表
            me.lineChart = echarts.init(document.getElementById('chartarea'));

            me.charttype = 0; //当前图表类型
            me.formatdata = null; //格式化

            //图表切换菜单
            $('.chartarea-btns button').on('click', function() {

                if (me.switching) { //阻止连续切换
                    return;
                }
                window.setTimeout(function() {
                    me.switching = false;
                }, 600);

                me.switching = true;
                var $this = $(this);
                me.charttype = $this.attr('data-type');

                $this.addClass('active').siblings().removeClass('active');



                var title = "";

                switch ($this.attr('data-type')) {

                    case "0":
                        title = "新增注册用户数趋势";
                        break;
                    case "1":
                        title = "新增登录用户数趋势"
                        break;
                    case "2":
                        title = "新增注册企业数趋势";
                        break;

                    default:

                }

                if (me.formatdata) {
                    me.lineChart.clear();

                    me.formatdata.options[me.charttype].title.text = title;

                    me.lineChart.setOption(JSON.parse(JSON.stringify(me.formatdata.options[me.charttype])));
                }
            });
            $(window).on('resize', function() {
                me.lineChart.resize();
            });
            //<p class="download"><button>下载</button></p>



            //下载
            $('.downloads button').on('click', function() {
                me.download && me.download();
            });

            //汇总数据排序
            $('.incsorta').on('click', function(e) {
                var $target = $(e.currentTarget);
                var index = $target.attr('data-index');
                $('.p-increased th').each(function() {
                    if (this != e.currentTarget) {
                        $(this).removeClass('asc des');
                    }
                })
                if ($target.hasClass('asc')) {
                    $target.removeClass('asc').addClass('des');
                    me.zdata.sort(function(a, b) {

                        if (a[index].indexOf("%") > 0) {

                            var numa = parseFloat(a[index].toString().replace(/[\%\-]/g, '')),
                                numb = parseFloat(b[index].toString().replace(/[\%\-]/g, ''));

                        } else {

                            var numa = parseFloat(a[index].toString().replace(/,|\s/g, '')),
                                numb = parseFloat(b[index].toString().replace(/,|\s/g, ''));

                        }

                        return numb - numa;
                    });
                } else {
                    $target.removeClass('des').addClass('asc');
                    me.zdata.sort(function(a, b) {

                        if (a[index].indexOf("%") > 0) {

                            var numa = parseFloat(a[index].toString().replace(/[\%\-]/g, '')),
                                numb = parseFloat(b[index].toString().replace(/[\%\-]/g, ''));

                        } else {

                            var numa = parseFloat(a[index].toString().replace(/,|\s/g, '')),
                                numb = parseFloat(b[index].toString().replace(/,|\s/g, ''));
                        }

                        return numa - numb;
                    });
                }

                var allstr = tbodytem({
                    'tbody': me.zdata
                });
                $('.tableoverview').html(allstr);
            })


            //详细数据排序
            $('.incsortb').on('click', function(e) {
                var $target = $(e.currentTarget);
                var index = $target.attr('data-index');
                $('.p-increased th').each(function() {
                    if (this != e.currentTarget) {
                        $(this).removeClass('asc des');
                    }
                })
                if ($target.hasClass('asc')) {
                    $target.removeClass('asc').addClass('des');
                    me.alltabledata.sort(function(a, b) {

                        if (index == 0) {

                            return b[index].localeCompare(a[index]); //时间按照字符串排序

                        } else {

                            if (a[index].indexOf("%") > 0) {

                                var numa = parseFloat(a[index].toString().replace(/[\%\-]/g, '')), //
                                    numb = parseFloat(b[index].toString().replace(/[\%\-]/g, ''));

                            } else {

                                var numa = parseFloat(a[index].toString().replace(/,|\s/g, '')),
                                    numb = parseFloat(b[index].toString().replace(/,|\s/g, ''));
                            }

                            return numb - numa;
                        }
                    });
                } else {
                    $target.removeClass('des').addClass('asc');

                    me.alltabledata.sort(function(a, b) {

                        if (index == 0) {
                            return a[index].localeCompare(b[index]);

                        } else {

                            if (a[index].indexOf("%") > 0) {

                                var numa = parseFloat(a[index].toString().replace(/[\%\-]/g, '')),
                                    numb = parseFloat(b[index].toString().replace(/[\%\-]/g, ''));

                            } else {

                                var numa = parseFloat(a[index].toString().replace(/,|\s/g, '')),
                                    numb = parseFloat(b[index].toString().replace(/,|\s/g, ''));
                            }

                            return numa - numb;
                        }
                    });
                }

                var allstr = tbodytem({
                    'tbody': me.alltabledata
                });
                $('.tabledetail').html(allstr);
            });

        },

        //根据筛选信息获取数据
        refresh: function(info, dimensionname, dimension) {
            loadScreen.start(2);
            var me = this;

            var state = {
                'a': false,
                'b': false
            }

            var pinfo = util.clone(info);
            pinfo['showType'] = -1;
            pinfo[dimensionname] = '';

            var singledata, //分维度数据
                alldata; //总数据

            //
            function check() {
                if (state.a && state.b) {
                    console.log('数据获取完毕');

                    $(".searchinfo,.reset").removeAttr("disabled").css({
                        "backgroundColor": "#FAAC3E"
                    });

                    var fdata = me.formatdata = translate.format(singledata, alldata, dimension);
                    me.alltabledata = fdata.tablelist;

                    utils.addCommaForOp(me.alltabledata, 2);

                    var domstr = tbodytem({
                        'tbody': me.alltabledata
                    });

                    $('.tabledetail').html(domstr);


                    me.zdata = translate.formatall(singledata, alldata, dimension);

                    utils.addCommaForOp(me.zdata, 1);

                    var allstr = tbodytem({
                        'tbody': me.zdata
                    });
                    $('.tableoverview').html(allstr);

                    console.log(JSON.stringify(fdata.options[me.charttype]));
                    me.lineChart.clear(); //清除原有实例
                    me.lineChart.setOption(JSON.parse(JSON.stringify(fdata.options[me.charttype])));

                    $('.p-increased th').removeClass('asc des');
                }
            }

            //获取单独数据
            app.api({
                'url': 'operation/increase/userent',
                'data': info,
                'success': function(data) {
                    if (!loadScreen.end()) return;
                    if (typeof data.value == 'undefined') {

                        $(".searchinfo,.reset").removeAttr("disabled").css({
                            "backgroundColor": "#FAAC3E"
                        });

                        return;
                    }



                    if (data.success) {

                        state.a = true;
                        singledata = data.value.model;
                        check();
                    }
                }
            });

            //获取全数据
            app.api({
                'url': 'operation/increase/userent',
                'data': pinfo,
                'success': function(data) {
                    if (!loadScreen.end()) return;
                    if (typeof data.value == 'undefined') {

                        $(".searchinfo,.reset").removeAttr("disabled").css({
                            "backgroundColor": "#FAAC3E"
                        });

                        return;
                    }

                    if (data.success) {

                        state.b = true;
                        alldata = data.value.model;
                        check();
                    }
                }
            });
        }
    };

    exports.init = function() {
        //新增页面
        var pageIncrease = new PageIncrease();

        //筛选框
        var pageFilter = new PageFilter();

        pageFilter.refresh = function(info, target, dimensions) {
            pageIncrease.refresh(info, target, dimensions);
        }

        pageFilter.ready = function(info, target, dimensions) {
            pageIncrease.refresh(info, target, dimensions);
        }

        //下载
        pageIncrease.download = function() {


            window.open(BI.API_PATH + '/operation/increase/down?' + $.param(pageFilter.getDownloadInfo()));
        }
    }
});