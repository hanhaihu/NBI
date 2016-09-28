/**
 *
 *表格模块
 */
define(function(require, exports, module) {

    var template = $(require('./template.html'));


    function TableModule() {
        this.init.apply(this, arguments);
    }
    TableModule.prototype = {
        tableTemplate: template.filter('#tabletemplate').html(),
        tbodyTemplate: template.filter('#tbodytemplate').html(),
        init: function(el) {

            this.$el = $(el);
            this.template = _.template(this.tableTemplate);
            this.tbodytemplate = _.template(this.tbodyTemplate);
            this.data = null; //存储初始数据
            this.initEvent(); //初始化事件
        },
        initEvent: function() {
            var me = this;
            this.$el.on('click', 'th', function() {

                var $this = $(this);
                var index = $this.index();

                if (me.data.thead[0] == '应用版本') {

                    if (index == 0) { //默认应用版本和终端类型列不进行排序;

                        return;
                    }
                } else if (me.data.thead[1] == '应用版本') {
                    if (index == 1) {
                        return;
                    }
                } else if (me.data.thead[0] == '终端类型') {

                    if (index == 0) {

                        return;
                    }

                } else if (me.data.thead[1] == '终端类型') {

                    if (index == 1) {

                        return;
                    }
                }

                // 首行不为数字默认不能排序

                if (!isNaN(parseFloat(me.data.tbody[0][0]))) {

                    var arraya = [];

                    var arrayb = me.data.tbody.slice(0);

                } else if (me.data.tbody[0][0] == "总数") {

                    var arraya = me.data.tbody.slice(0, 1);
                    var arrayb = me.data.tbody.slice(1);

                } else {

                    var arraya = [];

                    var arrayb = me.data.tbody.slice(0);
                }


                if (index == 0) {

                    arrayb.sort(function(a, b) {

                        return a[index].localeCompare(b[index]); //时间按照字符串排序
                    });

                } else {

                    arrayb.sort(function(a, b) {

                        if (a[index] == "-") { //"-"排序会导致bug,所以在排序前将他替换为小于0的数,在排序后再换回"-";

                            a[index] = (-1.234);
                        }

                        if (b[index] == "-") {

                            b[index] = (-1.234);
                        }

                        if (a[index].toString().indexOf('%') > 0) {

                            return parseFloat(a[index].toString().replace(/[\%\-]/g, '')) - parseFloat(b[index].toString().replace(/[\%\-]/g, ''));

                        } else {

                            return parseFloat(a[index].toString().replace(/,|\s/g, '')) - parseFloat(b[index].toString().replace(/,|\s/g, ''));

                        }

                    });

                    for (var i = 0; i < arrayb.length; i++) {

                        for (var m = 0; m < arrayb[i].length; m++) {
                            if (arrayb[i][m] == (-1.234)) {
                                arrayb[i][m] = "-";
                            }
                        }
                    }
                }

                if ($this.hasClass('asc')) {

                    $this.addClass('des').removeClass('asc').siblings().removeClass('asc des');
                    arrayb.reverse();
                } else {

                    $this.addClass('asc').removeClass('des').siblings().removeClass('asc des');
                }
                me.data.tbody = arraya.concat(arrayb)
                me.refreshTbody();
            });
        },
        renderData: function(data) {

            this.data = data;
            var domStr = this.template(data);
            this.$el.html(domStr);
        },
        refreshTbody: function() {
            var domStr = this.tbodytemplate(this.data);
            this.$el.find('tbody').html(domStr);
        }
    };
    window.TableModule = TableModule;
});