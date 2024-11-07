(function() {
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

    routes_load("周涨幅榜");
})();