define(function(require, exports, module) {

    //折线图的配置
    var option = {
        title: {
            text: "企信消息指标概览",
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
                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].seriesName == "活跃会话占比" ? params[i].value + "%" : params[i].value) + "<br/>")
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
            data: ['发送消息次数', '发送消息人数', '均值'],
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
            name: '数量',
            type: 'value',
            min: 0,
        }, {
            type: 'value',
            name: '均值',
            min: 0,
        }],
        series: [{
            name: '发送消息次数',
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
            name: '发送消息人数',
            type: 'line',
            data: [40, 50, 60, 70, 80, 90, 100],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: "均值",
            type: 'line',
            yAxisIndex: 1,
            data: [40, 50, 60, 70, 80, 90, 100],
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
            text: '企信信息指标总数对比',
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
            text: '按消息类别分指标数据占比',
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
            data: ['文字', '语音', '图片', '位置', '文档', '电话会议', '会议', '任务', '日程', '群通知', '群投票(企信)', '其它'],
            icon: 'pin',
            width: 500,
            height: 40,
            left: 50,
            textStyle: {
                fontSize: 10
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
            name: '数量',
            type: 'value',
            min: 0,
        },
        series: [{
            name: '文字',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [40, 50, 60, 70, 80, 90, 100],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '语音',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [40, 50, 60, 70, 80, 90, 100],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '图片',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '位置',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '文档',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '电话会议',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '会议',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '任务',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '日程',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '群通知',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '群投票(企信)',
            type: 'bar',
            barWidth: 30,
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
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
            stack: '信息',
            data: [50, 50, 60, 70, 40, 30, 20],
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
        option,
        optionPie,
        optionPillar
    };

    module.exports = obj;

});