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

var url = "https://api-csob.ok-skins.com/api/v1/rank";
var page = 0;
var type_now = "";
var num = 1;
var post_data = "";

function update_rank(type){
    type_now = type;

    var post_datas = {
        "hot" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"VOL_COUNT","timeRange":"WEEK","page":1},
        "up" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"PRICE_CHANGE_PERCENT_DESC","timeRange":"WEEK","page":1},
        "down" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"PRICE_CHANGE_PERCENT_ASC","timeRange":"WEEK","page":1},
        "lease" : {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"LEASECOUNT_DOWN","timeRange":"WEEK","page":1}
    };
    page = 0;
    num = 1;
    post_data = post_datas[type];
    // 匹配请求数据

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

    post_data.page = page;

    Request.post(url,JSON.stringify(post_data), type_now +"_datas", "receive");
    wait4value(type_now +"_datas").then(value => {
        insert_items()
    });
} // 调用后加载新一页的内容

function insert_items(){
    var e = document.getElementById("items");

    var resp = JSON.parse(all_resps[type_now +"_datas"]); // 获取对应的请求结果
    var rank_list = resp.data.list;

    for (let item of rank_list) {
        var change = item.minPriceChangePercent[7]*100;

        var color = "rgba(29, 29, 31, 0.6)";
        var add_txt = "";
        if (change < 0) {
            color = config.down_color
        }
        if (change > 0) {
            color = config.up_color
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

document.getElementById("back").addEventListener('click', function() {
    Jump.jump("index","");
});