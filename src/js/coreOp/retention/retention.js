/*
 *
 *  留存率核心逻辑 Created By Haihu Han
 *  异步请求两次数据时可能会出现bug;
 */

define(function(require, exports, module) {
    exports.init = function() {
        var $el = exports.$el;
        var listData = require('../../commModule/listModel.js');
        var helpObject = require('../../commModule/helpInfo.js');
        var sTableData = [{
            'thead': '',
            'tbody': ''
        }, {
            'thead': '',
            'tbody': ''
        }];

        var $date = $el.find('#date');
        var app = BI.app;
        var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期控件配置文件
        var loadScreen = new(require('../../commModule/loadScreen.js'))(app);

        function MainChart() {
            this.init.apply(this, arguments);
        }

        /*

        @params dataRepository 保存每次请求回来的数据

        */

        MainChart.prototype = {
            //初始化
            init: function() {
                var me = this;
                me.padding(); //从后台请求回来select option的值来填充
                me.initChange(); // 初始化日周月切换按钮
                me.showHelp();
                me.initDateWidget(); //初始化日期时间插件
                me.loadSource(); //首次进入页面时，默认请求两次数据;
                me.initChoice(); //折线图参数切换
                me.getCheck(); // 查看按钮绑定点击事件
                me.bindReset(); //绑定重置按钮点击事件

                $("#tip_board").html($('#tiptemplate').html());
            },
            dataRepository: {},
            status: {
                a: false,
                b: false
            },
            container: [],
            $: function(str) {
                return $el.find(str);
            },
            showHelp: function() {

                $(".timetype").append($(helpObject.strForOp)).css('position', 'relative');

                $('.icon:eq(1)').hover(function() {

                    $('.helps').css("display", "block").parent('#tipBoard').css({
                        'left': '61%',
                        'top': '50px'
                    });

                }, function() {

                    $('.helps').css("display", "none");

                });
            },
            initDateWidget: function() { //初始化日期插件
                dateConfig.runForRe();
            },
            getCheck: function() { //点击查看按钮时重新渲染页面
                var me = this;
                me.$('.search').click(function() {
                    me.resetButtonStatus($(this));
                    me.loadSource();
                });
            },
            initChange: function() {
                var me = this;
                $('.timetype button').on('click', function(ev) {
                    ev.preventDefault();
                    $(this).addClass('active').siblings().removeClass('active');
                });
            },
            initChoice: function() {
                var me = this;
                me.$('.label button').click(function() {

                    if (me.switching) { //阻止连续切换
                        return;
                    }

                    window.setTimeout(function() {
                        me.switching = false;
                    }, 600);

                    me.switching = true;

                    $(this).addClass('active').siblings().removeClass('active'); //点击新用户N天留存率和新企业N天留存率时切换

                    var title = "";

                    switch ($(".label button[class=active]").attr('data-item')) {

                        case "1":
                            title = '新增登录用户留存率';
                            break;
                        case "2":
                            title = '新增注册企业留存率';

                            break;

                        default:
                    }
                    me.initChart(me.dataRepository, title);
                });
            },
            loadSource: function() { //初次进入页面时加载数据和点击查看按钮时加载数据
                loadScreen.start(2);
                var me = this;

                app.api({ //请求新增用户部分数据
                    url: 'operation/retention/newuser2',
                    type: 'POST',
                    data: me.getSearch(),
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        if (typeof resp.value == 'undefined') {

                            $(".search,.reset").removeAttr("disabled").css({
                                "backgroundColor": "#FAAC3E"
                            });
                            return;
                        }

                        me.status.a = true;
                        var values = resp.value.model;

                        var str = "日期";

                        me.dataRepository.tbodyUser = me.formatData(values).tbodyOne; //用来渲染折线图的数据

                        me.dataRepository.xAxis = values.legends; // 折线图的横坐标

                        me.dataRepository.legends = values.categories; // 折线图的图例

                        values.legends.splice(0, 0, str); //给表格的头部加上“时间”,已经改变了values.legends的值

                        sTableData[0].thead = values.legends;

                        sTableData[0].tbody = me.formatData(values).tbodySecond; //渲染新增用户表格

                        for (var i = 0; i < me.dataRepository.tbodyUser.length; i++) {
                            me.dataRepository.tbodyUser[i].shift(); //用来渲染折线图的数据
                        }

                        if (me.status.a == true && me.status.b == true) { //当两组数据都请求回来后，才进行渲染

                            me.checkStatus();
                            me.initList(sTableData);
                            me.initChart(me.dataRepository);
                            me.status.a = false;
                            me.status.b = false;
                        }
                    }
                });

                app.api({ //请求新增企业部分数据
                    url: 'operation/retention/newentperise2',
                    type: 'POST',
                    data: me.getSearch(),
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        if (typeof resp.value == 'undefined') {

                            $(".search,.reset").removeAttr("disabled").css({
                                "backgroundColor": "#FAAC3E"
                            });

                            return;
                        }
                        me.status.b = true;

                        var values = resp.value.model;

                        var str = "日期";

                        me.dataRepository.tbodyEpre = me.formatData(values).tbodyOne; //渲染折线图

                        values.legends.splice(0, 0, str); //引用数据类型改变了values.legends 的值；

                        sTableData[1].thead = values.legends;
                        sTableData[1].tbody = me.formatData(values).tbodySecond; //渲染新增企业表格

                        for (var i = 0; i < me.dataRepository.tbodyEpre.length; i++) {
                            me.dataRepository.tbodyEpre[i].shift(); //去掉日期渲染折线图
                        }

                        if (me.status.a == true && me.status.b == true) { //两组数据同时请求完成后才会进行渲染;
                            me.checkStatus();
                            me.initList(sTableData);
                            me.initChart(me.dataRepository);
                            me.status.a = false;
                            me.status.b = false;
                        }
                    }
                });
            },
            initList: function(obj) { //初始化底部列表
                //渲染第一个列表
                var tableModule = new TableModule($('#userRe'));
                tableModule.renderData(obj[0]);
                //渲染第二个列表
                var tableModule = new TableModule($('#userReDate'));
                tableModule.renderData(obj[1]);

            },
            initChart: function(source, title) {


                try {

                    window.retentionCharta = echarts.init(document.getElementById('lineRe')); //渲染折线图
                } catch (err) {

                    return;
                }

                $(window).bind('resize', function() {
                    retentionCharta.resize();
                });

                var me = this;
                var option = {
                    title: {
                        text: (title ? title : "新增登录用户留存率"),
                        subtext: '',
                        x: 'center',
                    },
                    smooth: true,
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            var html = params[0].name + '<br/>';
                            var htmlTwo = "<div style='text-align:left'>";
                            for (var i = 0; i < params.length; i++) {
                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].value ? params[i].value + "%" : "") + "<br/>")
                            }
                            html += htmlTwo;
                            html += "</div>";
                            return html;
                        }

                    },

                    legend: {
                        orient: 'horizontal',
                        bottom: 0,
                        data: source.legends.slice(0).reverse(),
                        icon: 'pin',
                        textStyle: {
                            fontSize: 10
                        },
                    },
                    xAxis: {
                        type: 'category',
                        data: source.xAxis,
                        boundaryGap: false,
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 70,
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                            title: '保存为图片'
                        },
                        right: 60
                    },
                    /**
                     *
                     * yaxis 纵坐标轴
                     */
                    yAxis: {
                        type: 'value',
                        name: '百分比',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}.00%'
                        }
                    },

                    grid: {
                        left: '3%',
                        bottom: '20%',
                        containLabel: true,
                    },
                    series: []
                };

                var val = $(".label button[class=active]").attr('data-item');

                if (val == "1") {
                    dataArray = source.tbodyUser;

                } else {
                    dataArray = source.tbodyEpre;
                }

                for (var i = 0; i < dataArray.length; i++) {
                    var item = {
                        name: me.dataRepository.legends[i],
                        type: 'line',
                        data: '',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }
                    }
                    item.data = dataArray[i];

                    for (var m = 0; m < item.data.length; m++) {

                        if (item.data[m] == null) {

                            item.data[m] = "";
                        }

                    }

                    option.series.push(item);
                }

                var copy = [];

                $.each(option.xAxis.data, function(index, value) {
                    copy.push(value);
                });

                if (copy[0] == '日期') { //如果数组第一个是时间字段的话去掉

                    copy.shift();
                }
                option.xAxis.data = copy; //x轴数据

                retentionCharta.setOption(option);
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
            getSearch: function() {
                var me = this;
                var obj = {}
                obj.start = me.getTime().start;
                obj.end = me.getTime().end;
                obj.scope = ($("#scope").val() == 'all' ? '' : $("#scope").val()); //企业规模
                // obj.payType = ($('#active').val() == 'all' ? '' : $('#active').val()); //付费状态
                obj.industry = ($('#category').val() == 'all' ? '' : $('#category').val()); //行业类别
                obj.source = ($('#sourceId').val() == 'all' ? '' : $('#sourceId').val()); //企业来源类型
                obj.area = ($('#distract').val() == 'all' ? '' : $('#distract').val()); //地区
                // obj.activity = ($('#actDegree').val() == 'all' ? '' : $('#actDegree').val()); //活跃度

                obj.establishedAccount = ($("#accountNum").val() == 'all' ? '' : $("#accountNum").val()); //开通账号数量；

                obj.enterpriseType = ($("#entType").val() == 'all' ? '' : $("#entType").val()); //企业类型


                obj.type = me.getTimeType();
                switch (obj.type) {
                    case 0:
                        obj.retentions = '1,2,3,4,5,6,14,30';
                        break;
                    case 1:
                        obj.retentions = '1,2,3,4,5,6,7,8';
                        break;
                    case 2:
                        obj.retentions = '1,2';
                        break;
                    default:
                }
                return obj;
            },
            formatData: function(model) {

                var obj = {
                        tbodyOne: [],
                        tbodySecond: []
                    }
                    //把数据填充到tbody中
                for (var i = 0; i < model.categories.length; i++) {
                    var array = new Array(model.categories[i]);
                    for (var m = 0; m < model.percent.length; m++) {
                        array.push(model.percent[m][i]);
                    }
                    obj.tbodyOne.push(array);
                }

                for (var i = 0; i < model.categories.length; i++) {
                    var array = new Array(model.categories[i]);
                    for (var m = 0; m < model.percent.length; m++) {
                        array.push(model.percent[m][i] == null ? '-' : model.percent[m][i] + '%');
                    }
                    obj.tbodySecond.push(array);
                }
                return obj;
            },
            padding: function() { //初次进入页面时把请求回来的响应的数据嵌入到select标签中;
                var me = this;
                app.api({
                    url: 'operation/dimension/all',
                    type: 'POST',
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

                        me.$('#scope').append($(fragmentOne)); //填充企业规模


                        // var fragmentTwo = document.createDocumentFragment();
                        // for (var i = 0; i < object.value.model[5].length; i++) {
                        //     var option = document.createElement('option');
                        //     option.innerHTML = object.value.model[5][i].dimension;
                        //     option.setAttribute('value', object.value.model[5][i].value);

                        //     fragmentTwo.appendChild(option);
                        // }

                        // me.$('#active').append($(fragmentTwo)); //填充付费状态

                        var fragmentThree = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[1].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[1][i].dimension;
                            option.setAttribute('value', object.value.model[1][i].value);

                            fragmentThree.appendChild(option);
                        }

                        me.$('#category').append($(fragmentThree)); // 填充行业类别

                        var fragmentFour = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[6].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[6][i].dimension;
                            option.setAttribute('value', object.value.model[6][i].value);

                            fragmentFour.appendChild(option);
                        }

                        me.$('#sourceId').append($(fragmentFour)); //填充企业来源类型


                        var fragmentFive = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[0].length; i++) {
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[0][i].dimension;
                            option.setAttribute('value', object.value.model[0][i].value);

                            fragmentFive.appendChild(option);
                        }

                        $("#distract").append($(fragmentFive)); //填充区域


                        var fragmentSix = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model[15].length; i++) { //活跃度
                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[15][i].dimension;
                            option.setAttribute('value', object.value.model[15][i].value);

                            fragmentSix.appendChild(option);
                        }

                        $("#actDegree").append($(fragmentSix));



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


                        /*这些数据的请求会耗费一些时间，需要优化下*/

                        me.initDownload(); //绑定下载按钮点击事件;

                    },
                    error: function(e) {

                        console.log(e);
                    }
                });

            },

            resetButtonStatus: function(obj) {
                obj.attr("disabled", "disabled").css({
                    "backgroundColor": "grey"
                });
            },

            checkStatus: function() {

                $(".search,.reset").removeAttr("disabled").css({
                    "backgroundColor": "#FAAC3E"
                });
            },
            initDownload: function() {
                var me = this;


                me.$('.download:eq(0)').click(function() {
                    var url = BI.API_PATH + "/operation/retention/downuser2" + "?" + $.param(me.getSearch());
                    window.open(url);
                });

                me.$('.download:eq(1)').click(function() {
                    var url = BI.API_PATH + "/operation/retention/downenterprise2" + "?" + $.param(me.getSearch());
                    window.open(url);
                });
            },
            bindReset: function() {
                var me = this;
                $(".reset").click(function() {
                    me.resetButtonStatus($(this));
                    me.initDateWidget(); //初始化日期时间插件
                    $(".timetype button[class=active]").removeClass('active');

                    $('.timetype button[data-timetype=0]').addClass('active');
                    $("#lineChart button[class=active]").removeClass("active");
                    $("#lineChart button[data-item=1]").addClass("active");
                    $("select").val("all");
                    me.loadSource(); //首次进入页面时，默认请求两次数据;
                    me.initChoice(); //折线图参数切换
                });
            }
        }
        var mainChart = new MainChart();
    }
});