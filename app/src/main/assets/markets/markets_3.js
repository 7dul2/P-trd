(function() {
    function load_finish(){
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('mark').style.opacity = 1;
        setTimeout(function(){document.getElementById('loading').style.display="none"},300);
    }

    function formatNumber(num, precision = 2) {
        const absNum = Math.abs(num);
        if (absNum >= 100000000) {
            return (num / 100000000).toFixed(precision) + '亿';
        } else if (absNum >= 10000) {
            return (num / 10000).toFixed(precision) + '万';
        } else {
            return num.toFixed(precision);
        }
    }

    function changeRate(now,before,precision = 2) {
        var rate =(((before - now)/before)*100).toFixed(precision);
        return rate;
    }

    // index_datas
    _ie({
        tag: 'div',
        attribute: {
            class: 'info_heading'
        },
        children: [
            {
                tag: 'p',
                innerHTML : "市场指数"
            },
        ]
    },document.getElementById("container"));
    var index_datas = _ie({
        tag : "div",
        className : "horizontal_infos_list",
    },document.getElementById("container"));
    var url = "https://api-csob.ok-skins.com/api/v1/index/info";
    var post_data = {"categoryList":["all"],"platform":2,"base":false};
    Request.post(url,JSON.stringify(post_data),"index_datas", "receive");
    wait4value("index_datas").then(value => {
        load_finish();
        index_datas_handing();
    });
    function index_datas_handing(){
        var resp = JSON.parse(all_resps["index_datas"]).data.list[0];

        var change = (resp.changeRate > 0 ? '+' : '') + (resp.changeRate * 100).toFixed(2) + "%/" + (resp.change > 0 ? '+' : '') + resp.change;

        var _option = {
            tag: "div",
            className: "infos",
            children: [
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: resp.index
                        },
                        {
                            tag: "a",
                            innerHTML: "当前指数"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: resp.changeRate > 0 ? `<up>${change}</up>` : (resp.changeRate < 0 ? `<down>${change}</down>` : change)
                        },
                        {
                            tag: "a",
                            innerHTML: "变化"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: resp.indexList[resp.closeIndex]
                        },
                        {
                            tag: "a",
                            innerHTML: "昨收"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: resp.indexList[resp.closeIndex+1]
                        },
                        {
                            tag: "a",
                            innerHTML: "今开"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: Math.max(...resp.indexList)
                        },
                        {
                            tag: "a",
                            innerHTML: "最高"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: Math.min(...resp.indexList)
                        },
                        {
                            tag: "a",
                            innerHTML: "最低"
                        }
                    ]
                },
            ],

        };
        gsap.from(_ie(_option,index_datas), {
            duration: 0.5, 
            y: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.3
        });
    }
    // index_chart
    _ie({
        tag : "div",
        className : "_chart_container",
        children : [
            {
                tag : "div",
                className : "_chart",
                id : "index_chart"
            }
        ]
    },document.getElementById("container"));
    var url = "https://api-csob.ok-skins.com/api/v1/index/chart?category=all&platform=2&type=DAY"
    Request.get(url,"index_chart", "receive");
    wait4value("index_chart").then(value => {
        load_finish();
        index_chart_handling();
    });
    function index_chart_handling(){
        var resp = JSON.parse(all_resps["index_chart"]).data.list;

        const timestamps = resp.map(item => {
            const date = new Date(item[0]);
            return date.getFullYear() + '-' + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                   date.getDate().toString().padStart(2, '0');
        });
        const values = resp.map(item => item[1]);

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
                confine: true,
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
                bottom: '15%',
                left: '15%',
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
                        color: '#8e8e8e'
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
                    show: false,
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 90,
                    end: 100,
                },
                {
                    show: false,
                    type: 'slider',
                    xAxisIndex: [0],
                    bottom: 0,
                    start: 90,
                    end: 100,
                }
            ]
        };
        var myChart = echarts.init(document.getElementById('index_chart'));
        myChart.setOption(option);
    }

    // market_datas
    _ie({
        tag: 'div',
        attribute: {
            class: 'info_heading'
        },
        children: [
            {
                tag: 'p',
                innerHTML : "市场数据"
            },
        ]
    },document.getElementById("container"));
    var market_datas = _ie({
        tag : "div",
        className : "horizontal_infos_list",
        style : {
            marginBottom : "var(--margin_bottom_1)"
        }
    },document.getElementById("container"));
    var url = "https://api-csob.ok-skins.com/api/v2/market/total?timeRange=DAY&platform=2";
    Request.get(url,"market_datas", "receive");
    wait4value("market_datas").then(value => {
        load_finish();
        market_datas_handling();
    });
    function market_datas_handling(){
        var resp = JSON.parse(all_resps["market_datas"]).data;

        function r(a,b){
            var c_r = changeRate(a,b);
            var c_t = (c_r > 0 ? '+' : '') + c_r + "%";
            var c_s = c_r > 0 ? `<up_s>${c_t}</up_s>` : (c_r < 0 ? `<down_s>${c_t}</down_s>` : c_t);
            return c_s
        }

        var _option = {
            tag: "div",
            className: "infos",
            children: [
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: formatNumber(resp.totalPrice.value/100)
                        },
                        {
                            tag: "p",
                            innerHTML: r(resp.totalPrice.value,resp.totalPrice.beforeValue)
                        },
                        {
                            tag: "a",
                            innerHTML: "总在售底价"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: formatNumber(resp.totalMarketPrice.value/100)
                        },
                        {
                            tag: "p",
                            innerHTML: r(resp.totalMarketPrice.value,resp.totalMarketPrice.beforeValue)
                        },
                        {
                            tag: "a",
                            innerHTML: "总在售市值"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: formatNumber(resp.totalSellCount.value)
                        },
                        {
                            tag: "p",
                            innerHTML: r(resp.totalSellCount.value,resp.totalSellCount.beforeValue)
                        },
                        {
                            tag: "a",
                            innerHTML: "总在售量"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: formatNumber(resp.totalPurchaseCommonMaxPrice.value/100)
                        },
                        {
                            tag: "p",
                            innerHTML: r(resp.totalPurchaseCommonMaxPrice.value,resp.totalPurchaseCommonMaxPrice.beforeValue)
                        },
                        {
                            tag: "a",
                            innerHTML: "总求购顶价"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: formatNumber(resp.totalPurchaseCount.value)
                        },
                        {
                            tag: "p",
                            innerHTML: r(resp.totalPurchaseCount.value,resp.totalPurchaseCount.beforeValue)
                        },
                        {
                            tag: "a",
                            innerHTML: "总求购量"
                        }
                    ]
                },
            ],

        };
        gsap.from(_ie(_option,market_datas), {
            duration: 0.5, 
            y: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.3
        });
    }

    // type_index
    _ie({
        tag: 'div',
        attribute: {
            class: 'info_heading'
        },
        children: [
            {
                tag: 'p',
                innerHTML : "物品板块指数"
            },
        ]
    },document.getElementById("container"));
    var type_index = _ie({
        tag : "div",
        className : "items_datas",
        style : {
            marginBottom : "calc(var(--margin_bottom_1) - var(--margin_bottom_3))"
        }
    },document.getElementById("container"));
    var url = "https://api-csob.ok-skins.com/api/v1/index/info"
    var post_data = {"categoryList":["knives","pistols","rifles","smgs","shotguns","machineguns","gloves","sticker","others"],"platform":2,"base":false};
    Request.post(url,JSON.stringify(post_data),"type_index", "receive");
    wait4value("type_index").then(value => {
        load_finish();
        type_index_handing();
    });
    function type_index_handing(){
        var resp = JSON.parse(all_resps["type_index"]).data.list;

        var translation = {
            "gloves" : "手套",
            "knives" : "刀匕",
            "machineguns" : "机枪",
            "others" : "其他",
            "pistols" : "手枪",
            "rifles" : "步枪",
            "shotguns" : "霰弹枪",
            "smgs" : "冲锋枪",
            "sticker" : "贴纸"
        };

        resp.forEach((item, index) => {
            var change = (item.changeRate > 0 ? '+' : '') + (item.changeRate * 100).toFixed(2) + "%/" + (item.change > 0 ? '+' : '') + item.change;

            var e = _ie({
                tag : "div",
                className : "item_datas",
                children : [
                    {
                        tag : "p",
                        innerHTML : translation[item.category]
                    },
                    {
                        tag : "a",
                        innerHTML : item.index
                    },
                    {
                        tag : "b",
                        innerHTML : item.changeRate > 0 ? `<up>${change}</up>` : (item.changeRate < 0 ? `<down>${change}</down>` : change)
                    },
                ]
            },type_index);

            var color = (item.changeRate > 0) ? config.up_color : (item.changeRate < 0) ? config.down_color : '#8e8e8e';

            var option = {
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
                        data: item.indexList,
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

            var chart = _ie({
                tag : "div",
            },e);

            var myChart = echarts.init(chart);
            myChart.setOption(option);

            gsap.from(e, {
                duration: 0.5, 
                y: 50, 
                opacity: 0,
                ease: "power3.out",
                delay: 0.3
            });
        });

    }

    // price_block
    _ie({
        tag: 'div',
        attribute: {
            class: 'info_heading'
        },
        children: [
            {
                tag: 'p',
                innerHTML : "价格板块市值"
            },
        ]
    },document.getElementById("container"));
    var price_block = _ie({
        tag : "div",
        className : "items_datas"
    },document.getElementById("container"));
    var url = "https://api-csob.ok-skins.com/api/v2/market/chart?type=priceData&subType=totalMarketPrice&timeRange=WEEK&platform=2";
    Request.get(url,"price_block", "receive");
    wait4value("price_block").then(value => {
        load_finish();
        price_block_handling();
    });
    function price_block_handling(){
        var resp = JSON.parse(all_resps["price_block"]).data.list;

        var translation = {
            "p0" : "小件(0-100)",
            "p100" : "中小件(100-1k)",
            "p1000" : "中件(1k-5k)",
            "p5000" : "中大件(5k-2w)",
            "p20000" : "大件(>2w)",
        };

        resp.shift();

        resp.forEach((item, index) => {
            var tag = item.shift();

            var change = item[item.length-1] - item[0];
            var change_rate = ((change / item[0]) * 100).toFixed(2);

            var change = (change_rate > 0 ? '+' : '') + change_rate + "%";

            var e = _ie({
                tag : "div",
                className : "item_datas",
                children : [
                    {
                        tag : "p",
                        innerHTML : translation[tag]
                    },
                    {
                        tag : "a",
                        innerHTML : formatNumber(item[item.length-1]/100)
                    },
                    {
                        tag : "b",
                        innerHTML : change_rate > 0 ? `<up>${change}</up>` : (change_rate < 0 ? `<down>${change}</down>` : change)
                    },
                ]
            },price_block);

            var color = (change_rate > 0) ? config.up_color : (change_rate < 0) ? config.down_color : '#8e8e8e';

            var option = {
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
                        data: item,
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

            var chart = _ie({
                tag : "div",
            },e);

            var myChart = echarts.init(chart);
            myChart.setOption(option);

            gsap.from(e, {
                duration: 0.5, 
                y: 50, 
                opacity: 0,
                ease: "power3.out",
                delay: 0.3
            });
        })
    }

})();