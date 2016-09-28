define(function(require, exports, module) {
    exports.init = function() {

        var TypesCRM = [];

        var sessionTypesTwo = [];

        var sTableData = [{
            'thead': [
                '日期',
                '新增对象',
                '活跃对象',
                '累计对象',
                '活跃占比'
            ],
            'tbody': [

            ]
        }, {
            'thead': [
                '日期',
                '总数',
                '线索',
                '客户',
                '销售流程',
                '联系人',
                '机会',
                '成交/订单',
                '退货单',
                '竞争对手',
                '市场活动',
                '回款',
                '退款',
                '开票申请',
                '合同',
                '产品'
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '总数',
                '线索池',
                '公海',
                '拜访',
                '盘点',
                '角色',
                '其它'
            ],
            'tbody': [

            ]
        }];

        var $el = exports.$el; //每一个js都得这样写，否则就会报错;

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
                me.loadSource(me.flag); //进入页面时次请求数据
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
                            titleForBar = "新增对象总数对比";
                            titleForPillar = "新增对象分时对比";
                            break;

                        case "1":
                            titleForBar = "活跃对象总数对比";
                            titleForPillar = "活跃对象分时对比";

                            break;
                        case "2":
                            titleForBar = "累计对象总数对比";
                            titleForPillar = "累计对象分时对比";
                            break;

                        default:
                    }

                    me.getCenterChart(titleForBar, titleForPillar);
                    me.getBottomChart(titleForBar, titleForPillar); //刷新底部列表
                });
            },

            resetData: function() {
                sTableData = [{
                    'thead': [
                        '日期',
                        '新增对象',
                        '活跃对象',
                        '累计对象',
                        '活跃占比'
                    ],
                    'tbody': [

                    ]
                }, {
                    'thead': [
                        '日期',
                        '总数',
                        '线索',
                        '客户',
                        '销售流程',
                        '联系人',
                        '机会',
                        '成交/订单',
                        '退货单',
                        '竞争对手',
                        '市场活动',
                        '回款',
                        '退款',
                        '开票申请',
                        '合同',
                        '产品'
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '总数',
                        '线索池',
                        '公海',
                        '拜访',
                        '盘点',
                        '角色',
                        '其它'
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

            getTimeType: function() { //获取日,周,月

                var typeValue = $('.timetype').children('.active').attr('data-timetype');
                return parseInt(typeValue);
            },

            loadSource: function(flag) {
                var me = this
                me.resetData(); //重置数据
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


                var columnArray = ['date', 'column1', 'column2', 'column3', 'percent']; //新增对象  //活跃对象 //累计对象  //活跃占比

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

            settleDataTwo: function(resp) { // 整理第二次表的数据

                var me = this;

                var tbody = sTableData[1].tbody; //整理数据

                var columnArray = ['date', 'total', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12', 'column13', 'column14', 'column15'];


                //时间 //总数 //线索  //客户 //销售流程 //联系人 // 机会 //成交/订单 //退货单 //竞争对手 //市场活动 //回款 //退款 //开票申请 //合同  //产品 

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

            settleDataThree: function(resp) { //整理第三个表的数据

                var me = this;

                var tbody = sTableData[2].tbody;

                var columnArray = ['date', 'total', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7'];

                //时间 //总数 //线索池 //公海 //拜访  //盘点  //角色  //其他


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


                        console.log(object);
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
                        for (var i = 0; i < object.value.model[11].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[11][i].dimension;
                            option.setAttribute('value', object.value.model[11][i].value);



                            if (object.value.model[11][i].type == 0) {

                                TypesCRM.push(object.value.model[11][i].value);


                            } else if (object.value.model[11][i].type == 1) {


                                sessionTypesTwo.push(object.value.model[11][i].value);



                            }



                            fragmentSix.appendChild(option);
                        }



                        $("#session").append($(fragmentSix));


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
                var me = this;

                loadScreen.start();
                var tpQuery = me.getSearch();
                tpQuery.objectType = ($('#session').val() == "all" ? '' : $('#session').val()); //对象类别

                app.api({
                    url: '/business/crmobject/indicators', //顶部图表数据的请求
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
                        var addObject = [], // 新增对象
                            activeObject = [], //活跃对象
                            accuObject = [], // 累计对象
                            percent = [], // 活跃占比
                            date = []; //  日期

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            addObject.push(data[i][1]); // 

                            activeObject.push(data[i][2]);

                            accuObject.push(data[i][3]);

                            percent.push(data[i][4]);
                        }


                        var typeArray = [addObject.slice(0).reverse(), activeObject.slice(0).reverse(), accuObject.slice(0).reverse(), percent.slice(0).reverse()];


                        for (var n = 0; n < typeArray.length; n++) {

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

                            var lineChart = echarts.init(document.getElementById('lineCrm'));

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

                ctQuery.dimensionType = 0;

                ctQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype'));

                ctQuery.objectTypes = TypesCRM.join(',');

                app.api({
                    url: '/business/crmobject/dimensions',
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

                        var clue = [], //线索
                            client = [], //客户
                            contact = [], // 联系人
                            chance = [], //机会
                            done = [], //成交
                            competitor = [], // 竞争对手
                            activity = [], // 市场活动
                            rbcash = [], //回款
                            application = [], // 开票申请
                            contract = [], // 合同
                            product = [], //产品
                            shopVisit = [], //巡店
                            check = [], //盘点
                            others = [], // 其他

                            date = [];

                        for (var i = 0; i < data.length; i++) {

                            date.push(data[i][0]);

                            clue.push(data[i][2]); //线索

                            client.push(data[i][3]); //客户

                            contact.push(data[i][4]); //联系人

                            chance.push(data[i][5]); //机会

                            done.push(data[i][6]); // 成交

                            competitor.push(data[i][7]); // 竞争对手

                            activity.push(data[i][8]); // 市场活动

                            rbcash.push(data[i][9]); // 回款

                            application.push(data[i][10]); // 开票申请
                            contract.push(data[i][11]); //合同
                            product.push(data[i][12]); //产品
                            shopVisit.push(data[i][13]); //巡店
                            check.push(data[i][14]); // 盘点
                            others.push(data[i][15]); // 其他


                        }


                        var typeArray = [clue, client, contact, chance, done, competitor, activity, rbcash, application, contract, product, shopVisit, check, others];


                        for (var s = 0; s < typeArray.length; s++) {

                            typeArray[s] = typeArray[s].slice(0).reverse(); //数据翻转

                        }

                        for (var i = 0; i < typeArray.length; i++) {

                            for (var m = 0; m < typeArray[i].length; m++) {

                                if (typeArray[i][m] == '-') { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                    typeArray[i][m] = 0;

                                } else {
                                    typeArray[i][m] = parseFloat(typeArray[i][m]);
                                }
                            }

                            chartOption.optionPillarOne.series[i].data = typeArray[i]; //给柱状图图加上相应的数据
                        }



                        if (titleForPillar) {

                            chartOption.optionPillarOne.title.text = titleForPillar;

                        } else {

                            chartOption.optionPillarOne.title.text = "新增对象分时对比";

                        }



                        chartOption.optionPillarOne.xAxis.data = date.slice(0).reverse();


                        try {

                            var pillarChart = echarts.init(document.getElementById('pillarCrm'), 'shine');
                        } catch (err) {

                            return;
                        }



                        window.onresize = pillarChart.resize; //初始化柱状图

                        pillarChart.setOption(chartOption.optionPillarOne); //渲染中部柱状图



                        var barData = []; //存储数据;

                        var strData = []; //存储不为空值的字段

                        var wrongData = []; //存储空值的"-";

                        var wrongStr = []; //存储为空值的字段;

                        var nameData = ['线索', '客户', '销售流程', '联系人', '机会', '成交/订单', '退货单', '竞争对手', '市场活动', '回款', '退款', '开票申请', '合同', '产品'];



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

                            chartOption.optionPieOne.title.text = titleForBar;
                        } else {

                            chartOption.optionPieOne.title.text = "新增对象总数对比";

                        }

                        chartOption.optionPieOne.series[0].data = (wrongData.concat(backbarData));

                        chartOption.optionPieOne.yAxis.data = (wrongStr.concat(barData));


                        var pieChart = echarts.init(document.getElementById('pieCrm'), 'shine'); //初始化饼图
                        window.onresize = pieChart.resize;
                        pieChart.setOption(chartOption.optionPieOne);


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
            getBottomChart: function(titleForBar, titleForPillar) {

                loadScreen.start();
                var me = this;
                var btQuery = me.getSearch();


                btQuery.dimensionType = 1;

                btQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype'));

                btQuery.objectTypes = sessionTypesTwo.join(',');

                app.api({
                    url: '/business/crmobject/dimensions', //底部图表数据的请求和渲染;
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

                        var sellProcess = [], //线索池
                            openSea = [], //公海
                            cluePool = [], //拜访
                            role = [], //盘点
                            test = [], //角色
                            others = [], //其他
                            date = [];

                        for (var i = 0; i < data.length; i++) {

                            date.push(data[i][0]);

                            sellProcess.push(data[i][2]); //线索池

                            openSea.push(data[i][3]); //公海

                            cluePool.push(data[i][4]); //拜访

                            role.push(data[i][5]); //盘点

                            test.push(data[i][6]) //角色

                            others.push(data[i][7]); //其他

                        }


                        var typeArray = [sellProcess, openSea, cluePool, role, test, others]; //颠倒数据顺序


                        for (var s = 0; s < typeArray.length; s++) {


                            typeArray[s] = typeArray[s].slice(0).reverse(); //数据翻转

                        }



                        for (var n = 0; n < chartOption.optionPillarTwo.series.length; n++) {

                            for (var i = 0; i < typeArray.length; i++) {

                                for (var m = 0; m < typeArray[i].length; m++) {

                                    if (typeArray[i][m] == '-') { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                        typeArray[i][m] = 0;

                                    } else {
                                        typeArray[i][m] = parseFloat(typeArray[i][m]);

                                    }
                                }
                            }
                            chartOption.optionPillarTwo.series[n].data = typeArray[n];
                        }



                        if (titleForPillar) {

                            chartOption.optionPillarTwo.title.text = titleForPillar;

                        } else {

                            chartOption.optionPillarTwo.title.text = "新增对象分时对比";

                        }

                        chartOption.optionPillarTwo.xAxis.data = date.slice(0).reverse();



                        try {

                            var pillarChartTwo = echarts.init(document.getElementById('pillarTwoCrm')); //初始化底部柱状图

                        } catch (err) {

                            return;
                        }

                        window.onresize = pillarChartTwo.resize;

                        pillarChartTwo.setOption(chartOption.optionPillarTwo);

                        var barData = []; //存储数据;

                        var strData = []; //存储不为空值的字段

                        var wrongData = []; //存储空值的"-";

                        var wrongStr = []; //存储为空值的字段;

                        var nameData = ['线索池', '公海', '拜访', '盘点', '角色', '其它'];


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

                            chartOption.optionPieTwo.title.text = titleForBar;
                        } else {

                            chartOption.optionPieTwo.title.text = "新增对象总数对比";

                        }


                        chartOption.optionPieTwo.series[0].data = (wrongData.concat(backbarData));

                        chartOption.optionPieTwo.yAxis.data = (wrongStr.concat(barData));

                        var pieChart = echarts.init(document.getElementById('pieTwoCrm')); //初始化饼图
                        window.onresize = pieChart.resize;
                        pieChart.setOption(chartOption.optionPieTwo);


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
                    tpQuery.objectType = ($('#session').val() == "all" ? '' : $('#session').val());
                    var url = BI.API_PATH + "/business/crmobject/indicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });

                $(".download:eq(1)").click(function() {


                    var ctQuery = me.getSearch();

                    ctQuery.dimensionType = 0;

                    ctQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype'));

                    ctQuery.objectTypes = TypesCRM.join(',');

                    var url = BI.API_PATH + "/business/crmobject/dimensionsdown" + "?" + $.param(ctQuery);

                    window.open(url);
                });


                $('.download:eq(2)').click(function() {

                    var btQuery = me.getSearch();

                    btQuery.dimensionType = 1;

                    btQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype'));

                    btQuery.objectTypes = sessionTypesTwo.join(',');

                    var url = BI.API_PATH + "/business/crmobject/dimensionsdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});