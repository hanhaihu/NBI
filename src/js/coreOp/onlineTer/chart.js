define(function(require, exports, module) {

    var optionPillar = {
        title: {
            text: '在线用户数量分终端数据对比',
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
            },
            right: 40
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            data: [],
            axisLabel: {
                rotate: 20
            }
        },
        yAxis: {
            type: 'category',
            data: [],
            name: '数量',
            interval: 10,
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


    var option = {
        title: {
            text: "在线指标分终端类型数据趋势",
            subtext: '',
            x: 'center'
        },
        smooth: true,
        tooltip: {
            trigger: 'axis',
        },
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#15b512', '#d8d455', "#4169E1", "#0000FF", "#1E90FF", "#00FFFF", "#32CD32"],
        legend: {
            orient: 'horizontal',
            bottom: 0,
            data: ['IOS', 'Android', 'Web', 'Win', 'Mac', '未知'],
            icon: 'pin',
            textStyle: {
                fontSize: 18
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                title: '保存为图片'
            },
            right: 40
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: [{
            type: 'value',
            name: '数量'
        }],
        series: [{
            name: 'IOS',
            type: 'line',
            data: []
        }, {
            name: 'Android',
            type: 'line',
            data: []
        }, {
            name: 'Web',
            type: 'line',
            data: []
        }, {
            name: 'Win',
            type: 'line',
            data: []
        }, {
            name: 'Mac',
            type: 'line',
            data: [],
        }, {
            name: '未知',
            type: 'line',
            data: [],
        }]
    };



    var obj = {
        option,
        optionPillar
    };

    module.exports = obj;
});