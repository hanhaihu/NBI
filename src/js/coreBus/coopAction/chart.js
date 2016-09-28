define(function(require, exports, module) {

    //折线图的配置
    var option = {
        title: {
            text: "Feed动作数据指标概览",
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
                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + params[i].value + "<br/>")
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
            data: ['动作数量', '动作人数', '人均'],
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
            name: '人均',
        }],
        series: [{
            name: '动作数量',
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
            name: '动作人数',
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
            name: '人均',
            type: 'line',
            data: [],
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }]
    };


    var optionPie = {
        title: {
            text: 'feed动作指标总数对比',
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
            text: 'Feed动作指标分维度趋势',
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
            bottom: -3,
            data: ['赞', '回复', '点击回执', '收藏', '手动关注', '讨论', '打印', '参与投票', '提醒', '设为任务', '赏', ],
            icon: 'pin',
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

            name: '赞',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '回复',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '点击回执',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '收藏',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '手动关注',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '讨论',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '打印',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '参与投票',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '提醒',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '设为任务',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
            data: [],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '赏',
            type: 'bar',
            barWidth: 30,
            stack: '会话类别',
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
        option,
        optionPie,
        optionPillar
    };

    module.exports = obj;

});