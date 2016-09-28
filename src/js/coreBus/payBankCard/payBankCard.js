define(function(require, exports, module) {
    exports.init = function() {

        var sTableData = [{
            'thead': [
                '日期',
                '成功绑卡次数',
                '绑卡总次数',
                '绑卡成功率',
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '成功解绑次数',
                '解绑总次数',
                '解绑成功率'
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
                me.initDateWidget(); //初始化时间插件
                me.initChange(); // 初始化日周月切换按钮
                me.showHelp();
                me.getCheck(); //点击查看时请求三次数据
                me.loadSource(me.flag); //进入页面时三次请求
                me.initReset(); //点击重置按钮时的动作;

                $("#tip_board").html($('#tiptemplate').html());
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
            b: false,
            initChange: function() { //初始化日周月切换按钮
                var me = this;
                $('.timetype button').on('click', function(ev) {
                    ev.preventDefault();
                    $(this).addClass('active').siblings().removeClass('active');
                });
            },
            showHelp: function() {

                $(".timetype").append($(helpObject.strForBus)).css('position', 'relative');


                $('.icon:eq(1)').hover(function() {

                    console.log(11);

                    $('.helps').css("display", "block"); //根据hash值自动加载帮助信息

                }, function() {

                    $('.helps').css("display", "none");

                });
            },
            initReset: function() {
                var me = this;

                $(".reset").click(function() {

                    me.initDateWidget();

                    $("select").val("all");

                    $(".timetype").find(".active").removeClass("active");

                    $(".timetype button[data-timetype=0]").addClass("active");
                    me.resetData();
                    me.rstButtoStatus($(this));
                    me.loadSource(true);
                });
            },
            resetData: function() {
                sTableData = [{
                    'thead': [
                        '日期',
                        '成功绑卡次数',
                        '绑卡总次数',
                        '绑卡成功率',
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '成功解绑次数',
                        '解绑总次数',
                        '解绑成功率'
                    ],
                    'tbody': []
                }];

            },

            initDateWidget: function() { //初始化时间插件
                var me = this;
                dateConfig.run();
            },
            getSearch: function() {
                var me = this;
                var obj = {};
                obj.area = ($('#distract').val() == 'all' ? '' : $('#distract').val()); //地区
                obj.start = me.getTime().start;
                obj.end = me.getTime().end; //时间段
                obj.type = me.getTimeType();
                obj.industry = ($('#category').val() == 'all' ? '' : $('#category').val()); //行业类别
                // obj.payType = ($('#payStatus').val() == 'all' ? '' : $('#payStatus').val()); //付费类型
                obj.scope = ($("#scope").val() == 'all' ? '' : $("#scope").val()); //企业规模
                obj.ignoreFx = parseInt(($('#removedata').val())); //是否分享


                obj.establishedAccount = ($("#accountNum").val() == 'all' ? '' : $("#accountNum").val()); //开通账号数量；

                obj.enterpriseType = ($("#entType").val() == 'all' ? '' : $("#entType").val()); //企业类型

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

                me.resetData();

                if (!flag) {

                    me.getSearchInfo(); //只有当第一次进入页面的时候才会进行筛选去数据的填充，如果是点击查看按钮那么是不会进行筛选区的填充的。


                } else {

                    me.getTopChart(); // 顶部数据请求及渲染
                    me.getBottomChart(); //底部数据请求及渲染;

                }

            },
            settleData: function(sTableData, resp) { //整理第一个表的数据

                var me = this;
                var tbody = sTableData.tbody; //整理数据

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    array[0] = resp.value.model[i].date;

                    array[1] = resp.value.model[i].column1;

                    array[2] = resp.value.model[i].column2;

                    array[3] = resp.value.model[i].percent;

                    for (var m = 0; m < array.length; m++) {

                        if (array[m] == undefined) {

                            array[m] = '-';

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

                        var fragmentFour = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[3].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[3][i].dimension;
                            option.setAttribute('value', object.value.model[3][i].value);

                            fragmentFour.appendChild(option);
                        }

                        $('#terminalType').append($(fragmentFour)); //填充终端类型;


                        var fragmentFive = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[0].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[0][i].dimension;
                            option.setAttribute('value', object.value.model[0][i].value);

                            fragmentFive.appendChild(option);
                        }

                        $("#distract").append($(fragmentFive)); //填充区域


                        var fragmentSix = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[16].length; i++) { //开通账号数量
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[16][i].dimension;
                            option.setAttribute('value', object.value.model[16][i].value);

                            fragmentSix.appendChild(option);
                        }

                        $("#accountNum").append($(fragmentSix));



                        var fragmentSeven = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[17].length; i++) { //企业类型
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[17][i].dimension;
                            option.setAttribute('value', object.value.model[17][i].value);

                            fragmentSeven.appendChild(option);
                        }

                        $("#entType").append($(fragmentSeven));



                        me.getTopChart();

                        me.getBottomChart();

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;

                var tpQuery = me.getSearch();
                tpQuery.actionCard = 0; //绑卡
                app.api({
                    url: '/business/paycard/indicators', //顶部图表数据的请求
                    type: 'POST',
                    data: tpQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        if (typeof resp.value == 'undefined') {

                            $(".search,.reset").removeAttr("disabled").css({
                                "backgroundColor": "#FAAC3E"
                            });
                            return;
                        }


                        me.a = true;

                        me.settleData(sTableData[0], resp);

                        var data = sTableData[0].tbody.slice(1);
                        var successBind = [], // 成功绑卡次数
                            bindSum = [], // 绑卡总次数
                            successPercent = [], // 绑卡成功率
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            successBind.push(data[i][1]);

                            bindSum.push(data[i][2]);

                            successPercent.push(data[i][3]);

                        }

                        var typeArray = [successBind, bindSum, successPercent];

                        for (var i = 0; i < typeArray.length; i++) {


                            for (var m = 0; m < typeArray[i].length; m++) {

                                if (typeArray[i][m] == '-') {

                                    typeArray[i][m] = 0;

                                } else {
                                    typeArray[i][m] = parseFloat(typeArray[i][m]);

                                }

                            }
                        }


                        chartOption.optionOne.series[0].data = successBind.slice(0).reverse();
                        chartOption.optionOne.series[1].data = bindSum.slice(0).reverse();
                        chartOption.optionOne.series[2].data = successPercent.slice(0).reverse();

                        chartOption.optionOne.xAxis.data = date.slice(0).reverse();



                        try {

                            var lineChart = echarts.init(document.getElementById('lineCard'));

                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.optionOne);


                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染顶部图表
                            me.tableModule.renderData(utils.addComma(sTableData[0], 1))
                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData[0], 1))
                        }


                        me.checkStatus();


                    }
                });
            },
            getBottomChart: function() {
                loadScreen.start();
                var me = this;
                var btQuery = me.getSearch();
                btQuery.actionCard = 1; // 解绑
                app.api({
                    url: '/business/paycard/indicators', //底部图表数据的请求和渲染;
                    type: 'POST',
                    data: btQuery,
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;

                        $(".search,.reset").removeAttr("disabled").css({
                            "backgroundColor": "#FAAC3E"
                        });

                        if (typeof resp.value == 'undefined') return;

                        me.b = true;

                        me.settleData(sTableData[1], resp);

                        var data = sTableData[1].tbody.slice(1);
                        var successUnBind = [],
                            unbindSum = [],
                            unbindSuccessPercent = [],

                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            successUnBind.push(data[i][1]);

                            unbindSum.push(data[i][2]);

                            unbindSuccessPercent.push(data[i][3]);
                        }


                        var typeArray = [successUnBind, unbindSum, unbindSuccessPercent];


                        for (var i = 0; i < typeArray.length; i++) {


                            for (var m = 0; m < typeArray[i].length; m++) {

                                if (typeArray[i][m] == '-') {

                                    typeArray[i][m] = 0;

                                } else {

                                    typeArray[i][m] = parseFloat(typeArray[i][m]);
                                }

                            }
                        }



                        chartOption.optionTwo.series[0].data = successUnBind.slice(0).reverse();
                        chartOption.optionTwo.series[1].data = unbindSum.slice(0).reverse();
                        chartOption.optionTwo.series[2].data = unbindSuccessPercent.slice(0).reverse();


                        chartOption.optionTwo.xAxis.data = date.slice(0).reverse();


                        try {

                            var lineChartTwo = echarts.init(document.getElementById('lineCardTwo')); //初始化折线图二

                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChartTwo.resize;

                        lineChartTwo.setOption(chartOption.optionTwo);



                        if (me.flag == false) {

                            me.tableModuleTwo = new TableModule($('#userReDate')); //渲染底部图表
                            me.tableModuleTwo.renderData(utils.addComma(sTableData[1], 1));
                        } else {

                            me.tableModuleTwo.renderData(utils.addComma(sTableData[1], 1));
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



                $('.download:eq(0)').click(function() {

                    var tpQuery = me.getSearch();
                    tpQuery.actionCard = 0;
                    var url = BI.API_PATH + "/business/paycard/indicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });



                $('.download:eq(1)').click(function() {


                    var btQuery = me.getSearch();

                    btQuery.actionCard = 1;
                    var url = BI.API_PATH + "/business/paycard/indicatorsdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});