define(function(require, exports, module) {

    //折线图的配置
    var optionOne = {
        title: {
            text: "充值指标概览",
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
                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].seriesName == "充值成功率" ? params[i].value + "%" : params[i].value) + "<br/>")
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
            data: ['成功充值金额', '成功充值次数', '充值总次数', '充值成功率'],
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
            data: ['2016/1/1', '2016/1/2', '2016/1/3', '2016/1/4', '2016/1/5', '2016/1/6', '2016/1/7']
        },
        yAxis: [{
            name: '次数',
            type: 'value',
            min: 0,
        }, {
            type: 'value',
            name: '百分比',
            min: 0,
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series: [{
            name: '成功充值金额',
            type: 'line',
            data: [700, 2033, 3667, 5536, 7987, 11061, 14771],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '成功充值次数',
            type: 'line',
            data: [430, 1333, 1634, 1869, 2451, 3074, 3710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '充值总次数',
            type: 'line',
            data: [880, 1100, 2010, 2800, 3200, 4350, 5820],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: "充值成功率",
            type: 'line',
            yAxisIndex: 1,
            data: [55.2, 55.2, 55.2, 55.2, 55.2, 55.2, 55.2],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }

        }]
    };



    var optionTwo = {
        title: {
            text: "提现指标概览",
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
                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].seriesName == "提现成功率" ? params[i].value + "%" : params[i].value) + "<br/>")
                }
                html += htmlTwo;
                return html;
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            bottom: 0,
            data: ['成功提现金额', '成功提现次数', '提现总次数', '提现成功率'],
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
            data: ['2016/1/1', '2016/1/2', '2016/1/3', '2016/1/4', '2016/1/5', '2016/1/6', '2016/1/7']
        },
        yAxis: [{
            name: '次数',
            type: 'value',
            min: 0,
        }, {
            type: 'value',
            name: '百分比',
            min: 0,
            axisLabel: {
                formatter: '{value}.00%'
            }
        }],
        series: [{
            name: '成功提现金额',
            type: 'line',
            data: [700, 2033, 3667, 5536, 7987, 11061, 14771],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '成功提现次数',
            type: 'line',
            data: [430, 1333, 1634, 1869, 2451, 3074, 3710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '提现总次数',
            type: 'line',
            data: [880, 1100, 2010, 2800, 3200, 4350, 5820],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: "提现成功率",
            type: 'line',
            yAxisIndex: 1,
            data: [55.2, 55.2, 55.2, 55.2, 55.2, 55.2, 55.2],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }

        }]
    };

    //饼状图的配置
    var optionPie = {
        title: {
            text: '充值指标总数对比',
            x: "center"
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            show: false,
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            align: 'auto',
            data: ['总数'],
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                title: '保存为图片'
            }
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {

                rotate: 20
            }
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [{
            type: 'bar',
            barWidth: '30',
            name: "总数",
            data: [],
            itemStyle: {
                normal: {
                    color: "#5B9BD5"
                }
            }
        }]
    };



    //柱状图配置
    var optionPillar = {
        title: {
            text: '充值指标分维度趋势',
            subtext: '',
            x: 'center'
        },
        smooth: true,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: true,
            orient: 'horizontal',
            bottom: 0,
            data: ['快钱', '微信', '其它'],
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
            data: ['2016/1/1', '2016/1/2', '2016/1/3', '2016/1/4', '2016/1/5', '2016/1/6', '2016/1/7'],
            boundaryGap: ['20%', '20%']
        },
        yAxis: {
            name: '次数',
            type: 'value',
            min: 0,
        },
        series: [{

            name: '快钱',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [430, 1333, 1634, 1869, 2451, 3074, 3710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '微信',
            type: 'bar',
            stack: '会话类别',
            barWidth: 30,
            data: [880, 1100, 2010, 2800, 3200, 4350, 5820],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '其它',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
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
        optionOne,
        optionTwo,
        optionPie,
        optionPillar
    };

    module.exports = obj;

});