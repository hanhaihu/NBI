<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>汇聚数据平台-纷享销客畅享智慧工作</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link rel="shortcut icon" href="//www.fxiaoke.com/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" type="image/x-icon" href="//www.fxiaoke.com/favicon.ico">
      <script type="text/javascript">
            var js = '${baseUrl}/' + 'resources.js?t=' + Date.now();
            document.write( '<script type="text/javascript" src="' + js + '"><\/script>' );
        </script>
        <script type="text/javascript">
            for ( var i = 0; i < window.RESOURCES.css.length; ++i ) {
                var css = '${baseUrl}/' + window.RESOURCES.css[ i ];
                document.write( '<link rel="stylesheet" type="text/css" href="' + css + '"/>' );
            }

              for(var m = 0; m < window.RESOURCES.js.length; ++m ){
                var js = '${baseUrl}/' + window.RESOURCES.js[ m ];
                document.write(  '<script type="text/javascript" src="' + js + '"><\/script>');
            }
        </script>
    <style>
    .autocomplete-suggestions {
        border: 1px solid #999;
        background: #FFF;
        overflow: auto;
    }
    
    .autocomplete-suggestion {
        padding: 2px 5px;
        white-space: nowrap;
        overflow: hidden;
    }
    
    .autocomplete-selected {
        background: #F0F0F0;
    }
    
    .autocomplete-suggestions strong {
        font-weight: normal;
        color: #3399FF;
    }
    
    .autocomplete-group {
        padding: 2px 5px;
    }
    
    .autocomplete-group strong {
        display: block;
        border-bottom: 1px solid #000;
    }
    </style>
</head>

<body>
    <header>
        <h3 id="title"></h3>
        <a class="icon help"></a>
        <!--<span class="header-menu">菜单</span>-->
       <div class="header-person">
            <button type="button" class="explain">版本说明</button>
            <div class="slide">
                <p class="person-user">用户A</p>
                <section>
                    <p><a href="/logout?from=/nbi">登出</a></p>
                </section>
            </div>
        </div>
    </header>
    <!--页面主菜单-->
     <nav>
        <ul class="root">
            <li class="title">
            </li>
            <li data-permissions="M017006" class="guideType" data-num="1"><a href="" style="margin-left:15px">核心运营指标</a></li>
            <ul class="children hide">
                <li data-permissions="M017001" class="active"><a href="#coreOp/totalCount">概览</a></li>
                <li data-permissions="M017002"><a href="#coreOp/increased">新增</a></li>
                <button type="button" class="online" data-permissions="M017003">在线</button>
                <ul class="cascading">
                    <li><a href="#coreOp/online" data-permissions="M017003001">在线-概览</a></li>
                    <li><a href="#coreOp/onlineTer" data-permissions="M017003002">在线-分终端类型</a></li>
                    <li><a href="#coreOp/onlineAppVer" data-permissions="M017003003">在线-分应用版本</a></li>
                </ul>
                <li data-permissions="M017009" class="new"><a href="#coreOp/MRR">MRR</a></li>
                <li data-permissions="M017004">
                    <a href="#coreOp/runaway">流失</a>
                </li>
                <li data-permissions="M017008" class="new"><a href="#coreOp/CRM-user">CRM用户数</a></li>
                <li data-permissions="M017007" class="new"><a href="#coreOp/actEntNum">活跃企业数</a></li>
                <li data-permissions="M017005"><a href="#coreOp/retention">留存</a></li>
            </ul>
            <li data-permissions="M017049" class="guideType" data-num="2"><a href="" style="margin-left:15px">核心业务指标</a></li>
            <ul class="children hide">
                <button type="button" data-permissions="M017056">概览</button>
                <ul class="cascading">
                    <li data-permissions="M017056001" class="new"><a href="#coreBus/overviewUser">按用户</a></li>
                    <li data-permissions="M017056002" class="new"><a href="#coreBus/overviewEnt">按企业</a></li>
                </ul>
                <button type="button" data-permissions="M017051">企信</button>
                <ul class="cascading">
                    <li data-permissions="M017051001"><a href="#coreBus/entSession">企信-会话</a></li>
                    <li data-permissions="M017051002"><a href="#coreBus/entInfo">企信-消息</a></li>
                </ul>
                <button type="button" data-permissions="M017055">协同</button>
                <ul class="cascading">
                    <li data-permissions="M017055001"><a href="#coreBus/coopFeed">协同-feed</a></li>
                    <li data-permissions="M017055002"><a href="#coreBus/coopAction">协同-动作</a></li>
                </ul>
                <button type="button" data-permissions="M017054">CRM</button>
                <ul class="cascading">
                    <li data-permissions="M017054001"><a href="#coreBus/CRM-obj" style="font-size: 15px;">CRM-对象数据</a></li>
                </ul>
                <button type="button" data-permissions="M017053">服务号</button>
                <ul class="cascading">
                    <li data-permissions="M017053001"><a href="#coreBus/serNum">服务号-数量</a></li>
                    <li data-permissions="M017053002"><a href="#coreBus/serInfo">服务号-服务号消息</a></li>
                </ul>
                <button type="button" data-permissions="M017052">支付</button>
                <ul class="cascading">
                    <li data-permissions="M017052001"><a href="#coreBus/payBonus">支付-红包</a></li>
                    <li data-permissions="M017052002"><a href="#coreBus/payCash">支付-充值提现</a></li>
                    <li data-permissions="M017052003"><a href="#coreBus/payBankCard">支付-银行卡</a></li>
                </ul>
                <button type="button" data-permissions="M017050">助手</button>
                <ul class="cascading">
                    <li data-permissions="M017050001"><a href="#coreBus/attendance">考勤外勤</a></li>
                    <li data-permissions="M017050002"><a href="#coreBus/project">项目管理助手</a></li>
                    <li data-permissions="M017050003"><a href="#coreBus/report">战报助手</a></li>
                    <li data-permissions="M017050004"><a href="#coreBus/meeting">会议助手</a></li>
                    <li data-permissions="M017050005"><a href="#coreBus/PK">PK助手</a></li>
                    <li data-permissions="M017050006"><a href="#coreBus/salary">工资助手</a></li>
                    <li data-permissions="M017050007"><a href="#coreBus/trainning">培训助手</a></li>
                </ul>
            </ul>
            <li data-permissions="M017100" class="guideType" data-num="2"><a href="" style="margin-left:15px">核心渠道指标</a></li>
            <ul class="children hide">
                <li data-permissions="M017101" class="active"><a href="#coreTrench/trench">概览</a></li>
            </ul>
        </ul>
    </nav>
    <div id="container"></div>
    <!--global-->
    <div class="g-loading"></div>
    <div class="switch-loading">
        <div><span></span>数据加载中请稍后...</div>
    </div>
    <div class="version">
    </div>
    <div id="tip_board" style="position:fixed; left:360px;top:30px;width:400px;z-index: 300;">
    </div>
    <script type="text/template" id="g-tips">
        <div class="g-tip">
            <p></p>
        </div>
    </script>
    <script type="text/template" id="g-toast">
        <div class="g-toast">
            <p></p>
        </div>
    </script>
    <script type="text/javascript">
    //PAGE_PATH 请求页面的根路径
    var BI = {};
    BI.PAGE_PATH = "${baseUrl}";
    BI.API_PATH = "/nbi/";
    </script>
    <!--模块化加载-->
    <script type="text/javascript">
    seajs.config({
        alias: {
            "jquery": '${baseUrl}/jquery.js'
        }
    })
    seajs.use("app", function(app) {
        app.init();
    });
    </script>
</body>

</html>
