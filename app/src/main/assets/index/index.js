update_check();

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

// 排行榜上的加载动画
lottie.loadAnimation({
      container: document.getElementById('loading'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: anim_loading,
      speed: 2,
});
document.getElementById('loading').style.opacity = 1;

var url = "https://api-csob.douyuex.com/api/v1/index/chart?category=all&platform=0&type=DAY";
Request.get(url,"major_index", "receive");
function major_index_load(){
    var list = JSON.parse(all_resps["major_index"]).data.list;

    const timestamps = list.map(item => {
        const date = new Date(item[0]);
        return date.getFullYear() + '-' + 
               (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
               date.getDate().toString().padStart(2, '0');
    });
    const values = list.map(item => item[1]);

    var change = values[values.length-1] - values[values.length-2];
    var color = "#48484B";
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
                    width: 1,
                },
                connectNulls: true,
                data: values.slice( values.length-31,values.length-1),
                areaStyle: {
                    color: {
                        type: 'linear',
                        x : 0,
                        x2 : 0,
                        y : 0,
                        y2 : 1,
                        colorStops: [{
                            offset: 0, color: color
                        }, {
                            offset: 1, color: 'rgba(0,0,0,0)'
                        }],
                    },
                },
            },
        ],
    }

    var myChart = echarts.init(document.getElementById('mmi_chart'));
    myChart.setOption(option);

    document.getElementById("index").style.color = color;
    document.getElementById("index").innerText = values[values.length-1];
    document.getElementById("index_float").style.color = color;

    change = change.toFixed(2);

    var float = (change / values[values.length-2] * 100).toFixed(2);

    if (change > 0){
        change = "+" + change;
        float = "+" + float;
    }
    var float = change + "(" + float + "%)今日";
    document.getElementById("index_float").innerText = float;


    document.getElementById("mmi_chart").addEventListener('click', function() {
        pop_up();
        _ie({
            tag : "div",
            className : "pop_up_index",
            children : [
                {
                    tag : "div",
                    className : "top",
                    children : [{
                        tag : "h1",
                        innerText : "大盘指数"
                    }]
                },
                {
                    tag : "div",
                    className : "legends",
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
                                            tag : "div"
                                        },
                                        {
                                            tag : "p",
                                            innerText : "指数"
                                        }
                                    ]
                                },
                                {
                                    tag : "p",
                                    innerText : values[values.length-1],
                                }
                            ]
                        }
                    ]
                },
                {
                    tag : "div",
                    id : "pop_up_index_chart",
                    className : "chart"
                }
            ]
        },document.getElementById("pop_up_container"));

        var option = {
            tooltip: {
                backgroundColor : "#48484b",
                borderColor: '#48484b',
                textStyle: {
                    color: '#fff',
                    fontSize: 12,
                },
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#48484b',
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
                    '指数': true
                },
            },
            grid: {
                top: '5%',
                right: '3%',
                bottom: '15%',
                left: '13%',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timestamps,
                axisLabel: {
                    fontSize: 10,
                },
                axisLine: {
                    lineStyle: {
                        color: '#48484b'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
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
                        color: '#48484b'
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
            series: [
                {
                    name: "指数",
                    type: 'line',
                    smooth: 0.4,
                    symbol: 'none',
                    lineStyle: {
                        color: "#157efb",
                        width: 2,
                    },
                    connectNulls: true,
                    data: values,
                    animationDuration: 500,
                    animationEasing: 'cubicInOut',
                }
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
        

        const selectedStatus = {};

        option.series.forEach(series => {
            selectedStatus[series.name] = true;
        });
        
        var index_chart = echarts.init(document.getElementById('pop_up_index_chart'));
        index_chart.setOption(option);

        document.querySelectorAll('.legend').forEach((item, index) => {
            item.addEventListener('click', () => {
                const seriesName = option.series[index].name;
                const isActive = item.classList.toggle('active');
                selectedStatus[seriesName] = !isActive;
                index_chart.setOption({
                    legend: {
                        selected: selectedStatus
                    }
                });
            });
        });
    });
}

wait4value("major_index").then(value => {
    major_index_load()
});

var url = "https://api-csob.douyuex.com/api/v1/updown/count?platform=0";
Request.get(url,"counter", "receive");
wait4value("counter").then(value => {
    var datas = JSON.parse(all_resps["counter"]).data;

    var tot_num = datas.up + datas.down + datas.stay;
    document.getElementById("c_up").innerText = "上涨: " + datas.up + ' ';
    document.getElementById("c_down").innerText = "下跌: " + datas.down + ' ';

    var lines = document.getElementsByClassName("c_line");
    lines[0].style.width = datas.up/tot_num*100-1 + "%";
    lines[1].style.width = datas.stay/tot_num*100-1 + "%";
    lines[2].style.width = datas.down/tot_num*100-1 + "%";

    var max =  Math.max(...Object.entries(datas).filter(([k, v]) => !["up", "down"].includes(k)).map(([k, v]) => v));;
    var bars = document.getElementById("counter_bars").children;

    bars[0].children[0].innerText = datas.up10;
    bars[0].children[1].style.height = 6 * datas.up10/max + "rem";
    bars[1].children[0].innerText = datas.up7;
    bars[1].children[1].style.height = 6 * datas.up7/max + "rem";
    bars[2].children[0].innerText = datas.up5;
    bars[2].children[1].style.height = 6 * datas.up5/max + "rem";    
    bars[3].children[0].innerText = datas.up3;
    bars[3].children[1].style.height = 6 * datas.up3/max + "rem";
    bars[4].children[0].innerText = datas.up0;
    bars[4].children[1].style.height = 6 * datas.up0/max + "rem";
    bars[5].children[0].innerText = datas.stay;
    bars[5].children[1].style.height = 6 * datas.stay/max + "rem";
    bars[6].children[0].innerText = datas.down0;
    bars[6].children[1].style.height = 6 * datas.down0/max + "rem";
    bars[7].children[0].innerText = datas.down3;
    bars[7].children[1].style.height = 6 * datas.down3/max + "rem";
    bars[8].children[0].innerText = datas.down5;
    bars[8].children[1].style.height = 6 * datas.down5/max + "rem";
    bars[9].children[0].innerText = datas.down7;
    bars[9].children[1].style.height = 6 * datas.down7/max + "rem";
    bars[10].children[0].innerText = datas.down10;
    bars[10].children[1].style.height = 6 * datas.down10/max + "rem";
})

var update_index = 0;

function rank_update(type){
    update_index ++;
    var rk_tip = document.getElementById("rk_tip");
    rk_tip.innerHTML = "";
    _ie({
        tag : "p",
        innerHTML : "走势简图(月)",
    },rk_tip);
    _ie({
        tag : "p",
        innerHTML : "在售/求购数量",
        style : {
            marginRight: "10%"
        }
    },rk_tip);
    _ie({
        tag : "p",
        innerHTML : "在售/求购价格",
    },rk_tip);
    _ie({
        tag : "p",
        innerHTML : "浮动率(周)",
    },rk_tip);

    document.getElementById('loading').style.display = "";
    document.getElementById('loading').style.opacity = 1;
    // 加载动画出现

    var navs = document.getElementById("rk_nav").children;
    for (var i = 0;i < navs.length;i++){
        navs[i].style.color = "rgba(245,245,247, 0.6)";
    }

    document.getElementById("items").innerHTML = "";

    document.getElementById("rank_nav_" + type).style.color = "rgba(245,245,247)";

    var button_more = document.getElementById("items_more");

    if (type == "stars"){
        button_more.children[0].children[0].innerText = "";
        button_more.onclick = function(){};

        var results = DataBase.query("SELECT item_name FROM stars",[]);
        if (results.length == 0){
            document.getElementById('loading').style.opacity = 0;
            setTimeout(function(){document.getElementById('loading').style.display = "none";},500);
            // 加载动画消失
            button_more.children[0].children[0].innerText = "空空如也";
            return
        }

        results = results.trim().split('\n');

        var e = document.getElementById("items");

        document.getElementById('loading').style.opacity = 0;
        setTimeout(function(){document.getElementById('loading').style.display = "none";},500);
        // 加载动画消失

        for (let stared_item of results) {
            var newElement = _ie({
                tag : "div",
                className : "item",
                id : "item_" + stared_item,
                children : [
                    {
                        tag : "div",
                        className : "item_name",
                        children : [{
                            tag :  "p",
                            innerText : stared_item
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
                                                innerText : "-"
                                            },
                                            {
                                                tag : "a",
                                                innerText : "-"
                                            },
                                        ]
                                    },
                                ]
                            },
                            {
                                tag : "div",
                                className : "data_float",
                                children : [
                                    {
                                        tag : "p",
                                        innerText : "暂不提供",
                                    }
                                ],
                                style : {
                                    backgroundColor : "rgba(29, 29, 31, 0.6)"
                                }
                            },
                        ]
                    },
                    
                ]
            },e); 

            gsap.from(newElement, {
                duration: 0.5, 
                y: 50, 
                opacity: 0,
                ease: "power3.out"
            });

            document.getElementById("item_" + stared_item).addEventListener('click', function() {
                Jump.jump("item",stared_item);
            }); // 当列表中的元素被点击时候,进行跳转

        }

        update_rank_items_infos(update_index);

        return
    }

    if (type == "steam"){
        _ie({
            tag : "script",
            src : "index_rank_steam.js"
        },document.body);
        return 0
    }

    button_more.children[0].children[0].innerText = "查看更多";
    button_more.onclick = function() {
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

        document.getElementById('loading').style.opacity = 0;
        setTimeout(function(){document.getElementById('loading').style.display = "none";},500);
        // 加载动画消失

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

        update_rank_items_infos(update_index);
    }
    wait4value("rank_items_"+type).then(value => {
        update_rank_items()
    });
}
function update_rank_items_infos(_index){
    var p = document.getElementById("items");
    for (var i = 0; i < p.children.length; i++){
        (function(index){ // 使用闭包保存当前迭代的索引值
            setTimeout(function(){
                if (update_index != _index){
                    return
                }
                var c = p.children[index];
                var name = c.children[0].children[0].innerText;

                var id;

                id = match_id(name,"buff"); // 先尝试本底读取,如果存在就不需要再请求csob了
                if (!id){
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
                    var post_data = {"goodsId":id,"platform":0,"timeRange":"HALF_YEAR","data":["createTime","minPrice","sellCount"]}
                    Request.post(url,JSON.stringify(post_data),"item_charts_"+id, "receive");
                    wait4value("item_charts_"+id).then(value => {
                        var datas = JSON.parse(all_resps["item_charts_"+id]);

                        var prices = datas.data.list[1].map(item => item/100);

                        var timestamps_format = datas.data.list[0].map(item => {
                            const date = new Date(item);
                            return date.getFullYear() + '-' + 
                                   (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                                   date.getDate().toString().padStart(2, '0');
                        });

                        var nums = datas.data.list[2];

                        var change = prices[prices.length-1] - prices[0];
                        var color = "#48484B";
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
                                    data: prices.slice(prices.length-31,prices.length-1),
                                    areaStyle: {
                                        color: {
                                            type: 'linear',
                                            x : 0,
                                            x2 : 0,
                                            y : 0,
                                            y2 : 1,
                                            colorStops: [{
                                                offset: 0, color: color
                                            }, {
                                                offset: 1, color: 'rgba(0,0,0,0)'
                                            }],
                                        },
                                    },
                                },
                                
                            ],
                        }

                        const chart = echarts.init(c.children[1].children[0]);
                        chart.setOption(option);

                        c.children[1].children[0].addEventListener('click', function() {
                            event.stopPropagation();
                            pop_up();
                            _ie({
                                tag : "div",
                                className : "pop_up_index",
                                children : [
                                    {
                                        tag : "div",
                                        className : "top",
                                        children : [{
                                            tag : "h1",
                                            innerText : name
                                        }]
                                    },
                                    {
                                        tag : "div",
                                        className : "legends",
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
                                                                innerText : "价格"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        tag : "p",
                                                        innerText : prices[prices.length-1],
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
                                                        innerText : nums[nums.length-1],
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag : "div",
                                        id : "pop_up_index_chart",
                                        className : "chart"
                                    }
                                ]
                            },document.getElementById("pop_up_container"));

                            var option = {
                                tooltip: {
                                    backgroundColor : "#48484b",
                                    borderColor: '#48484b',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 12,
                                    },
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross',
                                        label: {
                                            backgroundColor: '#48484b',
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
                                        '价格': true,
                                        "在售量" : true
                                    },
                                },
                                grid: {
                                    top: '5%',
                                    right: '13%',
                                    bottom: '15%',
                                    left: '13%',
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: timestamps_format,
                                    axisLabel: {
                                        fontSize: 10,
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#48484b'
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
                                                color: '#48484b'
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
                                                color: '#48484b'
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
                                        name: "价格",
                                        type: 'line',
                                        smooth: 0.4,
                                        symbol: 'none',
                                        lineStyle: {
                                            color: "#157efb",
                                            width: 2,
                                        },
                                        connectNulls: true,
                                        data: prices,
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
                                            width: 2,
                                        },
                                        connectNulls: true,
                                        data: nums,
                                        animationDuration: 500,
                                        animationEasing: 'cubicInOut',
                                        yAxisIndex: 1 
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

                            const selectedStatus = {};

                            option.series.forEach(series => {
                                selectedStatus[series.name] = true;
                            });
                            
                            var index_chart = echarts.init(document.getElementById('pop_up_index_chart'));
                            index_chart.setOption(option);

                            document.querySelectorAll('.legend').forEach((item, index) => {
                                item.addEventListener('click', () => {
                                    const seriesName = option.series[index].name;
                                    const isActive = item.classList.toggle('active');
                                    selectedStatus[seriesName] = !isActive;
                                    index_chart.setOption({
                                        legend: {
                                            selected: selectedStatus
                                        }
                                    });
                                });
                            });
                        })
                    });
                });

            }, 500 * index);
        })(i);
    }
}

document.getElementById("rank_nav_stars").addEventListener('click', function() {
    rank_update("stars");
});
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
document.getElementById("rank_nav_steam").addEventListener('click', function() {
    rank_update("steam");
});

// 如果有自选就载入自选,不然就载入hot
if (DataBase.query("SELECT item_name FROM stars",[]).length > 0){
    rank_update("stars");
}else{
    rank_update("hot");
}

// 接下来是search页面的跳转
var search = document.getElementsByClassName("search")[0];
search.addEventListener('click', function() {
    Jump.jump("search","")
});
