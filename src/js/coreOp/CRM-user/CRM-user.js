//实例化
define(function(require, exports, module) {

    var app = BI.app,
        util = BI.util;

    //页面筛选逻辑类
    var PageFilter = require('../online/pagefilter');
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

        init: function() { //初始化

            var me = this;

            $("#tip_board").html($('#tiptemplate').html());


            $(".timetype").append($(helpObject.strForOnLine)).css('position', 'relative');


            $('.icon:eq(1)').hover(function() {

                console.log(11);

                $('.helps').css("display", "block"); //粒度后面的帮助信息

            }, function() {

                $('.helps').css("display", "none");

            });

            me.lineChart = echarts.init(document.getElementById('chartarea')); //初始化图表


            me.charttype = 0; //通过获取相应的charttype值来进行相应的配置来进行图表的渲染;

            me.formatdata = null; //格式化

            me.itemLength = $('.chartarea-btns button').length; //折线图的切换按钮的个数;
            //图表切换菜单
            $('.chartarea-btns button').on('click', function() {
                var $this = $(this);
                me.charttype = $this.attr('data-type');
                $this.addClass('active').siblings().removeClass('active');


                var title = "";

                switch ($this.attr('data-type')) {

                    case "0":
                        title = "CRM购买用户数趋势";
                        break;
                    case "1":
                        title = "CRM开通用户数趋势"
                        break;
                    case "2":
                        title = "CRM在线用户数趋势";
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

            //sort排序
            $('.olsort').on('click', function(e) {
                var $target = $(e.currentTarget);
                var index = $target.attr('data-index');
                $('.p-online th').each(function() {
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
                $('tbody').html(domstr);
            });
        },

        //根据筛选信息获取数据
        refresh: function(info, dimensionname, dimension) {
            loadScreen.start();
            var me = this;


            function check() {


                $(".searchinfo,.reset").removeAttr("disabled").css({
                    "backgroundColor": "#FAAC3E"
                });

                var fdata = me.formatdata = translate.format(actEntData, dimension, me.itemLength); //整理数据

                me.tabledata = fdata.tablelist;

                utils.addCommaForOp(me.tabledata, 2);

                var domstr = tbodytem({
                    'tbody': me.tabledata
                });

                $('tbody').html(domstr);

                me.lineChart.clear(); //清除原有实例
                me.lineChart.setOption(JSON.parse(JSON.stringify(fdata.options[me.charttype])))

                $('.p-online th').removeClass('asc des');

            }

            //获取数据
            app.api({
                'url': 'operation/crmuser/all',
                'data': info,
                'success': function(resp) {
                    if (!loadScreen.end()) return;

                    if (typeof resp.value == 'undefined') {

                        $(".searchinfo,.reset").removeAttr("disabled").css({
                            "backgroundColor": "#FAAC3E"
                        });
                        return;
                    }


                    if (resp.success) {
                        actEntData = resp.value.model; //获取企业数据
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
            window.open(BI.API_PATH + '/operation/crmuser/down?' + $.param(pageFilter.getDownloadInfo()));
        }
    }
});