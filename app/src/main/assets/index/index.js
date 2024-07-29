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
        "hot" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"VOL_COUNT","timeRange":"TODAY","page":1},
        "up" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"PRICE_CHANGE_PERCENT_DESC","timeRange":"DAY","page":1},
        "down" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"PRICE_CHANGE_PERCENT_ASC","timeRange":"DAY","page":1},
        "lease" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"LEASECOUNT_DOWN","timeRange":"DAY","page":1}
    };

    Request.post("https://api-csob.douyuex.com/api/v1/rank",JSON.stringify(post_datas[type]),"rank_items_"+type, "receive");

    function update_rank_items(){
        var resp = JSON.parse(all_resps["rank_items_"+type]);
        var rank_list = resp.data.list;

        var e = document.getElementById("items");

        for (let item of rank_list) {
            var change = item.minPriceChangePercent[1]*100;

            var color = "rgba(29, 29, 31, 0.6)";
            var add_txt = "";
            if (change < 0) {
                color = "#DB2F63"
            }
            if (change > 0) {
                color = "#00AA41"
                add_txt = "+";
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