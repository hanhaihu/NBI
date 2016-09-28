define(function(require, exports, module) {
    exports.init = function() {
        var sTableData = {
            'thead': [
                '日期',
                '落地页PV',
                '落地页UV',
                '发送验证码点击量',
                '发送验证码点击人数',
                '下一步按钮点击量',
                '下一步按钮点击人数',
                '注册成功企业数',
                '总转换率'
            ],
            'tbody': []
        };
        var sTableData2 = {
            'thead': [
                '日期',
                '平均在线时长(min)',
                '平均员工数',
                '在线企业数',
                '活跃企业数'
            ],
            'tbody': []
        };
        var $el = exports.$el;

        var app = BI.app;

        require('../../commModule/listModel.js'); //引入模板文件;

        var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期控件配置文件

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
                me.watchCodeInput();
                me.initInput();
                me.loadSource(this.flag);
                me.initChange();
                me.showHelp();
                me.initSelect();
                me.getCheck();
                me.initDownload();
                me.bindReset();
                $("#tip_board").html($('#tiptemplate').html());
            },
            flag: false,
            selectScope: $('#scope option').toArray(),
            selectTpye: null,
            dataRepository: null,
            $: function(str) {
                return $el.find(str);
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


                    $('.helps').css("display", "block").parent('#tipBoard').css({
                        'left': '105%',
                    });

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
            loadSource: function(flag) { //初次进入页面时加载数据和点击查看按钮时加载数据
                var me = this;
                loadScreen.start(2);
                $(document).trigger('click');
                app.api({
                    url: '/channel/channel/convert',
                    type: 'POST',
                    data: me.getEffectPara(),
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        me.checkStatus();
                        if (typeof resp.value == 'undefined') return;
                        var values = resp.value.model;
                        me.resetData(); //重置数据为初始化数据
                        var container = {
                            tbody: me.formatData(values),
                            xAxis: me.settleTime(values)[0],
                            aData: me.settleTime(values)[1],
                            bData: me.settleTime(values)[2]
                        };
                        me.dataRepository = container;
                        sTableData.tbody = me.dataRepository.tbody;
                        me.initList(sTableData);
                        // me.initChart(me.dataRepository);
                        me.initChart(me.settleData());
                    }
                });
                app.api({
                    url: '/channel/channel/quality',
                    type: 'POST',
                    data: me.getQuaPara(),
                    dataType: 'json',
                    success: function(resp) {
                        if (!loadScreen.end()) return;
                        me.checkStatus();
                        if (typeof resp.value == 'undefined') return;
                        var values = resp.value.model;
                        me.resetData2(); //重置数据为初始化数据

                        var container = {
                            tbody: me.formatData2(values),
                            xAxis: me.settleTime2(values)[0]
                        };

                        me.dataRepository2 = container;
                        sTableData2.tbody = me.dataRepository2.tbody;
                        me.initList2(sTableData2);
                        me.initChart2(me.dataRepository2);
                    }
                });

            },

            initInput: function() {
                var me = this,
                    oneArr = [],
                    twoArr = [],
                    threeArr = [],
                    fourArr = [],
                    fiveArr = [],
                    arr = [
                        [],
                        [],
                        [],
                        [],
                        []
                    ];

                var array = ['One', 'Two', 'Three', 'Four', 'Five'];

                var reset = function(arr, string) {
                    var newArr = [];
                    var stringArr = string.replace(/\s+/g, '').split(',');
                    for (var i = 0; i < stringArr.length; i++) {
                        if (arr.indexOf(stringArr[i]) !== -1 && newArr.indexOf(stringArr[i]) == -1) {
                            newArr.push(stringArr[i]);
                        }
                    }
                    return newArr;
                }
                var slurfunc = function(index, slurstring, cb) {
                    app.api({
                        url: '/channel/channel/like',
                        type: 'POST',
                        data: {
                            advertType: ($('#payStatus').val() == 'all' ? '' : $('#payStatus').val()),
                            channel: ($('#scope').val() == 'all' ? '' : $('#scope').val()),
                            end: me.getTime().end,
                            index: index,
                            keyWord: index == '2' ? slurstring : $('#autocompleteOne').val().replace(/,$/, ''),
                            monitor: index == '3' ? slurstring : $('#autocompleteTwo').val().replace(/,$/, ''),
                            plan: index == '4' ? slurstring : $('#autocompleteThree').val().replace(/,$/, ''),
                            start: me.getTime().start,
                            template: index == '6' ? slurstring : $('#autocompleteFive').val().replace(/,$/, ''),
                            type: me.getTimeType(),
                            unit: index == '5' ? slurstring : $('#autocompleteFour').val().replace(/,$/, '')
                        },
                        dataType: 'json',
                        success: function(resp) {
                            resp.model && resp.model.length > 0 && cb(resp);
                        }
                    });

                };

                $('.trench').click(function(ev) {
                    if ($(ev.target).parents().hasClass('ms-drop')) return;

                    $('.ms-drop').css('display', 'none');

                    arr[0] = reset(arr[0], $('#autocompleteOne').val());
                    if (arr[0].length !== 0) {
                        $('#autocompleteOne').val(arr[0].join(',') + ',');
                    } else {
                        $('#autocompleteOne').val(arr[0].join(','));
                    }

                    arr[1] = reset(arr[1], $('#autocompleteTwo').val());
                    if (arr[1].length !== 0) {
                        $('#autocompleteTwo').val(arr[1].join(',') + ',');
                    } else {
                        $('#autocompleteTwo').val(arr[1].join(','));
                    }

                    arr[2] = reset(arr[2], $('#autocompleteThree').val());
                    if (arr[2].length !== 0) {
                        $('#autocompleteThree').val(arr[2].join(',') + ',');
                    } else {
                        $('#autocompleteThree').val(arr[2].join(','));
                    }

                    arr[3] = reset(arr[3], $('#autocompleteFour').val());
                    if (arr[3].length !== 0) {
                        $('#autocompleteFour').val(arr[3].join(',') + ',');
                    } else {
                        $('#autocompleteFour').val(arr[3].join(','));
                    }

                    arr[4] = reset(arr[4], $('#autocompleteFive').val());
                    if (arr[4].length !== 0) {
                        $('#autocompleteFive').val(arr[4].join(',') + ',');
                    } else {
                        $('#autocompleteFive').val(arr[4].join(','));
                    }
                });

                //更改select
                var changeSelect = function() {
                    var $optionscope = $('#scope').find('option');
                    var $optiontype = $('#payStatus').find('option');
                    $optionscope.hide();
                    $optiontype.hide();

                    app.api({
                        url: '/channel/channel/like',
                        type: 'POST',
                        data: {
                            advertType: '',
                            channel: '',
                            end: me.getTime().end,
                            index: 0,
                            keyWord: $('#autocompleteOne').val().replace(/,$/, ''),
                            monitor: $('#autocompleteTwo').val().replace(/,$/, ''),
                            plan: $('#autocompleteThree').val().replace(/,$/, ''),
                            start: me.getTime().start,
                            template: $('#autocompleteFive').val().replace(/,$/, ''),
                            type: me.getTimeType(),
                            unit: $('#autocompleteFour').val().replace(/,$/, '')
                        },
                        dataType: 'json',
                        success: function(resp) {
                            if (resp.model && resp.model.length > 0) {
                                var value = resp.model;
                                $optionscope.each(function(i) {
                                    if (value.indexOf($(this).val()) !== -1 || $(this).val() == 'all') {
                                        $optionscope.eq(i).show();
                                    }
                                });
                            }
                        }
                    });

                    app.api({
                        url: '/channel/channel/like',
                        type: 'POST',
                        data: {
                            advertType: '',
                            channel: '',
                            end: me.getTime().end,
                            index: 1,
                            keyWord: $('#autocompleteOne').val().replace(/,$/, ''),
                            monitor: $('#autocompleteTwo').val().replace(/,$/, ''),
                            plan: $('#autocompleteThree').val().replace(/,$/, ''),
                            start: me.getTime().start,
                            template: $('#autocompleteFive').val().replace(/,$/, ''),
                            type: me.getTimeType(),
                            unit: $('#autocompleteFour').val().replace(/,$/, '')
                        },
                        dataType: 'json',
                        success: function(resp) {
                            if (resp.model && resp.model.length > 0) {
                                var value = resp.model;
                                $optiontype.each(function(i) {
                                    if (value.indexOf($(this).val()) !== -1 || $(this).val() == 'all') {
                                        $optiontype.eq(i).show();
                                    }
                                });
                            }
                        }
                    });

                };

                for (var i = 0; i < array.length; i++) {
                    (function(index) {
                        var auto = $('#autocomplete' + array[index]);
                        var key = $('#key' + array[index]);

                        auto.timer = null;
                        auto.on('keyup', function(ev) {

                            clearTimeout(auto.timer);

                            if (ev.which == 8) {
                                changeSelect();
                                return;
                            } //退格

                            //获取最新输入

                            var slurstring = auto.val().split(',').pop();

                            //发出请求
                            auto.timer = setTimeout(function() {
                                slurfunc(key.attr('data-index'), slurstring, function(value) {
                                    //填充数据
                                    var optHTML = '';
                                    for (var i = 0; i < value.model.length; i++) {
                                        optHTML += '<option value=' + value.model[i] + '>' + value.model[i] + '</option>';
                                    }
                                    key.empty();
                                    key.append(optHTML);
                                    if (value.model.length > 0) {
                                        key.multipleSelect({
                                            selectAll: false,
                                            onClick: function(view) {
                                                var oldString = auto.val();

                                                arr[index] = reset(arr[index], auto.val());

                                                if (view.checked && arr[index].indexOf(view.label) == -1) {
                                                    arr[index].push(view.label);
                                                } else if (!view.checked && arr[index].indexOf(view.label) !== -1) {
                                                    arr[index].splice(arr[index].indexOf(view.label), 1);
                                                }
                                                if (arr[index].length !== 0) {
                                                    auto.val(arr[index].join(',') + ',');
                                                } else {
                                                    auto.val(arr[index].join(','));
                                                }

                                                if (oldString !== auto.val()) {
                                                    //更改 select 
                                                    changeSelect();
                                                }
                                            }
                                        });
                                    }
                                    key.siblings('.slurSelect').css('display', 'block');
                                    key.siblings('.slurSelect').find('.ms-drop').css('display', 'block');
                                });
                            }, 500);

                        });
                    })(i);
                }
            },
            initChart: function(source) {
                try {

                    var lineChart = echarts.init(document.getElementById('lineTrenchOne')); //初始化折线图

                } catch (err) {

                    return;
                }

                $(window).bind('resize', function() {
                    lineChart.resize();
                });

                // window.onresize = lineChart.resize;

                //折线图配置

                var reverse = source.aData.slice(0);

                var transPercent = source.bData.slice(0);

                var option = {
                    title: {
                        text: "自注册页面转化指标概览",
                        subtext: '',
                        x: 'center'
                    },
                    smooth: true,
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            var html = params[0].name + '<br/>';
                            var htmlTwo = "";
                            for (var i = 0; i < params.length; i++) {
                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].seriesName == "总转换率" ? (!isNaN(params[i].value) ? params[i].value + "%" : "-") : params[i].value) + "<br/>")
                            }
                            html += htmlTwo;
                            return html;
                        }
                    },
                    legend: {
                        show: true,
                        orient: 'horizontal',
                        bottom: 0,
                        data: ['注册成功企业数', '总转换率'],
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
                    }, {
                        name: '百分比',
                        type: 'value',
                        max: 100,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }],
                    series: [{
                        name: '注册成功企业数',
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
                        name: "总转换率",
                        type: 'line',
                        data: transPercent,
                        yAxisIndex: '1',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }

                    }]
                }

                if (!source.lengendName) {} else {

                    option.legend.data = source.lengendName;

                    if (source.lengendName[0] !== '总转换率' && source.lengendName[1] !== '总转换率') {

                        option.series = [{
                            name: source.lengendName[0],
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
                            name: source.lengendName[1],
                            type: 'line',
                            data: reverse,
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 0
                                }
                            }
                        }]
                        option.yAxis = {
                            name: '数量',
                            type: 'value',
                            min: 0,
                        };

                    } else if (source.lengendName[0] == '总转换率' && source.lengendName[1] !== '总转换率') {

                        option.series = [{
                            name: source.lengendName[0],
                            type: 'line',
                            data: transPercent,
                            yAxisIndex: '1',
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 0
                                }
                            }
                        }, {
                            name: source.lengendName[1],
                            type: 'line',
                            data: reverse,
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 0
                                }
                            }
                        }];

                        option.yAxis = [{
                            name: '数量',
                            type: 'value',
                            min: 0,
                        }, {
                            name: '百分比',
                            type: 'value',
                            max: 100,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        }];



                    } else if (source.lengendName[1] == '总转换率' && source.lengendName[0] !== '总转换率') {

                        option.series = [{
                            name: source.lengendName[0],
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
                            name: source.lengendName[1],
                            type: 'line',
                            data: transPercent,
                            yAxisIndex: '1',
                            itemStyle: {
                                normal: {
                                    borderWidth: 5,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 0
                                }
                            }
                        }];

                        option.yAxis = [{
                            name: '数量',
                            type: 'value',
                            min: 0,
                        }, {
                            name: '百分比',
                            type: 'value',
                            max: 100,
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        }];


                    }
                    option.series[0].data = source.aData;
                    option.series[1].data = source.bData;
                }
                lineChart.setOption(option);
            },
            initChart2: function(source) {


                try {

                    var lineChart = echarts.init(document.getElementById('lineTrenchTwo')); //初始化折线图

                } catch (err) {

                    return;
                }

                $(window).bind('resize', function() {
                    lineChart.resize();
                });

                // window.onresize = lineChart.resize;

                var option = {
                    title: {
                        text: "自注册企业质量指标概览",
                        subtext: '',
                        x: 'center'
                    },
                    smooth: true,
                    legend: {
                        show: true,
                        orient: 'horizontal',
                        bottom: 0,
                        data: ['平均在线时长', '平均员工数', '在线企业数', '活跃企业数'],
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
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            var html = params[0].name + '<br/>';
                            var htmlTwo = "";
                            for (var i = 0; i < params.length; i++) {
                                htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + params[i].value + "<br/>")
                            }
                            html += htmlTwo;
                            return html;
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
                    }, {
                        name: '数量',
                        type: 'value',
                    }],
                    series: [{
                        name: '平均在线时长',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }
                    }, {
                        name: '平均员工数',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }
                    }, {
                        name: "在线企业数",
                        type: 'line',
                        yAxisIndex: '1',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }

                    }, {
                        name: "活跃企业数",
                        type: 'line',
                        yAxisIndex: '1',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0
                            }
                        }

                    }]
                }
                var series1 = [],
                    series2 = [],
                    series3 = [],
                    series4 = [];

                for (var i = 1; i < source.tbody.length; i++) {
                    series1.push(source.tbody[i][1]);
                    series2.push(source.tbody[i][2]);
                    series3.push(source.tbody[i][3]);
                    series4.push(source.tbody[i][4]);
                }
                option.series[0].data = series1.slice(0).reverse();
                option.series[1].data = series2.slice(0).reverse();
                option.series[2].data = series3.slice(0).reverse();
                option.series[3].data = series4.slice(0).reverse();
                lineChart.setOption(option);
            },
            initDateWidget: function() { // 初始化日期控件
                var me = this;
                //填充顶部筛选区域数据;
            },

            watchCodeInput: function() {
                var me = this;
                dateConfig.runTrench();
                me.getSearchInfo();
            },

            getSearchInfo: function() {
                var me = this;

                app.api({
                    url: "/channel/channel/default", //筛选区域的值得请求;
                    type: "POST",
                    dataType: 'json',
                    data: {
                        "end": me.getTime().end,
                        "start": me.getTime().start,
                        "index": 0,
                        "type": me.getTimeType()
                    },
                    success: function(object) {

                        var fragmentOne = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model.length; i++) {

                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[i].dimension;
                            option.setAttribute('value', object.value.model[i].value);

                            fragmentOne.appendChild(option);
                        }
                        $('#scope').empty();
                        $('#scope').append('<option value="all">全选</option>');
                        $('#scope').append($(fragmentOne));
                    }
                });

                app.api({
                    url: "/channel/channel/default", //筛选区域的值得请求;
                    type: "POST",
                    dataType: 'json',
                    data: {
                        "end": me.getTime().end,
                        "start": me.getTime().start,
                        "index": 1,
                        "type": me.getTimeType()
                    },
                    success: function(object) {

                        var fragmentOne = document.createDocumentFragment();
                        for (var i = 0; i < object.value.model.length; i++) {

                            var option = document.createElement('option');
                            option.innerHTML = object.value.model[i].dimension;
                            option.setAttribute('value', object.value.model[i].value);

                            fragmentOne.appendChild(option);
                        }
                        $('#payStatus').empty();
                        $('#payStatus').append('<option value="all">全选</option>');
                        $('#payStatus').append($(fragmentOne));
                    }
                });
            },

            settleTime: function(data) {
                var array = [],
                    arryTwo = [],
                    arryThree = [];
                for (var i = 1; i < data.length; i++) {
                    array.unshift(data[i]['date']);
                    arryTwo.unshift(parseFloat(data[i]['column6'])); //
                    arryThree.unshift(parseFloat(data[i]['column7'])); //总转化率
                }
                return [array, arryTwo, arryThree];
            },
            settleTime2: function(data) {
                var array = [];
                for (var i = 1; i < data.length; i++) {
                    array.unshift(data[i]['date']);
                }
                return [array];
            },
            getTime: function() {
                var me = this;
                var timeDur = $('#date1').val().split('-'); //获取日期参数
                return {
                    start: new Date(timeDur[0]).getTime(),
                    end: new Date(timeDur[1]).getTime()
                };
            },
            getTimeTwo: function() {
                var me = this;
                var timeDur = $('#date2').val().split('-'); //获取日期参数
                return {
                    start: new Date(timeDur[0]).getTime(),
                    end: new Date(timeDur[1]).getTime()
                };
            },
            getTimeThree: function() {
                var me = this;
                var timeDur = $('#date3').val().split('-'); //获取日期参数
                return {
                    start: new Date(timeDur[0]).getTime(),
                    end: new Date(timeDur[1]).getTime()
                };
            },
            getTimeType: function() { //获取日,周,月标
                var typeValue = $('.timetype').children('.active').attr('data-timetype');
                return parseInt(typeValue);
            },
            getEffectPara: function() {
                var me = this;
                var obj = {};
                obj.advertType = ($('#payStatus').val() == 'all' ? '' : $('#payStatus').val()); //广告类型
                obj.channel = ($('#scope').val() == 'all' ? '' : $('#scope').val()); //推广渠道
                obj.convertEnd = me.getTimeTwo().end;
                obj.convertStart = me.getTimeTwo().start;
                obj.end = me.getTime().end;
                obj.type = me.getTimeType();
                obj.keyWord = $('#autocompleteOne').val().replace(/,$/, '');
                obj.monitor = $('#autocompleteTwo').val().replace(/,$/, '');
                obj.plan = $('#autocompleteThree').val().replace(/,$/, '');
                obj.start = me.getTime().start;
                obj.template = $('#autocompleteFive').val().replace(/,$/, '');
                obj.unit = $('#autocompleteFour').val().replace(/,$/, '');

                return obj;
            },
            getQuaPara: function() {
                var me = this;
                var obj = {};

                obj.advertType = ($('#payStatus').val() == 'all' ? '' : $('#payStatus').val()); //广告类型
                obj.channel = ($('#scope').val() == 'all' ? '' : $('#scope').val()); //推广渠道
                obj.convertEnd = me.getTimeTwo().end;
                obj.convertStart = me.getTimeTwo().start;
                obj.end = me.getTime().end;
                obj.type = me.getTimeType();
                obj.keyWord = $('#autocompleteOne').val().replace(/,$/, '');
                obj.monitor = $('#autocompleteTwo').val().replace(/,$/, '');
                obj.plan = $('#autocompleteThree').val().replace(/,$/, '');
                obj.start = me.getTime().start;
                obj.template = $('#autocompleteFive').val().replace(/,$/, '');
                obj.unit = $('#autocompleteFour').val().replace(/,$/, '');
                obj.qualityEnd = me.getTimeThree().end;
                obj.qualityStart = me.getTimeThree().start;
                return obj;
            },
            initList: function(sTableData) { //初始化列表
                var me = this;
                if (me.flag == false) {
                    me.tableModule = new TableModule($('#belowOne'));
                    me.tableModule.renderData(utils.addComma(sTableData, 1));
                } else {
                    me.tableModule.renderData(utils.addComma(sTableData, 1));
                }
            },
            initList2: function(sTableData) { //初始化列表
                var me = this;
                if (me.flag == false) {
                    me.tableModule2 = new TableModule($('#belowTwo'));
                    me.tableModule2.renderData(utils.addComma(sTableData, 1));
                } else {
                    me.tableModule2.renderData(utils.addComma(sTableData, 1));
                }
            },
            settleData: function() { //整理me.datarepository的值以便能够重新刷新折线图；
                var me = this;
                var nameArray = [
                    '落地页PV',
                    '落地页UV',
                    '发送验证码点击量',
                    '发送验证码点击人数',
                    '下一步按钮点击量',
                    '下一步按钮点击人数',
                    '注册成功企业数',
                    '总转换率'
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
                    default:
                }

                switch (parseInt($('.yClass').val())) {
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
                    default:
                }

                var xData = [];
                for (var i = 1; i < me.dataRepository.tbody.length; i++) {
                    xData.push(parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.xClass').val())])); //百分需要转化为数值
                }

                var yData = [];
                for (var i = 1; i < me.dataRepository.tbody.length; i++) {
                    yData.push(parseFloat(me.dataRepository.tbody[i][parseInt(me.$('.yClass').val())])); //百分需要转化为数值
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

                var dataArray = ['date', 'column0', 'column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7']

                for (var i = 0; i < model.length; i++) {

                    var array = [];
                    for (var j = 0; j < dataArray.length; j++) {

                        if (model[i][dataArray[j]] == null) {

                            if (model[i].total == 'total' && dataArray[j] == "date") {
                                array.push('总数');
                                continue;
                            }

                            array.push('-');

                        } else {

                            array.push(model[i][dataArray[j]]);
                        }
                    }

                    tbody.push(array);
                }

                console.log(tbody);
                return tbody;
            },
            formatData2: function(model) {
                var me = this;

                var tbody = sTableData2.tbody;

                var dataArray = ['date', 'column0', 'column1', 'column2', 'column3']

                for (var i = 0; i < model.length; i++) {

                    var array = [];
                    for (var j = 0; j < dataArray.length; j++) {

                        if (model[i][dataArray[j]] == null) {

                            if (model[i].total == 'total' && dataArray[j] == "date") {
                                array.push('总数');
                                continue;
                            }

                            array.push('-');

                        } else {

                            array.push(model[i][dataArray[j]]);
                        }
                    }

                    tbody.push(array);
                }
                return tbody;
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

            initDownload: function() {
                var me = this;
                me.$('.download').eq(0).click(function() {

                    var array = [];
                    var $data = $('#formdown input[name=data]');
                    var $name = $('#formdown input[name=filename]');
                    array.push([
                        '日期',
                        '落地页PV',
                        '落地页UV',
                        '发送验证码点击量',
                        '发送验证码点击人数',
                        '下一步按钮点击量',
                        '下一步按钮点击人数',
                        '注册成功企业数',
                        '总转换率'
                    ]);
                    array = array.concat(
                        sTableData.tbody
                    );
                    $data.val(JSON.stringify(array));
                    $name.val('注册转换效果统计表');
                    $('#submit').click();
                });
                me.$('.download').eq(1).click(function() {

                    var array = [];
                    var $data = $('#formdown input[name=data]');
                    var $name = $('#formdown input[name=filename]');
                    array.push([
                        '日期',
                        '平均在线时长(min)',
                        '平均员工数',
                        '在线企业数',
                        '活跃企业数'
                    ]);
                    array = array.concat(
                        sTableData2.tbody
                    );
                    $data.val(JSON.stringify(array));
                    $name.val('自注册企业质量概览表');
                    $('#submit').click();

                });
            },
            resetData: function() {
                sTableData = {
                    'thead': [
                        '日期',
                        '落地页PV',
                        '落地页UV',
                        '发送验证码点击量',
                        '发送验证码点击人数',
                        '下一步按钮点击量',
                        '下一步按钮点击人数',
                        '注册成功企业数',
                        '总转换率'
                    ],
                    'tbody': []
                };
            },
            resetData2: function() {
                sTableData2 = {
                    'thead': [
                        '日期',
                        '平均在线时长(min)',
                        '平均员工数',
                        '在线企业数',
                        '活跃企业数'
                    ],
                    'tbody': []
                };
            },
            bindReset: function() {
                var me = this;

                $(".resetTotal").click(function() {

                    me.resetButtonStatus($(this));

                    me.initDateWidget(); //重置条件跟默认进入页面时相同
                    me.watchCodeInput();

                    $('#autocompleteOne').val(""); //清空关键字和监控码，初始化;

                    $('#autocompleteTwo').val("");
                    $('#autocompleteThree').val("");
                    $('#autocompleteFour').val("");
                    $('#autocompleteFive').val("");

                    me.resetData(); //重置数据为初始数据
                    $(".timetype button[class=active]").removeClass('active');

                    $('.timetype button[data-timetype=0]').addClass('active');

                    $(".xClass option[selected]").removeAttr('selected');
                    $(".xClass option[disabled]").removeAttr('disabled');
                    $(".xClass option[value=7]").attr('selected', true);
                    $(".xClass option[value=8]").attr('disabled', true);

                    $(".yClass option[selected]").removeAttr('selected');
                    $(".yClass option[disabled]").removeAttr('disabled');
                    $(".yClass option[value=8]").attr('selected', true);
                    $(".yClass option[value=7]").attr('disabled', true);

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