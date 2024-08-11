let urlParams = new URLSearchParams(window.location.search);
var item_name = urlParams.get("name");
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

document.getElementById("item-name").innerText = item_name;

var loaded = {
    "infos" : false,
    "ai" : false,
    "news" : false,
}

var item_id = 0;
function load_item_id(){
    item_id = JSON.parse(all_resps["item_infos"]).data.list[0].goodsId;
}
// 先尝试请求csgoob获取item_id

function load_infos(){
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

    var url = "https://api-csob.douyuex.com/api/v2/goods/info";
    var post_data = {"goodsName":item_name};
    Request.post(url,JSON.stringify(post_data),"item_infos", "receive");
    wait4value("item_infos").then(value => {
        load_item_id();
        var url = "https://api-csob.douyuex.com/api/v1/goods/chart/kline";
        var post_data = {"goods":{"goodsId":item_id,"platform":0},"kType":"DAY","isFilter":false,"samplingSize":5,"upPercent":30,"downPercent":30}
        console.log(post_data);
        Request.post(url,JSON.stringify(post_data),"item_charts", "receive");
        wait4value("item_charts").then(value => {
            load_charts_datas();
        });
    });

    // 加载图表数据
   function load_charts_datas() {
    var jsons = JSON.parse(all_resps["item_charts"]).data.list;

    var data = [];
    var records = jsons; // Assuming the data format is [[timestamp1, open1, close1, high1, low1, volume1], [timestamp2, open2, close2, high2, low2, volume2], ...]

    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        var timestamp = record[0];
        var open = record[1] / 100; // Assuming you need to divide by 100
        var close = record[2] / 100; // Assuming you need to divide by 100
        var high = record[3] / 100; // Assuming you need to divide by 100
        var low = record[4] / 100; // Assuming you need to divide by 100
        var volume = record[5]; // Assuming volume does not need to be divided by 100

        var date = new Date(timestamp);

        data.push({
            timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume
        });
    }

    // 按时间戳排序数据以确保正确的顺序
    data.sort((a, b) => a.timestamp - b.timestamp);

    chart.applyNewData(data);
   }

    //传入新价格,加载入图表
    function updateChartWithNewPrice(newPrice) {
          const dataList = chart.getDataList();
          const lastData = dataList[dataList.length - 1];
          const newData = {
                ...lastData,
                close: newPrice,
                high: Math.max(lastData.high, newPrice),
                low: Math.min(lastData.low, newPrice),
                volume: lastData.volume + Math.round(Math.random() * 10),
          };
          chart.updateData(newData);
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
        if (item_id == 0){
            item_id = buffids[item_name];
        }
        if (typeof item_id !== "undefined"){
            var url = "https://buff.163.com/api/market/goods/info?game=csgo&goods_id="+item_id;
            Request.get(url,"buff_datas", "receive");
            wait4value("buff_datas").then(value => {
                update_datas();
            }); // 发送请求并等待数据
        }
    }
    buff_fetch()
    setInterval(buff_fetch, 10000);
    // 每10s更新一次数据


}

function load_ai(){

}

function load_news(){

}

function switch_content(nav){
    document.getElementById("container_infos").style.display = "none";

    var dict = {
        "infos" : load_infos,
        "ai" : load_ai,
        "news" : load_news,
    }

    var navs = document.getElementById("nav_menu").children;
    for (var i = 0;i < navs.length;i++){
        navs[i].style.color = "rgba(29, 29, 31, 0.45)";
    }

    document.getElementById("nav_"+nav).style.color = "rgba(29, 29, 31)"

    document.getElementById("container_" + nav).style.display = "flex";

    if (!loaded[nav]){
        dict[nav]();
        loaded[nav] = true;
    }
}

switch_content("infos");
document.getElementById("nav_infos").addEventListener('click', function() {
    switch_content("infos");
});
document.getElementById("nav_ai").addEventListener('click', function() {
    switch_content("ai");
});
document.getElementById("nav_news").addEventListener('click', function() {
   switch_content("news");
});

document.getElementById("back").addEventListener('click', function() {
    Jump.jump("index","");
});