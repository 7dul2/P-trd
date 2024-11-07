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
var value_types = {
    "PRICE_CHANGE": "price_change",
    "PRICE_CHANGE_PERCENT": "float",
    "MINPRICE": "price",
    "LEASE": "value",
    "LONG_LEASE": "value",
    "LEASEPRICE": "price",
    "VOL_COUNT": "value",
    "VOL_PRICE": "price",
    "VOL_LEASE_COUNT": "value",
    "VOL_LEASE_PRICE": "price",
    "SELLCOUNT": "value",
    "SELLCOUNT_SUM": "float",
    "SELLCOUNT_UP": "value",
    "LEASECOUNT": "value",
    "LEASECOUNT_SUM": "float",
    "LEASECOUNT_UP": "value",
    "PURCHASE_MAXPRICE": "price",
    "PURCHASE_COUNT": "value",
    "PURCHASE_DIFFPRICE_PERCENT": "float",
    "FLOAT_COUNT": "value",
    "STEAM": "value",
    "CASH": "value"
};

var flipped_types = {};
for (var key in types) {
    if (types.hasOwnProperty(key)) {
        flipped_types[types[key]] = key;
    }
}

function init_nav() {
    var nav_items = document.querySelectorAll('.rank_navs p');
    var selection_indicator = document.querySelector('.selection-indicator');

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
    var active_item = document.querySelector('.rank_navs p[data-active="true"]');

    // 如果没有激活项，则默认激活第一个元素
    if (!active_item && nav_items.length > 0) {
        active_item = nav_items[0];
        active_item.setAttribute("data-active", "true");
    }

    // 如果找到激活的项，则移动指示标
    if (active_item) {
        move_indicator(active_item);
    }

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
        });
    });
}

var routes = {};

function routes_delete(_n){
    delete routes[_n];

    var navs = document.querySelectorAll('.nav p');
    navs.forEach(function(item) {
        item.setAttribute("data-active", "false");
        if (item.textContent === _n){
            item.remove();
        }
    });

    routes_load("周涨幅榜");

    init_nav();
}

function routes_new(_n,_p) {
    // 如果没有value_name,就直接查询

    if (_n !== "自选"){
        if (!_p.value_name) {
            _p.value_name = flipped_types[(_p.type).replace(/_DESC|_ASC|_BUFF|_YYYP|_IGXE|_C5/g,"")];
        }
    
        _p.page = 1;
        _p.priceChangePercentTimeRange = "WEEK";
    }

    routes[_n] = _p;

    var nav = _ie({
        tag: "p",
        innerHTML: _n
    }, document.getElementById("rank_navs"));

    nav.addEventListener('click', function() {
        routes_load(_n)
    });
}

function routes_update(_n,_p) {
    if (!_p.value_name) {
        _p.value_name = flipped_types[(_p.type).replace(/_DESC|_ASC|_BUFF|_YYYP|_IGXE|_C5/g,"")];
    }

    _p.page = 1;
    _p.priceChangePercentTimeRange = "WEEK";

    routes[_n] = _p;
    routes_load(_n)
}

function routes_load(_n) {
    reset();

    var navs = document.querySelectorAll('.nav p');
    navs.forEach(function(item) {
        item.setAttribute("data-active", "false");
        if (item.textContent === _n){
            item.setAttribute("data-active", "true");
        }
    });

    if (_n == "自选") {
        load_stared(routes[_n]);
        document.getElementById('value_name').innerHTML = "周浮动";
        document.getElementById("value_name_1").innerHTML = "价格(在售量)"
    } else{
        params = {...routes[_n]};
        load();
        document.getElementById('value_name').innerHTML = routes[_n]["value_name"];
        document.getElementById("value_name_1").innerHTML = "价格(周浮动)"
    }


    init_nav();
}

// 发送请求的参数
var params;

// 根据当前参数加载排行榜
function load(){
    var url = "https://api-csob.ok-skins.com/api/v1/rank";

    var key = Math.random().toString(36).substr(2) + Date.now().toString(36);

    Request.post(url,JSON.stringify(params),key, "receive");

    wait4value(key).then(value => {
        var value_type = params.type.replace(/_DESC|_ASC|_BUFF|_YYYP|_IGXE|_C5/g, "");


        var resp = JSON.parse(all_resps[key]).data;

        // 如果匹配结果为空
        if (resp === null){

            delete all_resps[key];
            return
        }


        resp = resp.list;

        if (resp.length === 0){

            delete all_resps[key];
            return
        }

        resp.forEach(function(item) {
            item.value_type = value_types[value_type];
            insert(item);
        });

        delete all_resps[key];
    })

}

// 加载收藏
function load_stared(items){
    var sleep = 0;
    items.forEach(item => {
        setTimeout(function(){
            var item_name = item[0];

            var url = "https://api-csob.ok-skins.com/api/v2/goods/chart";
            
            var post_data = {"goodsId":item_names[item_name].id,"platform":0,"timeRange":"WEEK","data":["createTime","minPrice","sellCount"]}

            var key = Math.random().toString(36).substr(2) + Date.now().toString(36);

            Request.post(url,JSON.stringify(post_data),key, "receive");
            wait4value(key).then(value => {
                insert(JSON.parse(all_resps[key]).data.list,"star",item_name);
            });
        }, sleep);
        sleep += 500;

        // 避免同时发送大量请求形成阻塞
    });
}

