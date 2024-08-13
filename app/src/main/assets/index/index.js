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


var url = "https://api-csob.douyuex.com/api/v1/index/info";
var post_data = JSON.stringify({"categoryList":["all"],"platform":0,"base":false});
Request.post(url,post_data,"major_index", "receive");
function major_index_load(){
    var jsons = JSON.parse(all_resps["major_index"]);

    var change = jsons.data.list[0].change;
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
              width: 2,
            },
                connectNulls: true,
                data: jsons.data.list[0].indexList,
            },
        ],
    }

    var myChart = echarts.init(document.getElementById('mmi_chart'));
    myChart.setOption(option);

    var update_time = jsons.data.updateTime;
    const date = new Date(update_time);

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${month}-${day} ${hour}:${minute}`;

    document.getElementById("index_update_time").innerText = formattedDate;

    document.getElementById("index").style.color = color;
    document.getElementById("index").innerText = jsons.data.list[0].index;
    document.getElementById("index_float").style.color = color;

    var float = change / jsons.data.list[0].index * 100;
    var float = change + "(" + float.toFixed(2) + "%)今日";
    document.getElementById("index_float").innerText = float;
}
wait4value("major_index").then(value => {
    major_index_load()
});

function rank_update(type){
    var navs = document.getElementById("rk_nav").children;
    for (var i = 0;i < navs.length;i++){
        navs[i].style.color = "rgba(29, 29, 31, 0.6)";
    }

    document.getElementById("items").innerHTML = "";

    document.getElementById("rank_nav_" + type).style.color = "rgba(29, 29, 31)";

    document.getElementById("items_more").onclick = function() {
        Jump.jump("rank",type);
    };

    var post_datas = {
        "hot" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"VOL_COUNT","timeRange":"WEEK","page":1},
        "up" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"PRICE_CHANGE_PERCENT_DESC","timeRange":"WEEK","page":1},
        "down" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"PRICE_CHANGE_PERCENT_ASC","timeRange":"WEEK","page":1},
        "lease" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"LEASECOUNT_DOWN","timeRange":"WEEK","page":1}
    };

    Request.post("https://api-csob.douyuex.com/api/v1/rank",JSON.stringify(post_datas[type]),"rank_items_"+type, "receive");

    function update_rank_items(){
        var resp = JSON.parse(all_resps["rank_items_"+type]);
        var rank_list = resp.data.list;

        var e = document.getElementById("items");

        for (let item of rank_list) {
            var change = item.minPriceChangePercent["7"]*100;

            var color = "rgba(29, 29, 31, 0.6)";
            var add_txt = "";
            if (change < 0) {
                color = "#DB2F63"
            }
            if (change > 0) {
                color = "#00AA41"
                add_txt = "+";
            }

            var newElement = _ie({
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
                                    className : 'item_charts',
                                },
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
                                                    innerText : item.price/100
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

            gsap.from(newElement, {
                duration: 0.5, 
                y: 50, 
                opacity: 0,
                ease: "power3.out"
            });

            document.getElementById("item_" + item.goodsName).addEventListener('click', function() {
                Jump.jump("item",item.goodsName);
            }); // 当列表中的元素被点击时候,进行跳转

        };

        update_rank_items_infos();
    }
    wait4value("rank_items_"+type).then(value => {
        update_rank_items()
    });
}
function update_rank_items_infos(){
    var p = document.getElementById("items");
    for (var i = 0; i < p.children.length; i++){
        (function(index){ // 使用闭包保存当前迭代的索引值
            setTimeout(function(){
                var c = p.children[index];
                var name = c.children[0].children[0].innerText;

                var id;

                id = buffids[name]; // 先尝试本底读取,如果存在就不需要再请求csob了
                if (typeof id == "undefined"){
                    var url = "https://api-csob.douyuex.com/api/v2/goods/info";
                    var post_data = {"goodsName":name};
                    Request.post(url,JSON.stringify(post_data),"item_infos_"+name, "receive");
                }else{
                    all_resps["item_infos_"+name] = '{"data":{"list":[{"goodsId":'+id+'}]}}';
                }

                wait4value("item_infos_"+name).then(value => {
                    id = JSON.parse(all_resps["item_infos_"+name]).data.list[0].goodsId;

                    var url = "https://buff.163.com/api/market/goods/info?game=csgo&goods_id="+id;
                    Request.get(url,"buff_infos_"+id, "receive");
                    wait4value("buff_infos_"+id).then(value => {
                        var datas = JSON.parse(all_resps["buff_infos_"+id]);
                        c.children[1].children[1].children[0].children[0].innerText = datas["data"]["sell_num"];
                        c.children[1].children[1].children[0].children[1].innerText = datas["data"]["buy_num"];
                        c.children[1].children[1].children[1].children[0].innerText = datas["data"]["sell_min_price"];
                        c.children[1].children[1].children[1].children[1].innerText = datas["data"]["buy_max_price"];
                    });

                    var url = "https://api-csob.douyuex.com/api/v2/goods/chart";
                    var post_data = {"goodsId":id,"platform":0,"timeRange":"WEEK","data":["createTime","minPrice","sellCount"]}
                    Request.post(url,JSON.stringify(post_data),"item_charts_"+id, "receive");
                    wait4value("item_charts_"+id).then(value => {
                        var datas = JSON.parse(all_resps["item_charts_"+id]);
                        console.log(datas);

                        var prices = datas.data.list[1];

                        var timestamps = datas.data.list[0];
                        const dailyPrices = {};
                        const oneDay = 24 * 60 * 60 * 1000;
                        for (let i = 0; i < timestamps.length; i++) {
                            const date = new Date(Math.floor(timestamps[i] / oneDay) * oneDay);
                            const dateString = date.toISOString().split('T')[0];
                            if (!dailyPrices[dateString]) {
                                dailyPrices[dateString] = [];
                            }
                            dailyPrices[dateString].push(prices[i]);
                        }
                        const dailyAveragePrices = [];
                        for (const date in dailyPrices) {
                            const average = dailyPrices[date].reduce((sum, price) => sum + price, 0) / dailyPrices[date].length;
                           dailyAveragePrices.push(average);
                        }
                        prices = dailyAveragePrices;

                        var change = prices[prices.length-2] - prices[0];
                        var color = "#1D1D1F";
                        if (change < 0) {
                            color = "#DB2F63"
                        }
                        if (change > 0) {
                            color = "#00AA41"
                        }

                        const option = {
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
                                  width: 1,
                                },
                                    connectNulls: true,
                                    data: prices,
                                },
                            ],
                        }

                        const chart = echarts.init(c.children[1].children[0]);
                        chart.setOption(option);
                    });
                });

            }, 500 * index);
        })(i);
    }
}

document.getElementById("rank_nav_hot").addEventListener('click', function() {
    rank_update("hot");
});
document.getElementById("rank_nav_up").addEventListener('click', function() {
    rank_update("up");
});
document.getElementById("rank_nav_down").addEventListener('click', function() {
    rank_update("down");
});
document.getElementById("rank_nav_lease").addEventListener('click', function() {
    rank_update("lease");
});
rank_update("hot");


// 接下来是search页面的跳转
var search = document.getElementsByClassName("search")[0];
search.addEventListener('click', function() {
    Jump.jump("search","")
});