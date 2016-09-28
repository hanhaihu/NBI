// Created By Haihu Han 

define(function(require, exports, module) {
    exports.init = function() {

        var sTableData = {
            'thead': [
                '日期',
                '月签约订单金额',
                '月MRR',
                '月新购MRR',
                '月增购MRR',
                '月减购MRR',
                '月退订MRR',
                '月金额流失率',
                '月金额续约率(含增购)',
                '月金额续约率(不含增购)',
                'LTV'
            ],
            'tbody': []
        };


        var $el = exports.$el;

        var app = BI.app;

        require('../../commModule/listModel.js'); //引入模板文件

        var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期配置文件

        var helpObject = require('../../commModule/helpInfo.js');
        var loadScreen = new(require('../../commModule/loadScreen.js'))(app);

        var utils = require('../../commModule/utils.js');

        //填充列表的数据
        function MainChart() {
            this.init.apply(this, arguments);
        }

        MainChart.prototype = {
            init: function() {
                var me = this;
                me.initIframe(); //初始化下载form
                me.initDateWidget();
                me.getSearchInfo(); //填充顶部筛选区域数据;
                // me.showHelp();
                me.loadSource(this.flag);
                // me.initChange();
                me.initSelect();
                me.getCheck();
                me.initDownload();
                me.bindReset();
                $("#tip_board").html($('#tiptemplate').html());

                $("#tip").width(600);
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
            loadSource: function(flag) { //初次进入页面时加载数据和点击查看按钮时加载数据
                var me = this;
                loadScreen.start();

                me.resetData();
                if (!flag) {
                    app.api({
                        url: 'operation/mrr/overview',
                        type: 'POST',
                        data: me.getSearPara(),
                        dataType: 'json',
                        success: function(resp) {
                            if (!loadScreen.end()) return;

                            if (typeof resp.value == 'undefined') {

                                $(".check,.resetTotal").removeAttr("disabled").css({
                                    "backgroundColor": "#FAAC3E"
                                });

                                return
                            }

                            var values = resp.value.model;
                            me.checkStatus();
                            var container = {
                                tbody: me.formatData(values),
                                xAxis: me.settleTime(values)[0],
                                aData: me.settleTime(values)[1],
                                bData: ''
                            };

                            me.dataRepository = container;
                            sTableData.tbody = me.dataRepository.tbody;
                            me.initList(sTableData);
                            me.initChart(me.dataRepository);
                        }
                    });
                } else {
                    me.resetData();
                    app.api({
                        url: 'operation/mrr/overview',
                        type: 'POST',
                        data: me.getSearPara(),
                        dataType: 'json',
                        success: function(resp) {
                            if (!loadScreen.end()) return;
                            if (typeof resp.value == 'undefined') {

                                $(".check,.resetTotal").removeAttr("disabled").css({
                                    "backgroundColor": "#FAAC3E"
                                });
                                return
                            }
                            var values = resp.value.model;

                            me.checkStatus();

                            me.resetData(); //重置数据为初始化数据
                            var container = {
                                tbody: me.formatData(values),
                                xAxis: me.settleTime(values)[0],
                                aData: me.settleTime(values)[1],
                                bData: ''
                            };
                            me.dataRepository = container;
                            sTableData.tbody = me.dataRepository.tbody;
                            me.initList(sTableData);
                            me.initChart(me.settleData());
                        }
                    });
                }
            },
            initChart: function(source) {


                try {

                    var lineChart = echarts.init(document.getElementById('lineMrr')); //初始化折线图

                } catch (err) {

                    return;
                }

                $(window).bind('resize', function() {
                    lineChart.resize();
                });

                var reverse = source.aData.slice(0); //折线图配置

                var option = {
                    title: {
                        text: "MRR关键指标月视图",
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
                        data: ['月签约订单金额'],
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
                    }, ],
                    series: [{
                        name: '月签约订单金额',
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
                    var arry = ['月金额流失率', '月金额续约率(含增购)', '月金额续约率(不含增购)'];
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
                dateConfig.runForMrr();

            },

            getSearchInfo: function() {
                var me = this;

                app.api({
                    url: "operation/dimension/all", //筛选区域的值得请求;
                    type: "POST",
                    dataType: 'json',
                    success: function(object) {



                        var fragmentOne = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[15].length; i++) { //开通账号数量
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[15][i].dimension;
                            option.setAttribute('value', object.value.model[15][i].value);

                            fragmentOne.appendChild(option);
                        }

                        $("#actDegree").append($(fragmentOne));


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

                        var fragmentSeven = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[16].length; i++) { //开通账号数量
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[16][i].dimension;
                            option.setAttribute('value', object.value.model[16][i].value);

                            fragmentSeven.appendChild(option);
                        }

                        $("#accountNum").append($(fragmentSeven));

                    }
                });

            },

            settleTime: function(data) {
                var array = [],
                    arryTwo = [];

                for (var i = 0; i < data.length; i++) {
                    array.unshift(data[i]['date']);
                    arryTwo.unshift(data[i]['column0']); //整理时间和第一次时的新增登录用户数
                }
                return [array, arryTwo];
            },
            getTime: function() {
                var me = this;
                return {
                    start: new Date(dateConfig.startDate).getTime(),
                    end: new Date(dateConfig.endDate).getTime()
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
                obj.type = '2'; //时间类型
                obj.industry = ($('#category').val() == 'all' ? '' : $('#category').val()); //行业类别

                obj.establishedAccount = ($("#accountNum").val() == 'all' ? '' : $("#accountNum").val()); //开通账号数量；

                obj.activity = ($("#actDegree").val() == 'all' ? '' : $("#actDegree").val()); //活跃度


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
                    '月签约订单金额',
                    '月MRR',
                    '月新购MRR',
                    '月增购MRR',
                    '月减购MRR',
                    '月退订MRR',
                    '月金额流失率',
                    '月金额续约率(含增购)',
                    '月金额续约率(不含增购)',
                    'LTV'
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
                    default:
                }



                var xData = [];
                for (var i = 0; i < me.dataRepository.tbody.length; i++) {

                    xData.push(isNaN(parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.xClass').val())])) ? '' : parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.xClass').val())])); //百分需要转化为数值

                }

                var yData = [];



                if (!$('.yClass').val()) {



                } else {
                    for (var i = 0; i < me.dataRepository.tbody.length; i++) {
                        yData.push(isNaN(parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.yClass').val())])) ? '' : parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.yClass').val())])); //百分需要转化为数值
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

                var dataArray = ['date', 'column0', 'column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9'];

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
                $('.download').eq(0).click(function() {

                    var array = [];
                    var $data = $('#formdown input[name=data]');
                    var $name = $('#formdown input[name=filename]');
                    array.push([
                        '日期',
                        '月签约订单金额',
                        '月MRR',
                        '月新购MRR',
                        '月增购MRR',
                        '月减购MRR',
                        '月退订MRR',
                        '月金额流失率',
                        '月金额续约率(含增购)',
                        '月金额续约率(不含增购)',
                        'LTV'
                    ]);
                    array = array.concat(
                        sTableData.tbody
                    );
                    $data.val(JSON.stringify(array));
                    $name.val('MRR关键指标统计表');
                    $('#submit').click();
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
                        '月签约订单金额',
                        '月MRR',
                        '月新购MRR',
                        '月增购MRR',
                        '月减购MRR',
                        '月退订MRR',
                        '月金额流失率',
                        '月金额续约率(含增购)',
                        '月金额续约率(不含增购)',
                        'LTV'
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
                    $(".xClass option[value=1]").attr('selected', true);
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