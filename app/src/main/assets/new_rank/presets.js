(function() {
    var presets = {
        "周涨幅榜" : {
            "minPrice":0,
            "minSellCount":300,
            "sellCountTimeRange":"DAY",
            "sellCountChange":72,
            "priceChangePercentTimeRange":"WEEK",
            "type":"PRICE_CHANGE_PERCENT_DESC",
            "timeRange":"WEEK",
            "page":1
        },
        "周跌幅榜" : {
            "minPrice":0,
            "minSellCount":300,
            "sellCountTimeRange":"DAY",
            "sellCountChange":72,
            "priceChangePercentTimeRange":"WEEK",
            "type":"PRICE_CHANGE_PERCENT_ASC",
            "timeRange":"WEEK",
            "page":1
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
            "page":1
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
            "page":1
        },
    };

    var value_name = {
        "周涨幅榜" : "周涨幅",
        "周跌幅榜" : "周跌幅",
        "周热销榜" : "成交量",
        "周热租榜" : "成租量"
    }

    for (var key in presets) {
        if (presets.hasOwnProperty(key)) {
            (function(key, value) {
                // 创建新的导航项
                var nav = _ie({
                    tag: "p",
                    innerHTML: key
                }, document.getElementById("nav"));
    
                // 给每个导航项添加点击事件
                nav.addEventListener('click', function() {
                    is_loading = true;
                    reset();

                    // 所有导航项设置为未激活状态
                    var navs = document.querySelectorAll('.nav p');
                    navs.forEach(function(item) {
                        item.setAttribute("data-active", "false");
                    });

                    // 设置当前点击的导航项为激活状态
                    nav.setAttribute("data-active", "true");

                    params = {...value};
                    load();

                    document.getElementById('value_name').innerHTML = value_name[key];
                });
            })(key, presets[key]);
        }
    }
    init_nav();

})();