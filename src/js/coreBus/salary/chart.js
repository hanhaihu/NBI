define(function(require, exports, module) {

    //折线图的配置
    var option = {
        title: {
            text: "工资助手指标概览",
            subtext: '',
            x: 'center'
        },
        smooth: true,
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                var html = params[0].name + '<br/>';
                var htmlTwo = "<div style='text-align:left'>";
                for (var i = 0; i < params.length; i++) {
                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].seriesName == "导入成功率" ? params[i].value + "%" : params[i].value) + "<br/>")
                }
                html += htmlTwo;
                html += "</div>"
                return html;
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            bottom: 0,
            data: ['发送人数', '查看人数', '工资条导入总数', '工资条导入成功次数', '导入成功率'],
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
            data: []
        },
        yAxis: [{
            name: '次数/人数',
            type: 'value',
            min: 0,
        }, {
            type: 'value',
            name: '导入成功率',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series: [{
            name: '发送人数',
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '查看人数',
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '工资条导入总数',
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '工资条导入成功次数',
            type: 'line',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '导入成功率',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }]
    };
    var obj = {
        option
    };

    module.exports = obj;

});