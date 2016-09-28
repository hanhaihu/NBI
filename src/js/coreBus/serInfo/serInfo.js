define(function(require, exports, module) {
    exports.init = function() {

        var TypesSerInfo = [];

        var sTableData = [{
            'thead': [
                '日期',
                '服务号推送人数',
                '服务号推送消息数',
                '推送均值',
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '总数',
                'IT助手',
                '空白模板',
                '空白应用模板',
                '快捷入口模板',
                '快递帮手',
                '示例应用模板',
                '销售知识库',
                '企业文化墙',
                'HR助手',
                '行政助手',
                '项目战报',
                '周五真心话',
                '员工运动',
                '其它第三方应用模板类型',
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
                me.getCheck(); //点击查看时请求数据
                me.loadSource(me.flag); //进入页面时请求数据
                me.initSelect();
                me.initSessionType();
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

                $('.serIndictor button').on('click', function() {
                    if (me.switching) { //阻止连续切换
                        return;
                    }
                    window.setTimeout(function() {
                        me.switching = false
                    }, 600);
                    me.switching = true;
                    $(this).addClass('active').siblings().removeClass('active');
                    me.resetData();

                    var titleForBar = "",
                        titleForPillar = "";

                    switch ($('.serIndictor .active').attr('data-sessiontype')) {

                        case "0":
                            titleForBar = "服务号推送消息数总数对比";
                            titleForPillar = "服务号推送消息数分时对比";
                            break;

                        case "1":
                            titleForBar = "服务号推送人数总数对比";
                            titleForPillar = "服务号推送人数分时对比";
                            break;
                        default:
                    }

                    console.log(titleForBar);
                    console.log(titleForPillar);


                    me.getBottomChart(titleForBar, titleForPillar); // 切换指标时实时刷新底部数据;
                });
            },

            resetData: function() {
                sTableData = [{
                    'thead': [
                        '日期',
                        '服务号推送人数',
                        '服务号推送消息数',
                        '推送均值',
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '总数',
                        'IT助手',
                        '空白模板',
                        '空白应用模板',
                        '快捷入口模板',
                        '快递帮手',
                        '示例应用模板',
                        '销售知识库',
                        '企业文化墙',
                        'HR助手',
                        '行政助手',
                        '项目战报',
                        '周五真心话',
                        '员工运动',
                        '其它第三方应用模板类型',
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

            loadSource: function(flag) {
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


                var columnArray = ['date', 'column1', 'column2', 'column3']; //服务号推送人数   //服务号推送消息数     //推送均值

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

            settleDataTwo: function(resp) { //整理第二个表的数据
                var me = this;
                var tbody = sTableData[1].tbody;


                var columnArray = ['date', 'total', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12', 'column13', 'column14', 'column15', 'column16'];

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

                        var fragmentFive = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[0].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[0][i].dimension;
                            option.setAttribute('value', object.value.model[0][i].value);

                            fragmentFive.appendChild(option);
                        }

                        $("#distract").append($(fragmentFive)); //填充区域

                        var fragmentSix = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[10].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[10][i].dimension;
                            option.setAttribute('value', object.value.model[10][i].value);

                            TypesSerInfo.push(object.value.model[10][i].value);

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
                tpQuery.templateType = ($('#session').val() == "all" ? '' : $('#session').val());

                app.api({
                    url: '/business/serviceaccountmessage/indicators', //顶部图表数据的请求
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

                        var newSession = [], //服务号推送人数 
                            activeSession = [], //服务号推送消息数
                            accurate = [], //推送均值
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            newSession.push(data[i][1]);

                            activeSession.push(data[i][2]);

                            accurate.push(data[i][3]);
                        }

                        var typeArray = [newSession.slice(0).reverse(), activeSession.slice(0).reverse(), accurate.slice(0).reverse()];


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

                            chartOption.option.series[n].data = typeArray[n];
                        }


                        chartOption.option.xAxis.data = date.slice(0).reverse();


                        try {

                            var lineChart = echarts.init(document.getElementById('lineSerInfo'));

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
                var btQuery = me.getSearch();
                btQuery.indicator = parseInt($('.serIndictor .active').attr('data-sessiontype'));
                btQuery.templates = TypesSerInfo.join(',');
                app.api({
                    url: '/business/serviceaccountmessage/dimensions', //底部图表数据的请求和渲染;
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
                            iTCareTpl = [], //IT助手
                            serNumTpl = [], // 空白模板
                            blankTpl = [], //空白应用模板
                            entTpl = [], //快捷入口模板
                            package = [], //快递帮手
                            sampleTpl = [], //示例应用模板

                            saleBase = [], //销售知识库

                            entCulture = [], //企业文化墙

                            hrHelper = [], //'HR助手'
                            adminHelper = [], //'行政助手'
                            projectHelper = [], //项目战报
                            turewordHelper = [], //周五真心话

                            employeSpt = [], //员工运动
                            thirdPart = [], //其它第三方应用模板类型
                            others = [], //其他
                            date = [];


                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            sum.push(data[i][1]);

                            iTCareTpl.push(data[i][2]);

                            serNumTpl.push(data[i][3]);

                            blankTpl.push(data[i][4]);

                            entTpl.push(data[i][5]);

                            package.push(data[i][6]);

                            sampleTpl.push(data[i][7]);
                            saleBase.push(data[i][8]);

                            entCulture.push(data[i][9]);

                            hrHelper.push(data[i][10]);
                            adminHelper.push(data[i][11]);
                            projectHelper.push(data[i][12]);
                            turewordHelper.push(data[i][13]);

                            employeSpt.push(data[i][14]);
                            thirdPart.push(data[i][15]);
                            others.push(data[i][16]);
                        }


                        var typeArray = [iTCareTpl, serNumTpl, blankTpl, entTpl, package, sampleTpl, saleBase, entCulture, hrHelper, adminHelper, projectHelper, turewordHelper, employeSpt, thirdPart, others]; //颠倒数据顺序

                        for (var t = 0; t < typeArray.length; t++) {

                            typeArray[t] = typeArray[t].slice(0).reverse();
                        }


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

                            chartOption.optionPillar.title.text = "服务号推送消息数分时对比";

                        }


                        chartOption.optionPillar.xAxis.data = date.slice(0).reverse();



                        try {

                            var pillarChart = echarts.init(document.getElementById('pillarSerInfo')); //初始化柱状图

                        } catch (err) {

                            return;
                        }

                        window.onresize = pillarChart.resize;

                        pillarChart.setOption(chartOption.optionPillar);



                        var barData = []; //存储数据;

                        var strData = []; //存储不为空值的字段

                        var wrongData = []; //存储空值的"-";

                        var wrongStr = []; //存储为空值的字段;

                        var nameData = ['IT助手', '空白模板', '空白应用模板', '快捷入口模板', '快递帮手', '示例应用模板', '销售知识库', '企业文化墙', 'HR助手', '行政助手', '项目战报', '周五真心话', '员工运动', '其它第三方应用模板类型', '其它'];


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

                            chartOption.optionPie.title.text = "服务号推送消息数总数对比";

                        }

                        chartOption.optionPie.series[0].data = (wrongData.concat(backbarData));

                        chartOption.optionPie.yAxis.data = (wrongStr.concat(barData));


                        var pieChart = echarts.init(document.getElementById('pieSerInfo')); //初始化饼图
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
                    tpQuery.templateType = ($('#session').val() == "all" ? '' : $('#session').val());

                    var url = BI.API_PATH + "/business/serviceaccountmessage/indicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });



                $('.download:eq(1)').click(function() {

                    var btQuery = me.getSearch();
                    btQuery.indicator = parseInt($('.serIndictor .active').attr('data-sessiontype'));
                    console.log()
                    btQuery.templates = TypesSerInfo.join(',');
                    var url = BI.API_PATH + "/business/serviceaccountmessage/dimensionsdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});