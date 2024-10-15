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

// 所有允许选择的类型
var types = {
    "在售底价涨跌(数值)" : "PRICE_CHANGE",
    "在售底价涨跌(百分比)" : "PRICE_CHANGE_PERCENT",
    "在售底价" : "MINPRICE",
    "短租年化" : "LEASE",
    "长租年化" : "LONG_LEASE",
    "短租价格" : "LEASEPRICE",
    "成交量" : "VOL_COUNT",
    "成交额" : "VOL_PRICE",
    "成租量" : "VOL_LEASE_COUNT",
    "成租额" : "VOL_LEASE_PRICE",
    "挂售数量" : "SELLCOUNT",
    "挂售数量变化" : "SELLCOUNT_SUM",
    "挂售上架量" : "SELLCOUNT_UP",
    "挂租数量" : "LEASECOUNT",
    "挂租数量变化" : "LEASECOUNT_SUM",
    "挂租上架量" : "LEASECOUNT_UP",
    "求购顶价" : "PURCHASE_MAXPRICE",
    "求购数量" : "PURCHASE_COUNT",
    "出售-求购差值(百分比)" : "PURCHASE_DIFFPRICE_PERCENT",
    "存世量" : "FLOAT_COUNT",
    "挂刀比" : "STEAM",
    "套现比" : "CASH",
};

// 所有的type对应的value属性
var value_types = {
    "PRICE_CHANGE": "float",
    "PRICE_CHANGE_PERCENT": "float",
    "MINPRICE": "value",
    "LEASE": "value",
    "LONG_LEASE": "value",
    "LEASEPRICE": "value",
    "VOL_COUNT": "value",
    "VOL_PRICE": "value",
    "VOL_LEASE_COUNT": "value",
    "VOL_LEASE_PRICE": "value",
    "SELLCOUNT": "value",
    "SELLCOUNT_SUM": "float",
    "SELLCOUNT_UP": "value",
    "LEASECOUNT": "value",
    "LEASECOUNT_SUM": "float",
    "LEASECOUNT_UP": "value",
    "PURCHASE_MAXPRICE": "value",
    "PURCHASE_COUNT": "value",
    "PURCHASE_DIFFPRICE_PERCENT": "float",
    "FLOAT_COUNT": "value",
    "STEAM": "value",
    "CASH": "value"
};

// 所有允许分市场的类型
var marketable_types = [
    "PURCHASE_MAXPRICE","PURCHASE_COUNT","PURCHASE_DIFFPRICE_PERCENT",
];
// + BUFF/YYYP/IGXE/C5

// 所有允许排序的类型
var sortable_types = [
    "PRICE_CHANGE","PRICE_CHANGE","PRICE_CHANGE_PERCENT","PRICE_CHANGE_PERCENT",
    "MINPRICE","LEASEPRICE","LONGLEASEPRICE","SELLCOUNT","LEASECOUNT_SUM","PURCHASE_MAXPRICE",
    "PURCHASE_DIFFPRICE_PERCENT","PURCHASE_COUNT","FLOAT_COUNT","STEAM","CASH",
];

