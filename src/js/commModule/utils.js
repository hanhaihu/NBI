define(function(require, exports, module) {


	var utils = {

		settleDataForOnLine: function(indicator, lineChar, chartOption, sTableData) { //在线的两个页面公用的整理数据函数

			var data = sTableData[1].tbody.slice(0),
				legend = [],
				series = [],
				BigArray = [];

			for (var q = 0; q < data.length; q++) {

				legend.push(data[q][1]);


				if (q + 1 < data.length) {

					if (data[q + 1][0] != data[0][0]) {
						break;
					}

				} else {

					break;
				}
			}

			var versionLength = legend.length;

			legend.forEach(function(ele, index, array) {

				series.push({
					name: ele,
					type: 'line', //chart配置的series;
					data: []
				});

				BigArray.push(new Array());
			});


			var timeLength = data.length / versionLength;

			var timeDur = [];

			for (var i = 1; i <= timeLength; i++) {

				timeDur.push(data[(i - 1) * versionLength][0]); //这是求出作为x轴的日期;
			}


			for (var i = 1; i <= timeLength; i++) {

				for (var m = 0; m < BigArray.length; m++) {

					BigArray[m].push(data[(i - 1) * versionLength + m][indicator + 2])
				}
			}

			chartOption.option.xAxis.data = timeDur.slice(0).reverse();

			chartOption.option.series = series;

			chartOption.option.legend.data = legend;

			BigArray.forEach(function(ele, index, array) {

				chartOption.option.series[index].data = ele.slice(0).reverse();

			});

		},

		addComma: function(data, m) {

			var copyData = JSON.parse(JSON.stringify(data)); //深拷贝一个对象;

			for (var i = 0; i < copyData.tbody.length; i++) {

				for (q = m; q < copyData.tbody[0].length; q++) {

					if (isNaN(parseFloat(copyData.tbody[i][q]))) {

					} else {

						copyData.tbody[i][q] = copyData.tbody[i][q].toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
							return s + ','

						});
					}
				}
			}

			return copyData;
		},
		addCommaForOp: function(data, m) {

			var reData = data.slice(0);

			for (var i = 0; i < reData.length; i++) {

				for (q = m; q < reData[0].length; q++) {

					if (isNaN(parseFloat(reData[i][q]))) {

					} else {

						reData[i][q] = reData[i][q].toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
							return s + ','

						});
					}
				}
			}
			return reData;
		},

		addCommaForPayBonus: function(data, m) { //可以给带小数的整数添加千分位

			var copyData = JSON.parse(JSON.stringify(data)); //深拷贝一个对象;

			for (var i = 0; i < copyData.tbody.length; i++) {

				for (q = m; q < copyData.tbody[0].length; q++) {

					if (isNaN(parseFloat(copyData.tbody[i][q]))) {

					} else {

						copyData.tbody[i][q] = this.deleteFloat(copyData.tbody[i][q]);
					}
				}
			}

			return copyData;
		},

		deleteFloat: function(val) {
			//根据`.`作为分隔，将val值转换成一个数组
			var aIntNum = val.toString().split('.');
			// 整数部分
			var iIntPart = aIntNum[0];
			// 小数部分（传的值有小数情况之下）
			var iFlootPart = aIntNum.length > 1 ? '.' + aIntNum[1] : '';
			var rgx = /(\d+)(\d{3})/;
			// 如果整数部分位数大于或等于5
			if (iIntPart.length >= 4) {
				// 根据正则要求，将整数部分用逗号每三位分隔
				while (rgx.test(iIntPart)) {
					iIntPart = iIntPart.replace(rgx, '$1' + ',' + '$2');
				}
			}
			return iIntPart + iFlootPart;
		}
	}

	module.exports = utils;
});