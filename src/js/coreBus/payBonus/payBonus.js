define(function(require, exports, module) {
    exports.init = function() {

        var sTableData = {
            'thead': [
                '日期',
                '发送红包金额',
                '发送红包个数',
                '金额均值',
            ],
            'tbody': []
        };

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
                me.getCheck(); //点击查看时请求二次数据
                me.loadSource(me.flag); //进入页面时二次请求
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
                sTableData = {
                    'thead': [
                        '日期',
                        '发送红包金额',
                        '发送红包个数',
                        '金额均值',
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

                }

                me.getTopChart(); // 顶部数据请求及渲染

            },
            settleData: function(resp) { //整理第一个表的数据

                var me = this;

                var tbody = sTableData.tbody; //整理数据


                var dataArray = ['date', 'column1', 'column2', 'column3'];

                for (var i = 0; i < resp.value.model.length; i++) {

                    var array = [];

                    for (var j = 0; j < dataArray.length; j++) {

                        if (resp.value.model[i][dataArray[j]] == null) {

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

                        // 这些数据的请求会耗费一些时间，需要优化下

                        me.initDownLoad(); //绑定下载按钮点击事件;
                    }
                });

            },
            getTopChart: function() { //顶部图表数据的请求和渲染
                loadScreen.start();
                var me = this;
                var tpQuery = me.getSearch();

                app.api({
                    url: '/business/paybag/indicators', //顶部图表数据的请求
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
                        var data = sTableData.tbody.slice(1);
                        var bonusSum = [], //红包金额
                            bonusAmount = [], //红包个数
                            average = [], //红包金额均值
                            date = [];

                        for (var i = 0; i < data.length; i++) {
                            date.push(data[i][0]);

                            bonusSum.push(data[i][1]);

                            bonusAmount.push(data[i][2]);

                            average.push(data[i][3]);
                        }

                        chartOption.option.series[0].data = bonusSum.slice(0).reverse();
                        chartOption.option.series[1].data = bonusAmount.slice(0).reverse();
                        chartOption.option.series[2].data = average.slice(0).reverse();

                        chartOption.option.xAxis.data = date.slice(0).reverse();

                        try {

                            var lineChart = echarts.init(document.getElementById('linePayBonus'));

                        } catch (err) {

                            return;
                        }

                        window.onresize = lineChart.resize; //初始化折线图

                        lineChart.setOption(chartOption.option);


                        if (me.flag == false) {

                            me.tableModule = new TableModule($('#userRe')); //渲染图表
                            me.tableModule.renderData(utils.addCommaForPayBonus(sTableData, 1));
                        } else {

                            me.tableModule.renderData(utils.addCommaForPayBonus(sTableData, 1));
                        }

                        me.checkStatus();
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

                    var tpQuery = me.getSearch();
                    var url = BI.API_PATH + "/business/paybag/indicatorsdown" + "?" + $.param(tpQuery);
                    window.open(url);
                });
            }
        }
        var session = new Session();
    }
});