// + _DESC/_ASC
var category = [{
    name: "匕首",
    key: "knives",
    category: [{
        name: "鲍伊猎刀",
        key: "weapon_knife_survival_bowie",
    }, {
        name: "蝴蝶刀",
        key: "weapon_knife_butterfly",
    }, {
        name: "弯刀",
        key: "weapon_knife_falchion",
    }, {
        name: "折叠刀",
        key: "weapon_knife_flip",
    }, {
        name: "穿肠刀",
        key: "weapon_knife_gut",
    }, {
        name: "猎杀者匕首",
        key: "weapon_knife_tactical",
    }, {
        name: "M9 刺刀",
        key: "weapon_knife_m9_bayonet",
    }, {
        name: "刺刀",
        key: "weapon_bayonet",
    }, {
        name: "爪子刀",
        key: "weapon_knife_karambit",
    }, {
        name: "暗影双匕",
        key: "weapon_knife_push",
    }, {
        name: "短剑",
        key: "weapon_knife_stiletto",
    }, {
        name: "熊刀",
        key: "weapon_knife_ursus",
    }, {
        name: "折刀",
        key: "weapon_knife_gypsy_jackknife",
    }, {
        name: "锯齿爪刀",
        key: "weapon_knife_widowmaker",
    }, {
        name: "海豹短刀",
        key: "weapon_knife_css",
    }, {
        name: "系绳匕首",
        key: "weapon_knife_cord",
    }, {
        name: "求生匕首",
        key: "weapon_knife_canis",
    }, {
        name: "流浪者匕首",
        key: "weapon_knife_outdoor",
    }, {
        name: "骷髅匕首",
        key: "weapon_knife_skeleton",
    }, {
        name: "廓尔喀刀",
        key: "weapon_knife_kukri",
    }]
}, {
    name: "手枪",
    key: "pistols",
    category: [{
        name: "P2000",
        key: "weapon_hkp2000",
    }, {
        name: "USP 消音版",
        key: "weapon_usp_silencer",
    }, {
        name: "格洛克 18 型",
        key: "weapon_glock",
    }, {
        name: "P250",
        key: "weapon_p250",
    }, {
        name: "FN57",
        key: "weapon_fiveseven",
    }, {
        name: "CZ75 自动手枪",
        key: "weapon_cz75a",
    }, {
        name: "Tec-9",
        key: "weapon_tec9",
    }, {
        name: "R8 左轮手枪",
        key: "weapon_revolver",
    }, {
        name: "沙漠之鹰",
        key: "weapon_deagle",
    }, {
        name: "双持贝瑞塔",
        key: "weapon_elite",
    }, {
        name: "电击枪",
        key: "weapon_taser",
    }]
}, {
    name: "步枪",
    key: "rifles",
    category: [{
        name: "加利尔 AR",
        key: "weapon_galilar",
    }, {
        name: "SCAR-20",
        key: "weapon_scar20",
    }, {
        name: "AWP",
        key: "weapon_awp",
    }, {
        name: "AK-47",
        key: "weapon_ak47",
    }, {
        name: "法玛斯",
        key: "weapon_famas",
    }, {
        name: "M4A4",
        key: "weapon_m4a1",
    }, {
        name: "M4A1 消音型",
        key: "weapon_m4a1_silencer",
    }, {
        name: "SG 553",
        key: "weapon_sg556",
    }, {
        name: "SSG 08",
        key: "weapon_ssg08",
    }, {
        name: "AUG",
        key: "weapon_aug",
    }, {
        name: "G3SG1",
        key: "weapon_g3sg1",
    }]
}, {
    name: "冲锋枪",
    key: "smgs",
    category: [{
        name: "P90",
        key: "weapon_p90",
    }, {
        name: "MAC-10",
        key: "weapon_mac10",
    }, {
        name: "UMP-45",
        key: "weapon_ump45",
    }, {
        name: "MP7",
        key: "weapon_mp7",
    }, {
        name: "PP-野牛",
        key: "weapon_bizon",
    }, {
        name: "MP9",
        key: "weapon_mp9",
    }, {
        name: "MP5-SD",
        key: "weapon_mp5sd",
    }]
}, {
    name: "霰弹枪",
    key: "shotguns",
    category: [{
        name: "截短霰弹枪",
        key: "weapon_sawedoff",
    }, {
        name: "XM1014",
        key: "weapon_xm1014",
    }, {
        name: "新星",
        key: "weapon_nova",
    }, {
        name: "MAG-7",
        key: "weapon_mag7",
    }]
}, {
    name: "机枪",
    key: "machineguns",
    category: [{
        name: "M249",
        key: "weapon_m249",
    }, {
        name: "内格夫",
        key: "weapon_negev",
    }]
}, {
    name: "手套",
    key: "gloves",
    category: [{
        name: "血猎手套",
        key: "weapon_bloodhound_gloves",
    }, {
        name: "驾驶手套",
        key: "weapon_driver_gloves",
    }, {
        name: "裹手",
        key: "weapon_hand_wraps",
    }, {
        name: "摩托手套",
        key: "weapon_moto_gloves",
    }, {
        name: "专业手套",
        key: "weapon_specialist_gloves",
    }, {
        name: "运动手套",
        key: "weapon_sport_gloves",
    }, {
        name: "九头蛇手套",
        key: "weapon_hydra_gloves",
    }, {
        name: "狂牙手套",
        key: "weapon_brokenfang_gloves",
    }]
}, {
    name: "贴纸",
    key: "stickers",
    category: [{
        name: "贴纸",
        key: "sticker",
    }]
}, {
    name: "其他",
    key: "others",
    category: [{
        name: "武器箱",
        key: "csgo_type_weaponcase",
    }, {
        name: "探员",
        key: "type_customplayer",
    }, {
        name: "音乐盒",
        key: "csgo_type_musickit",
    }]
}];
var exterior = ["崭新出厂", "略有磨损", "久经沙场", "破损不堪", "战痕累累", "无涂装"];
var quality = ["普通", "★", "纪念品", "StatTrak™", "★ StatTrak™"];
var rarity = ["违禁", "隐秘", "保密", "受限", "军规级", "工业级", "消费级", "大师", "非凡", "卓越", "奇异", "高级"];
var time_ranges = {
    "近1天" : "DAY",
    "近1周" : "WEEK",
    "近1个月" : "MONTH",
    "近3个月" : "QUARTER",
    "近6个月" : "HALF_YEAR",
    "近1年" : "YEAR",
};