// 重置参数
function reset(){
    params = {
        "priceChangePercentTimeRange":"WEEK",
        "type":"PRICE_CHANGE_PERCENT_DESC",
        "page":1  
    } // 最基本的三个参数

    document.getElementById("rank_container").innerHTML = "";
}

// 往排行榜插入元素
function insert(datas,type="normal",name=""){
    var parent = document.getElementById("rank_container")
    
    var num = parent.children.length + 1;// 商品排行
    var num_mark = null;
    if (num <= 3){
        num_mark = "top";
        // 如果前三名就标记
    }

    if (type === "star") {
        var name = name; // 商品名称
    }
    if (type === "normal") {
        var name = datas.goodsName; // 商品名称
    }

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
                        id : "item_name_" + key,
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
                        id : "fold_"+key,
                        children: [
                            {
                                tag: 'path',
                                attribute : {
                                    d: 'M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };


    var price_html = ""; // 显示的html
    if (type === "star") {
        var price = (datas[1][datas[1].length-1]/100).toFixed(2); // 商品价格
        var sell_num = datas[2][datas[2].length-1];

        price_html = sell_num;
    }
    if (type === "normal") {
        var price = (datas.price/100).toFixed(2); // 商品价格
        var price_change_rate = (datas.minPriceChangePercent[7]*100).toFixed(2); // 七天浮动

        if (price_change_rate >= 0){
            price_html += "<up>+" + price_change_rate + "%</up>";
        }else {
            price_html += "<down>" + price_change_rate + "%</down>";
        }
    }

    if (type === "star") {
        var last_price = datas[1][0]/100;
        var price_change_rate = (price - last_price) / last_price;
        var value = price_change_rate; // 排行榜对应的数值
        var value_tag = "float"; // 展示value对应的html标签
    }

    if (type === "normal") {
        var value = datas.value; // 排行榜对应的数值
        var value_tag = datas.value_type; // 展示value对应的html标签
    }

    if (value_tag === "price"){
        value_tag = "value";
        value = (value/100).toFixed(2);
    }

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

    if (value_tag === "price_change"){
        value_tag = "float";
        value = (value/100).toFixed(2);
        if (value >= 0){
            value = "+" + value;
            value_mark = "up";
        }else {
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

    document.getElementById("item_name_" + key).addEventListener("click", function() {
        Jump.jump("item",name);
    });

    const fold_tool = document.getElementById("fold_"+key);
    let is_fold = false;// 是否折叠
    fold_tool.addEventListener("click", function() {
        // 切换旋转状态
        if (!is_fold) {
            fold_tool.style.transform = "rotate(180deg)";
            is_fold = true;
        } else {
            fold_tool.style.transform = "rotate(0deg)";
            is_fold = false;
        }

        toggle_height(item_infos);

        if (document.getElementById("pop_up_index_chart_" + key).children.length === 0){
            load_infos(name,key);
        }
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

// 自选
var stared = DataBase.query("SELECT item_name FROM stars",[]).trim()
    .split('\n')
    .map(item => item.split(","));
if (stared.length !== 0){
    routes_new("自选", stared);
}

// 预设
var presets = {
    "周涨幅榜" : {
        "minPrice":10,
        "minSellCount":300,
        "sellCountTimeRange":"DAY",
        "sellCountChange":72,
        "priceChangePercentTimeRange":"WEEK",
        "type":"PRICE_CHANGE_PERCENT_DESC",
        "timeRange":"WEEK",
        "page":1,
        "value_name" : "周涨幅"
    },
    "周跌幅榜" : {
        "minPrice":10,
        "minSellCount":300,
        "sellCountTimeRange":"DAY",
        "sellCountChange":72,
        "priceChangePercentTimeRange":"WEEK",
        "type":"PRICE_CHANGE_PERCENT_ASC",
        "timeRange":"WEEK",
        "page":1,
        "value_name" : "周跌幅"
    },
    "周热销榜" : {
        "minPrice":0,
        "minSellCount":300,
        "sellCountTimeRange":"WEEK",
        "sellCountChange":72,
        "priceChangePercentTimeRange":"WEEK",
        "type":"VOL_COUNT",
        "timeRange":"WEEK",
        "volCountTimeRange":"WEEK",
        "page":1,
        "value_name" : "成交量"
    },
    "周热租榜" : {
        "minPrice":0,
        "minSellCount":300,
        "sellCountTimeRange":"DAY",
        "sellCountChange":72,
        "priceChangePercentTimeRange":"WEEK",
        "type":"VOL_LEASE_COUNT",
        "timeRange":"WEEK",
        "volLeaseCountTimeRange":"WEEK",
        "page":1,
        "value_name" : "成租量"
    },
};

for (var key in presets) {
    routes_new(key, presets[key]);
}


if (stared.length == 0){
    routes_load("周涨幅榜");
}else {
    routes_load("自选");
}
document.getElementById("rank_page").addEventListener('click', function() {
    Jump.jump("rank","")
});

// 自定义
var result = DataBase.query("SELECT * FROM rank",[])
    .trim()
    .split('\n')
    .map(item => item.split(","));

var customizes = {};

result.forEach(item => {
    var encode_params = item[1].trim();
    let fixed_params = encode_params.replace(/%u([0-9A-Fa-f]{4})/g, function(match, group) {
        return "%" + group.toUpperCase();
    });
    var decoded_params = decodeURIComponent(fixed_params);
    customizes[item[0]] = JSON.parse(decoded_params);
});


for (var key in customizes) {
    if (customizes.hasOwnProperty(key)) {
        routes_new(key, customizes[key]);
    }
}