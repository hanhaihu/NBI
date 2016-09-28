define(function(require, exports, module) {
    exports.init = function() {


        var TypesPayCash = [];

        var sTableData = [{
            'thead': [
                '日期',
                '成功充值金额',
                '成功充值次数',
                '充值总次数',
                '充值成功率',
            ],
            'tbody': [

            ]
        }, {
            'thead': [
                '日期',
                '总数',
                '快钱',
                '微信',
                '其它'
            ],
            'tbody': [

            ]
        }, {
            'thead': [
                '日期',
                '成功提现金额',
                '成功提现次数',
                '提现总次数',
                '提现成功率',
            ],
            'tbody': [


            ]
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
                me.loadSource(me.flag); //进入页面时次请求
                me.initSelect();
                me.initSessionType(); //切换会话类型
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
            c: false,
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

                    $("select").val("all");

                    me.initDateWidget();


                    $(".timetype").find(".active").removeClass("active");

                    $(".timetype button[data-timetype=0]").addClass("active");


                    $(".sessiontype").find('.active').removeClass("active");

                    $(".sessiontype button[data-sessiontype=0]").addClass("active");

                    me.resetData();

                    me.rstButtoStatus($(this));

                    me.loadSource(true);

                });
            },
            initSessionType: function() {
                var me = this;
                $('.sessiontype button').on('click', function() {
                    if (me.switching) { //阻止连续切换
                        return;
                    }
                    window.setTimeout(function() {
                        me.switching = false;
                    }, 600);
                    me.switching = true;
                    $(this).addClass('active').siblings().removeClass('active');
                    me.resetData();



                    var titleForBar = "",
                        titleForPillar = "";

                    switch ($('.sessiontype .active').attr('data-sessiontype')) {

                        case "0":
                            titleForBar = "成功充值金额总数对比";
                            titleForPillar = "成功充值金额分时对比";
                            break;

                        case "1":
                            titleForBar = "成功充值次数总数对比";
                            titleForPillar = "成功充值次数分时对比";

                            break;
                        case "2":
                            titleForBar = "充值总次数总数对比";
                            titleForPillar = "充值总次数分时对比";
                            break;

                        default:
                    }

                    me.getCenterChart(titleForBar, titleForPillar);
                    me.getBottomChart();
                });
            },

            resetData: function() {
                sTableData = [{
                    'thead': [
                        '日期',
                        '成功充值金额',
                        '成功充值次数',
                        '充值总次数',
                        '充值成功率',
                    ],
                    'tbody': [

                    ]
                }, {
                    'thead': [
                        '日期',
                        '总数',
                        '快钱',
                        '微信',
                        '其它'
                    ],
                    'tbody': [

                    ]
                }, {
                    'thead': [
                        '日期',
                        '成功提现金额',
                        '成功提现次数',
                        '提现总次数',
                        '提现成功率',
                    ],
                    'tbody': [


                    ]
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

            loadSource: function(flag) { //这里要请求三组数据
                var me = this;

                me.resetData();

                if (!flag) {

                    me.getSearchInfo(); //只有当第一次进入页面的时候才会进行筛选去数据的填充，如果是点击查看按钮那么是不会进行筛选区的填充的。

                } else {
                    me.getTopChart(); // 顶部数据请求及渲染
                    me.getCenterChart(); //中部数据请求及渲染;
                    me.getBottomChart(); //底部数据请求及渲染;

                }
            },
            settleData: function(resp) { //整理第一个表的数据

                var me = this;
                var tbody = sTableData[0].tbody; //整理数据


                var columnArray = ['date', 'column1', 'column2', 'column3', 'percent'];

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    for (var m = 0; m < 5; m++) {

                        if (resp.value.model[i][columnArray[m]] == undefined) {

                            array[m] = '-';


                        } else {

                            array[m] = resp.value.model[i][columnArray[m]];

                        }
                    }

                    tbody.push(array);
                }

            },

            settleDataTwo: function(resp) {

                var me = this;

                var tbody = sTableData[1].tbody; //整理数据

                var columnArray = ['date', 'total', 'column2', 'column3', 'column4']; //时间 //总数 //快钱  //微信  //其它

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    for (var m = 0; m < columnArray.length; m++) {

                        if (resp.value.model[i][columnArray[m]] == undefined) {

                            array[m] = '-';

                        } else {

                            array[m] = resp.value.model[i][columnArray[m]]; //

                        }
                    }

                    tbody.push(array);
                }

                console.log(tbody);
            },

            settleDataThree: function(resp) { //整理第三个表的数据
                var me = this;


                var tbody = sTableData[2].tbody;

                var columnArray = ['date', 'column1', 'column2', 'column3', 'percent'];

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    for (var m = 0; m < columnArray.length; m++) {

                        if (resp.value.model[i][columnArray[m]] == undefined) { // 把请求回来的数据拼装到tbody 中;

                            array[m] = '-';


                        } else {

                            array[m] = resp.value.model[i][columnArray[m]];

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
                        for (var i = 0; i < object.value.model[9].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[9][i].dimension;
                            option.setAttribute('value', object.value.model[9][i].value);

                            TypesPayCash.push(object.value.model[9][i].value);

                            fragmentSix.appendChild(option);
                        }

                        $("#session").append($(fragmentSix)); //填充session 类型;

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



                        // 这些数据的请求会耗费一些时间，需要优化下

                        me.getTopChart();

                        me.getCenterChart();

                        me.getBottomChart();

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;

                var tpQuery = me.getSearch();
                tpQuery.rechargeChannel = ($('#session').val() == "all" ? '' : $('#session').val()); //充值渠道的值;

                app.api({
                    url: '/business/paycash/rechargeindicators', //顶部图表数据的请求
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
                        me.settleData(resp);
                        var data = sTableData[0].tbody.slice(1);

                        var newSession = [], //成功充值金额
                            activeSession = [], //成功充值次数
                            accurate = [], //充值总次数
                            acPercent = [], // 充值成功率
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            newSession.push(data[i][1]);

                            activeSession.push(data[i][2]);

                            accurate.push(data[i][3]);

                            acPercent.push(data[i][4]);
                        }


                        var typeArray = [newSession.slice(0).reverse(), activeSession.slice(0).reverse(), accurate.slice(0).reverse(), acPercent.slice(0).reverse()];


                        for (var n = 0; n < 4; n++) {

                            for (var i = 0; i < typeArray.length; i++) {

                                for (var m = 0; m < typeArray[i].length; m++) {

                                    if (typeArray[i][m] == '-') { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                        typeArray[i][m] = 0;

                                    } else {
                                        typeArray[i][m] = parseFloat(typeArray[i][m]);
                                    }
                                }
                            }

                            chartOption.optionOne.series[n].data = typeArray[n];
                        }


                        chartOption.optionOne.xAxis.data = date.slice(0).reverse();


                        try {

                            var lineChart = echarts.init(document.getElementById('linePayCashOne'));
                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.optionOne);


                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染顶部图表

                            me.tableModule.renderData(utils.addComma(sTableData[0], 1));
                        } else {

                            me.tableModule.renderData(utils.addComma(sTableData[0], 1));

                        }

                        me.checkStatus();

                    }
                });
            },

            getCenterChart: function(titleForBar, titleForPillar) {

                loadScreen.start();
                var me = this;
                var ctQuery = me.getSearch();
                var url = null;

                ctQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype')); // 指标切换的值


                if (ctQuery.indicator == 3) {


                    url = '/business/paycash/rechargedimensionsrate';


                } else {

                    url = '/business/paycash/rechargedimensions';
                }


                ctQuery.rechargeChannels = TypesPayCash.join(','); //中部图表数据的渲染

                app.api({

                    url: url,
                    type: 'POST',
                    data: ctQuery,
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

                        var data = sTableData[1].tbody.slice(1);

                        var fastMoney = [],
                            weChat = [],
                            others = [],
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            fastMoney.push(data[i][2]); //快钱

                            weChat.push(data[i][3]); //微信

                            others.push(data[i][4]); //其它
                        }


                        var typeArray = [fastMoney.slice(0).reverse(), weChat.slice(0).reverse(), others.slice(0).reverse()];

                        console.log(typeArray);


                        for (var n = 0; n < 3; n++) {

                            for (var i = 0; i < typeArray.length; i++) {

                                for (var m = 0; m < typeArray[i].length; m++) {

                                    if (typeArray[i][m] == '-') { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                        typeArray[i][m] = 0;

                                    } else {
                                        typeArray[i][m] = parseFloat(typeArray[i][m]);
                                    }
                                }
                            }

                            chartOption.optionPillar.series[n].data = typeArray[n]; //给柱状图图加上相应的数据
                        }


                        if (titleForPillar) {

                            chartOption.optionPillar.title.text = titleForPillar;

                        } else {

                            chartOption.optionPillar.title.text = "成功充值金额分时对比";

                        }


                        chartOption.optionPillar.xAxis.data = date.slice(0).reverse();


                        try {

                            var pillarChart = echarts.init(document.getElementById('pillarPayCash'));

                        } catch (err) {

                            return;
                        }


                        window.onresize = pillarChart.resize; //初始化柱状图

                        pillarChart.setOption(chartOption.optionPillar); //渲染中部柱状图



                        var barData = []; //存储数据;

                        var strData = []; //存储不为空值的字段

                        var wrongData = []; //存储空值的"-";

                        var wrongStr = []; //存储为空值的字段;


                        var nameData = ['快钱', '微信', '其它'];


                        for (var i = 0; i < nameData.length; i++) {

                            if (resp.value.model[0]["column" + (i + 2)] != undefined) {

                                barData.push(resp.value.model[0]["column" + (i + 2)]);

                                strData.push(nameData[i]);

                            } else {

                                wrongData.push("-");

                                wrongStr.push(nameData[i]);

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

                            barData[s] = (barData[s].replace(/\d+/g, "")); //把字符串中的数字去掉   "纷享"

                        }

                        for (var m = 0; m < barData.length; m++) {


                            backbarData[m] = parseFloat(backbarData[m]);
                        }


                        if (titleForBar) {

                            chartOption.optionPie.title.text = titleForBar;
                        } else {

                            chartOption.optionPie.title.text = "成功充值金额总数对比";

                        }



                        chartOption.optionPie.series[0].data = (wrongData.concat(backbarData));

                        chartOption.optionPie.yAxis.data = (wrongStr.concat(barData));



                        var pieChart = echarts.init(document.getElementById('piePayCash')); //初始化饼图
                        window.onresize = pieChart.resize;
                        pieChart.setOption(chartOption.optionPie);


                        if (me.flag == false) {

                            me.tableModuleTwo = new TableModule($('#userReDate'));
                            me.tableModuleTwo.renderData(utils.addComma(sTableData[1], 1));

                        } else {

                            me.tableModuleTwo.renderData(utils.addComma(sTableData[1], 1));

                        }

                        me.checkStatus();

                    }

                });

            },
            getBottomChart: function() {
                loadScreen.start();
                var me = this;
                var btQuery = me.getSearch(); //底部数据请求时需要添加两个多余的参数;
                app.api({
                    url: '/business/paycash/withdrawindicators', //底部图表数据的请求和渲染;
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


                        me.c = true;

                        me.settleDataThree(resp);

                        var data = sTableData[2].tbody.slice(1);

                        var sucNumber = [],
                            sucTimes = [],
                            withdrawSum = [],
                            withdrawPercent = [],
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            sucNumber.push(data[i][1]); //成功提现金额

                            sucTimes.push(data[i][2]); //成功提现次数;

                            withdrawSum.push(data[i][3]); // 提现总次数

                            withdrawPercent.push(data[i][4]); //提现成功率;

                        }


                        var typeArray = [sucNumber.slice(0).reverse(), sucTimes.slice(0).reverse(), withdrawSum.slice(0).reverse(), withdrawPercent.slice(0).reverse()]; //颠倒数据顺序


                        for (var n = 0; n < chartOption.optionTwo.series.length; n++) {

                            for (var i = 0; i < typeArray.length; i++) {

                                for (var m = 0; m < typeArray[i].length; m++) {

                                    if (typeArray[i][m] == '-') { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                        typeArray[i][m] = 0;

                                    } else {
                                        typeArray[i][m] = parseFloat(typeArray[i][m]);

                                    }
                                }
                            }
                            chartOption.optionTwo.series[n].data = typeArray[n];
                        }



                        chartOption.optionTwo.xAxis.data = date.slice(0).reverse();

                        console.log(chartOption.optionTwo);



                        try {

                            var lineChartTwo = echarts.init(document.getElementById('linePayCashTwo')); //初始化底部折线图

                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChartTwo.resize;

                        lineChartTwo.setOption(chartOption.optionTwo);

                        if (me.flag == false) {

                            me.tableModuleThree = new TableModule($('#withdrawList')); //渲染底部图表
                            me.tableModuleThree.renderData(utils.addComma(sTableData[2], 1));
                        } else {

                            me.tableModuleThree.renderData(utils.addComma(sTableData[2], 1));

                        }

                        me.checkStatus();

                    }
                });
            },

            initSelect: function() {
                var me = this;
                $("#session").change(function() {
                    me.resetData();
                    me.getTopChart(); //实时刷新顶部图表
                });
            },
            checkStatus: function() {
                var me = this;
                if (me.a == true && me.b == true && me.c == true) {

                    $(".search,.reset").removeAttr("disabled").css({
                        "backgroundColor": "#FAAC3E"
                    });
                }

            },
            rstButtoStatus: function(obj) {
                var me = this;
                me.a = false;
                me.b = false;
                me.c = false;

                obj.attr("disabled", "disabled").css({
                    "backgroundColor": "grey"
                });
            },

            initDownLoad: function() {
                var me = this;


                $('.download:eq(0)').click(function() {

                    var tpQuery = me.getSearch();
                    tpQuery.rechargeChannel = ($('#session').val() == "all" ? '' : $('#session').val());

                    var url = BI.API_PATH + "/business/paycash/rechargeindicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });


                $(".download:eq(1)").click(function() {


                    var ctQuery = me.getSearch();


                    ctQuery.rechargeChannels = TypesPayCash.join(',');

                    ctQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype'));

                    if (ctQuery.indicator == 3) {


                        var url = BI.API_PATH + "/business/paycash/rechargedimensionsdownrate" + "?" + $.param(ctQuery);

                    } else {

                        var url = BI.API_PATH + "/business/paycash/rechargedimensionsdown" + "?" + $.param(ctQuery);
                    }


                    window.open(url);
                });



                $('.download:eq(2)').click(function() {

                    var btQuery = me.getSearch();
                    var url = BI.API_PATH + "/business/paycash/withdrawindicatorsdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});