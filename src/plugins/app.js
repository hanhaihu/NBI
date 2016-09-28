/*!
 * routie - a tiny hash router
 * v0.3.2
 * http://projects.jga.me/routie
 * copyright Greg Allen 2013
 * MIT License
*/
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

  Route.prototype.match = function(path, params){
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
      path = path.replace('/:'+param, '/'+params[param]);
    }
    path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
    if (path.indexOf(':') != -1) {
      throw new Error('missing parameters for url: '+path);
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
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
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
(function(){

	//声明全局变量
	var BI = window.BI = {};
	BI.PAGE_PATH = "";
    BI.API_PATH = "/nbi/api/";

    //常用DOM元素引用
    var $body = $('body'),
        $nav = $('nav'),
        $container = $('#container');

    //模板元素
    var tipsTemplate = $('#g-tips').html(),
        toastTemplate = $('#g-toast').html();

    var TIME_OUT = 600000;   //请求超时设置

	//页面路由
	var App = function(){
		this.init.apply( this , arguments );
	}

	App.prototype = {
		
		init: function(){
			var me = this;
			console.log('init');

            
			//侦听路由事件
            //页面切换主逻辑
			routie('*',function( paths ){
				var path,
                    paramarray,
                    params;

                if( paths ){
                    path = paths.split('/=/')[0];
                    paramarray = paths.split('/=/')[1];
                }else{
                    path = me.getCurrentHash().slice(1);
                }
	    	 
		    	if( paramarray ){
		    		
		    		params = {};
		    		paramarray = paramarray.split('&');
		    		for( var i=0; i< paramarray.length; i++ ){
		    			params[ paramarray[i].split('=')[0] ] = paramarray[i].split('=')[1];
		    		}
		    	}

                me.lightNav();
	            me.switchpage( path , params );
			})
		},

		//初始化一些事件
		_initEvent: function(){

			var me = this;
		},

        /**
         *
         * 点亮图标
         */
        lightNav: function(){
            var me = this;
            hash = this.getCurrentHash();

            //先移除所有的active类名
            $nav.find('p a').each(function(){
                $(this).removeClass('active');
            });

            //遍历所有带href属性的a标签
            //如果a标签的href 和 当前location.hash 相等 则所有父级li加active类名
            $nav.find('p a[href]').each(function(){
                var $this = $(this),
                    href = $this.attr('href') || '';

                if( hash == href ){
                    $this.addClass('active');
                }
            });
        },

		/**
	     *
	     * @desc 获取当前hash
	     * 如果location的hash为空 则取nav中可见且有href属性的a标签的href值
	     */
	    getCurrentHash: function(){

	    	return location.hash || this.getIndexHash();
	    },

	    /**
	     *
	     * @desc 获取首个hash
	     */
	    getIndexHash: function(){

	    	return $nav.find('a[href]').eq(0).attr('href') || '';
	    },

		/**
		 * @desc 载入nav首个链接地址
		 * 同时不更改当前hash 防止不能后退
		 */
		index: function(){
			var path = this.getCurrentHash().slice(1);
	        this.switchpage( path );
		},

	    /*
	    *
	    * 页面切换逻辑执行
	    * @params{string}  path    
	    * @params{object}  params
	    */
		switchpage: function( path, params ){
			var me = this;
			
            path = BI.PAGE_PATH + path + '.html';
            console.log( 'switchpage' );
            console.log( path );
			console.log( params );
            $container.attr('src',path);
		},

        //通用请求方法
        api: function( opt, mask ){
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
            },opt||{}); 

            //如果 url是 ~ 开头 则从根路径请求
            //否则 从全局配置的api路径请求
            if( opt.url.indexOf('~') == 0 ){
                opt.url = opt.url.slice(1);
            }else{
                opt.url = BI.API_PATH + opt.url;
            }

            opt.beforeSend = function(){
                return beforeSend && beforeSend.apply( this, arguments );
            };

            opt.success = function( data, status , xhr ){
                if(data.login == false){
                    location.href = "/login?from=" + location.pathname;
                    return;
                }
                if(!data.success){
                    me.showToast('请求错误  ' + data.message);
                }
                return success && success.apply( this, arguments );
            };

            opt.error = function( info ){
                if( info && info.statusText == "abort") return;
                me.showToast('网络错误' + '(' + info.status + ')' + '!');
                return error && error.apply( this );
            };

            return $.ajax( opt );
        },
        
        //显示全局遮罩
        showGlobalLoading: function(){

        },
        
        //隐藏全局遮罩
        hideGlobalLoading: function(){

        },

        //显示提示
        showTips: function( msg ){
            var me = this;

            var $tips = $(tipsTemplate );                  //生成新的dom元素
            var $content = $tips.find('p').text( msg );

            $body.append( $tips );
            setTimeout(function(){
                $tips.fadeOut('fast',function(){
                    $tips.remove();
                })
            },3000)
        },

        //显示警告
        showToast: function( msg ){
            var me = this;
            
            var $toast = $(toastTemplate);
            var $content = $toast.find('p').text( msg );

            $body.append( $toast );
            setTimeout(function(){
                $toast.fadeOut('fast',function(){
                    $toast.remove();
                })
            },3000)
        }
	}

	BI.app = new App();
})();

