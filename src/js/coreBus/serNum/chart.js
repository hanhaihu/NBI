define(function(require, exports, module) {

    //折线图的配置
    var option = {
        title: {
            text: "服务号数量指标概览",
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
                html += "</div>"
                return html;
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            bottom: 0,
            data: ['新增服务号', '活跃服务号', '累计服务号', '活跃占比'],
            icon: 'pin',
            textStyle: {
                fontSize: 18
            },
            selected: {
                '新增服务号': true,
                '活跃服务号': true,
                '累计服务号': false,
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
            name: '数量',
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
            name: '新增服务号',
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
            name: '活跃服务号',
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
            name: '累计服务号',
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
            name: "活跃占比",
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

    var optionPie = {
        title: {
            text: '服务号指标总数对比',
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
            text: '服务号指标分维度趋势',
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
            data: ['IT助手', '空白模板', '空白应用模板', '快捷入口模板', '快递帮手', '示例应用模板', '销售知识库', '企业文化墙', 'HR助手', '行政助手', '项目战报', '周五真心话', '员工运动', '其它第三方应用模板类型', '其它'],
            icon: 'pin',
            textStyle: {
                fontSize: 10
            },
        },
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#15b512', '#d8d455', "#4169E1", "#0000FF", "#1E90FF", "#00FFFF", "#32CD32"],
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

            name: 'IT助手',
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
            name: '空白模板',
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
            name: '空白应用模板',
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
            name: '快捷入口模板',
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
            name: '快递帮手',
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
            name: '示例应用模板',
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
            name: '销售知识库',
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
            name: '企业文化墙',
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
            name: 'HR助手',
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
            name: '行政助手',
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
            name: '项目战报',
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
            name: '周五真心话',
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
            name: '员工运动',
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
            name: '其它第三方应用模板类型',
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
            name: '其它',
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