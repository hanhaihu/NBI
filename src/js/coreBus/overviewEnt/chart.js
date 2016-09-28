define(function(require, exports, module) {

    //折线图的配置
    var option = {
        title: {
            text: '功能使用次数数据趋势',
            x: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        smooth: true,
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#15b512', '#d8d455'],
        legend: {
            orient: 'horizontal',
            bottom: 0,
            align: 'auto',
            icon: 'pin',
            data: ['企信', '协同', 'CRM', '支付', '考勤助手', '外勤助手', 'PK助手', '项目管理助手', '工资助手', '战报助手', '会议助手', '培训助手']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '12%',
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
            data: [],
            boundaryGap: false,
            axisLabel: {
                rotate: 60
            }
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            name: '企信',
            type: 'line',
            data: []
        }, {
            name: '协同',
            type: 'line',
            data: []
        }, {
            name: 'CRM',
            type: 'line',
            data: []
        }, {
            name: '支付',
            type: 'line',
            data: []
        }, {
            name: '考勤助手',
            type: 'line',
            data: []
        }, {
            name: '外勤助手',
            type: 'line',
            data: []
        }, {
            name: 'PK助手',
            type: 'line',
            data: []
        }, {
            name: '项目管理助手',
            type: 'line',
            data: []
        }, {
            name: '工资助手',
            type: 'line',
            data: []
        }, {
            name: '战报助手',
            type: 'line',
            data: []
        }, {
            name: '会议助手',
            type: 'line',
            data: []
        }, {
            name: '培训助手',
            type: 'line',
            data: []
        }]
    };
    var obj = {
        option
    };

    module.exports = obj;

});