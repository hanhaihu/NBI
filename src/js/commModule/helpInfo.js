define(function(require, exports, module) {

    var strForBus = "<div id='tipBoard' style='position:absolute; width:400px;left:100%;top:8px;'>" +
        "<div class='helps'>" +
        "<div class='corner'></div>" +
        "<p>当统计粒度选择为“周”或者“月”时，只会统计出所选择的时间范围内，已过完的完整自然周/自然月的指标结果</p>" +
        "</div>" +
        "</div>";


    var strForOp = "<div id='tipBoard' style='position:absolute; width:400px;left:105%;top:8px;'>" +
        "<div class='helps'>" +
        "<div class='corner'></div>" +
        "<p>当统计粒度选择为“周”或者“月”时，只会统计出所选择的时间范围内，已过完的完整自然周/自然月的指标结果</p>" +
        "</div>" +
        "</div>";

    var strForZhh = "<div id='tipBoard' style='position:absolute; width:400px;left:100%;top:8px;'>" +
        "<div class='helps'>" +
        "<div class='corner'></div>" +
        "<p>当统计粒度选择为“周”或者“月”时，只会统计出所选择的时间范围内，已过完的完整自然周/自然月的指标结果</p>" +
        "</div>" +
        "</div>";

    var strForOnLine = "<div id='tipBoard' style='position:absolute; width:400px;left:106%;top:0px;'>" +
        "<div class='helps'>" +
        "<div class='corner'></div>" +
        "<p>当统计粒度选择为“周”或者“月”时，只会统计出所选择的时间范围内，已过完的完整自然周/自然月的指标结果</p>" +
        "</div>" +
        "</div>";
    module.exports = {
        strForOp,
        strForBus,
        strForZhh,
        strForOnLine
    };
});