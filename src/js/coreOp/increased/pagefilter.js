//实例化
define(function(require, exports, module) {

    var app = BI.app,
        util = BI.util;

    //select枚举对应表
    var Select_Map = {
        '0': 'area', //城市
        '1': 'industry', //行业
        '2': 'scope', //企业规模
        '3': 'terminalAndVersion', //终端类型
        '4': '', //产品版本(暂时已经去掉)
        // '5': 'payType', //付费类型
        '6': 'source',
        '16': 'establishedAccount', //开通账号数量
        '17': 'enterpriseType' //企业类型


    };

    //选择维度map转换
    var Reverse_Map = {
        // 'payType': '0', //付费类型
        'terminalAndVersion': '1', //终端类型
        'industry': '2', //行业
        'scope': '3', //企业规模
        'area': '4', //城市
        'source': '5',
        'establishedAccount': '7', //开通账号数量
        'enterpriseType': '8' //企业类型

    };

    var dateConfig = require('../../commModule/dateConfigure.js'); //引入日期控件配置文件
    // 页面筛选逻辑类
    // 筛选逻辑处理
    function PageFilter() {
        this.init.apply(this, arguments);
    }
    PageFilter.prototype = {

        init: function() {
            var me = this;


            me.$sd = $('#selectdimension'); //选择维度select
            me.$datamodel = $('[data-model]'); //所有的select选择框

            me.initDateWidget(); //初始化时间日期插件
            // 维度切换逻辑
            me.initEvent();
            me.initFilterEvent();

            //
            me.target = 'source'; //默认维度为企业来源类型
            me.getSelect(); //获取所有select option
        },

        // 获取筛选信息
        // 
        getSelectInfo: function() {
            //var 
            var me = this;

            //日期信息
            var dateinfo = me.$date.val().split('-');

            var info = {};

            var dimensions, //维度value---,隔开
                dimensionsArray, //维度value----数组
                dimensionsText; //维度text-----数组

            me.$datamodel.each(function() {
                var $this = $(this);
                var key = $this.attr('data-model');

                if (key == me.target) {
                    dimensionsArray = $this.multipleSelect('getSelects');
                    dimensionsText = $this.multipleSelect('getSelects', 'text');

                    if (key == "terminalAndVersion") {
                        info[key] = dimensions = dimensionsArray.join('@');
                    } else {
                        info[key] = dimensions = dimensionsArray.join(',');
                    }
                } else {
                    info[key] = $this.val();
                }
            });

            //获取 日月周 选择
            info['type'] = $('.timetype .active').attr('data-timetype');

            //起始时间
            info.start = new Date(dateinfo[0]).getTime();
            info.end = new Date(dateinfo[1]).getTime();

            //维度指向 方便后端获取
            info['showType'] = Reverse_Map[me.target];

            var obj = {
                'info': info,
                'target': me.target,
                'dimensions': dimensionsText,
                'dimensionsText': dimensionsText
            };

            console.log(obj);
            return obj;
        },
        initDateWidget: function() {
            var me = this;
            dateConfig.run();
            //初始化日期选择
            me.$date = $('#date');
           
            $(".timetype button").removeClass('active'); //重置后粒度选默认为日

            $('.timetype button[data-timetype=0]').addClass('active');

            $('.chartarea-btns button:nth-child(1)').trigger('click'); //重置指标切换为第一个;
        },

        getDownloadInfo: function() {
            //var 
            var me = this;

            //日期信息
            var dateinfo = me.$date.val().split('-');

            var info = {};
            var dimensions;

            me.$datamodel.each(function() {
                var $this = $(this);
                var key = $this.attr('data-model');

                if (key == me.target) {

                    if (key == "terminalAndVersion") {
                        info[key] = dimensions = $this.multipleSelect('getSelects').join('@');
                    } else {
                        info[key] = dimensions = $this.multipleSelect('getSelects').join(',');
                    }



                    info[key + '2'] = '';
                } else {
                    info[key] = $this.val();
                    info[key + '2'] = $this.val();
                }
            });

            //获取 日月周 选择
            info['type'] = $('.timetype .active').attr('data-timetype');

            //起始时间
            info.start = new Date(dateinfo[0]).getTime();
            info.end = new Date(dateinfo[1]).getTime();

            info['showType'] = Reverse_Map[me.target];

            return info;
        },

        //初始化事件
        initEvent: function() {
            var me = this;

            //查找事件
            $('.searchinfo').on('click', function() {


                $(this).attr("disabled", "disabled").css({ "backgroundColor": "grey" });

                var obj = me.getSelectInfo();
                //触发搜索事件
                me.refresh && me.refresh(obj.info, obj.target, obj.dimensions);
            });

            //重置
            $('.reset').on('click', function() {

                $(this).attr("disabled", "disabled").css({ "backgroundColor": "grey" });
                $("select").val("");
                me.$sd.val('source');
                me.shiftSelect();
                var obj = me.getSelectInfo();
                me.initDateWidget(); //重置日期插件，日周月粒度,和指标切换;
                me.refresh && me.refresh(obj.info, obj.target, obj.dimensions);
            });

            //日月周切换
            $('.timetype button').on('click', function(ev) {
                ev.preventDefault();
                $(ev.currentTarget).addClass('active').siblings().removeClass('active');
            });
        },

        //初始化筛选逻辑
        initFilterEvent: function() {
            var me = this;

            me.$sd.on('change', function(e) {
                me.shiftSelect();
            });
        },

        //-----------切换单选多选
        //@param bool 
        //如果为真 则默认第一个全选
        shiftSelect: function(bool) {
            var me = this;

            var target = me.target = me.$sd.val();

            me.$datamodel.each(function() {
                var $this = $(this);
                var model = $this.attr('data-model');

                //
                if (model == target) {

                    if ($this.data('multipleSelect')) {
                        $this.multipleSelect('show');
                    } else {
                        $this.multipleSelect();
                        if (bool) {
                            $this.multipleSelect('checkAll'); //$el-----select 元素
                        } else {
                            $this.multipleSelect('show'); //$parent -----指的是multiselect元素
                        }
                    }
                    //
                } else {

                    if ($this.data('multipleSelect')) {
                        $this.multipleSelect('hide');
                    }
                }
            });
        },

        //获取所有筛选项
        getSelect: function() {
            var me = this;

            //获取所有select选项
            app.api({
                'url': 'operation/dimension/all',
                'success': function(data) {
                    console.log('allselect');
                    console.warn(data);
                    if (data.success) {
                        data.value.model.forEach(function(item, index) {

                            if (Select_Map[index]) {
                                var $item = $('[data-model=' + Select_Map[index] + ']');
                                if ($item.length > 0) {
                                    me.resetSelect($item, item)
                                }
                            }
                        });
                        me.shiftSelect(true);

                        var obj = me.getSelectInfo();
                        me.ready && me.ready(obj.info, obj.target, obj.dimensions);
                    }
                }
            });
        },

        /***********************
         *
         *重置select的值
         * @param $select
         * @param array [{'name':'XXX','value':'XXX'},{'name':'XXX','value':'XXX'},{'name':'XXX','value':'XXX'}] 或
         *              ['XXX','XXX','XXX']
         ***********************/
        resetSelect: function($select, array, selectvalue) {
            var optionStr = '<option value="" class="all">全部</option>';

            if (array.length <= 0) return;

            for (var i = 0; i < array.length; i++) {
                if (typeof array[i] == 'object') {
                    optionStr = optionStr + '<option value="' + array[i]['value'] + '">' + array[i]['dimension'] + '</option>'
                } else {
                    optionStr = optionStr + '<option value="' + array[i] + '">' + array[i] + '</option>'
                }
            }

            $select.html(optionStr);

            if (selectvalue) {
                $select.val(selectvalue);
            } else {
                $select[0].options[0].selected = true
            }
            //todo 默认选中第一个 并触发事件
            $select.trigger('change');
        }
    };

    module.exports = PageFilter;
});
