function genData (timestamp = new Date().getTime(), length = 800) {
  let basePrice = 5000
  timestamp = Math.floor(timestamp / 1000 / 60) * 60 * 1000 - length * 60 * 1000
  const dataList = []
  for (let i = 0; i < length; i++) {
    const prices = []
    for (let j = 0; j < 4; j++) {
      prices.push(basePrice + Math.random() * 60 - 30)
    }
    prices.sort()
    const open = +(prices[Math.round(Math.random() * 3)].toFixed(2))
    const high = +(prices[3].toFixed(2))
    const low = +(prices[0].toFixed(2))
    const close = +(prices[Math.round(Math.random() * 3)].toFixed(2))
    const volume = Math.round(Math.random() * 100) + 10
    const turnover = (open + high + low + close) / 4 * volume
    dataList.push({ timestamp, open, high,low, close, volume, turnover })

    basePrice = close
    timestamp += 60 * 1000
  }
  return dataList
}

let isMADisplayed = false;
let isVOLDisplayed = false;

// 初始化图表
var chart = klinecharts.init('k_line');
chart.applyNewData(genData());
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

