//实例化
define(function(require, exports, module) {

    var app = BI.app,
        util = BI.util;


    var translate = {
        /*
         * @param  singledata    分维度数据
         * @param  alldata       总数据
         * @param  dimension     维度长度
         * 格式化数据
         * 占比精确到小数点后1位(%) 四舍五入
         * 
         */
        format: function(onlineData, dimension, length) {
            var me = this;

            return {
                'tablelist': me.formatTable(onlineData, dimension, length),
                'options': me.formatChart(onlineData, dimension, length)

            }
        },
        //格式化表格数据
        formatTable: function(onlineData, dimension, length) {
            var me = this;

            //列表数据
            var tablelist = [];

            var columnArray = ["date", "dimension", "column2", "column3", "column4", "column5", "column6"]; //所有的数据都是放在column*中;

            for (var i = 0; i < onlineData.length; i++) {

                var array = [];

                for (var j = 0; j < columnArray.length; j++) {

                    if (onlineData[i][columnArray[j]] == null) {


                        array.push('-');


                    } else {

                        array.push(onlineData[i][columnArray[j]]); //把数据拼成以行为单位;

                    }
                }
                tablelist.push(array);
            }
            return tablelist; //拼好的表格数据
        },

        //格式化图表数据
        formatChart: function(onlineData, dimension, length) {
            var me = this;

            var dimensionlength = dimension.length;
            var categories = me.unique(onlineData); //获得x轴时间;

            var chartData = me.assembleData(me.formatTable(onlineData));
            //组装series
            var options = [];

            console.log(chartData);
            chartData.forEach(function(item, index) {
                var option = {
                    title: {
                        text: "活跃企业数趋势",
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    smooth: true,
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '20%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '数量',
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 0,
                        data: dimension,
                        icon: 'pin',
                        textStyle: {
                            fontSize: 18
                        },
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: categories
                    },
                    series: []
                };

                options[index] = option;

                for (var i = 0; i < dimensionlength; i++) {
                    options[index]['series'].push({
                        name: dimension[i],
                        type: 'line',
                        data: []
                    })
                }
                item.forEach(function(value, ind) {
                    var gindex = ind % dimensionlength;
                    options[index]['series'][gindex]['data'].unshift(value);
                });

            });

            if (length == 2) {
                options[options.length - 1].yAxis = {
                    type: 'value',
                    name: '百分比',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                };

                options[options.length - 1].tooltip.formatter = function(params) {
                    console.log(params);
                    var html = params[0].name + '<br/>';
                    var htmlTwo = "";
                    for (var i = 0; i < params.length; i++) {
                        htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].value ? params[i].value + "%" : '') + "<br/>")
                    }
                    html += htmlTwo;
                    return html;
                }

            }
            console.log(options);
            return options;
        },
        unique: function(array) { //数组去重用于获得x轴时间;

            var categories = [],
                r = [];

            array.forEach(function(item, index) {

                categories.unshift(item.date); //提取日期
            });

            for (var i = 0, l = categories.length; i < l; i++) {
                for (var j = i + 1; j < l; j++)
                    if (categories[i] === categories[j]) j = ++i; //数组去重 
                r.push(categories[i]);
            }
            return r;
        },
        assembleData: function(data) { //把从后台的拿到的数据拼装成@李国栋应用的格式
            var array = [],
                dataArrayOne = [],
                dataArrayTwo = [],
                dataArrayThree = [];

            for (var i = 0; i < data.length; i++) {
                dataArrayOne.push(isNaN(parseFloat(data[i][2])) ? '-' : parseFloat(data[i][2]));
                dataArrayTwo.push(isNaN(parseFloat(data[i][4])) ? '-' : parseFloat(data[i][4])); //新增,CRM用户数，活跃企业数拥有三个echarts的option;
                dataArrayThree.push(isNaN(parseFloat(data[i][6])) ? '-' : parseFloat(data[i][6]));
            }
            array.push(dataArrayOne);
            array.push(dataArrayTwo);
            array.push(dataArrayThree);
            return array;
        }
    };

    module.exports = translate;
});