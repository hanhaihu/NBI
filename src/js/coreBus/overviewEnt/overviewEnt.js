define(function(require, exports, module) {
    exports.init = function() {
        var sTableData = {
            'thead': [
                '日期',
                '企信',
                '协同',
                'CRM',
                '支付',
                '考勤助手',
                '外勤助手',
                'PK助手',
                '项目管理助手',
                '工资助手',
                '战报助手',
                '会议助手',
                '培训助手'
            ],
            'tbody': []
        };
        var $el = exports.$el; //每一个js 都得这样写，否则就会报错;

        var app = BI.app; //app.api 为封装后的ajax的调用方法

        require('../../commModule/listModel.js'); //引入列表模板

        var chartOption = require('./chart.js'); // 引入Echarts配置文件

        var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期控件配置文件

        var helpStr = require('../../commModule/helpInfo.js');
        var loadScreen = new(require('../../commModule/loadScreen.js'))(app);

        var utils = require('../../commModule/utils.js');


        function Session() {

            this.init.apply(this, arguments);
        }

        Session.prototype = {
            init: function() {
                var me = this;
                me.initIframe(); //初始化下载form
                me.ininButtonChange();
                me.initDateWidget(); //初始化时间插件
                me.showHelp();
                me.initChange(); // 初始化日周月切换按钮
                me.getCheck(); //点击查看时请求二次数据
                me.loadSource(me.flag); //进入页面时二次请求
                me.initReset(); //点击重置按钮时的动作

                $("#tip_board").html($('#tiptemplate').html());
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
            ininButtonChange: function() {
                var me = this;

                $('.chartarea-btns button').click(function() {

                    if ($(this).index() == 0 && $(this).hasClass('active') !== true) {
                        me.getTopChart();
                    }
                    if ($(this).index() == 1 && $(this).hasClass('active') !== true) {
                        me.getTwoChart();
                    }
                    if ($(this).index() == 2 && $(this).hasClass('active') !== true) {
                        me.gettreeChart();
                    }
                    if ($(this).index() == 3 && $(this).hasClass('active') !== true) {
                        me.getFourChart();
                    }

                    $('.chartarea-btns button').removeClass('active');
                    $(this).addClass('active');

                });
            },
            showHelp: function() {

                $(".timetype").append($(helpStr.strForZhh)).css('position', 'relative');

                $('.icon:eq(1)').hover(function() {

                    $('.helps').css("display", "block"); //根据hash值自动加载帮助信息

                }, function() {

                    $('.helps').css("display", "none");

                });
            },
            getCheck: function() { //点击查看按钮时重新刷新
                var me = this;
                $('.search').click(function() {
                    me.rstButtoStatus($(this));
                    me.resetData();
                    me.flag = true;
                    me.loadSource(me.flag);
                });
            },
            flag: false,
            a: false,
            title: '功能使用次数',
            initChange: function() { //初始化日周月切换按钮
                var me = this;
                $('.timetype button').on('click', function(ev) {
                    ev.preventDefault();
                    $(this).addClass('active').siblings().removeClass('active');

                });
            },
            initReset: function() {
                var me = this;

                $(".reset").click(function() {

                    me.initDateWidget();

                    $("#removedata").val("1");
                    $("#enterpriseType").val("all");
                    $('#establishedAccount').val('all');
                    $('#area').val('all');
                    $('#source').val('all');
                    $('#activity').val('all');
                    $('#industry').val('all');

                    $(".timetype").find(".active").removeClass("active");

                    $(".timetype button[data-timetype=0]").addClass("active");
                    me.resetData();
                    me.rstButtoStatus($(this));
                    me.loadSource(true);
                });
            },
            resetData: function() {
                sTableData = {
                    'thead': [
                        '日期',
                        '企信',
                        '协同',
                        'CRM',
                        '支付',
                        '考勤助手',
                        '外勤助手',
                        'PK助手',
                        '项目管理助手',
                        '工资助手',
                        '战报助手',
                        '会议助手',
                        '培训助手'
                    ],
                    'tbody': []
                };
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
                // obj.payType = ($('#payStatus').val() == 'all' ? '' : $('#payStatus').val()); //付费类型
                obj.ignoreFx = parseInt(($('#removedata').val())); //是否分享
                obj.establishedAccount = ($('#establishedAccount').val() == 'all' ? '' : $('#establishedAccount').val());
                obj.area = ($('#area').val() == 'all' ? '' : $('#area').val());
                obj.source = ($('#source').val() == 'all' ? '' : $('#source').val());
                obj.activity = ($('#activity').val() == 'all' ? '' : $('#activity').val());
                obj.industry = ($('#industry').val() == 'all' ? '' : $('#industry').val());
                obj.enterpriseType = ($('#enterpriseType').val() == 'all' ? '' : $('#enterpriseType').val());
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

            loadSource: function(flag) { //这里要请求两此数据，和一次筛选区的键值对;
                var me = this;

                if (!flag) {

                    me.getSearchInfo(); //只有当第一次进入页面的时候才会进行筛选去数据的填充，如果是点击查看按钮那么是不会进行筛选区的填充的。

                } else {

                }
                $('.chartarea-btns button').each(function(index, item) {
                    if ($(item).hasClass('active')) {
                        console.log($(this).data('type'));
                        switch ($(this).data('type')) {
                            case 0:
                                {
                                    me.getTopChart();
                                    break;
                                }
                            case 1:
                                {
                                    me.getTwoChart();
                                    break;
                                }
                            case 2:
                                {
                                    me.gettreeChart();
                                    break;
                                }
                            case 3:
                                {
                                    me.getFourChart();
                                    break;
                                }
                        }
                    }
                });
                // me.getTopChart(); // 顶部数据请求及渲染

            },
            settleData: function(resp) { //整理第一个表的数据

                var me = this;

                sTableData.tbody = [];

                var tbody = sTableData.tbody; //整理数据

                var dataArray = ['date', 'column0', 'column1', 'column2', 'column3', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12'];

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    for (var j = 0; j < dataArray.length; j++) {

                        if (resp.value.model[i][dataArray[j]] == null) {

                            if (resp.value.model[i].total == 'total' && dataArray[j] == "date") {
                                array.push('总数');
                                continue;
                            }
                            array.push('-');

                        } else {

                            array.push(resp.value.model[i][dataArray[j]]);

                        }
                    }

                    tbody.push(array);
                }

            },
            getSearchInfo: function() {
                var me = this;

                app.api({
                    url: "/operation/dimension/all", //筛选区域的值得请求;
                    type: "POST",
                    dataType: 'json',
                    success: function(object) {

                        var fragmentOne = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[17].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[17][i].dimension;
                            option.setAttribute('value', object.value.model[17][i].value);

                            fragmentOne.appendChild(option);
                        }
                        $('#enterpriseType').append($(fragmentOne));

                        var fragmentTwo = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[16].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[16][i].dimension;
                            option.setAttribute('value', object.value.model[16][i].value);

                            fragmentTwo.appendChild(option);
                        }
                        $('#establishedAccount').append($(fragmentTwo));

                        var fragmentThree = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[0].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[0][i].dimension;
                            option.setAttribute('value', object.value.model[0][i].value);

                            fragmentThree.appendChild(option);
                        }
                        $('#area').append($(fragmentThree));

                        var fragmentFour = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[6].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[6][i].dimension;
                            option.setAttribute('value', object.value.model[6][i].value);

                            fragmentFour.appendChild(option);
                        }
                        $('#source').append($(fragmentFour));

                        var fragmentFive = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[15].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[15][i].dimension;
                            option.setAttribute('value', object.value.model[15][i].value);

                            fragmentFive.appendChild(option);
                        }
                        $('#activity').append($(fragmentFive));

                        var fragmentSix = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[1].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[1][i].dimension;
                            option.setAttribute('value', object.value.model[1][i].value);

                            fragmentSix.appendChild(option);
                        }
                        $('#industry').append($(fragmentSix));

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;
                var tpQuery = me.getSearch();

                app.api({
                    url: '/business/overview2/times', //顶部图表数据的请求
                    type: 'POST',
                    data: tpQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        me.a = true;
                        me.checkStatus();
                        if (!resp.success) return;
                        me.settleData(resp);

                        chartOption.option.title.text = '功能使用次数趋势';
                        $('#titleTable').html('功能使用次数');
                        chartOption.option.xAxis.data = [];
                        for (var i = 0; i < chartOption.option.series.length; i++) {
                            chartOption.option.series[i].data = [];
                        }
                        sTableData.tbody.reverse();
                        chartOption.option.yAxis = {
                            type: 'value',
                        };
                        chartOption.option.tooltip = {
                            trigger: 'axis',
                            formatter: function(params) {
                                var html = params[0].name + '<br/>';
                                var htmlTwo = "<div style='text-align:left'>";
                                for (var i = 0; i < params.length; i++) {
                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + params[i].value + "<br/>")
                                }
                                html += htmlTwo;
                                html += "</div>";
                                return html;
                            }
                        };

                        console.log(sTableData.tbody);
                        for (var i = 0; i < sTableData.tbody.length; i++) {
                            chartOption.option.xAxis.data.push(sTableData.tbody[i][0]);
                            chartOption.option.series[0].data.push(sTableData.tbody[i][1]);
                            chartOption.option.series[1].data.push(sTableData.tbody[i][2]);
                            chartOption.option.series[2].data.push(sTableData.tbody[i][3]);
                            chartOption.option.series[3].data.push(sTableData.tbody[i][4]);
                            chartOption.option.series[4].data.push(sTableData.tbody[i][5]);
                            chartOption.option.series[5].data.push(sTableData.tbody[i][6]);
                            chartOption.option.series[6].data.push(sTableData.tbody[i][7]);
                            chartOption.option.series[7].data.push(sTableData.tbody[i][8]);
                            chartOption.option.series[8].data.push(sTableData.tbody[i][9]);
                            chartOption.option.series[9].data.push(sTableData.tbody[i][10]);
                            chartOption.option.series[10].data.push(sTableData.tbody[i][11]);
                            chartOption.option.series[11].data.push(sTableData.tbody[i][12]);
                        }
                        sTableData.tbody.reverse();
                        var lineChart = echarts.init(document.getElementById('lineEnt'));

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);

                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染图表
                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        }

                        // me.checkStatus();
                    }
                });
            },
            getTwoChart: function() {
                loadScreen.start();
                var me = this;
                var tpQuery = me.getSearch();

                app.api({
                    url: '/business/overview2/enterprise', //顶部图表数据的请求
                    type: 'POST',
                    data: tpQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        me.a = true;
                        me.checkStatus();
                        if (!resp.success) return;
                        me.settleData(resp);

                        chartOption.option.title.text = '功能使用企业数趋势';
                        $('#titleTable').html('功能使用企业数');
                        chartOption.option.xAxis.data = [];
                        for (var i = 0; i < chartOption.option.series.length; i++) {
                            chartOption.option.series[i].data = [];
                        }
                        sTableData.tbody.reverse();
                        chartOption.option.yAxis = {
                            type: 'value',
                        };
                        chartOption.option.tooltip = {
                            trigger: 'axis',
                            formatter: function(params) {
                                var html = params[0].name + '<br/>';
                                var htmlTwo = "<div style='text-align:left'>";
                                for (var i = 0; i < params.length; i++) {
                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + params[i].value + "<br/>")
                                }
                                html += htmlTwo;
                                html += "</div>";
                                return html;
                            }
                        };
                        for (var i = 0; i < sTableData.tbody.length; i++) {
                            chartOption.option.xAxis.data.push(sTableData.tbody[i][0]);
                            chartOption.option.series[0].data.push(sTableData.tbody[i][1]);
                            chartOption.option.series[1].data.push(sTableData.tbody[i][2]);
                            chartOption.option.series[2].data.push(sTableData.tbody[i][3]);
                            chartOption.option.series[3].data.push(sTableData.tbody[i][4]);
                            chartOption.option.series[4].data.push(sTableData.tbody[i][5]);
                            chartOption.option.series[5].data.push(sTableData.tbody[i][6]);
                            chartOption.option.series[6].data.push(sTableData.tbody[i][7]);
                            chartOption.option.series[7].data.push(sTableData.tbody[i][8]);
                            chartOption.option.series[8].data.push(sTableData.tbody[i][9]);
                            chartOption.option.series[9].data.push(sTableData.tbody[i][10]);
                            chartOption.option.series[10].data.push(sTableData.tbody[i][11]);
                            chartOption.option.series[11].data.push(sTableData.tbody[i][12]);

                        }
                        sTableData.tbody.reverse();
                        var lineChart = echarts.init(document.getElementById('lineEnt'));

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);

                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染图表
                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        }


                    }
                });
            },
            gettreeChart: function() {
                loadScreen.start();
                var me = this;
                var tpQuery = me.getSearch();

                app.api({
                    url: '/business/overview2/average', //顶部图表数据的请求
                    type: 'POST',
                    data: tpQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        me.a = true;
                        me.checkStatus();
                        if (!resp.success) return;
                        me.settleData(resp);

                        chartOption.option.title.text = '企业平均使用次数趋势';
                        $('#titleTable').html('企业平均使用次数');
                        chartOption.option.xAxis.data = [];
                        for (var i = 0; i < chartOption.option.series.length; i++) {
                            chartOption.option.series[i].data = [];
                        }
                        sTableData.tbody.reverse();
                        chartOption.option.yAxis = {
                            type: 'value',
                        };
                        chartOption.option.tooltip = {
                            trigger: 'axis',
                            formatter: function(params) {
                                var html = params[0].name + '<br/>';
                                var htmlTwo = "<div style='text-align:left'>";
                                for (var i = 0; i < params.length; i++) {
                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + params[i].value + "<br/>")
                                }
                                html += htmlTwo;
                                html += "</div>";
                                return html;
                            }
                        };
                        for (var i = 0; i < sTableData.tbody.length; i++) {
                            chartOption.option.xAxis.data.push(sTableData.tbody[i][0]);
                            chartOption.option.series[0].data.push(sTableData.tbody[i][1]);
                            chartOption.option.series[1].data.push(sTableData.tbody[i][2]);
                            chartOption.option.series[2].data.push(sTableData.tbody[i][3]);
                            chartOption.option.series[3].data.push(sTableData.tbody[i][4]);
                            chartOption.option.series[4].data.push(sTableData.tbody[i][5]);
                            chartOption.option.series[5].data.push(sTableData.tbody[i][6]);
                            chartOption.option.series[6].data.push(sTableData.tbody[i][7]);
                            chartOption.option.series[7].data.push(sTableData.tbody[i][8]);
                            chartOption.option.series[8].data.push(sTableData.tbody[i][9]);
                            chartOption.option.series[9].data.push(sTableData.tbody[i][10]);
                            chartOption.option.series[10].data.push(sTableData.tbody[i][11]);
                            chartOption.option.series[11].data.push(sTableData.tbody[i][12]);
                        }
                        sTableData.tbody.reverse();
                        var lineChart = echarts.init(document.getElementById('lineEnt'));

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);

                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染图表
                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        }

                        // me.checkStatus();
                    }
                });
            },
            getFourChart: function() {
                loadScreen.start();
                var me = this;
                var tpQuery = me.getSearch();

                app.api({
                    url: '/business/overview2/percent', //顶部图表数据的请求
                    type: 'POST',
                    data: tpQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        me.a = true;
                        me.checkStatus();
                        if (!resp.success) return;
                        me.settleData(resp);

                        chartOption.option.title.text = '功能渗透率趋势';
                        $('#titleTable').html('功能渗透率');
                        chartOption.option.xAxis.data = [];
                        for (var i = 0; i < chartOption.option.series.length; i++) {
                            chartOption.option.series[i].data = [];
                        }
                        sTableData.tbody.reverse();
                        chartOption.option.yAxis = {
                            type: 'value',
                            min: 0,
                            max: 100,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        };
                        chartOption.option.tooltip = {
                            trigger: 'axis',
                            formatter: function(params) {
                                var html = params[0].name + '<br/>';
                                var htmlTwo = "<div style='text-align:left'>";
                                for (var i = 0; i < params.length; i++) {
                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].value == '-' ? '' : (params[i].value + "%")) + "<br/>")
                                }
                                html += htmlTwo;
                                html += "</div>";
                                return html;
                            }
                        };
                        for (var i = 0; i < sTableData.tbody.length; i++) {
                            chartOption.option.xAxis.data.push(sTableData.tbody[i][0]);
                            chartOption.option.series[0].data.push(sTableData.tbody[i][1] == '-' ? '-' : parseFloat(sTableData.tbody[i][1]));
                            chartOption.option.series[1].data.push(sTableData.tbody[i][2] == '-' ? '-' : parseFloat(sTableData.tbody[i][2]));
                            chartOption.option.series[2].data.push(sTableData.tbody[i][3] == '-' ? '-' : parseFloat(sTableData.tbody[i][3]));
                            chartOption.option.series[3].data.push(sTableData.tbody[i][4] == '-' ? '-' : parseFloat(sTableData.tbody[i][4]));
                            chartOption.option.series[4].data.push(sTableData.tbody[i][5] == '-' ? '-' : parseFloat(sTableData.tbody[i][5]));
                            chartOption.option.series[5].data.push(sTableData.tbody[i][6] == '-' ? '-' : parseFloat(sTableData.tbody[i][6]));
                            chartOption.option.series[6].data.push(sTableData.tbody[i][7] == '-' ? '-' : parseFloat(sTableData.tbody[i][7]));
                            chartOption.option.series[7].data.push(sTableData.tbody[i][8] == '-' ? '-' : parseFloat(sTableData.tbody[i][8]));
                            chartOption.option.series[8].data.push(sTableData.tbody[i][9] == '-' ? '-' : parseFloat(sTableData.tbody[i][9]));
                            chartOption.option.series[9].data.push(sTableData.tbody[i][10] == '-' ? '-' : parseFloat(sTableData.tbody[i][10]));
                            chartOption.option.series[10].data.push(sTableData.tbody[i][11] == '-' ? '-' : parseFloat(sTableData.tbody[i][11]));
                            chartOption.option.series[11].data.push(sTableData.tbody[i][12] == '-' ? '-' : parseFloat(sTableData.tbody[i][12]));
                        }
                        sTableData.tbody.reverse();
                        var lineChart = echarts.init(document.getElementById('lineEnt'));

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);

                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染图表
                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData, 1));
                        }

                        // me.checkStatus();
                    }
                });
            },
            checkStatus: function() {
                var me = this;
                if (me.a == true) {

                    $(".search,.reset").removeAttr("disabled").css({
                        "backgroundColor": "#FAAC3E"
                    });
                }

            },
            rstButtoStatus: function(obj) {
                var me = this;
                me.a = false;

                obj.attr("disabled", "disabled").css({
                    "backgroundColor": "grey"
                });
            },
            initDownLoad: function() {
                var me = this;
                $('.download:eq(0)').click(function() {
                    var array = [];
                    var $data = $('#formdown input[name=data]');
                    var $name = $('#formdown input[name=filename]');
                    array.push([
                        '日期',
                        '企信',
                        '协同',
                        'CRM',
                        '支付',
                        '考勤助手',
                        '外勤助手',
                        'PK助手',
                        '项目管理助手',
                        '工资助手',
                        '战报助手',
                        '会议助手',
                        '培训助手'
                    ]);
                    array = array.concat(
                        sTableData.tbody
                    );
                    $data.val(JSON.stringify(array));
                    $name.val($('#titleTable').html());
                    $('#submit').click();

                });
            }
        }
        var session = new Session();
    }
});