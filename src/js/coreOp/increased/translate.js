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
        format: function(singledata, alldata, dimension) {
            var me = this;

            return {
                'tablelist': me.formatTable(singledata, alldata, dimension),
                'options': me.formatChart(singledata, alldata, dimension)
            }
        },

        //格式化总览数据
        formatall: function(singledata, alldata, dimension) {
            var me = this;

            var tablelist = [];

            //填充tablelist的基础结构
            dimension.forEach(function(item, index) {
                tablelist[index] = [];
                tablelist[index].push(item);
            });

            //装填数据
            var total = [];
            alldata.values.forEach(function(item, index) {
                total[index] = 0;

                item.forEach(function(value, ind) {

                    total[index] = total[index] + value;
                });
            });

            //
            singledata.values.forEach(function(item, index) {

                var curindex = (index + 1) * 2 - 1;
                item.forEach(function(value, ind) {

                    var num = ind % dimension.length;

                    tablelist[num][curindex] = tablelist[num][curindex] || 0;
                    tablelist[num][curindex] = tablelist[num][curindex] + value;

                    var persent = "-";
                    if (total[index] != 0) {
                        persent = Math.round(tablelist[num][curindex] / total[index] * 10000) / 100 + '%';
                    }
                    tablelist[num][curindex + 1] = persent;
                });
            });

            //

            return tablelist;
        },

        //格式化表格数据
        formatTable: function(singledata, alldata, dimension) {
            var me = this;

            var dimensionlength = dimension.length;

            //列表数据
            var tablelist = [];

            // 遍历拼出表格数据
            singledata.categories.forEach(function(item, index) {

                tablelist[index] = [];
                tablelist[index].push(item.split('@')[0]);
                tablelist[index].push(item.split('@')[1]);

                var gindex = Math.floor(index / dimensionlength);


                singledata.values.forEach(function(value, ind) {
                    tablelist[index].push(value[index]);

                    var persent = "-";
                    if (alldata.values[ind][gindex] != 0) {
                        persent = Math.round(value[index] / alldata.values[ind][gindex] * 10000) / 100 + '%';
                    }

                    tablelist[index].push(persent);
                });

            });

            return tablelist;
        },

        //格式化图表数据
        formatChart: function(singledata, alldata, dimension) {
            var me = this;
            var dimensionlength = dimension.length;
            var categories = alldata.categories.reverse();

            //组装series
            var options = [];
            //遍历values
            singledata.values.forEach(function(item, index) {

                var option = {
                    title: {
                        text: "新增注册用户数趋势",
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
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
                        name: "数量",
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
                        data: categories //_.clone( alldata.categories) //????????为什么这个地方不管用
                    },
                    series: []
                };

                // 为什么 util.clone(option) 报错
                // options[ index ] = util.clone( option );
                options[index] = option;

                for (var i = 0; i < dimensionlength; i++) {
                    options[index]['series'].push({
                        name: dimension[i],
                        type: 'line',
                        //stack: '总量',
                        data: []
                    })
                }

                item.forEach(function(value, ind) {

                    var gindex = ind % dimensionlength;
                    options[index]['series'][gindex]['data'].unshift(value);
                });

            });

            //所有为0的data 滤去

            options.forEach(function(item) {

                var seriesList = [];
                item['series'].forEach(function(ind, index) {

                    var bool = false;
                    ind.data.forEach(function(ele) {
                        if (ele != 0) {
                            bool = true
                        };
                    })

                    if (bool == false) {
                        seriesList.push(index)
                    }
                });

                var series = item.series;
                var data = item.legend.data;

                item.series = [];
                item.legend.data = [];
                series.forEach(function(vector, index) {
                    if (_.contains(seriesList, index)) {
                        return;
                    } else {
                        item.series.push(vector);
                        item.legend.data.push(data[index]);
                    }
                })
            });

            console.log(options);
            return options;
        }
    };

    module.exports = translate;
});