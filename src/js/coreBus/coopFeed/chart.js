define(function(require, exports, module) {

    //折线图的配置
    var optionOne = {
        title: {
            text: "协同feed指标概览",
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
            data: ['发送feed数量', '发送feed人数', '人均'],
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
            name: '人均',
        }],
        series: [{
            name: '发送feed数量',
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
            name: '发送feed人数',
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
            name: '人均',
            type: 'line',
            yAxisIndex: 1,
            data: [880, 1100, 2010, 2800, 3200, 4350, 5820],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }]
    };

    var optionPieOne = {
        title: {
            text: 'feed信息指标总数对比',
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
    var optionPillarOne = {
        title: {
            text: 'feed信息指标分维度趋势',
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
            data: ['分享', '日志', '指令', '任务', '审批', '日程', '公告', 'CRM服务-记录', 'CRM-销售记录', '外勤签到', '其他'],
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
            name: '次数',
            type: 'value',
            min: 0,
        },
        series: [{

            name: '分享',
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
            name: '日志',
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
            name: '指令',
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
        }, {
            name: '任务',
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
        }, {
            name: '审批',
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
        }, {
            name: '日程',
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
        }, {
            name: '公告',
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
        }, {
            name: 'CRM服务-记录',
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
        }, {
            name: 'CRM-销售记录',
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
        }, {
            name: '外勤签到',
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
        }, {
            name: '其他',
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

    var optionPieTwo = {
        title: {
            text: '按feed元素类别数据分布',
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
    var optionPillarTwo = {
        title: {
            text: '按数据元素类别数据趋势',
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
            data: ['文本', '图片', '@', '语音', '关联客户', '定位', '发起回执', '关联联系人', '附件', '话题', '表格', '发起投票'],
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
            name: '次数',
            type: 'value',
            min: 0,
        },
        series: [{

            name: '文本',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [430, 1333, 1634, 1869, 2451, 3074, 3710],
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
            stack: 'feed元素类别',
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
            name: '@',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
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
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '关联客户',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '定位',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '发起回执',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '关联联系人',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '附件',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '话题',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '表格',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0
                }
            }
        }, {
            name: '发起投票',
            type: 'bar',
            barWidth: 30,
            stack: 'feed元素类别',
            data: [19710, 19710, 19710, 19710, 19710, 19710, 19710],
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 0,
                    color: '#F60'
                }
            }
        }]
    };


    var obj = {
        optionOne,
        optionPieOne,
        optionPillarOne,
        optionPieTwo,
        optionPillarTwo
    };

    module.exports = obj;

});