// 发送请求的参数
var params;

// 根据当前参数加载排行榜
function load(){
    var url = "https://api-csob.ok-skins.com/api/v1/rank";

    var key = Math.random().toString(36).substr(2) + Date.now().toString(36);

    Request.post(url,JSON.stringify(params),key, "receive");

    wait4value(key).then(value => {
        var value_type = params.type.replace(/_DESC|_ASC|_BUFF|_YYYP|_IGXE|_C5/g, "");

        var resp = JSON.parse(all_resps[key]).data.list;

        resp.forEach(function(item) {
            item.value_type = value_types[value_type];
            insert(item);
        });

        delete all_resps[key];

        is_loading = false;
        // 加载结束了
    })

}

// 重置参数
function reset(){
    params = {
        "priceChangePercentTimeRange":"WEEK",
        "type":"PRICE_CHANGE_PERCENT_DESC",
        "page":1  
    } // 最基本的三个参数

    document.getElementById("container").innerHTML = "";
}

// 下一页
function next_page(){
    is_loading = true;
    console.log(params.page);
    params.page += 1;
    console.log(params.page);
    load();
}

// 往排行榜插入元素
function insert(datas){
    var parent = document.getElementById("container")
    
    var num = parent.children.length + 1;// 商品排行
    var num_mark = null;
    if (num <= 3){
        num_mark = "top";
        // 如果前三名就标记
    }

    var name = datas.goodsName; // 商品名称
    var key = Math.random().toString(36).substr(2) + Date.now().toString(36);

    var item_header = {
        tag : "div",
        className : "item_header",
        children : [
            {
                tag : "div",
                className : "rank_name",
                children : [
                    {
                        tag : "a",
                        innerHTML : num,
                        attribute : {
                           "data-active" : num_mark
                        }
                    },
                    {
                        tag : "p",
                        innerHTML : name
                    }
                ]
            },
            {
                tag : "div",
                children : [
                    {
                        tag: 'svg',
                        attribute : {
                            viewBox: '64 64 896 896',
                        },
                        id : "unfold_"+key,
                        children: [
                            {
                                tag: 'path',
                                attribute : {
                                    d: 'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'
                                }
                            }
                        ]
                    },
                    {
                        tag: 'svg',
                        attribute : {
                            viewBox: '64 64 896 896',
                        },
                        id : "fold_"+key,
                        children: [
                            {
                                tag: 'path',
                                attribute : {
                                    d: 'M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z'
                                }
                            }
                        ],
                        style : {
                            display : "none"
                        }
                    },
                ]
            }
        ]
    };

    var price = (datas.price/100).toFixed(2); // 商品价格
    var price_change_rate = (datas.minPriceChangePercent[7]*100).toFixed(2); // 七天浮动

    var price_html = ""; // 显示的html
    if (price_change_rate >= 0){
        price_html += "<up>+" + price_change_rate + "%</up>";
    }else {
        price_html += "<down>" + price_change_rate + "%</down>";
    }

    var value = datas.value; // 排行榜对应的数值
    var value_tag = datas.value_type; // 展示value对应的html标签
    var value_mark = "";
    if (value_tag === "float"){
        value = (value * 100).toFixed(2);
        if (value >= 0){
            value = "+" + value + "%";
            value_mark = "up";
        }else {
            value = value + "%";
            value_mark = "down";
        }
    } 

    var item_datas = {
        tag : "div",
        className : "item_datas",
        children : [
            {
                tag : "div",
                children : [
                    {
                        tag : "p",
                        innerHTML : price
                    },
                    {
                        tag : "a",
                        innerHTML : price_html
                    }
                ]
            },
            {
                tag : value_tag,
                innerHTML : value,
                attribute : {
                    "data-active" : value_mark
                }
            }
        ]
    };

    var e = _ie({
        tag : "div",
        className : "item",
        children : [item_header,item_datas]
    },parent)

    gsap.from(e, {
        duration: 0.5, 
        y: 50, 
        opacity: 0,
        ease: "power3.out",
        delay: 0
    });

    var item_infos = _ie({
        tag : "div",
        className : "item_infos",
    },e);

    _ie({
        tag : "div",
        className : "pop_up_index",
        children : [
            {
                tag : "div",
                className : "legends",
                id : "legends_" + key,
                children : [
                    {
                        tag : "div",
                        className : "legend",
                        "data-series" : "0",
                        children : [
                            {
                                tag : 'div',
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l1"
                                    },
                                    {
                                        tag : "p",
                                        innerText : "在售价"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerText : "-",
                            }
                        ]
                    },
                    {
                        tag : "div",
                        className : "legend",
                        "data-series" : "1",
                        children : [
                            {
                                tag : 'div',
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l2"
                                    },
                                    {
                                        tag : "p",
                                        innerText : "在售量"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerText : "-",
                            }
                        ]
                    },
                    {
                        tag : "div",
                        className : "legend",
                        "data-series" : "2",
                        children : [
                            {
                                tag : 'div',
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l3"
                                    },
                                    {
                                        tag : "p",
                                        innerText : "求购价"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerText : "-",
                            }
                        ]
                    },
                    {
                        tag : "div",
                        className : "legend",
                        "data-series" : "3",
                        children : [
                            {
                                tag : 'div',
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l4"
                                    },
                                    {
                                        tag : "p",
                                        innerText : "求购量"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerText : "-",
                            }
                        ]
                    },
                    {
                        tag : "div",
                        className : "legend",
                        "data-series" : "4",
                        children : [
                            {
                                tag : 'div',
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l5"
                                    },
                                    {
                                        tag : "p",
                                        innerText : "steam价"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerText : "-",
                            }
                        ]
                    },
                ]
            },
            {
                tag : "div",
                id : "pop_up_index_chart_" + key,
                className : "chart2",
            }
        ]
    },item_infos);


    document.getElementById("unfold_"+key).addEventListener('click', function() {
        document.getElementById("unfold_"+key).style.display = "none"
        document.getElementById("fold_"+key).style.display = ""

        toggle_height(item_infos);

        if (document.getElementById("pop_up_index_chart_" + key).children.length === 0){
            load_infos(name,key);
        }
    });

    document.getElementById("unfold_"+key).addEventListener('click', function() {
        document.getElementById("fold_"+key).style.display = "none"
        document.getElementById("unfold_"+key).style.display = ""

        toggle_height(item_infos);
    });
} 

