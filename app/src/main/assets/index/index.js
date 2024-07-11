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


var url = "https://www.csgoob.com/?platform=0&_data=routes%2F_index";
Request.get(url,"major_index", "receive");
function major_index_init(){
    var jsons = JSON.parse(all_resps["major_index"]);

    var change = jsons.list[0].change;
    var color = "#1D1D1F";
    if (change < 0) {
        color = "#DB2F63"
    }
    if (change > 0) {
        color = "#00AA41"
    }

    option = {
        grid: {
          top: '5%',
          bottom: '5%',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
          scale:true,
        },
        series: [
          {
            type: 'line',
            smooth: 0.4,
            symbol: 'none',
            lineStyle: {
              color: color,
              width: 3,
            },
                connectNulls: true,
                data: jsons.list[0].indexList,
            },
        ],
    }

    var myChart = echarts.init(document.getElementById('mmi_chart'));
    myChart.setOption(option);

    var update_time = jsons.updateTime;
    const date = new Date(update_time);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${month}-${day} ${hour}:${minute}`;

    document.getElementById("index_update_time").innerText = formattedDate;

    document.getElementById("index").style.color = color;
    document.getElementById("index").innerText = jsons.list[0].index;
    document.getElementById("index_float").style.color = color;

    var float = jsons.list[0].change / jsons.list[0].index * 100;
    var float = jsons.list[0].change + "(" + float.toFixed(2) + "%)今日";
    document.getElementById("index_float").innerText = float;
}
wait4value("major_index").then(value => {
    major_index_init()
});

var url = "https://www.csgoob.com/rank?category=&type=VOL_COUNT&timeRange=TODAY&page=1&minPrice=0&minSellCount=0&sellCountType=DOWN&sellCountTimeRange=DAY&sellCountChange=0&categoryInclude=NOT&exterior=&quality=&exteriorInclude=NOT&qualityInclude=NOT&priceChangePercentTimeRange=HALF_MONTH&container=&containerInclude=NOT&nameInclude=TRUE&leaseCountType=DOWN&leaseCountTimeRange=DAY&_data=routes%2Frank";
Request.get(url,"rank_items", "receive");
function update_rank_items(){
    var resp = JSON.parse(all_resps["rank_items"]);
    var rank_list = resp.rankList;

    var e = document.getElementById("items");
    e.innerHTML = '';

    for (let item of rank_list) {
        var change = item.minPriceChangePercent[1]*100;
        var color = "rgba(29, 29, 31, 0.6)";
        var add_txt = "+";
        if (change < 0) {
            color = "#DB2F63"
            add_txt = "";
        }
        if (change > 0) {
            color = "#00AA41"
        }
        if (change == 0) {
            add_txt = "="
        }

        _ie({
                tag : "div",
                className : "item",
                id : "item_" + item.goodsName,
                children : [
                    {
                        tag : "div",
                        className : "item_name",
                        children : [{
                            tag :  "p",
                            innerText : item.goodsName
                        }]
                    },
                    {
                        tag : "div",
                        className : "item_infos",
                        children : [
                            {
                                tag : "div",
                                className : "item_datas",
                                children : [
                                    {
                                        tag : "div",
                                        className : 'item_data',
                                        children : [
                                            {
                                                tag : "p",
                                                innerText : "-"
                                            },
                                            {
                                                tag : "a",
                                                innerText : "-"
                                            },
                                        ]
                                    },
                                    {
                                        tag : "div",
                                        className : 'item_data',
                                        children : [
                                            {
                                                tag : "p",
                                                innerText : item.price
                                            },
                                            {
                                                tag : "a",
                                                innerText : "-"
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                tag : "div",
                                className : "data_float",
                                children : [
                                    {
                                        tag : "p",
                                        innerText : add_txt + change.toFixed(2) + "%",
                                    }
                                ],
                                style : {
                                    backgroundColor : color
                                }
                            },
                        ]
                    }
                ]
            },e); // 向rank列表插入元素

        document.getElementById("item_" + item.goodsName).addEventListener('click', function() {
            Jump.jump("item",item.goodsName);
        }); // 当列表中的元素被点击时候,进行跳转

    };

    update_rank_items_infos();
}
wait4value("rank_items").then(value => {
    update_rank_items()
});
function update_rank_items_infos(){
    var p = document.getElementById("items");
    for (var i = 0; i < p.children.length; i++){
        (function(index){ // 使用闭包保存当前迭代的索引值
            setTimeout(function(){
                var c = p.children[index];
                var name = c.children[0].children[0].innerText;

                var id = buffids[name];

                if (typeof id !== "undefined"){
                    var url = "https://buff.163.com/api/market/goods/info?game=csgo&goods_id="+id;
                    Request.get(url,"buff_infos_"+id, "receive");
                }

                wait4value("buff_infos_"+id).then(value => {
                    var datas = JSON.parse(all_resps["buff_infos_"+id]);
                    c.children[1].children[0].children[0].children[0].innerText = datas["data"]["sell_num"];
                    c.children[1].children[0].children[0].children[1].innerText = datas["data"]["buy_num"];
                    c.children[1].children[0].children[1].children[0].innerText = datas["data"]["sell_min_price"];
                    c.children[1].children[0].children[1].children[1].innerText = datas["data"]["buy_max_price"];
                });
            }, 1000 * index);
        })(i);
    }
}