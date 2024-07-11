let urlParams = new URLSearchParams(window.location.search);
var item_name = urlParams.get("name");

document.getElementById("item-name").innerText = item_name;

let isMADisplayed = false;
let isVOLDisplayed = false;
// 初始化图表
var chart = klinecharts.init('k_line');
chart.setStyles({
    candle: {
        bar: {
            upColor: "#00AA43",
            downColor: "#DB2F63",
            upBorderColor: "#00AA43",
            downBorderColor: "#DB2F63",
            upWickColor: "#00AA43",
            downWickColor: "#DB2F63"
        },
        priceMark: {
            last: {
                upColor: "#00AA43",
                downColor: "#DB2F63"
            }
        },
        tooltip: {
            showRule: 'follow_cross',
            showType: 'rect',
            custom: [
                { title: '时间', value: '  {time}' },
                { title: '开盘', value: '{open}' },
                { title: '最高', value: '{high}' },
                { title: '最低', value: '{low}' },
                { title: '收盘', value: '{close}' },
                { title: '成交量', value: '{volume}' }
            ],
        }
    },
    indicator: {
        bars: [{
            upColor: 'rgba(0,170,67,.7)',
            downColor: 'rgba(219,47,99,.7)',
        }],
    },
    yAxis: {
        inside: true,
        axisLine: {
              show: false,
        },
    },

});
// 定义MA指标
const maIndicator = {
  name: 'MA',
  shortName: '',
  calcParams: [7, 30],
  figures: [
    { key: 'ma1', title: 'MA7: ', type: 'line' },
    { key: 'ma2', title: 'MA30: ', type: 'line' }
  ],
  regenerateFigures: (params) => {
    return params.map((p, i) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' }
    });
  },
  calc: (kLineDataList, { calcParams, figures }) => {
    const closeSums = [];
    return kLineDataList.map((kLineData, i) => {
      const ma = {};
      const close = kLineData.close;
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close;
        if (i >= param - 1) {
          ma[figures[j].key] = closeSums[j] / param;
          closeSums[j] -= kLineDataList[i - (param - 1)].close;
        }
      });
      return ma;
    });
  }
};
// 定义VOL指标
const volIndicator = {name: 'VOL',shortName: ''};
// 切换MA指标
function func_MA() {
  if (isMADisplayed) {
    chart.removeIndicator('candle_pane', 'MA');
  } else {
    chart.createIndicator(maIndicator, false, { id: 'candle_pane' });
  }
  isMADisplayed = !isMADisplayed;
}
// 切换VOL指标
function func_VOL() {
  if (isVOLDisplayed) {
    chart.removeIndicator('vol_pane', 'VOL');
  } else {
    chart.createIndicator(volIndicator, false, { id: 'vol_pane' });
  }
  isVOLDisplayed = !isVOLDisplayed;
}
func_MA(); // 显示MA
// 图表相关
function updateChartWithNewPrice(newPrice) {
  // Get the current data list from the chart
  const dataList = chart.getDataList();

  // Extract the last data point from the list
  const lastData = dataList[dataList.length - 1];

  // Create a new data object based on the last data point
  const newData = {
    ...lastData,
    close: newPrice, // Update close price with the new price
    high: Math.max(lastData.high, newPrice), // Adjust high price if necessary
    low: Math.min(lastData.low, newPrice), // Adjust low price if necessary
    volume: lastData.volume + Math.round(Math.random() * 10), // Increment volume (example)
  };

  // Update the chart with the new data
  chart.updateData(newData);
}

ci.fetch_datas("(function() {charts_type['1年价格']();return false})()");
function charts_datas_check() {

    ci.fetch_datas("(function() {let result = charts_options;return result;})()");
    if (custom_temp_result !== "") {
        deal_charts_datas(custom_temp_result);
        clearInterval(checkInterval);
    }
}
let checkInterval = setInterval(charts_datas_check, 5000);
// 设置部分信息以及图表内容
function deal_charts_datas(datas) {
    var data = [];
    var price = datas["series"][0]["data"];
    var dayData = {};

    for (var i = 0; i < price.length; i++) {
        var timestamp = price[i][0];
        var value = price[i][1];

        var date = new Date(timestamp);
        var dayKey = date.toDateString();

        if (!dayData[dayKey]) {
            dayData[dayKey] = {
                timestamp: timestamp,
                open: value,
                high: value,
                low: value,
                close: value,
                volume: 0
            };
        } else {
            dayData[dayKey].high = Math.max(dayData[dayKey].high, value);
            dayData[dayKey].low = Math.min(dayData[dayKey].low, value);
            dayData[dayKey].close = value;
        }
    }

    for (var day in dayData) {
        data.push(dayData[day]);
    }

    chart.applyNewData(data);
}

var all_resps = {};
function receive(key,resp){
    all_resps[key] = resp;
}
function wait4value(key) {
    return new Promise((resolve, reject) => {
        const checkValue = () => {
            if (typeof all_resps[key] !== 'undefined') {
                resolve(all_resps[key]);
            } else {
                setTimeout(checkValue, 100);
            }
        };
        checkValue();
    });
}
function update_datas() {
    var datas = JSON.parse(all_resps['buff_datas']);
    // 获取最新请求到的数据
    delete all_resps['buff_datas'];
    // 删除该值避免影响下次请求处理

    document.querySelector('.item_infos').children[0].innerText = datas["data"]["sell_min_price"];

    document.querySelector('.item_data').innerHTML = "";
    _ie({
        tag : "div",
        children : [
            {
                tag : "p",
                innerText : "在售数量"
            },
            {
                tag : "a",
                innerText : datas["data"]["sell_num"]
            }
        ]
    },document.querySelector('.item_data'));
    _ie({
        tag : "div",
        children : [
            {
                tag : "p",
                innerText : "求购价格"
            },
            {
                tag : "a",
                innerText : datas["data"]["buy_max_price"]
            }
        ]
    },document.querySelector('.item_data'));
    _ie({
        tag : "div",
        children : [
            {
                tag : "p",
                innerText : "求购数量"
            },
            {
                tag : "a",
                innerText : datas["data"]["buy_num"]
            }
        ]
    },document.querySelector('.item_data'));
    _ie({
        tag : "div",
        children : [
            {
                tag : "p",
                innerText : "Steam参考价"
            },
            {
                tag : "a",
                innerText : datas["data"]["goods_info"]["steam_price_cny"]
            }
        ]
    },document.querySelector('.item_data'));

    updateChartWithNewPrice(datas["data"]["sell_min_price"]);
}
function buff_fetch(){
    if (item_name != ""){
        var id = buffids[item_name];
        if (typeof id !== "undefined"){
            var url = "https://buff.163.com/api/market/goods/info?game=csgo&goods_id="+id;
            Request.get(url,"buff_datas", "receive");
            wait4value("buff_datas").then(value => {
                update_datas();
            }); // 发送请求并等待数据
        }
    }
}
buff_fetch()
setInterval(buff_fetch, 10000);
// 每10s更新一次数据