function init_nav() {
    var nav_items = document.querySelectorAll('.nav p');
    var selection_indicator = document.querySelector('.selection-indicator');

    // 清除上一次最后一个导航项的 margin-right 样式
    function clear_last_item_margin() {
        var last_item = document.querySelector('.nav p[data-last="true"]');
        if (last_item) {
            last_item.removeAttribute('data-last');
            last_item.style.marginRight = ''; // 恢复默认的 margin-right
        }
    }

    // 给最后一个导航项设置 margin-right 为 0
    function set_last_item_margin() {
        clear_last_item_margin(); // 先清除之前的最后一个元素的 margin-right 样式
        var last_item = nav_items[nav_items.length - 1];
        last_item.setAttribute('data-last', 'true');
        last_item.style.marginRight = '0'; // 设置 margin-right 为 0
    }

    function move_indicator(element) {
        var element_width = element.offsetWidth;
        var element_left = element.offsetLeft;

        selection_indicator.style.width = element_width + 'px';
        selection_indicator.style.left = element_left + 'px';

        selection_indicator.style.boxShadow = '2px 0 5px rgba(255, 255, 255, 0.5)'; // 初始模糊效果
        setTimeout(() => {
            selection_indicator.style.boxShadow = 'none'; // 移动后清除模糊
        }, 300); // 等待过渡完成后清除模糊
    }

    // 初始化，移动指示标到默认激活的元素
    var active_item = document.querySelector('.nav p[data-active="true"]');

    // 如果没有激活项，则默认激活第一个元素
    if (!active_item && nav_items.length > 0) {
        active_item = nav_items[0];
        active_item.click();
    }

    // 如果找到激活的项，则移动指示标
    if (active_item) {
        move_indicator(active_item);
    }

    // 设置最后一个导航项的 margin-right 为 0
    set_last_item_margin();

    // 添加点击事件，切换激活状态并移动指示标
    nav_items.forEach(function(nav_item) {
        nav_item.addEventListener('click', function() {
            // 移除其他元素的激活状态
            nav_items.forEach(function(item) {
                item.setAttribute('data-active', 'false');
            });

            // 设置当前点击的元素为激活状态
            nav_item.setAttribute('data-active', 'true');

            // 移动指示标到当前元素
            move_indicator(nav_item);

            // 每次点击后重新设置最后一个导航项的 margin-right
            set_last_item_margin();
        });
    });
}

