//===================
//
// app 路由系统
//--------------------
define("app", function(require, exports, module) {

    //routie路由系统
    (function(w) {

        var routes = [];
        var map = {};
        var reference = "routie";
        var oldReference = w[reference];

        var Route = function(path, name) {
            this.name = name;
            this.path = path;
            this.keys = [];
            this.fns = [];
            this.params = {};
            this.regex = pathToRegexp(this.path, this.keys, false, false);

        };

        Route.prototype.addHandler = function(fn) {
            this.fns.push(fn);
        };

        Route.prototype.removeHandler = function(fn) {
            for (var i = 0, c = this.fns.length; i < c; i++) {
                var f = this.fns[i];
                if (fn == f) {
                    this.fns.splice(i, 1);
                    return;
                }
            }
        };

        Route.prototype.run = function(params) {
            for (var i = 0, c = this.fns.length; i < c; i++) {
                this.fns[i].apply(this, params);
            }
        };

        Route.prototype.match = function(path, params) {
            var m = this.regex.exec(path);

            if (!m) return false;


            for (var i = 1, len = m.length; i < len; ++i) {
                var key = this.keys[i - 1];

                var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];

                if (key) {
                    this.params[key.name] = val;
                }
                params.push(val);
            }

            return true;
        };

        Route.prototype.toURL = function(params) {
            var path = this.path;
            for (var param in params) {
                path = path.replace('/:' + param, '/' + params[param]);
            }
            path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
            if (path.indexOf(':') != -1) {
                throw new Error('missing parameters for url: ' + path);
            }
            return path;
        };

        var pathToRegexp = function(path, keys, sensitive, strict) {
            if (path instanceof RegExp) return path;
            if (path instanceof Array) path = '(' + path.join('|') + ')';
            path = path
                .concat(strict ? '' : '/?')
                .replace(/\/\(/g, '(?:/')
                .replace(/\+/g, '__plus__')
                .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {
                    keys.push({
                        name: key,
                        optional: !!optional
                    });
                    slash = slash || '';
                    return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
                })
                .replace(/([\/.])/g, '\\$1')
                .replace(/__plus__/g, '(.+)')
                .replace(/\*/g, '(.*)');
            return new RegExp('^' + path + '$', sensitive ? '' : 'i');
        };

        var addHandler = function(path, fn) {
            var s = path.split(' ');
            var name = (s.length == 2) ? s[0] : null;
            path = (s.length == 2) ? s[1] : s[0];

            if (!map[path]) {
                map[path] = new Route(path, name);
                routes.push(map[path]);
            }
            map[path].addHandler(fn);
        };

        var routie = function(path, fn) {
            if (typeof fn == 'function') {
                addHandler(path, fn);
                routie.reload();
            } else if (typeof path == 'object') {
                for (var p in path) {
                    addHandler(p, path[p]);
                }
                routie.reload();
            } else if (typeof fn === 'undefined') {
                routie.navigate(path);
            }
        };

        routie.lookup = function(name, obj) {
            for (var i = 0, c = routes.length; i < c; i++) {
                var route = routes[i];
                if (route.name == name) {
                    return route.toURL(obj);
                }
            }
        };

        routie.remove = function(path, fn) {
            var route = map[path];
            if (!route)
                return;
            route.removeHandler(fn);
        };

        routie.removeAll = function() {
            map = {};
            routes = [];
        };

        routie.navigate = function(path, options) {
            options = options || {};
            var silent = options.silent || false;

            if (silent) {
                removeListener();
            }
            setTimeout(function() {
                window.location.hash = path;

                if (silent) {
                    setTimeout(function() {
                        addListener();
                    }, 1);
                }

            }, 1);
        };

        routie.noConflict = function() {
            w[reference] = oldReference;
            return routie;
        };

        var getHash = function() {
            return window.location.hash.substring(1);
        };

        var checkRoute = function(hash, route) {
            var params = [];
            if (route.match(hash, params)) {
                route.run(params);
                return true;
            }
            return false;
        };

        var hashChanged = routie.reload = function() {
            var hash = getHash();
            for (var i = 0, c = routes.length; i < c; i++) {
                var route = routes[i];
                if (checkRoute(hash, route)) {
                    return;
                }
            }
        };

        var addListener = function() {
            if (w.addEventListener) {
                w.addEventListener('hashchange', hashChanged, false);
            } else {
                w.attachEvent('onhashchange', hashChanged);
            }
        };

        var removeListener = function() {
            if (w.removeEventListener) {
                w.removeEventListener('hashchange', hashChanged);
            } else {
                w.detachEvent('onhashchange', hashChanged);
            }
        };
        addListener();

        w[reference] = routie;

    })(window);

    /**
     *
     * app页面路由
     */
    //常用DOM元素引用
    var $body = $('body'),
        $header = $('header'),
        $nav = $('nav'),
        $container = $('#container');

    //模板元素
    var tipsTemplate = $('#g-tips').html(),
        toastTemplate = $('#g-toast').html();

    var TIME_OUT = 600000; //请求超时设置

    var ver = '1.2.5'; //版本号
    var new_tip = require('../../js/commModule/new.js');
    var $content = $(require('../../js/commModule/version.html.js'));
    //页面路由
    var App = function() {
        //this.init.apply(this, arguments);
    }
    App.prototype = {

        init: function() {
            var me = this;

            me.showVersion(); //每次重新加载页面时都会提示版本信息
            me.showExplain();
            //侦听路由事件
            //页面切换主逻辑
            me.path = null; //当前html path 绝对路径
            me.params = null; //当前参数
            me.jspath = null; //当前jspath 绝对路径

            me.currentPage = null; //当前页面缓存
            // me.cache = {}; //页面缓存 缓存每个页面的exports

            //获取当前用户信息
            //获取完毕后开启路由
            me.getAccount();
            me._initRoute();
            me.getExplain(); //获取帮助信息
            me.avoidCalShow(); //避免日历插件关闭不了;
            me.categoryButtonClick(); //绑定相应页面的点击事件
            me.mainCategoryChange(); //主目录的切换; 


        },

        //初始化路由系统
        _initRoute: function() {
            var me = this;

            routie('*', function(paths) {

                var path, //hash路径部分
                    params; //hash参数部分

                var paramarray;
                if (paths) {


                    path = paths.split('/=/')[0]; //获取hash值;
                    paramarray = paths.split('/=/')[1];

                    console.log(path);
                    console.log(paramarray);

                } else {
                    path = me.getCurrentHash().slice(1);
                    console.log(path);
                }

                //格式化param
                if (paramarray) {

                    params = {};
                    paramarray = paramarray.split('&');
                    for (var i = 0; i < paramarray.length; i++) {
                        params[paramarray[i].split('=')[0]] = paramarray[i].split('=')[1];
                    }
                }

                me.path = BI.PAGE_PATH + "/pages/" + path; //path   绝对路径

                console.log(path);
                var jsName = path.split('/')[1];
                me.jspath = BI.PAGE_PATH + "/js/" + path + '/' + jsName; //jspath 绝对路径
                me.params = params; //参数
                console.log(params);
                me.lightNav();
                me.switchpage();
            });
        },

        //获取当前用户信息
        getAccount: function(callback) {
            var me = this;

            me.api({
                url: '~/g/api/account/getloginaccount',
                async: false,
                success: function(data) {

                    if (data.success) {
                        $header.find('.person-user').text(data.value.model.name);

                        BI.role = data.value.model;
                        BI.FUNCTIONS = data.value.model.moduleCodes;
                        me.setPermissions();

                        $(".guideType").each(function(index, ele) {

                            var href = $(this).next('.children').find('a[href]').eq(0).attr('href');

                            $(this).children('a').attr('href', href);

                        });

                        new_tip(ver, data.value.model.username);
                    }
                }
            });
        },

        //设置权限显隐状态
        setPermissions: function($el) {
            var $el = $el || $nav;



            $el.find('[data-permissions]').each(function() {
                var $this = $(this),
                    codes = $this.attr('data-permissions').split(/[\s,]+/); //   /\s+/

                var bool = false;
                for (var i = 0; i < BI.FUNCTIONS.length; i++) {

                    for (var j = 0; j < codes.length; j++) {
                        if (codes[j] == BI.FUNCTIONS[i]) {
                            //$this.show(); 默认不做任何处理
                            bool = true;
                            break;
                        }

                    }
                    if (bool == true) {
                        break;
                    }
                }
                if (bool == false) {
                    $this.remove();
                }
            });

        },

        //根据当前hash 点亮图标
        lightNav: function() {
            var me = this;
            hash = this.getCurrentHash(); //获取当前hash

            //遍历所有带href属性的a标签
            //如果a标签的href 和 当前location.hash 相等 则所有父级li加active类名

            //清除所有根节点的 active 状态
            $nav.find('.root').removeClass('active');

            $nav.find('li>a[href]').each(function() {
                var $this = $(this),
                    href = $this.attr('href') || '';

                if (hash == href) {

                    if ($this.parents('ul').hasClass('hide')) {
                        $this.parents('.hide').slideDown(300);
                        $this.parents('.hide').siblings('.children').slideUp(300);

                        if ($this.parent('li').parent().hasClass('children')) {

                            // $this.parent('li').siblings(".cascading").slideUp(300);

                        } else {

                            $this.parent('li').parent(".cascading").css({
                                "display": "block"
                            });
                        }

                        $this.parent('li').addClass('active');

                    } else {
                        $this.parent('li').addClass('active');

                    }

                } else {
                    $this.parent('li').removeClass('active');
                }
            });
        },

        /**
         *
         * @desc 获取当前hash
         * 如果location的hash为空 则取nav中可见且有href属性的a标签的href值
         */
        getCurrentHash: function() {

            return location.hash || this.getIndexHash();
        },

        /**
         *
         * @desc 获取首个hash
         */
        getIndexHash: function() {

            return $nav.find('a[href]').eq(1).attr('href') || '';
        },

        //===================
        //
        // 页面切换逻辑执行
        // 页面切换过快 的逻辑处理????????
        // @params{string}  path    
        // @params{object}  params
        //-------------------------
        switchpage: function() {
            var me = this;

            var path = me.path + '.html.js';
            var jspath = me.jspath + '.js';

            me.currentPage && me.currentPage.$el.detach();

            // var cachepage = null;
            // for (var key in me.cache) {
            //     if (key == me.path) {
            //         cachepage = me.cache[key];
            //         break;
            //     }
            // }

            // //如果缓存有直接显示
            // if (cachepage) {
            //     $container.append(cachepage.$el);
            //     me.currentPage = cachepage;
            //     //缓存中没有 发送请求 成功后存入缓存
            // } else {
            // me.showGlobalLoading();
            require.async(path, function(response) {

                var $el = $(response);
                $container.append($el);

                require.async(jspath, function(exports) {

                    exports.$el = $el;
                    exports.init(me.params);
                    // me.cache[me.path] = exports;
                    me.currentPage = exports;
                    // me.hideGlobalLoading();
                    new_tip();
                });
            });
            // }

            me.setTitle();

            //取消 new
            new_tip();
        },
        cancelNew: function() {

        },

        setTitle: function() {

            var me = this;

            var title = (me.getCurrentHash());

            var obj = {
                "#coreOp/totalCount": '数据概览',
                "#coreOp/MRR": 'MRR',
                "#coreOp/increased": '新增统计',
                "#coreOp/online": '在线统计',
                "#coreOp/onlineTer": '在线分终端类型',
                "#coreOp/onlineAppVer": '在线分移动端版本',
                "#coreOp/runaway": "流失统计",
                "#coreOp/retention": "留存统计",
                '#coreBus/entSession': '企信-会话',
                '#coreBus/overviewUser': '业务概览',
                '#coreBus/overviewEnt': '业务概览',
                '#coreBus/entInfo': '企信-消息',
                '#coreBus/attendance': "考勤外勤",
                '#coreBus/coopFeed': '协同-feed',
                '#coreBus/coopAction': '协同-动作',
                '#coreBus/CRM-obj': 'CRM-对象数据',
                '#coreOp/CRM-user': 'CRM用户数',
                '#coreOp/actEntNum': '活跃企业数',
                '#coreBus/serNum': '服务号-数量',
                '#coreBus/serInfo': '服务号-服务号消息',
                '#coreBus/payBonus': '支付-红包',
                '#coreBus/payCash': '支付-充值提现',
                '#coreBus/payBankCard': '支付-银行卡',
                '#coreBus/project': '项目管理助手',
                '#coreBus/report': '战报助手',
                '#coreBus/meeting': '会议助手',
                '#coreBus/PK': 'PK助手',
                '#coreBus/salary': '工资助手',
                '#coreBus/trainning': '培训助手',
                "#coreTrench/trench": '渠道概览',
            };


            $("#title").html(obj[title]);


            switch (obj[title]) {

                case 'CRM-对象数据':
                    $('#tip_board').css({
                        "left": '420px'
                    });
                    break;
                case 'MRR':
                    $('#tip_board').css({
                        "left": '300px'
                    });
                    break;
                case '在线分终端类型':
                    $('#tip_board').css({
                        "left": '410px'
                    });
                    break;
                case '在线分移动端版本':
                    $('#tip_board').css({
                        "left": '440px'
                    });
                    break;
                case '数据概览':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '新增统计':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '在线统计':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '流失统计':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case 'CRM用户数':
                    $('#tip_board').css({
                        "left": '380px'
                    });
                    break;
                case '活跃企业数':
                    $('#tip_board').css({
                        "left": '380px'
                    });
                    break;
                case '留存统计':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '服务号-数量':
                    $('#tip_board').css({
                        "left": '390px'
                    });
                    break;
                case '服务号-服务号消息':
                    $('#tip_board').css({
                        "left": '460px'
                    });
                    break;
                case '支付-充值提现':
                    $('#tip_board').css({
                        "left": '410px'
                    });
                    break;
                case '支付-银行卡':
                    $('#tip_board').css({
                        "left": '390px'
                    });
                    break;
                case '支付-红包':
                    $('#tip_board').css({
                        "left": '370px'
                    });
                    break;
                case '考勤外勤':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '业务概览':
                    $('#tip_board').css({
                        "left": '370px'
                    });
                    break;
                case '企信-会话':
                    $('#tip_board').css({
                        "left": '370px'
                    });
                    break;
                case '企信-消息':
                    $('#tip_board').css({
                        "left": '370px'
                    });
                    break;
                case '协同-feed':
                    $('#tip_board').css({
                        "left": '370px'
                    });
                    break;
                case '协同-动作':
                    $('#tip_board').css({
                        "left": '370px'
                    });
                    break;
                case '项目管理助手':
                    $('#tip_board').css({
                        "left": '410px'
                    });
                    break;
                case '战报助手':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '会议助手':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case 'PK助手':
                    $('#tip_board').css({
                        "left": '340px'
                    });
                    break;
                case '工资助手':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '培训助手':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                case '渠道概览':
                    $('#tip_board').css({
                        "left": '360px'
                    });
                    break;
                default:
            }

        },

        getDeps: function() {
            var me = this;

            var path = me.jspath + '.js';

            require.async(path, function(exports) {
                exports.$el = me.$el;
                exports.init(me.param);
            })
        },

        //通用请求方法
        api: function(opt, mask) {
            var me = this,
                beforeSend = opt.beforeSend,
                success = opt.success,
                error = opt.error;

            //默认配置
            opt = _.extend({
                type: 'post',
                cache: false,
                timeout: TIME_OUT,
                dataType: 'json'
            }, opt || {});

            //如果 url是 ~ 开头 则从根路径请求
            //否则 从全局配置的api路径请求
            if (opt.url.indexOf('~') == 0) {
                opt.url = opt.url.slice(1);
            } else {
                opt.url = BI.API_PATH + opt.url;
            }

            opt.beforeSend = function() {
                return beforeSend && beforeSend.apply(this, arguments);
            };

            opt.success = function(data, status, xhr) {
                if (data.login == false) {
                    location.href = "/login?from=" + location.pathname;
                    return;
                }
                if (!data.success) {
                    me.showToast('请求错误  ' + data.message);
                }
                return success && success.apply(this, arguments);
            };

            opt.error = function(info) {
                if (info && info.statusText == "abort") return;
                me.showToast('网络错误' + '(' + info.status + ')' + '!');
                return error && error.apply(this);
            };

            return $.ajax(opt);
        },

        $gloading: $('.g-loading'),
        $switchloading: $('.switch-loading'),
        $version: $('.version'),
        $explain: $(".explain"),
        //显示全局遮罩
        showGlobalLoading: function() {
            this.$gloading.show();
        },

        //隐藏全局遮罩
        hideGlobalLoading: function() {
            this.$gloading.hide();
        },

        showLoading: function() {
            this.$switchloading.show();
        },

        showVersion: function() {
            var me = this;
            // document.body.parentNode.style.overflow = "hidden"; //隐藏且禁用
            this.$version.html($content);
            // this.$version.fadeIn(1000);
            this.$delete = $(".delete");
            this.$delete.unbind("click");
            this.$delete.click(function(e) {
                e.stopPropagation();
                me.$version.hide();
                document.body.parentNode.style.overflow = "scroll"; //显示且使用
            });
        },

        showExplain: function() {
            var me = this;
            this.$explain.click(function() {
                me.$version.toggle();
                if (me.$version.css('display') == "none") {
                    document.body.parentNode.style.overflow = "scroll";
                } else {

                    document.body.parentNode.style.overflow = "hidden"
                }

            });
        },

        //隐藏全局遮罩
        hideLoading: function() {
            this.$switchloading.hide();
        },
        //显示提示
        showTips: function(msg) {
            var me = this;

            var $tips = $(tipsTemplate); //生成新的dom元素
            var $content = $tips.find('p').text(msg);

            $body.append($tips);
            setTimeout(function() {
                $tips.fadeOut('fast', function() {
                    $tips.remove();
                })
            }, 3000)
        },

        //显示警告
        showToast: function(msg) {
            var me = this;

            var $toast = $(toastTemplate);
            var $content = $toast.find('p').text(msg);

            $body.append($toast);
            setTimeout(function() {
                $toast.fadeOut('fast', function() {
                    $toast.remove();
                })
            }, 3000)
        },
        getExplain: function() {

            $('.icon:eq(0)').hover(function() {

                $('#tip').css("display", "block"); //根据hash值自动加载帮助信息

            }, function() {

                $('#tip').css("display", "none");
            });
        },
        mainCategoryChange: function() {
            $(".guideType").click(function(e) {
                $(this).next('.children').slideDown(400).siblings('.children').slideUp(400).children('.cascading').slideUp(400); //点击主目录时,其余的主目录自动关闭,并且子元素cascading类也自动关闭;
                // if ($(this).attr('data-num') == "2") {
                //     // $(".cascading:eq(0)").css("display", "block").siblings(".cascading").css({
                //     //     "display": "none"
                //     // });
                // }
            });
        },

        categoryButtonClick: function() {

            // $(".children button[data-permissions!='M017003']").click(function() {

            //     $(this).next(".cascading").slideDown(400).siblings('.cascading').slideUp(400); //点击相应的button时,相应的cascading类自动展开，其余的关闭;

            // });

            $(".children button").toggle(function() {

                $(this).next(".cascading").slideDown(400); //点击.children类的时候循环切换相邻的.cascading的显隐状态;

            }, function() {

                $(this).next(".cascading").slideUp(400);
            });


            // $(".online").toggle(function() {

            //     $(this).next(".cascading").slideDown(400)

            // }, function() {

            //     $(this).next(".cascading").slideUp(400);

            // });
        },
        avoidCalShow: function() {

            $("nav").click(function() {

                $(".ui-front").trigger("click"); //在nav和container上绑定点击事件，触发点击事件时关闭日历插件下拉框;
            });
        }
    }
    var app = BI.app = new App();


    // util工具类
    var util = {

        resetSelect: function() {

        },

        //复制obj对象
        clone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
    BI.util = util;


    module.exports = app;
});