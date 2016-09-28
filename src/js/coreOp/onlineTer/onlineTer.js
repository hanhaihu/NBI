define(function(require, exports, module) {
    exports.init = function() {
        var sTableData = [{
            'thead': [
                '终端类型',
                '在线用户数量',
                '在线企业数量',
                '平均在线人数',
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '终端类型',
                '在线用户数量',
                '在线企业数量',
                '平均在线人数',
            ],
            'tbody': []
        }];

        var $el = exports.$el; //每一个js 都得这样写，否则就会报错;

        var app = BI.app; //app.api 为封装后的ajax的调用方法

        require('../../commModule/listModel.js'); //引入列表模板

        var chartOption = require('./chart.js'); // 引入Echarts配置文件

        var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期控件配置文件

        var helpObject = require('../../commModule/helpInfo.js');

        var loadScreen = new(require('../../commModule/loadScreen.js'))(app);

        var utils = require('../../commModule/utils.js');

        function Session() {

            this.init.apply(this, arguments);
        }

        Session.prototype = {
            init: function() {
                var me = this;
                me.initIframe(); //初始化下载form
                me.initDateWidget(); //初始化时间插件
                me.initChange(); // 初始化日周月切换按钮
                me.showHelp();
                me.getCheck(); //点击查看时请求数据
                me.loadSource(); //进入页面时请求数据
                me.initSessionType();
                me.initReset(); //点击重置按钮时的动作;
                me.initDownLoad();
                $("#tip_board").html($('#tiptemplate').html());
            },
            getCheck: function() { //点击查看按钮时重新刷新
                var me = this;
                $('.search').click(function() {
                    me.flag = true;
                    me.rstButtoStatus($(this));
                    me.resetData();
                    me.loadSource();
                });
            },
            flag: false,
            a: false,
            b: false,
            initChange: function() { //初始化日周月切换按钮
                var me = this;
                $('.timetype button').on('click', function(ev) {
                    ev.preventDefault();
                    $(this).addClass('active').siblings().removeClass('active');
                });
            },
            showHelp: function() {

                $(".timetype").append($(helpObject.strForOnLine)).css('position', 'relative');

                $('.icon:eq(1)').hover(function() {


                    $('.helps').css("display", "block").parent('#tipBoard').css('left', '100%');; //根据hash值自动加载帮助信息

                }, function() {

                    $('.helps').css("display", "none");

                });
            },
            initReset: function() {
                var me = this;

                $(".reset").click(function() {

                    me.initDateWidget();

                    $(".timetype").find(".active").removeClass("active");

                    $(".timetype button[data-timetype=0]").addClass("active");

                    $(".sessiontype").find('.active').removeClass("active");

                    $(".sessiontype button[data-sessiontype=0]").addClass("active");

                    me.resetData();
                    me.rstButtoStatus($(this));
                    me.loadSource();
                });
            },
            resetData: function() {
                sTableData = [{
                    'thead': [
                        '终端类型',
                        '在线用户数量',
                        '在线企业数量',
                        '平均在线人数',
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '终端类型',
                        '在线用户数量',
                        '在线企业数量',
                        '平均在线人数',
                    ],
                    'tbody': []
                }];
            },
            initSessionType: function() {
                var me = this;
                $('.serIndictor button').on('click', function() {
                    $(this).addClass('active').siblings().removeClass('active');
                    me.initChart();
                });
            },

            initIframe: function() {

                if ($('.formClass').length > 0) return;
                $('body').append(
                    "<form  class='formClass' action=" + BI.API_PATH + "/business/download/download method='POST' enctype='multipart/form-data'  id='formdown' style='display:none;'>" +
                    "<input type='text' name='data'>" +
                    "<input type='text' name='filename'>" +
                    "<button type='submit' id='submit'></button>" +
                    "</form>"
                );
            },

            initChart: function() {
                var me = this;
                var indicator = parseInt($('.serIndictor .active').attr('data-sessiontype'));
                me.initBarChart(indicator, me.pillarChart);
                me.initLineChart(indicator, me.lineChart);
            },

            initBarChart: function(indicator, pillarChart) {

                var chartTitle = {
                    '0': '在线用户数量分终端数据对比',
                    '1': '在线企业数量分终端数据对比',
                    '2': '平均在线人数分终端数据对比'
                }

                console.log(sTableData);

                var data = sTableData[0].tbody.slice(0);



                var barData = []; //存储数据;

                var strData = []; //存储不为空值的字段

                var wrongData = []; //存储空值的"-";

                var wrongStr = []; //存储为空值的字段;

                for (var i = 0; i < data.length; i++) {


                    if (data[i][indicator + 1] == '-') {

                        wrongData.push(data[i][indicator + 1]);

                        wrongStr.push('&' + data[i][0]);

                    } else {

                        barData.push(data[i][indicator + 1]);

                        strData.push('&' + data[i][0]);
                    }
                }

                for (var q = 0; q < barData.length; q++) {


                    barData[q] = (barData[q] + strData[q]); //把数字和类目拼装在一起
                }

                barData.sort(function(a, b) {
                    return parseFloat(a) - parseFloat(b); //拼装后进行排序
                });

                var backbarData = barData.slice(0);

                for (var s = 0; s < barData.length; s++) {

                    barData[s] = (barData[s].split('&')[1]); //把字符串中的数字去掉

                }

                for (var m = 0; m < barData.length; m++) {


                    backbarData[m] = backbarData[m].split('&')[0]; //把数字中的字符串去掉
                }

                chartOption.optionPillar.series[0].barWidth = "30";

                chartOption.optionPillar.series[0].data = (wrongData.concat(backbarData));

                console.log(chartOption.optionPillar.series[0].data);

                if (wrongStr[0] == "&-" && (barData.length == 0)) {

                    chartOption.optionPillar.yAxis.data = [""];

                } else {

                    chartOption.optionPillar.yAxis.data = (wrongStr.concat(barData));

                }

                chartOption.optionPillar.title.text = chartTitle[indicator.toString()];

                pillarChart.setOption(chartOption.optionPillar);
            },

            initLineChart: function(indicator, lineChart) {

                utils.settleDataForOnLine(indicator, lineChart, chartOption, sTableData);

                chartOption.option.title.text = "在线指标分终端类型数据趋势";

                lineChart.setOption(chartOption.option);
            },
            initDateWidget: function() { //初始化时间插件
                var me = this;
                dateConfig.run();
            },
            getSearch: function() {
                var me = this;
                var obj = {};
                obj.start = me.getTime().start;
                obj.end = me.getTime().end; //时间段
                obj.type = me.getTimeType();
                return obj;
            },

            getTime: function() {
                var timeDur = $('#date').val().split('-'); //获取日期参数
                return {
                    start: new Date(timeDur[0]).getTime(),
                    end: new Date(timeDur[1]).getTime()
                };
            },

            getTimeType: function() { //获取日,周,月标

                var typeValue = $('.timetype').children('.active').attr('data-timetype');
                return parseInt(typeValue);
            },

            loadSource: function() {
                var me = this;
                me.resetData();
                me.getTopChart(); // 顶部数据请求及渲染
                me.getBottomChart(); //底部数据请求及渲染
            },
            settleData: function(resp) { //整理第一个表的数据

                var me = this;

                var tbody = sTableData[0].tbody; //整理数据

                var columnArray = ['date', 'column0', 'column1', 'column2']; //在线用户数量   //在线企业数量     //平均在线人数


                if (resp.value.model.length == 0) {

                    sTableData[0].tbody = [
                        ['-', '-', '-', '-']
                    ]

                } else {

                    for (var i = 0; i < resp.value.model.length; i++) {

                        var array = [];

                        for (var m = 0; m < columnArray.length; m++) {


                            if (resp.value.model[i][columnArray[m]] == undefined) {

                                array[m] = '-';

                            } else {

                                array[m] = resp.value.model[i][columnArray[m]];

                            }
                        }

                        tbody.push(array);
                    }

                }

            },

            settleDataTwo: function(resp) { //整理第二个表的数据
                var me = this;

                var tbody = sTableData[1].tbody;

                var columnArray = ['column0', 'column1', 'column2'];


                if ($.isEmptyObject(resp.value)) {

                    sTableData[1].tbody = [
                        ['-', '-', '-', '-', '-']
                    ]

                } else {

                    for (var i = 0; i < resp.value.model.length; i++) {

                        var array = [];

                        for (var m = 0; m < columnArray.length; m++) {

                            if (resp.value.model[i][columnArray[m]] == undefined) {

                                array[m] = '-';

                            } else {

                                array[m] = resp.value.model[i][columnArray[m]];
                            }
                        }
                        array.unshift(resp.value.model[i].date.split('@')[1]);
                        array.unshift(resp.value.model[i].date.split('@')[0]);
                        tbody.push(array);
                    }
                }
            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;
                var tpQuery = me.getSearch();
                app.api({
                    url: 'operation/onlineterminal/total', //顶部图表数据的请求
                    type: 'POST',
                    data: tpQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        if (typeof resp.value == 'undefined') {
                            $(".search,.reset").removeAttr("disabled").css({
                                "backgroundColor": "#FAAC3E"
                            });
                            return
                        }

                        me.a = true;

                        me.settleData(resp);

                        var indicator = parseInt($('.serIndictor .active').attr('data-sessiontype'));

                        try {

                            var pillarChart = echarts.init(document.getElementById('pieTer'));


                        } catch (err) {


                            return;
                        }

                        var pillarChart = echarts.init(document.getElementById('pieTer'));

                        me.pillarChart = pillarChart; //避免重复初始化

                        window.onresize = pillarChart.resize; //初始化折线图

                        me.initBarChart(indicator, pillarChart);


                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#tableOneTer')); //渲染顶部图表

                            me.tableModule.renderData(utils.addComma(sTableData[0], 1));

                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData[0], 1));

                        }
                        me.checkStatus();

                    }
                });
            },
            getBottomChart: function() {
                loadScreen.start();
                var me = this;
                var btQuery = me.getSearch();
                app.api({
                    url: 'operation/onlineterminal/detail', //底部图表数据的请求和渲染;
                    type: 'POST',
                    data: btQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        if (typeof resp.value == 'undefined') {
                            $(".search,.reset").removeAttr("disabled").css({
                                "backgroundColor": "#FAAC3E"
                            });
                            return;
                        }

                        me.b = true;
                        me.settleDataTwo(resp);


                        var indicator = parseInt($('.serIndictor .active').attr('data-sessiontype'));

                        try {

                            var lineChart = echarts.init(document.getElementById('lineTer'));

                        } catch (err) {

                            return;

                        }

                        me.lineChart = lineChart; //避免重复初始化

                        window.onresize = lineChart.resize;

                        me.initLineChart(indicator, lineChart);

                        if (me.flag == false) {
                            me.tableModuleTwo = new TableModule($('#tableTwoTer')); //渲染底部图表
                            me.tableModuleTwo.renderData(utils.addComma(sTableData[1], 2));
                        } else {

                            me.tableModuleTwo.renderData(utils.addComma(sTableData[1], 2));
                        }
                        me.checkStatus();
                    }
                });
            },
            checkStatus: function() {
                var me = this;
                if (me.a == true && me.b == true) {

                    $(".search,.reset").removeAttr("disabled").css({
                        "backgroundColor": "#FAAC3E"
                    });
                }

            },
            rstButtoStatus: function(obj) {
                var me = this;
                me.a = false;
                me.b = false;

                obj.attr("disabled", "disabled").css({
                    "backgroundColor": "grey"
                });
            },

            initDownLoad: function() {
                var me = this;
                $('.download').eq(0).click(function() {
                    var array = [];
                    var $data = $('#formdown input[name=data]');
                    var $name = $('#formdown input[name=filename]');
                    array.push([
                        '终端类型',
                        '在线用户数量',
                        '在线企业数量',
                        '平均在线人数',
                    ]);
                    array = array.concat(
                        sTableData[0].tbody
                    );
                    $data.val(JSON.stringify(array));
                    $name.val('在线指标分终端数据对比');
                    $('#submit').click();
                });


                $('.download').eq(1).click(function() {

                    var array = [];
                    var $data = $('#formdown input[name=data]');
                    var $name = $('#formdown input[name=filename]');
                    array.push([
                        '日期',
                        '终端类型',
                        '在线用户数量',
                        '在线企业数量',
                        '平均在线人数',
                    ]);
                    array = array.concat(
                        sTableData[1].tbody
                    );
                    $data.val(JSON.stringify(array));
                    $name.val('在线指标分终端类型数据趋势');

                    $('#submit').click();
                });
            }
        }
        var session = new Session();
    }
});