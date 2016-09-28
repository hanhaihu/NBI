define(function(require, exports, module) {
    var dateConfig = {};

    var getTime = function($date) {
        var timeDur = $date.val().split('-'); //获取日期参数
        return {
            start: new Date(timeDur[0]).getTime(),
            end: new Date(timeDur[1]).getTime()
        };
    }
    var option = {
        "ranges": {
            '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '过去七天': [moment().subtract(7, 'days'), moment()],
            '过去30天': [moment().subtract(30, 'days'), moment()],
            '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
            '自定义': 'custom'
        },
        "periods": ['day'],
        "startDate": moment().subtract('days', 7).add(1, 'days').startOf("day").toDate(),
        "endDate": moment().subtract("days", 1).endOf("day").toDate(),
        "maxDate": moment().subtract("days", 1).endOf("day").toDate()
    };

    var optionFun = function(startDate, endDate, period) {
        $(this).val(startDate.format('YYYY/MM/DD') + ' - ' + endDate.format('YYYY/MM/DD'))
    };

    var startDate = moment().subtract('days', 7).startOf("day");
    var endDate = moment().subtract("days", 1).endOf("day");

    var endDateRetention = moment().subtract("days", 2).endOf("day");

    var init = function($datearr) {
        $('div[data-bind="stopBinding: true"]').remove();
        for (var i = 0; i < $datearr.length; i++) {
            var $parent = $datearr[i].parent();
            $datearr[i].remove();
            if ($datearr.length == 1) {
                $parent.append('<input type="text" id="date">');
            } else {
                $parent.append('<input type="text" id="date' + (i + 1) + '" style="margin-left:0;">');
            }
        }
    };

    dateConfig.run = function() {
        init([$('#date')]);
        optionFun.apply($('#date'), [startDate, endDate]);
        $("#date").daterangepicker(option, optionFun);
    };

    dateConfig.runForRe = function() {
        init([$('#date')]);
        optionFun.apply($('#date'), [startDate, endDateRetention]);
        $("#date").daterangepicker(option, optionFun);
    };

    dateConfig.runForMrr = function() {

        var option = {
            "ranges": {
                '自定义': 'custom'
            },
            "periods": ['month'],
            "startDate": moment().subtract('month', 6).startOf("month").add(1, 'days').toDate(),
            "endDate": moment().subtract("month", 1).endOf("month").toDate(),
            "maxDate": moment().subtract("month", 1).endOf("month").toDate()
        };
        var optionFun = function(startDate, endDate, period) {
            dateConfig.startDate = startDate.format('YYYY/MM/DD');
            dateConfig.endDate = endDate.format('YYYY/MM/DD');
            $(this).val(startDate.format('YYYY/MM') + ' - ' + endDate.format('YYYY/MM'))
        };

        init([$('#date')]);
        optionFun.apply($('#date'), [moment().subtract('month', 6).startOf('month'), moment().subtract('month', 1).endOf('month')]);
        $("#date").daterangepicker(option, optionFun);
        $('.custom-range-inputs').hide();
    };

    var date1func = function(startDate, endDate, period) {
        //default
        BI.app.api({
            url: "/channel/channel/default", //筛选区域的值得请求;
            type: "POST",
            dataType: 'json',
            data: {
                "end": getTime($('#date1')).end,
                "start": getTime($('#date1')).start,
                // "end":1469980800000,
                // "start":1464710400000,
                "index": 0,
                "type": parseInt($('.timetype').children('.active').attr('data-timetype'))
            },
            success: function(object) {

                var fragmentOne = document.createDocumentFragment();
                for (var i = 0; i < object.value.model.length; i++) {

                    var option = document.createElement('option');
                    option.innerHTML = object.value.model[i].dimension;
                    option.setAttribute('value', object.value.model[i].value);

                    fragmentOne.appendChild(option);
                }

                $('#scope').empty();
                $('#scope').append('<option value="all">全选</option>');
                $('#scope').append($(fragmentOne));

                // me.selectScope =  $('#scope option').toArray();
            }
        });

        BI.app.api({
            url: "/channel/channel/default", //筛选区域的值得请求;
            type: "POST",
            dataType: 'json',
            data: {
                "end": getTime($('#date1')).end,
                "start": getTime($('#date1')).start,
                "index": 1,
                "type": parseInt($('.timetype').children('.active').attr('data-timetype'))
            },
            success: function(object) {

                var fragmentOne = document.createDocumentFragment();
                for (var i = 0; i < object.value.model.length; i++) {

                    var option = document.createElement('option');
                    option.innerHTML = object.value.model[i].dimension;
                    option.setAttribute('value', object.value.model[i].value);

                    fragmentOne.appendChild(option);
                }
                $('#payStatus').empty();
                $('#payStatus').append('<option value="all">全选</option>');
                $('#payStatus').append($(fragmentOne));
            }
        });
        //约束 
        var time1 = {},
            time2 = getTime($('#date2')),
            time3 = getTime($('#date3'));

        time1.start = startDate;
        time1.end = endDate;

        init([$('#date1'), $('#date2'), $('#date3')]);

        optionFun.apply($('#date1'), [startDate, endDate]);
        optionFun.apply($('#date2'), [moment(time2.start).isAfter(time1.start) ? moment(time2.start) : moment(time1.start), moment(time2.end).isAfter(time1.start) ? moment(time2.end) : moment(time1.start)]);
        optionFun.apply($('#date3'), [moment(time3.start).isAfter(time1.start) ? moment(time3.start) : moment(time1.start), moment(time3.end).isAfter(time1.start) ? moment(time3.end) : moment(time1.start)]);

        var option1 = {
                "ranges": {
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '过去七天': [moment().subtract(7, 'days'), moment()],
                    '过去30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                    '自定义': 'custom'
                },
                "periods": ['day'],
                "startDate": moment(time1.start),
                "endDate": moment(time1.end),
                "maxDate": moment().subtract("days", 1).endOf("day").toDate()
            },
            option2 = {
                "ranges": {
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '过去七天': [moment().subtract(7, 'days'), moment()],
                    '过去30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                    '自定义': 'custom'
                },
                "periods": ['day'],
                "minDate": moment(time1.start),
                "startDate": moment(time2.start).isAfter(time1.start) ? moment(time2.start).add(1, 'days') : moment(time1.start),
                "endDate": moment(time2.end).isAfter(time1.start) ? moment(time2.end).add(1, 'days') : moment(time1.start),
                "maxDate": moment().subtract("days", 1).endOf("day").toDate()
            },
            option3 = {
                "ranges": {
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '过去七天': [moment().subtract(7, 'days'), moment()],
                    '过去30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                    '自定义': 'custom'
                },
                "periods": ['day'],
                "minDate": moment(time1.start),
                "startDate": moment(time3.start).isAfter(time1.start) ? moment(time3.start).add(1, 'days') : moment(time1.start),
                "endDate": moment(time3.end).isAfter(time1.start) ? moment(time3.end).add(1, 'days') : moment(time1.start),
                "maxDate": moment().subtract("days", 1).endOf("day").toDate()
            };

        $('#date1').daterangepicker(option1, date1func);
        $('#date2').daterangepicker(option2, date2func);
        $('#date3').daterangepicker(option3, date3func);

    };
    var date2func = function(startDate, endDate, period) {
        var time1 = getTime($('#date1'));
        time2 = {},
            time3 = getTime($('#date3'));

        time2.start = startDate;
        time2.end = endDate;

        init([$('#date1'), $('#date2'), $('#date3')]);

        optionFun.apply($('#date1'), [moment(time1.start), moment(time1.end)]);
        optionFun.apply($('#date2'), [startDate, endDate]);
        optionFun.apply($('#date3'), [moment(time3.start).isAfter(time2.start) ? moment(time3.start) : moment(time2.start), moment(time3.end).isAfter(time2.start) ? moment(time3.end) : moment(time2.start)]);

        var option1 = {
                "ranges": {
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '过去七天': [moment().subtract(7, 'days'), moment()],
                    '过去30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                    '自定义': 'custom'
                },
                "periods": ['day'],
                "startDate": moment(time1.start).add(1, 'days'),
                "endDate": moment(time1.end).add(1, 'days'),
                "maxDate": moment().subtract("days", 1).endOf("day").toDate()
            },
            option2 = {
                "ranges": {
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '过去七天': [moment().subtract(7, 'days'), moment()],
                    '过去30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                    '自定义': 'custom'
                },
                "periods": ['day'],
                "minDate": moment(time1.start).add(1, 'days'),
                "startDate": moment(time2.start),
                "endDate": moment(time2.end),
                "maxDate": moment().subtract("days", 1).endOf("day").toDate()
            },
            option3 = {
                "ranges": {
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '过去七天': [moment().subtract(7, 'days'), moment()],
                    '过去30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                    '自定义': 'custom'
                },
                "periods": ['day'],
                "minDate": moment(time2.start),
                "startDate": moment(time3.start).isAfter(time2.start) ? moment(time3.start).add(1, 'days') : moment(time2.start),
                "endDate": moment(time3.end).isAfter(time2.start) ? moment(time3.end).add(1, 'days') : moment(time2.start),
                "maxDate": moment().subtract("days", 1).endOf("day").toDate()
            };

        $('#date1').daterangepicker(option1, date1func);
        $('#date2').daterangepicker(option2, date2func);
        $('#date3').daterangepicker(option3, date3func);
    };
    var date3func = function(startDate, endDate, period) {
        $(this).val(startDate.format('YYYY/MM/DD') + ' - ' + endDate.format('YYYY/MM/DD'))
    };

    dateConfig.runTrench = function() {

        var date1 = $('#date1'),
            date2 = $('#date2'),
            date3 = $('#date3');

        init([$('#date1'), $('#date2'), $('#date3')]);
        optionFun.apply($('#date1'), [startDate, endDate]);
        optionFun.apply($('#date2'), [startDate, endDate]);
        optionFun.apply($('#date3'), [startDate, endDate]);

        var optionTrench = {
            "ranges": {
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '过去七天': [moment().subtract(7, 'days'), moment()],
                '过去30天': [moment().subtract(30, 'days'), moment()],
                '本月': [moment().startOf('month').add(1, 'days'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month').add(1, 'days'), moment().subtract(1, 'month').endOf('month')],
                '自定义': 'custom'
            },
            "periods": ['day'],
            "startDate": moment().subtract('days', 7).add(1, 'days').startOf("day").toDate(),
            "endDate": moment().subtract("days", 1).endOf("day").toDate(),
            "maxDate": moment().subtract("days", 1).endOf("day").toDate()
        };

        $('#date1').daterangepicker(optionTrench, date1func);
        optionTrench.minDate = moment().subtract('days', 7).add(1, 'days').startOf("day").toDate();
        $('#date2').daterangepicker(optionTrench, date2func);
        $('#date3').daterangepicker(optionTrench, date3func);

    };

    module.exports = dateConfig;
});