function load_infos(name,key){
    var url = "https://api-csob.ok-skins.com/api/v2/goods/chart"
    var post_data = {"goodsId":item_names[name].id,"platform":0,"timeRange":"MONTH","data":["createTime","minPrice","sellCount","steamPrice","purchaseCount","purchaseMaxPrice"]}

    Request.post(url,JSON.stringify(post_data),key, "receive");

    wait4value(key).then(value => {
        var resp = JSON.parse(all_resps[key]).data.list;

        var option = {
            tooltip: {
                backgroundColor : "#8e8e8e",
                borderColor: '#8e8e8e',
                textStyle: {
                    color: '#fff',
                    fontSize: 12,
                },
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#8e8e8e',
                    },
                    fontSize: 12,
                },
                formatter: function(params) {
                    return params.map(param => {
                        const seriesName = param.seriesName;
                        const value = param.value;
                        return `${seriesName}: ${value}`;
                    }).join('<br/>');
                }
            },
            legend: {
                show: false,
                selected: {
                    '在售价': true,
                    "在售量" : true,
                    "求购价" : false,
                    "求购量" : false,
                    "steam价" : false,
                },
            },
            grid: {
                top: '5%',
                bottom: '15%',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: resp[0].map(item => {
                    const date = new Date(item);
                    return date.getFullYear() + '-' + 
                           (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                           date.getDate().toString().padStart(2, '0');
                }),
                axisLabel: {
                    fontSize: 10,
                },
                axisLine: {
                    lineStyle: {
                        color: '#8e8e8e'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    position: 'left',
                    axisLabel: {
                        formatter: function(value) {
                            if (value >= 10000) {
                                return (value / 10000) + 'w';
                            } else if (value >= 1000) {
                                return (value / 1000) + 'k';
                            } else {
                                return value;
                            }
                        },
                        fontSize: 10,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#8e8e8e'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            width: 1,
                            type: 'solid',
                        }
                    },
                },
                {
                    type: 'value',
                    scale: true,
                    position: 'right',
                    axisLabel: {
                        formatter: function(value) {
                            if (value >= 10000) {
                                return (value / 10000) + 'w';
                            } else if (value >= 1000) {
                                return (value / 1000) + 'k';
                            } else {
                                return value;
                            }
                        },
                        fontSize: 10,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#8e8e8e'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            width: 1,
                            type: 'solid',
                        }
                    },
                }
            ],
            series: [
                {
                    name: "在售价",
                    type: 'line',
                    smooth: 0.4,
                    symbol: 'none',
                    lineStyle: {
                        color: "#157efb",
                        width: 1,
                    },
                    connectNulls: true,
                    data: resp[1].map(item => item/100),
                    animationDuration: 500,
                    animationEasing: 'cubicInOut',
                    yAxisIndex: 0
                },
                {
                    name: "在售量",
                    type: 'line',
                    smooth: 0.4,
                    symbol: 'none',
                    lineStyle: {
                        color: "#53d769",
                        width: 1,
                    },
                    connectNulls: true,
                    data: resp[2],
                    animationDuration: 500,
                    animationEasing: 'cubicInOut',
                    yAxisIndex: 1 
                },
                {
                    name: "求购价",
                    type: 'line',
                    smooth: 0.4,
                    symbol: 'none',
                    lineStyle: {
                        color: "#fdcb2e",
                        width: 1,
                    },
                    connectNulls: true,
                    data: resp[5].map(item => item/100),
                    animationDuration: 500,
                    animationEasing: 'cubicInOut',
                    yAxisIndex: 0
                },
                {
                    name: "求购量",
                    type: 'line',
                    smooth: 0.4,
                    symbol: 'none',
                    lineStyle: {
                        color: "#fd3d3a",
                        width: 1,
                    },
                    connectNulls: true,
                    data: resp[4],
                    animationDuration: 500,
                    animationEasing: 'cubicInOut',
                    yAxisIndex: 1
                },
                {
                    name: "steam价",
                    type: 'line',
                    smooth: 0.4,
                    symbol: 'none',
                    lineStyle: {
                        color: "#60c9f8",
                        width: 1,
                    },
                    connectNulls: true,
                    data: resp[3].map(item => item/100),
                    animationDuration: 500,
                    animationEasing: 'cubicInOut',
                    yAxisIndex: 0
                },
            ],
            dataZoom: [
                {
                    show : false,
                    type: 'inside',
                    xAxisIndex: [0],
                },
                {
                    show : false,
                    type: 'slider',
                    xAxisIndex: [0],
                    bottom: 0,
                }
            ]
        };

        var index_chart = echarts.init(document.getElementById('pop_up_index_chart_'+key));
        index_chart.setOption(option); 
    
        var legends = document.getElementById('legends_'+key).children;
        var i = 0;
        for (let item of legends) {
            var statu = option.legend.selected[item.children[0].children[1].innerText];

            item.addEventListener('click', () => {
                statu = option.legend.selected[item.children[0].children[1].innerText];

                option.legend.selected[item.children[0].children[1].innerText] = !statu;

                item.classList.toggle('active');

                index_chart.setOption(option); 
            });
            if (!statu){
                item.classList.toggle('active');
            }

            item.children[1].innerText = option.series[i].data[option.series[i].data.length-1];
            i++;
        }

        setTimeout(function() {
            index_chart.resize();
        }, 300);
    })
}

lottie.loadAnimation({
    container: document.getElementById('loading'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: anim_loading,
    speed: 2,
});

function toggle_height(container) {
    if (container.style.height === '0px' || container.style.height === '') {
        container.style.height = "20rem";
        setTimeout(function() {
            container.style.height = 'auto';
        }, 300);
    } else {
        container.style.height = container.scrollHeight + 'px'; 
        setTimeout(function() {
            container.style.height = '0';
        }, 10); // 延迟以触发动画
    }
}

// 用于获取小数长度
function get_decimal_places(num) {
    // 将数字转换为字符串
    const num_str = num.toString();

    // 检查是否包含小数点
    if (num_str.includes('.')) {
        // 返回小数点后的位数
        return num_str.split('.')[1].length;
    }

    // 如果没有小数点，返回 0
    return 0;
}

var is_loading = true;

function observe_element_visibility(element, callback_function) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !is_loading) {
                is_loading = true; // 触发时设置标志为 true
                callback_function(); // 执行回调
            }
        });
    });
    observer.observe(element);
}

const loading_element = document.getElementById('loading');
observe_element_visibility(loading_element, () => {
    console.log("see,next page");
    next_page();
});
