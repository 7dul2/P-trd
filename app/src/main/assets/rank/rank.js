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
// 用于请求处理的准备

var url = "";
var page = 0;
var type_now = "";
var num = 1;

function update_rank(type){
    type_now = type;

    var urls = {
        "hot" : "https://csgoob.onet4p.net/rank?category=&type=VOL_COUNT&timeRange=TODAY&minPrice=0&minSellCount=0&sellCountType=DOWN&sellCountTimeRange=DAY&sellCountChange=0&categoryInclude=NOT&exterior=&quality=&exteriorInclude=NOT&qualityInclude=NOT&priceChangePercentTimeRange=HALF_MONTH&container=&containerInclude=NOT&nameInclude=TRUE&leaseCountType=DOWN&leaseCountTimeRange=DAY&_data=routes%2Frank&page=",
        "up" : "https://csgoob.onet4p.net/rank?category=&type=PRICE_UP_PERCENT&timeRange=DAY&minSellCount=50&sellCountType=DOWN&sellCountTimeRange=DAY&sellCountChange=0&categoryInclude=NOT&exterior=&quality=&exteriorInclude=NOT&qualityInclude=NOT&priceChangePercentTimeRange=HALF_MONTH&container=&containerInclude=NOT&nameInclude=TRUE&leaseCountType=DOWN&leaseCountTimeRange=DAY&volCountTimeRange=WEEK&volLeaseCountTimeRange=WEEK&_data=routes%2Frank&page=",
        "down" : "https://csgoob.onet4p.net/rank?category=&type=PRICE_DOWN_PERCENT&timeRange=DAY&minPrice=100&minSellCount=50&sellCountType=DOWN&sellCountTimeRange=DAY&sellCountChange=0&categoryInclude=NOT&exterior=&quality=&exteriorInclude=NOT&qualityInclude=NOT&priceChangePercentTimeRange=HALF_MONTH&container=&containerInclude=NOT&nameInclude=TRUE&leaseCountType=DOWN&leaseCountTimeRange=DAY&volCountTimeRange=WEEK&volLeaseCountTimeRange=WEEK&_data=routes%2Frank&page=",
        "lease" : "https://csgoob.onet4p.net/rank?category=&type=VOL_LEASE_COUNT&timeRange=DAY&minPrice=0&minSellCount=0&sellCountType=DOWN&sellCountTimeRange=DAY&sellCountChange=0&categoryInclude=NOT&exterior=&quality=&exteriorInclude=NOT&qualityInclude=NOT&priceChangePercentTimeRange=HALF_MONTH&container=&containerInclude=NOT&nameInclude=TRUE&leaseCountType=DOWN&lease,CountTimeRange=DAY&volCountTimeRange=WEEK&volLeaseCountTimeRange=WEEK&_data=routes%2Frank&page="
    };
    url = urls[type];
    page = 0;
    num = 1;
    // 匹配url并更新页

    var navs = document.getElementById("nav_menu").children;
    for (var i = 0;i < navs.length;i++){
        navs[i].style.color = "rgba(29, 29, 31, 0.6)";
    }
    document.getElementById("nav_" + type).style.color = "rgba(29, 29, 31)";
    // 更新被选中类型的颜色

    document.getElementById("items").innerHTML = "";
    // 清空当前排行榜的内容

    next_page(); // 第0页的后一页就是第1页
} // 用于类型选择的切换

function next_page(){
    page++;

    console.log(type_now +"_datas")
    console.log(url+page)

    Request.get(url+page, type_now +"_datas", "receive");
    wait4value(type_now +"_datas").then(value => {
        insert_items()
    });
} // 调用后加载新一页的内容

function insert_items(){
    var e = document.getElementById("items");

    var resp = JSON.parse(all_resps[type_now +"_datas"]); // 获取对应的请求结果
    var rank_list = resp.rankList;

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
            className : "rk_c",
            children : [
                {
                    tag : "a",
                    innerText : num,
                    className : "rk_num"
                },
                {
                    tag : "div",
                    className : "item",
                    id : "item_" + item.goodsName,
                    children: [
                        {
                            tag : "div",
                            className : "item_name",
                            children : [
                               {
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
                                                    innerText : item.leasePrice/100
                                                },
                                                {
                                                    tag : "a",
                                                    innerText : item.longLeasePrice/100
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
                                                    innerText : ""
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
                },
                ]
            },e); // 向rank列表插入元素

        document.getElementById("item_" + item.goodsName).addEventListener('click', function() {
            Jump.jump("item",item.goodsName);
        }); // 当列表中的元素被点击时候,进行跳转

        num ++;

    };

} // 传入请求获取的结果,通过该函数插入置排行榜

window.onscroll = function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        next_page();
    }
}; // 无限滚动加载


let urlParams = new URLSearchParams(window.location.search);
var rank_name = urlParams.get("name");
update_rank(rank_name); // 初始化

document.getElementById("nav_hot").addEventListener('click', function() {
    update_rank("hot");
});
document.getElementById("nav_up").addEventListener('click', function() {
    update_rank("up");
});
document.getElementById("nav_down").addEventListener('click', function() {
    update_rank("down");
});
document.getElementById("nav_lease").addEventListener('click', function() {
    update_rank("lease");
});
// 绑定点击事件