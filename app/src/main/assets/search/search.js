var goods = Object.keys(buffids);

// 精准匹配
function exact_match(keyword) {
    const lowerCaseKeyword = keyword.toLowerCase();
    return goods.filter(item => item.toLowerCase().includes(lowerCaseKeyword));
}

// 模糊匹配
function jaro(s1, s2) {
    const s1_len = s1.length;
    const s2_len = s2.length;
    if (s1_len === 0 && s2_len === 0) return 1.0;
    if (s1_len === 0 || s2_len === 0) return 0.0;
    const match_distance = Math.floor(Math.max(s1_len, s2_len) / 2) - 1;
    const s1_matches = new Array(s1_len).fill(false);
    const s2_matches = new Array(s2_len).fill(false);
    let matches = 0;
    let transpositions = 0;
    for (let i = 0; i < s1_len; i++) {
        const start = Math.max(0, i - match_distance);
        const end = Math.min(i + match_distance + 1, s2_len);
        for (let j = start; j < end; j++) {
            if (s2_matches[j]) continue;
            if (s1[i] !== s2[j]) continue;
            s1_matches[i] = true;
            s2_matches[j] = true;
            matches++;
            break;
        }
    }
    if (matches === 0) return 0.0;
    let k = 0;
    for (let i = 0; i < s1_len; i++) {
        if (!s1_matches[i]) continue;
        while (!s2_matches[k]) k++;
        if (s1[i] !== s2[k]) transpositions++;
        k++;
    }
    transpositions /= 2;
    return ((matches / s1_len) + (matches / s2_len) + ((matches - transpositions) / matches)) / 3.0;
}
function jaro_match(keyword, threshold = 0) {
    return goods
        .map(item => ({ item, score: jaro(item, keyword) }))
        .filter(result => result.score > threshold)
        .sort((a, b) => b.score - a.score)
        .map(result => result.item);
}


function insert_result(name,price,float) {
    var p = document.getElementById("result");

    var add = "";
    var color = "#1D1D1F";
    if (float < 0) {
        color = "#DB2F63"
    }
    if (float > 0) {
        color = "#00AA41";
        add = "+";
    }
    if (float != 0){
        float = add + float + "%"
    }else {
        float = ""
    }

    var newElement = _ie({
        tag : "div",
        className : "item",
        children : [
            {
                tag : 'div',
                className : "infos",
                children : [
                    {
                        tag : "h1",
                        innerHTML : name
                    },
                    {
                        tag : 'div',
                        className : "data",
                        children : [
                            {
                                tag : 'p',
                                innerHTML : price
                            },
                            {
                                tag : 'p',
                                innerHTML : float,
                                style : {
                                    color : color
                                }
                            },
                        ]
                    }
                ]
            },
            {
                tag : "div",
                innerHTML : "<svg width=\"20\" height=\"20\"><use xlink:href=\"#go\"></use></svg>",
            }
        ]
    },p);

    gsap.from(newElement, {
        duration: 0.5, 
        y: 50, 
        opacity: 0,
        ease: "power3.out"
    });

    newElement.addEventListener('click', function() {
        gsap.to(newElement, {
            duration: 0.08,
            opacity: 0,
            yoyo: true,
            repeat: 1,
            ease: "power3.inOut"
        });
        setTimeout(function(){
            Jump.jump("item",name.replace("<abbr>", "").replace("</abbr>", ""));
        },100)
    });


}
function insert_title(title){
    var p = document.getElementById("result");
    var newElement  = _ie({
        tag : "div",
        className : "title",
        children : [
            {
                tag : 'a',
                innerHTML : title
            }
        ]
    },p);
    gsap.from(newElement, {
        duration: 0.5, 
        y: 50, 
        opacity: 0,
        ease: "power3.out"
    });
}

var input = document.getElementById("input");
input.addEventListener("input", debounce(function() {
    match(input.value);
}, 300));

// 防抖函数
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

function match(query) {
    document.getElementById("result").innerHTML = "";
    if (query == ""){
        load_hot();
        return
    }

    var exact_result = exact_match(query);

    var count = 0;
    if (exact_result.length > 0){
        insert_title("精确匹配");
        exact_result.forEach(function(result) {
            if (count < 6){
                var name = "";
                var strs = result.split(query);
                strs.forEach(function(str) {
                    name += str + "<abbr>" + query + "</abbr>";
                })
                var name = name.slice(0, -("<abbr>" + query + "</abbr>").length);
                insert_result(name, "-", 0);
                count ++;
            }
        });
    }

    if (count < 6){
        count = 0;
        var jaro_result = jaro_match(query);
        if (jaro_result.length > 0){
            insert_title("猜您想搜");
            jaro_result.forEach(function(result) {
                if (count < 6){
                    insert_result(result, "-", 0);
                    count ++;
                }
            });
        }
    }

    load_infos();
}

// 用于请求处理的准备
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
function load_hot(){
    document.getElementById("result").innerHTML = "";

    var url = "https://api-csob.douyuex.com/api/v1/rank";
    var post = {"category":[],"minPrice":10000,"minSellCount":30,"sellCountType":"DOWN","sellCountTimeRange":"WEEK","sellCountChange":15,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"WEEK","volLeaseCountTimeRange":"WEEK","type":"VOL_COUNT","timeRange":"WEEK","page":1}
    Request.post(url,JSON.stringify(post), "hot", "receive");
    wait4value("hot").then(value => {
        insert_title("热门");
        var datas = JSON.parse(all_resps["hot"]).data.list;
        var count = 0;
        datas.forEach(function(data) {
            if (count < 6){
                insert_result(data.goodsName, data.price/100, (data.minPriceChangePercent["7"]*100).toFixed(2));
                count ++;
            }
        });
    });
}

load_hot();

// 从buff获取商品的详细信息
function load_infos(){
    var results = document.getElementById("result");
    for (let i = 0;i < results.children.length;i++){
        setTimeout(function(){
            var child = results.children[i];
            if (child.className == "item"){
                var name = child.children[0].children[0].innerText;
                var id = buffids[name];
                if (typeof id != "undefined"){
                    var url = "https://buff.163.com/api/market/goods/info?game=csgo&goods_id="+id;
                    Request.get(url,"buff_infos_"+id, "receive");
                    wait4value("buff_infos_"+id).then(value => {
                        var datas = JSON.parse(all_resps["buff_infos_"+id]);
                        if (datas["data"]["sell_min_price"] == 0){
                            datas["data"]["sell_min_price"] = "无相关数据"
                        }
                        child.children[0].children[1].children[0].innerText = datas["data"]["sell_min_price"];
                    });
                }
            }
        },500 * i)
    }
}