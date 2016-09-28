define(function(require, exports, module) {
    exports.init = function() {

        var sTableData = [{
            'thead': [
                '日期',
                '考勤签到人数',
                '考勤签到成功次数',
                '考勤签到总次数',
                '考勤签到成功率',
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '外勤签到人数',
                '外勤签到成功次数',
                '外勤签到总次数',
                '外勤签到成功率'
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
                me.getCheck(); //点击查看时数据
                me.loadSource(me.flag); //进入页面时请求数据
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
                    console.log(111);
                });
            },
            resetData: function() {
                sTableData = [{
                    'thead': [
                        '日期',
                        '考勤签到人数',
                        '考勤签到成功次数',
                        '考勤签到总次数',
                        '考勤签到成功率',
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '外勤签到人数',
                        '外勤签到成功次数',
                        '外勤签到总次数',
                        '外勤签到成功率'
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
                // obj.terminalAndVersion = ($("#terminalType").val() == 'all' ? '' : $('#terminalType').val()); //终端类型-产品版本号;
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

            getTimeType: function() { //获取日,周,月类型

                var typeValue = $('.timetype').children('.active').attr('data-timetype');
                return parseInt(typeValue);
            },

            loadSource: function(flag) { //这里要请求两此数据，和一次筛选区select下拉框的的键值对;
                var me = this;

                me.resetData();

                if (!flag) {

                    me.getSearchInfo(); //只有当第一次进入页面的时候才会进行筛选区数据的填充，如果是点击查看按钮那么是不会进行筛选区的填充的。

                } else {

                    me.getTopChart(); // 顶部数据请求及渲染
                    me.getBottomChart(); //底部数据请求及渲染;

                }

            },
            settleData: function(resp) { //整理第一个表的数据

                var me = this;
                var tbody = sTableData[0].tbody; //整理数据

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    array[0] = resp.value.model[i].date;

                    array[1] = resp.value.model[i].column1;

                    array[2] = resp.value.model[i].column2;

                    array[3] = resp.value.model[i].column3;

                    if (!resp.value.model[i].percent) {

                        array[4] = '-';

                    } else {

                        array[4] = resp.value.model[i].percent;
                    }

                    tbody.push(array);
                }

            },

            settleDataTwo: function(resp) { //整理第二个表的数据
                var me = this;
                var tbody = sTableData[1].tbody;

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    array[0] = resp.value.model[i].date;

                    array[1] = resp.value.model[i].column1;

                    array[2] = resp.value.model[i].column2;

                    array[3] = resp.value.model[i].column3;

                    if (!resp.value.model[i].percent) {

                        array[4] = '-';
                    } else {


                        array[4] = resp.value.model[i].percent;
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


                        // 这些数据的请求会耗费一些时间，需要优化下

                        me.getTopChart(); // 顶部数据请求及渲染
                        me.getBottomChart(); //底部数据请求及渲染;

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                var me = this;
                loadScreen.start();
                var tpQuery = me.getSearch();
                tpQuery.checkType = 0;

                app.api({
                    url: '/business/checkin/inout', //顶部图表数据的请求
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

                        console.log(resp);
                        me.a = true;
                        me.settleData(resp);

                        console.log(sTableData);
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

                        chartOption.optionOne.series[0].data = newSession.slice(0).reverse();
                        chartOption.optionOne.series[1].data = activeSession.slice(0).reverse();
                        chartOption.optionOne.series[2].data = accurate.slice(0).reverse();


                        for (var i = 0; i < acPercent.length; i++) {

                            if (acPercent[i] == '-') {

                                acPercent[i] = 0;
                            } else {
                                acPercent[i] = parseFloat(acPercent[i]);

                            }

                        }
                        console.log(chartOption.optionOne.series);


                        chartOption.optionOne.series[3].data = acPercent.slice(0).reverse();
                        console.log(chartOption.optionOne.series);

                        chartOption.optionOne.xAxis.data = date.slice(0).reverse();

                        try {

                            var lineChart = echarts.init(document.getElementById('lineAttOne'));

                        } catch (err) {

                            return;
                        }

                        lineChart.setOption(chartOption.optionOne);



                        window.onresize = lineChart.resize; //使折线图能够随屏幕响应式扩展

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
            getBottomChart: function() {
                loadScreen.start();
                var me = this;
                var btQuery = me.getSearch(); //底部数据请求时需要添加额外的参数;
                btQuery.checkType = 1;
                app.api({
                    url: '/business/checkin/inout', //底部图表数据的请求和渲染;
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
                            single = [],
                            common = [],
                            department = [],
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            sum.push(data[i][1]);

                            single.push(data[i][2]);

                            common.push(data[i][3]);

                            department.push(data[i][4]);
                        }


                        console.log(sTableData);

                        chartOption.optionTwo.series[0].data = sum.slice(0).reverse(); //外勤签到人数
                        chartOption.optionTwo.series[1].data = single.slice(0).reverse(); //外勤签到次数
                        chartOption.optionTwo.series[2].data = common.slice(0).reverse(); //外勤签到成功次数

                        for (var i = 0; i < department.length; i++) {

                            if (department[i] == "-") {

                                department[i] = 0;
                            } else {

                                department[i] = parseFloat(department[i]);
                            }
                        }

                        chartOption.optionTwo.series[3].data = department.slice(0).reverse(); //外勤签到成功率
                        chartOption.optionTwo.xAxis.data = date.slice(0).reverse();


                        try {

                            var lineChartTwo = echarts.init(document.getElementById('lineAttTwo')); //初始化折线图二

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
                    tpQuery.checkType = 0;
                    var url = BI.API_PATH + "/business/checkin/inoutdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });



                $('.download:eq(1)').click(function() {

                    var btQuery = me.getSearch();

                    btQuery.checkType = 1;

                    var url = BI.API_PATH + "/business/checkin/inoutdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});