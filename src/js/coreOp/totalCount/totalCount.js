// Created By Haihu Han 


define(function(require, exports, module) {
    exports.init = function() {
        var sTableData = {
            'thead': [
                '日期',
                '新增注册用户数',
                '新增注册企业数',
                '新增登录用户数',
                '用户平均在线时长(min)',
                '在线用户数',
                '用户在线占比',
                '在线企业数',
                '企业在线占比',
                '活跃企业数',
                '企业活跃率',
                '流失用户数',
                '流失企业数',
                '累计用户数',
                '累计企业数'
            ],
            'tbody': []
        };

        var $el = exports.$el;

        var app = BI.app;

        require('../../commModule/listModel.js'); //引入模板文件

        var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期配置文件
        var loadScreen = new(require('../../commModule/loadScreen.js'))(app);

        var helpObject = require('../../commModule/helpInfo.js');

        var utils = require('../../commModule/utils.js');

        //填充列表的数据
        function MainChart() {
            this.init.apply(this, arguments);
        }

        MainChart.prototype = {
            init: function() {
                var me = this;
                me.initDateWidget();
                me.getSearchInfo(); //填充顶部筛选区域数据;
                me.showHelp();
                me.loadSource(this.flag);
                me.initChange();
                me.initSelect();
                me.getCheck();
                me.initDownload();
                me.bindReset();
                $("#tip_board").html($('#tiptemplate').html());
            },
            flag: false,
            dataRepository: null,
            $: function(str) {
                return $el.find(str);
            },
            initChange: function() { //初始化日周月切换按钮
                var me = this;
                $('.timetype button').on('click', function(ev) {
                    ev.preventDefault();
                    $(this).addClass('active').siblings().removeClass('active');
                });
            },
            showHelp: function() {

                $(".timetype").append($(helpObject.strForOp)).css('position', 'relative');

                $('.icon:eq(1)').hover(function() {

                    $('.helps').css("display", "block");

                }, function() {

                    $('.helps').css("display", "none");

                });
            },
            getCheck: function() { //点击查看按钮时重新刷新
                var me = this;
                $('.check').click(function() {
                    me.resetButtonStatus($(this));
                    me.flag = true;
                    me.loadSource(me.flag);
                });
            },
            loadSource: function(flag) { //初次进入页面时加载数据和点击查看按钮时加载数据
                var me = this;

                loadScreen.start();

                me.resetData();

                if (!flag) {
                    app.api({
                        url: 'operation/overview/all2',
                        type: 'POST',
                        data: me.getSearPara(),
                        dataType: 'json',
                        success: function(resp) {

                            if (!loadScreen.end()) return;

                            if (typeof resp.value == 'undefined') {
                                $(".check,.resetTotal").removeAttr("disabled").css({
                                    "backgroundColor": "#FAAC3E"
                                });
                            }

                            var values = resp.value.model;
                            var container = {
                                tbody: me.formatData(values),
                                xAxis: me.settleTime(values)[0],
                                aData: me.settleTime(values)[1],
                                bData: ''
                            };

                            me.dataRepository = container;
                            sTableData.tbody = me.dataRepository.tbody;
                            me.checkStatus();
                            me.initList(sTableData);
                            me.initChart(me.dataRepository);
                        }
                    });
                } else {
                    me.resetData();
                    app.api({
                        url: 'operation/overview/all2',
                        type: 'POST',
                        data: me.getSearPara(),
                        dataType: 'json',
                        success: function(resp) {
                            if (!loadScreen.end()) return;
                            if (typeof resp.value == 'undefined') {
                                $(".check,.resetTotal").removeAttr("disabled").css({
                                    "backgroundColor": "#FAAC3E"
                                });
                            }
                            var values = resp.value.model;
                            me.resetData(); //重置数据为初始化数据
                            var container = {
                                tbody: me.formatData(values),
                                xAxis: me.settleTime(values)[0],
                                aData: me.settleTime(values)[1],
                                bData: ''
                            };
                            me.dataRepository = container;
                            sTableData.tbody = me.dataRepository.tbody;
                            me.checkStatus();
                            me.initList(sTableData);
                            me.initChart(me.settleData());
                        }
                    });
                }
            },
            initChart: function(source) {


                try {

                    var lineChart = echarts.init(document.getElementById('lineTotal')); //初始化折线图

                } catch (err) {

                    return;
                }

                $(window).bind('resize', function() {
                    lineChart.resize();
                });

                var reverse = source.aData.slice(0); //折线图配置

                var option = {
                    title: {
                        text: "核心运营指标概览",
                        subtext: '',
                        x: 'center'
                    },
                    smooth: true,
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        show: true,
                        orient: 'horizontal',
                        bottom: 0,
                        data: ['新增注册企业数'],
                        icon: 'pin',
                        textStyle: {
                            fontSize: 18
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                            title: '保存为图片'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: source.xAxis,
                        axisLabel: {

                            rotate: 60

                        }
                    },
                    yAxis: [{
                        name: '数量',
                        type: 'value',
                        min: 0,
                    }],
                    series: [{
                        name: '新增注册企业数',
                        type: 'line',
                        data: reverse,
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }
                    }, {
                        name: "",
                        type: 'line',
                        data: "",
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }

                    }]
                }


                if (!source.lengendName) {
                    option.tooltip.formatter = function(params) {
                        var html = params[0].name + '<br/>';
                        var htmlTwo = "";
                        htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : params[0].value) + "<br/>");
                        html += htmlTwo;
                        return html;
                    }
                } else {
                    var arry = ['用户在线占比', '企业在线占比', '企业活跃率'];
                    option.legend.data = source.lengendName;
                    option.series[0].name = source.lengendName[0];
                    option.series[1].name = source.lengendName[1];

                    var judgeSignal = true;

                    for (var i = 0; i < arry.length; i++) {

                        if (option.series[0].name == arry[i]) {
                            judgeSignal = false;
                        }
                    }

                    if (!judgeSignal) { //select的第一个值为百分比

                        option.series[0].yAxisIndex = '1';
                        option.yAxis[1] = {
                            name: '百分比',
                            type: 'value',
                            max: 100,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        }

                        if (option.legend.data.length == 1) {

                            option.tooltip.formatter = function(params) {

                                var html = params[0].name + '<br/>';

                                var htmlTwo = "";

                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value + "%")) + "<br/>")

                                html += htmlTwo;
                                return html;
                            }
                        } else if (arry.join(',').indexOf(option.series[1].name) > -1) {


                            option.series[1].yAxisIndex = '1';


                            option.tooltip.formatter = function(params) {

                                var html = params[0].name + '<br/>';

                                var htmlTwo = "";

                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value + "%")) + "<br/>")


                                if (params[1]) {

                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[1].color + '"></span>' + params[1].seriesName + ":" + (isNaN(params[1].value) ? '' : (params[1].value + "%")) + "<br/>");


                                } else {


                                }

                                html += htmlTwo;
                                return html;
                            }


                        } else {

                            option.tooltip.formatter = function(params) {

                                var html = params[0].name + '<br/>';

                                var htmlTwo = "";


                                if (params.length == 2) {

                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value + "%")) + "<br/>")
                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[1].color + '"></span>' + params[1].seriesName + ":" + (isNaN(params[1].value) ? '' : (params[1].value)) + "<br/>");

                                } else if (params.length == 1) {

                                    if (arry.join(',').indexOf(params[0].seriesName) > -1) {


                                        htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value + "%")) + "<br/>")

                                    } else {

                                        htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value)) + "<br/>");

                                    }
                                }
                                html += htmlTwo;
                                return html;
                            }

                        }

                    } else { //judgeSignal不为flase,说明第一个值为数值型


                        if (option.legend.data.length == 1) {

                            option.tooltip.formatter = function(params) {

                                var html = params[0].name + '<br/>';

                                var htmlTwo = "";

                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value)) + "<br/>")

                                html += htmlTwo;
                                return html;
                            }


                        } else if (arry.join(',').indexOf(option.series[1].name) > -1) {

                            option.yAxis[1] = {
                                name: '百分比',
                                type: 'value',
                                max: 100,
                                axisLabel: {
                                    formatter: '{value}%'
                                }
                            }

                            option.series[1].yAxisIndex = '1';

                            option.tooltip.formatter = function(params) {

                                var html = params[0].name + '<br/>';

                                var htmlTwo = "";

                                if (params.length == 2) {

                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value)) + "<br/>");
                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[1].color + '"></span>' + params[1].seriesName + ":" + (isNaN(params[1].value) ? '' : (params[1].value + "%")) + "<br/>");

                                } else if (params.length == 1) {

                                    if (arry.join(',').indexOf(params[0].seriesName) > -1) {

                                        htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value + "%")) + "<br/>");
                                    } else {

                                        htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value)) + "<br/>");

                                    }

                                }

                                html += htmlTwo;

                                return html;
                            }

                        } else {

                            option.tooltip.formatter = function(params) {

                                var html = params[0].name + '<br/>';

                                var htmlTwo = "";

                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[0].color + '"></span>' + params[0].seriesName + ":" + (isNaN(params[0].value) ? '' : (params[0].value)) + "<br/>");


                                if (params[1]) {

                                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[1].color + '"></span>' + params[1].seriesName + ":" + (isNaN(params[1].value) ? '' : (params[1].value)) + "<br/>");
                                } else {


                                }

                                html += htmlTwo;
                                return html;
                            }

                        }
                    }
                    option.series[0].data = source.aData;
                    option.series[1].data = source.bData;
                }

                lineChart.setOption(option);
            },
            initDateWidget: function() { // 初始化日期控件
                var me = this;
                dateConfig.run();
            },

            getSearchInfo: function() {
                var me = this;

                app.api({
                    url: "operation/dimension/all", //筛选区域的值得请求;
                    type: "POST",
                    dataType: 'json',
                    success: function(object) {

                        var fragmentOne = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[2].length; i++) {

                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[2][i].dimension;
                            option.setAttribute('value', object.value.model[2][i].value);

                            fragmentOne.appendChild(option);
                        }

                        $('#scope').append($(fragmentOne)); //填充企业规模


                        // var fragmentTwo = document.createDocumentFragment();
                        // for (var i = 0; i < object.value.model[5].length; i++) {
                        //     var option = document.createElement('option');
                        //     option.innerHTML = object.value.model[5][i].dimension;
                        //     option.setAttribute('value', object.value.model[5][i].value);

                        //     fragmentTwo.appendChild(option);
                        // }

                        // $('#payStatus').append($(fragmentTwo)); //填充付费类型

                        var fragmentThree = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[1].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[1][i].dimension;
                            option.setAttribute('value', object.value.model[1][i].value);

                            fragmentThree.appendChild(option);
                        }

                        $('#category').append($(fragmentThree)); // 填充行业类别


                        var fragmentFive = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[0].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[0][i].dimension;
                            option.setAttribute('value', object.value.model[0][i].value);

                            fragmentFive.appendChild(option);
                        }

                        $("#distract").append($(fragmentFive)); //填充区域

                        var fragmentSix = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[6].length; i++) { //企业来源类型
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[6][i].dimension;
                            option.setAttribute('value', object.value.model[6][i].value);

                            fragmentSix.appendChild(option);
                        }

                        $("#sourceId").append($(fragmentSix));


                        var fragmentSeven = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[16].length; i++) { //开通账号数量
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[16][i].dimension;
                            option.setAttribute('value', object.value.model[16][i].value);

                            fragmentSeven.appendChild(option);
                        }

                        $("#accountNum").append($(fragmentSeven));



                        var fragmentEight = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[17].length; i++) { //企业类型
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[17][i].dimension;
                            option.setAttribute('value', object.value.model[17][i].value);

                            fragmentEight.appendChild(option);
                        }

                        $("#entType").append($(fragmentEight));



                    }
                });

            },

            settleTime: function(data) {
                var array = [],
                    arryTwo = [];

                for (var i = 1; i < data.length; i++) {
                    array.unshift(data[i]['date']);
                    arryTwo.unshift(data[i]['column2']); //整理时间和第一次时的新增登录用户数
                }
                return [array, arryTwo];
            },
            getTime: function() {
                var me = this;
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

            getSearPara: function() {
                var me = this;
                var obj = {};
                obj.area = ($('#distract').val() == 'all' ? '' : $('#distract').val()); //地区
                obj.start = me.getTime().start;
                obj.end = me.getTime().end; //时间段
                obj.type = me.getTimeType(); //时间类型
                obj.industry = ($('#category').val() == 'all' ? '' : $('#category').val()); //行业类别
                // obj.payType = ($('#payStatus').val() == 'all' ? '' : $('#payStatus').val()); //付费类型
                obj.source = ($('#sourceId').val() == 'all' ? '' : $('#sourceId').val()); //企业来源类型;
                obj.scope = ($("#scope").val() == 'all' ? '' : $("#scope").val()); //企业规模

                obj.establishedAccount = ($("#accountNum").val() == 'all' ? '' : $("#accountNum").val()); //开通账号数量；

                obj.enterpriseType = ($("#entType").val() == 'all' ? '' : $("#entType").val()); //企业类型


                return obj;
            },
            initList: function(sTableData) { //初始化列表
                var me = this;
                if (me.flag == false) {
                    me.tableModule = new TableModule($('#below'));
                    me.tableModule.renderData(utils.addComma(sTableData, 1));
                } else {
                    me.tableModule.renderData(utils.addComma(sTableData, 1));
                }
            },
            settleData: function() { //整理me.datarepository的值以便能够重新刷新折线图；
                var me = this;
                var nameArray = [
                    "新增注册用户数",
                    "新增注册企业数",
                    "新增登录用户数",
                    "用户平均在线时长(min)",
                    "在线用户数",
                    "用户在线占比",
                    "在线企业数",
                    "企业在线占比",
                    "活跃企业数",
                    "企业活跃率",
                    "流失用户数",
                    "流失企业数",
                    "累计用户数",
                    "累计企业数"
                ];

                var name = []
                switch (parseInt($('.xClass').val())) {
                    case 1:
                        name[0] = nameArray[0];
                        break;
                    case 2:
                        name[0] = nameArray[1];
                        break;
                    case 3:
                        name[0] = nameArray[2];
                        break;
                    case 4:
                        name[0] = nameArray[3];
                        break;
                    case 5:
                        name[0] = nameArray[4];
                        break;
                    case 6:
                        name[0] = nameArray[5];
                        break;
                    case 7:
                        name[0] = nameArray[6];
                        break;
                    case 8:
                        name[0] = nameArray[7];
                        break;
                    case 9:
                        name[0] = nameArray[8];
                        break;
                    case 10:
                        name[0] = nameArray[9];
                        break;
                    case 11:
                        name[0] = nameArray[10];
                        break;
                    case 12:
                        name[0] = nameArray[11];
                        break;
                    case 13:
                        name[0] = nameArray[12];
                        break;
                    case 14:
                        name[0] = nameArray[13];
                    default:
                }

                switch (parseInt($('.yClass').val())) {
                    case "":
                        name[1] = null;
                        break;
                    case 1:
                        name[1] = nameArray[0];
                        break;
                    case 2:
                        name[1] = nameArray[1];
                        break;
                    case 3:
                        name[1] = nameArray[2];
                        break;
                    case 4:
                        name[1] = nameArray[3];
                        break;
                    case 5:
                        name[1] = nameArray[4];
                        break;
                    case 6:
                        name[1] = nameArray[5];
                        break;
                    case 7:
                        name[1] = nameArray[6];
                        break;
                    case 8:
                        name[1] = nameArray[7];
                        break;
                    case 9:
                        name[1] = nameArray[8];
                        break;
                    case 10:
                        name[1] = nameArray[9];
                        break;
                    case 11:
                        name[1] = nameArray[10];
                        break;
                    case 12:
                        name[1] = nameArray[11];
                        break;
                    case 13:
                        name[1] = nameArray[12];
                        break;
                    case 14:
                        name[1] = nameArray[13];
                    default:
                }

                var xData = [];
                for (var i = 1; i < me.dataRepository.tbody.length; i++) {
                    xData.push(parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.xClass').val())]) ? parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.xClass').val())]) : ''); //百分需要转化为数值
                }

                var yData = [];

                if (!$('.yClass').val()) {

                } else {
                    for (var i = 1; i < me.dataRepository.tbody.length; i++) {
                        yData.push(parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.yClass').val())]) ? parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.yClass').val())]) : ''); //百分需要转化为数值
                    }
                }

                me.dataRepository.lengendName = name;

                me.dataRepository.aData = xData.slice(0).reverse();
                me.dataRepository.bData = yData.slice(0).reverse();

                return me.dataRepository;
            },
            initSelect: function() {
                var me = this;
                $(".subSelect").change(function() {
                    var val = $(this).val();

                    $(this).siblings('.subSelect')
                        .children("option[disabled]").removeAttr('disabled'); //切换select的值时使连个select的值互逆；

                    $(this).siblings('.subSelect')
                        .children("option[value=" + val + "]")
                        .attr('disabled', 'true');

                    me.initChart(me.settleData()); //select值改变时实时刷新chart图；
                });
            },
            formatData: function(model) {
                var me = this;

                var tbody = sTableData.tbody;

                var dataArray = ['date', 'column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12', 'column13', 'column14', ]

                for (var i = 0; i < model.length; i++) {

                    var array = [];
                    for (var j = 0; j < dataArray.length; j++) {

                        if (model[i][dataArray[j]] == null) {

                            array.push('-');

                        } else {

                            array.push(model[i][dataArray[j]]);
                        }
                    }

                    tbody.push(array);
                }
                return tbody;
            },

            initDownload: function() {
                var me = this;

                me.$('.download').click(function() {
                    var url = BI.API_PATH + '/operation/overview/download2' + '?' + $.param(me.getSearPara());
                    window.open(url);

                });
            },

            resetButtonStatus: function(obj) {
                obj.attr("disabled", "disabled").css({
                    "backgroundColor": "grey"
                });
            },

            checkStatus: function() {

                $(".check,.resetTotal").removeAttr("disabled").css({
                    "backgroundColor": "#FAAC3E"
                });
            },

            resetData: function() {
                sTableData = {
                    'thead': [
                        '日期',
                        '新增注册用户数',
                        '新增注册企业数',
                        '新增登录用户数',
                        '用户平均在线时长(min)',
                        '在线用户数',
                        '用户在线占比',
                        '在线企业数',
                        '企业在线占比',
                        '活跃企业数',
                        '企业活跃率',
                        '流失用户数',
                        '流失企业数',
                        '累计用户数',
                        '累计企业数'
                    ],
                    'tbody': []
                };

            },
            bindReset: function() {
                var me = this;

                $(".resetTotal").click(function() {

                    $("select").val("all");

                    me.resetButtonStatus($(this));

                    me.initDateWidget(); //重置条件跟默认进入页面时相同
                    me.resetData(); //重置数据为初始数据
                    $(".timetype button[class=active]").removeClass('active');

                    $('.timetype button[data-timetype=0]').addClass('active');

                    $(".xClass option[selected]").removeAttr('selected');
                    $(".xClass option[disabled]").removeAttr('disabled');
                    $(".xClass option[value=2]").attr('selected', true);
                    $(".yClass option[selected]").removeAttr('selected');
                    $(".yClass option[disabled]").removeAttr('disabled');
                    $(".yClass option[value='']").attr('selected', true);
                    $(".yClass option[value=2]").attr('disabled', true);

                    me.flag = false;
                    me.loadSource(this.flag);
                    me.initChange();
                    me.initSelect();
                });
            }
        }
        var mainChart = new MainChart();
    }
});