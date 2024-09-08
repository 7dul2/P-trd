(function() {
    // infos
    var url = "https://api-csob.douyuex.com/api/v2/goods/info";
    var post_data = {"goodsName":item_name};
    Request.post(url,JSON.stringify(post_data),"item_info", "receive");
    wait4value("item_info").then(value => {
        document.getElementById('loading').style.opacity = 0;
        infos_handling();
    });

    var tags = _ie({
        tag : "div",
        className : "tags",
    },document.getElementById("container"));

    var relations = _ie({
        tag : "div",
        className : "relations",
    },document.getElementById("container"));

    var horizontal_infos_list = _ie({
        tag : "div",
        className : "horizontal_infos_list",
    },document.getElementById("container"));
    var chart = _ie({
        tag : "div",
        className : "chart"
    },document.getElementById("container"));

    function infos_handling(){
        var resp = JSON.parse(all_resps["item_info"]).data;

        all_resps["id"] = resp.list[0].goodsId;

        // tags
        var tag_info = resp.info;
        gsap.from(_ie({tag:"div",className:"tag",children:[{tag:"p",innerHTML:tag_info.exterior}]},tags), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0
        });
        gsap.from(_ie({tag:"div",className:"tag",children:[{tag:"p",innerHTML:tag_info.rarity}]},tags), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.3
        });
        gsap.from(_ie({tag:"div",className:"tag",children:[{tag:"p",innerHTML:tag_info.quality}]},tags), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.6
        });

        // relations
        var relation_info = resp.relations;
        for (let i = 0;i<relation_info.length;i++){
            var _option = {
                tag : "div",
                className : "relation",
                children : [
                    {
                        tag : "p",
                        innerHTML : relation_info[i].exterior
                    },
                    {
                        tag : "a",
                        innerHTML : (relation_info[i].minPrice/100).toFixed(2)
                    },
                ]
            };
            var _r = _ie(_option,relations);
            gsap.from(_r, {
                duration: 0.5, 
                x: 50, 
                opacity: 0,
                ease: "power3.out",
                delay: 0.3 * i
            });

            _r.addEventListener('click', function() {
                Jump.jump("item",relation_info[i].goodsName);
            });
        }

        // infos
        var info = resp.list;
        // 在售价格
        const _prices = info.map(item => item.minPrice);        
        const _min = _prices.indexOf(Math.min(..._prices));
        var _option = {
            tag : "div",
            className : "infos",
            children :[
                {
                    tag : "p",
                    className : "heading",
                    children : [
                        {
                            tag : "p",
                            innerHTML : "在售价格"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[0].minPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "BUFF"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[1].minPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "悠悠有品"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[2].minPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "IGXE"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[3].minPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "C5"
                        }
                    ]
                },
            ]
        };
        _option.children[_min+1].children[1].innerHTML += "<b>Min</b>";
        gsap.from(_ie(_option,horizontal_infos_list), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0
        });
        // 求购价格
        const _buy_prices = info.map(item => item.purchaseMaxPrice);        
        const _max = _buy_prices.indexOf(Math.min(..._buy_prices));
        var _option = {
            tag : "div",
            className : "infos",
            children :[
                {
                    tag : "p",
                    className : "heading",
                    children : [
                        {
                            tag : "p",
                            innerHTML : "求购价格"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[0].purchaseMaxPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "BUFF"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[1].purchaseMaxPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "悠悠有品"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[2].purchaseMaxPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "IGXE"
                        }
                    ]
                },
                {
                    tag : "p",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[3].purchaseMaxPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "C5"
                        }
                    ]
                },
            ]
        };
        _option.children[_max+1].children[1].innerHTML += "<b>Max</b>";
        gsap.from(_ie(_option,horizontal_infos_list), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.3
        });

        var heading = _ie({
            tag : "div",
            className : "chart_heading",
            children : [
                {
                    tag : "p",
                    innerHTML : "价格"
                },
                {
                    tag : "div",
                    className : "chart_switch",
                    children : [
                        {
                            tag: 'svg',
                            id: 'line',
                            attribute : {
                                width: '1.3rem',
                                viewBox: '64 64 896 896',
                            },
                            children: [
                                {
                                    tag: 'path',
                                    attribute : {
                                        d: 'M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 00-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 00-11.3 0L266.3 586.7a8.03 8.03 0 000 11.3l39.5 39.7z'
                                    }
                                }
                            ]
                        },
                        {
                            tag : "p",
                            innerHTML : "|"
                        },
                        {
                            tag: 'svg',
                            id: 'k_line',
                            attribute : {
                                width: '1.3rem',
                                viewBox: '64 64 896 896',
                            },
                            children: [
                                {
                                    tag: 'path',
                                    attribute : {
                                        d: 'M320 224h-66v-56c0-4.4-3.6-8-8-8h-52c-4.4 0-8 3.6-8 8v56h-66c-4.4 0-8 3.6-8 8v560c0 4.4 3.6 8 8 8h66v56c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8v-56h66c4.4 0 8-3.6 8-8V232c0-4.4-3.6-8-8-8zm-60 508h-80V292h80v440zm644-436h-66v-96c0-4.4-3.6-8-8-8h-52c-4.4 0-8 3.6-8 8v96h-66c-4.4 0-8 3.6-8 8v416c0 4.4 3.6 8 8 8h66v96c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8v-96h66c4.4 0 8-3.6 8-8V304c0-4.4-3.6-8-8-8zm-60 364h-80V364h80v296zM612 404h-66V232c0-4.4-3.6-8-8-8h-52c-4.4 0-8 3.6-8 8v172h-66c-4.4 0-8 3.6-8 8v200c0 4.4 3.6 8 8 8h66v172c0 4.4 3.6 8 8 8h52c4.4 0 8-3.6 8-8V620h66c4.4 0 8-3.6 8-8V412c0-4.4-3.6-8-8-8zm-60 145a3 3 0 01-3 3h-74a3 3 0 01-3-3v-74a3 3 0 013-3h74a3 3 0 013 3v74z'
                                    }
                                }
                            ]
                        },
                    ]
                }
            ]
        },chart);
        gsap.from(heading, {
            duration: 0.5, 
            y: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0
        });
        document.getElementById("line").addEventListener('click', () => {
            chart_switch("line");
        });
        document.getElementById("k_line").addEventListener('click', () => {
            chart_switch("k_line");
        });
    }

    function line(){
        var url = "https://api-csob.douyuex.com/api/v2/goods/chart";
        var post_data = {"goodsId":all_resps["id"],"platform":0,"timeRange":"HALF_YEAR","data":["createTime","minPrice","sellCount"]};
        Request.post(url,JSON.stringify(post_data),"item_line", "receive");
        wait4value("item_line").then(value => {
            var resp = JSON.parse(all_resps["item_line"]).data.list;

            var timestamps = resp[0].map(item => {
                const date = new Date(item);
                return date.getFullYear() + '-' + 
                       (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                       date.getDate().toString().padStart(2, '0');
            });
            var prices = resp[1].map(item => item/100);
            var nums = resp[2];

            var legends = _ie({
                tag : 'div',
                className : "chart_legends",
                children : [
                    {
                        tag : "div",
                        className : "legend",
                        children : [
                            {
                                tag : "div",
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l1",
                                    },
                                    {
                                        tag : "p",
                                        innerHTML : "价格"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerHTML : prices[prices.length-1]
                            }
                        ]
                    },
                    {
                        tag : "div",
                        className : "legend",
                        children : [
                            {
                                tag : "div",
                                className : "top",
                                children : [
                                    {
                                        tag : "div",
                                        className : "l2",
                                    },
                                    {
                                        tag : "p",
                                        innerHTML : "在售量"
                                    }
                                ]
                            },
                            {
                                tag : "p",
                                innerHTML : nums[nums.length-1]
                            }
                        ]
                    },
                ]
            },chart);
            gsap.from(legends, {
                duration: 0.5, 
                y: 50, 
                opacity: 0,
                ease: "power3.out",
                delay: 0
            });
    
            var _chart = _ie({
                tag : "div",
                id : "chart"
            },chart);
            gsap.from(_chart, {
                duration: 0.5, 
                y: 50, 
                opacity: 0,
                ease: "power3.out",
                delay: 0.3
            });

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
            var _chart_ = echarts.init(document.getElementById('chart'));
            _chart_.setOption(option);
            document.querySelectorAll('.legend').forEach((item, index) => {
                item.addEventListener('click', () => {
                    const seriesName = option.series[index].name;
                    const isActive = item.classList.toggle('active');
                    selectedStatus[seriesName] = !isActive;
                    _chart_.setOption({
                        legend: {
                            selected: selectedStatus
                        }
                    });
                });
            });
        });
    }

    function k_line(){
        var _chart = _ie({
            tag : "div",
            id : "chart",
            style : {
                height : "30rem"
            }
        },chart);
        gsap.from(_chart, {
            duration: 0.5, 
            y: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.3
        });

        var url = "https://api-csob.douyuex.com/api/v1/goods/chart/kline";
        var post_data = {"goods":{"goodsId":all_resps["id"],"platform":0},"kType":"DAY","isFilter":false,"samplingSize":5,"upPercent":30,"downPercent":30}
        Request.post(url,JSON.stringify(post_data),"item_kline", "receive");
        wait4value("item_kline").then(value => {
            var resp = JSON.parse(all_resps["item_kline"]).data.list;

            var _chart_ = klinecharts.init('chart');
            _chart_.setStyles({
                grid: {
                    show: true,
                    horizontal: {
                      color: 'rgba(245,245,247, 0.1)',
                    },
                    vertical: {
                      color: 'rgba(245,245,247, 0.1)',
                    }
                },
                candle: {
                    bar: {
                        upColor: "#00AA43",
                        downColor: "#DB2F63",
                        upBorderColor: "#00AA43",
                        downBorderColor: "#DB2F63",
                        upWickColor: "#00AA43",
                        downWickColor: "#DB2F63"
                    },
                    priceMark: {
                        last: {
                            upColor: "#00AA43",
                            downColor: "#DB2F63"
                        }
                    },
                    tooltip: {
                        showRule: 'follow_cross',
                        showType: 'rect',
                        custom: [
                            { title: '时间', value: '  {time}' },
                            { title: '开盘', value: '{open}' },
                            { title: '最高', value: '{high}' },
                            { title: '最低', value: '{low}' },
                            { title: '收盘', value: '{close}' },
                            { title: '成交量', value: '{volume}' }
                        ],
                    }
                },indicator: {
                    bars: [{
                        upColor: 'rgba(0,170,67,.7)',
                        downColor: 'rgba(219,47,99,.7)',
                    }],
                },
                yAxis: {
                    inside: true,
                    axisLine: {
                          show: false,
                    },
                },
            });

            var data = [];
            var records = resp;
    
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                var timestamp = record[0];
                var open = record[1] / 100;
                var close = record[2] / 100;
                var high = record[3] / 100;
                var low = record[4] / 100;
                var volume = record[5];
    
                var date = new Date(timestamp);
    
                data.push({
                    timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    volume: volume
                });
            }
    
            data.sort((a, b) => a.timestamp - b.timestamp);
    
            _chart_.applyNewData(data);
        })
    }

    function chart_switch(type){
        if (chart.children.length == 2){
            chart.removeChild(chart.children[1]);
        }else if (chart.children.length == 3){
            chart.removeChild(chart.children[2]);
            chart.removeChild(chart.children[1]);
        }

        if (type === "line"){
            document.getElementById("line").style.fill = "var(--text-color)";
            document.getElementById("k_line").style.fill = "";
            line();
        }

        if (type === "k_line"){
            document.getElementById("k_line").style.fill = "var(--text-color)";
            document.getElementById("line").style.fill = "";
            k_line();
        }
    }

    wait4value("id").then(value => {
        chart_switch("line"); 
    });
})();