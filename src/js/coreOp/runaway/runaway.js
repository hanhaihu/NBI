//实例化
define(function(require, exports, module) {

    var app = BI.app,
        util = BI.util;

    var PageFilter = require('../increased/pagefilter');
    var translate = require('./translate');

    var tbodytem = _.template(require('../online/template.html'));

    var helpObject = require('../../commModule/helpInfo.js');
    var loadScreen = new(require('../../commModule/loadScreen.js'))(app);
    var utils = require('../../commModule/utils.js');


    //流失页面
    function RunAway() {
        this.init.apply(this, arguments);
    }
    RunAway.prototype = {

        //初始化
        init: function() {

            var me = this;


            $("#tip_board").html($('#tiptemplate').html());



            $(".timetype").append($(helpObject.strForOnLine)).css('position', 'relative');


            $('.icon:eq(1)').hover(function() {

                console.log(11);

                $('.helps').css("display", "block"); //粒度后面的帮助信息

            }, function() {

                $('.helps').css("display", "none");

            });

            //初始化图表
            me.lineChart = echarts.init(document.getElementById('chartarea'));
            me.charttype = 0;
            me.formatdata = null;

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
                        title = "流失用户数趋势";
                        break;
                    case "1":
                        title = "流失企业数趋势"
                        break;
                    default:

                }

                if (me.formatdata) {
                    me.lineChart.clear();
                    me.formatdata.options[me.charttype].title.text = title;
                    me.lineChart.setOption(JSON.parse(JSON.stringify(me.formatdata.options[me.charttype])));
                }
            })

            $(window).on('resize', function() {
                me.lineChart.resize();
            });

            $('.downloads button').on('click', function() {
                me.download && me.download();
            });

            //总览排序
            $('.runsorta').on('click', function(e) {
                var $target = $(e.currentTarget);
                var index = $target.attr('data-index');
                $('th').each(function() {
                    if (this != e.currentTarget) {
                        $(this).removeClass('asc des');
                    }
                })
                if ($target.hasClass('asc')) {
                    $target.removeClass('asc').addClass('des');
                    me.tabledataview.sort(function(a, b) {
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
                    me.tabledataview.sort(function(a, b) {
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
                    'tbody': me.tabledataview
                });
                $('.tableoverview').html(allstr);
            });

            //总数据排序
            $('.runsortb').on('click', function(e) {
                var $target = $(e.currentTarget);
                var index = $target.attr('data-index');
                $('.p-runaway th').each(function() {
                    if (this != e.currentTarget) {
                        $(this).removeClass('asc des');
                    }
                })
                if ($target.hasClass('asc')) {
                    $target.removeClass('asc').addClass('des');
                    me.tabledata.sort(function(a, b) {

                        if (index == 0) {

                            return b[index].localeCompare(a[index]); //时间按照字符串排序

                        } else {
                            if (a[index].indexOf("%") > 0) {

                                var numa = parseFloat(a[index].toString().replace(/[\%\-]/g, '')),
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
                    me.tabledata.sort(function(a, b) {
                        if (index == 0) {
                            return a[index].localeCompare(b[index]); //时间按照字符串排序

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
                var domstr = tbodytem({
                    'tbody': me.tabledata
                });
                $('.tabledetail').html(domstr);
            });
        },

        //根据筛选信息获取数据
        refresh: function(info, dimensionname, dimension) {
            loadScreen.start(3);
            var me = this;

            console.log('refresh');

            var state = {
                'a': false,
                'b': false
            }

            var pinfo = util.clone(info);
            pinfo['showType'] = -1;
            pinfo[dimensionname] = '';

            var singledata, //分维度数据
                alldata; //总数居

            //
            function check() {
                if (state.a && state.b) {
                    console.log('数据获取完毕');

                    $(".searchinfo,.reset").removeAttr("disabled").css({
                        "backgroundColor": "#FAAC3E"
                    });

                    var fdata = me.formatdata = translate.format(singledata, alldata, dimension);
                    me.tabledata = fdata.tablelist;

                    utils.addCommaForOp(me.tabledata, 2);
                    var domstr = tbodytem({
                        'tbody': me.tabledata
                    });
                    $('.tabledetail').html(domstr);

                    me.lineChart.clear(); //清除原有实例
                    me.lineChart.setOption(JSON.parse(JSON.stringify(fdata.options[me.charttype])));

                    var alltabledata = me.tabledataview = translate.formatall(singledata, alldata, dimension);

                    utils.addCommaForOp(me.tabledataview, 1);
                    var allstr = tbodytem({
                        'tbody': me.tabledataview
                    });
                    $('.tableoverview').html(allstr);

                    $('.p-runaway th').removeClass('asc des');
                }
            }

            //获取单独数据
            app.api({
                'url': 'operation/wastage/userent',
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
            })

            //获取全数据
            app.api({
                'url': 'operation/wastage/userent',
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
            })

            var $acc = $('.tableacc');
            //获取累计数据
            app.api({
                'url': 'operation/wastage/total',
                'data': {
                    'end': pinfo.end
                },
                'success': function(data) {
                    if (!loadScreen.end()) return;
                    console.warn('acc');
                    console.warn(data);
                    if (data.success) {
                        var model = data.value.model;
                        $acc.find('td').eq(0).text(model.totalWastageUser.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
                            return s + ','
                        }));
                        $acc.find('td').eq(1).text(model.totalWastageUserPercent);
                        $acc.find('td').eq(2).text(model.totalWastageEnterprise.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
                            return s + ','
                        }));
                        $acc.find('td').eq(3).text(model.totalWastageEnterprisePercent);
                    }
                }
            })
        }
    }
    exports.init = function() {

        console.log('init');
        var runAway = new RunAway();

        //筛选框
        var pageFilter = new PageFilter();

        pageFilter.refresh = function(info, target, dimensions) {
            runAway.refresh(info, target, dimensions);
        }

        pageFilter.ready = function(info, target, dimensions) {
            runAway.refresh(info, target, dimensions);
        }

        //
        runAway.download = function() {
            window.open(BI.API_PATH + '/operation/wastage/down?' + $.param(pageFilter.getDownloadInfo()));
        }
    }
});