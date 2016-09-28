define(function(require, exports, module) {
    exports.init = function() {

        var TypesEntInfo = [];

        var sTableData = [{
            'thead': [
                '日期',
                '发送消息次数',
                '发送消息人数',
                '均值',
            ],
            'tbody': []
        }, {
            'thead': [
                '日期',
                '总数',
                '文字',
                '语音',
                '图片',
                '位置',
                '文档',
                '电话会议',
                '会议',
                '任务',
                '日程',
                '群通知',
                '群投票(企信)',
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
                me.loadSource(me.flag); //进入页面时三次请求
                me.getCheck(); //点击查看时请求三次数据
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
                        me.switching = false
                    }, 600);
                    me.switching = true;
                    $(this).addClass('active').siblings().removeClass('active');
                    me.resetData();


                    var titleForBar = "",
                        titleForPillar = "";

                    switch ($('.sessiontype .active').attr('data-sessiontype')) {

                        case "0":
                            titleForBar = "发送消息次数总数对比";
                            titleForPillar = "发送消息次数分时对比";
                            break;

                        case "1":
                            titleForBar = "发送消息人数总数对比";
                            titleForPillar = "发送消息人数分时对比";

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
                        '发送消息次数',
                        '发送消息人数',
                        '均值',
                    ],
                    'tbody': []
                }, {
                    'thead': [
                        '日期',
                        '总数',
                        '文字',
                        '语音',
                        '图片',
                        '位置',
                        '文档',
                        '电话会议',
                        '会议',
                        '任务',
                        '日程',
                        '群通知',
                        '群投票(企信)',
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

                var columnArray = ['date', 'column1', 'column2', 'column3'];

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

                var columnArray = ["date", "total", "column2", "column3", "column4", "column5", "column6", "column7", "column8", "column9", "column10", "column11", "column12", "column13"];

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    for (var m = 0; m < 14; m++) {

                        if (resp.value.model[i][columnArray[m]] == undefined) { //当后台没有给基本的字段时，自动将他们的值设为‘-’，不包括0;
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


                        for (var i = 0; i < object.value.model[8].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[8][i].dimension;
                            option.setAttribute('value', object.value.model[8][i].value);
                            TypesEntInfo.push(object.value.model[8][i].value); //保存messageTypes 的值

                            fragmentSix.appendChild(option);
                        }

                        $("#infoType").append($(fragmentSix)); //填充session 类型;

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


                        me.getTopChart(); // 顶部数据请求及渲染
                        me.getBottomChart(); //底部数据请求及渲染;

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;

                var tpQuery = me.getSearch();
                tpQuery.messageType = ($('#infoType').val() == "all" ? '' : $('#infoType').val()); //会话类别的值

                app.api({
                    url: '/business/qixinmessage/messageindicators', //顶部图表数据的请求
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
                        var sendInforNumber = [],
                            sendInforPeople = [],
                            average = [],
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);
                            sendInforNumber.push(data[i][1]);

                            sendInforPeople.push(data[i][2]);
                            average.push(data[i][3]);
                        }

                        var typeArray = [sendInforNumber.slice(0).reverse(), sendInforPeople.slice(0).reverse(), average.slice(0).reverse()];

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

                            var lineChart = echarts.init(document.getElementById('lineEntInfo'));

                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);


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
                btQuery.messageTypes = TypesEntInfo.join(','); //所有的会话类别可能是写死的
                app.api({
                    url: '/business/qixinmessage/messagedimensions', //底部图表数据的请求和渲染;
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
                            word = [],
                            sound = [],
                            pic = [],
                            position = [],
                            doc = [],
                            teleMeeting = [],
                            Meeting = [],
                            task = [],
                            range = [],
                            inform = [],
                            teamInfo = [],
                            vote = [],
                            Other = [],
                            date = [];

                        for (var i = 0; i < data.length; i++) {

                            date.push(data[i][0]);

                            sum.push(data[i][1]);

                            word.push(data[i][2]);

                            sound.push(data[i][3]);

                            pic.push(data[i][4]);

                            position.push(data[i][5]);

                            doc.push(data[i][6]);

                            teleMeeting.push(data[i][7]);

                            Meeting.push(data[i][8]);

                            task.push(data[i][9]);

                            range.push(data[i][10]);

                            teamInfo.push(data[i][11]);

                            vote.push(data[i][12]);

                            Other.push(data[i][13]);

                        }


                        var typeArray = [word.slice(0).reverse(), sound.slice(0).reverse(), pic.slice(0).reverse(), position.slice(0).reverse(), doc.slice(0).reverse(), teleMeeting.slice(0).reverse(), Meeting.slice(0).reverse(), task.slice(0).reverse(), range.slice(0).reverse(), teamInfo.slice(0).reverse(), vote.slice(0).reverse(), Other.slice(0).reverse()];


                        for (var n = 0; n < 12; n++) {

                            for (var a = 0; a < 12; a++) {

                                for (var q = 0; q < typeArray[a].length; q++) { //为了防止数据中出现’-‘,影响echarts图的渲染，所以将所有的’-‘，替换成0;

                                    if (typeArray[a][q] == '-') {
                                        typeArray[a][q] = 0;
                                    } else {

                                        typeArray[a][q] = parseFloat(typeArray[a][q]);

                                    }
                                }

                            }
                            chartOption.optionPillar.series[n].data = typeArray[n];
                        }

                        if (titleForPillar) {

                            chartOption.optionPillar.title.text = titleForPillar;

                        } else {

                            chartOption.optionPillar.title.text = "发送消息次数分时对比";

                        }



                        chartOption.optionPillar.xAxis.data = date.slice(0).reverse(); //柱状图的Legend


                        try {

                            var pillarChart = echarts.init(document.getElementById('pillarEntInfo'), 'shine'); //初始化柱状图

                        } catch (err) {

                            return;
                        }



                        window.onresize = pillarChart.resize;

                        pillarChart.setOption(chartOption.optionPillar);



                        var barData = []; //存储数据;

                        var strData = []; //存储不为空值的字段

                        var wrongData = []; //存储空值的"-";

                        var wrongStr = []; //存储为空值的字段;

                        var nameData = ['文字', '语音', '图片', '位置', '文档', '电话会议', '会议', '任务', '日程', '群通知', '群投票(企信)', '其它'];

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



                        chartOption.optionPie.series[0].data = (wrongData.concat(backbarData));

                        chartOption.optionPie.yAxis.data = (wrongStr.concat(barData));

                        if (titleForBar) {

                            chartOption.optionPie.title.text = titleForBar;
                        } else {

                            chartOption.optionPie.title.text = "发送消息次数总数对比";

                        }



                        var pieChart = echarts.init(document.getElementById('pieEntInfo'), 'shine'); //初始化饼图
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
                $("#infoType").change(function() {
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
                    tpQuery.messageType = ($('#infoType').val() == "all" ? '' : $('#infoType').val());

                    var url = BI.API_PATH + "/business/qixinmessage/messageindicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });



                $('.download:eq(1)').click(function() {

                    var btQuery = me.getSearch(); //底部数据请求时需要添加两个多余的参数;
                    btQuery.indicator = parseInt($('.sessiontype .active').attr('data-sessiontype')); // 指标切换的值

                    btQuery.messageTypes = TypesEntInfo.join(',');
                    var url = BI.API_PATH + "/business/qixinmessage/messagedimensionsdown" + "?" + $.param(btQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});