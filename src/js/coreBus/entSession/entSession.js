// Created By Haihu Han 



define(function(require, exports, module) {
    exports.init = function() {

        var TypesEnt = [];
        var sTableData = [{
            'thead': [
                '日期',
                '新增会话',
                '活跃会话',
                '累计会话',
                '活跃会话占比',
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '总数',
                '单聊',
                '普通群组',
                '部门群组',
                '项目管理群组',
                '其它'
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
                            titleForBar = "新增会话总数对比";
                            titleForPillar = "新增会话分时对比";
                            break;

                        case "1":
                            titleForBar = "活跃会话总数对比";
                            titleForPillar = "活跃会话分时对比";

                            break;
                        case "2":
                            titleForBar = "累计会话总数对比";
                            titleForPillar = "累计会话分时对比";
                            break;

                        default:
                    }

                    me.getBottomChart(titleForBar, titleForPillar); // 切换指标时实时刷新底部数据;
                });
            },

            resetData: function() {
                sTableData = [{
                    'thead': [
                        '日期',
                        '新增会话',
                        '活跃会话',
                        '累计会话',
                        '活跃会话占比',
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '总数',
                        '单聊',
                        '普通群组',
                        '部门群组',
                        '项目管理群组',
                        '其它'
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

            settleDataTwo: function(resp) { //整理第二个表的数据
                var me = this;
                var tbody = sTableData[1].tbody;


                var columnArray = ['date', 'total', 'column2', 'column3', 'column4', 'column5', 'column6'];

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

                        // var fragmentFour = document.createDocumentFragment();
                        // for (var i = 0; i < object.value.model[3].length; i++) {
                        //     var option = document.createElement('option');
                        //     option.innerHTML = object.value.model[3][i].dimension;
                        //     option.setAttribute('value', object.value.model[3][i].value);

                        //     fragmentFour.appendChild(option);
                        // }

                        // $('#terminalType').append($(fragmentFour)); //填充终端类型;


                        var fragmentFive = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[0].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[0][i].dimension;
                            option.setAttribute('value', object.value.model[0][i].value);

                            fragmentFive.appendChild(option);
                        }

                        $("#distract").append($(fragmentFive)); //填充区域

                        var fragmentSix = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[7].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[7][i].dimension;
                            option.setAttribute('value', object.value.model[7][i].value);

                            TypesEnt.push(object.value.model[7][i].value);

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

                        me.getBottomChart();

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;

                var tpQuery = me.getSearch();
                tpQuery.sessionType = ($('#session').val() == "all" ? '' : $('#session').val()); //会话类别的值

                app.api({
                    url: '/business/qixin/sessionindicators', //顶部图表数据的请求
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

                        var newSession = [],
                            activeSession = [],
                            accurate = [],
                            acPercent = [],
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

                            chartOption.option.series[n].data = typeArray[n];
                        }


                        chartOption.option.xAxis.data = date.slice(0).reverse();


                        try {


                            var lineChart = echarts.init(document.getElementById('lineEntSession'));


                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);
                        console.log(chartOption.option.series);

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
            getBottomChart: function(titleForBar, titleForPillar) {
                loadScreen.start();
                var me = this;
                var btQuery = me.getSearch(); //底部数据请求时需要添加两个多余的参数;
                btQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype')); // 指标切换的值
                btQuery.sessionTypes = TypesEnt.join(','); //所有的会话类别可能是写死的
                app.api({
                    url: '/business/qixin/sessiondimensions', //底部图表数据的请求和渲染;
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

                        var data = sTableData[1].tbody.slice(1);


                        var sum = [],
                            single = [], //单聊
                            common = [], //普通群组
                            department = [], // 部门群组
                            program = [], //项目组
                            others = [], //其他


                            date = [];


                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            sum.push(data[i][1]);

                            single.push(data[i][2]);

                            common.push(data[i][3]);

                            department.push(data[i][4]);

                            program.push(data[i][5]);

                            others.push(data[i][6]);
                        }


                        var typeArray = [single.slice(0).reverse(), common.slice(0).reverse(), department.slice(0).reverse(), program.slice(0).reverse(), others.slice(0).reverse()]; //颠倒数据顺序


                        for (var n = 0; n < chartOption.optionPillar.series.length; n++) {

                            for (var i = 0; i < typeArray.length; i++) {

                                for (var m = 0; m < typeArray[i].length; m++) {

                                    if (typeArray[i][m] == '-') { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                        typeArray[i][m] = 0;

                                    } else {
                                        typeArray[i][m] = parseFloat(typeArray[i][m]);

                                    }
                                }
                            }
                            chartOption.optionPillar.series[n].data = typeArray[n];
                        }


                        if (titleForPillar) {

                            chartOption.optionPillar.title.text = titleForPillar;

                        } else {

                            chartOption.optionPillar.title.text = "新增会话分时对比";

                        }

                        chartOption.optionPillar.xAxis.data = date.slice(0).reverse();


                        try {

                            var pillarChart = echarts.init(document.getElementById('pillarEntSession')); //初始化柱状图

                        } catch (err) {

                            return;
                        }

                        window.onresize = pillarChart.resize;

                        pillarChart.setOption(chartOption.optionPillar);



                        var barData = []; //存储数据;

                        var strData = []; //存储不为空值的字段

                        var wrongData = []; //存储空值的"-";

                        var wrongStr = []; //存储为空值的字段;


                        var nameData = ['单聊', '普通群组', '部门群组', '项目管理群组', '其它'];


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

                            chartOption.optionPie.title.text = "新增会话总数对比";

                        }

                        chartOption.optionPie.series[0].data = (wrongData.concat(backbarData));

                        chartOption.optionPie.yAxis.data = (wrongStr.concat(barData));

                        var pieChart = echarts.init(document.getElementById('pieEntSession')); //初始化饼图
                        window.onresize = pieChart.resize;
                        pieChart.setOption(chartOption.optionPie);

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

            initSelect: function() {
                var me = this;
                $("#session").change(function() {
                    me.resetData(); //当select的值变化时,实时的刷新图表
                    me.getTopChart();
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
                    tpQuery.sessionType = ($('#session').val() == "all" ? '' : $('#session').val()); //会话类别的值
                    var url = BI.API_PATH + "/business/qixin/sessionindicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });



                $('.download:eq(1)').click(function() {

                    var btQuery = me.getSearch(); //底部数据请求时需要添加两个多余的参数;
                    btQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype')); // 指标切换的值
                    btQuery.sessionTypes = TypesEnt.join(','); //所有的会话类别可能是写死的
                    var url = BI.API_PATH + "/business/qixin/sessiondimensionsdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});