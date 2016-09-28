define(function(require, exports, module) {

    //折线图的配置
    var optionOne = {
        title: {
            text: "CRM对象数量指标概览",
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
                    htmlTwo += ('<span style="display:inline-block;margin-right:5px;' + 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>' + params[i].seriesName + ":" + (params[i].seriesName == "活跃占比" ? params[i].value + "%" : params[i].value) + "<br/>")
                }
                html += htmlTwo;
                html += "</div>";
                return html;
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            bottom: 0,
            data: ['新增对象', '活跃对象', '累计对象', '活跃占比'],
            icon: 'pin',
            textStyle: {
                fontSize: 18
            },
            selected: {
                '新增对象': true,
                '活跃对象': true,
                '累计对象': false,
                '活跃占比': true
            }
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
            min: 80,
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series: [{
            name: '新增对象',
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
            name: '活跃对象',
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
            name: '累计对象',
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
            name: '活跃占比',
            type: 'line',
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
            text: 'CRM对象指标总数对比',
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
            text: 'CRM对象指标分维度趋势',
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
            data: ['线索', '客户', '销售流程', '联系人', '机会', '成交/订单', '退货单', '竞争对手', '市场活动', '回款', '退款', '开票申请', '合同', '产品'],
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

            name: '线索',
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
            name: '客户',
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
            name: '销售流程',
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
            name: '联系人',
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
            name: '机会',
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
            name: '成交/订单',
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
            name: '退货单',
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
            name: '竞争对手',
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
            name: '市场活动',
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
            name: '回款',
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
            name: '退款',
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
            name: '开票申请',
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
            name: '合同',
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
            name: '产品',
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
            text: '按对象类别数据分布',
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
    var optionPillarTwo = {
        title: {
            text: '按对象类别时间趋势',
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
            data: ['线索池', '公海', '拜访', '盘点', '角色', '其它'],
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

            name: '线索池',
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
            name: '公海',
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
            name: '拜访',
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
            name: '盘点',
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
            name: '角色',
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
            name: '其它',
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