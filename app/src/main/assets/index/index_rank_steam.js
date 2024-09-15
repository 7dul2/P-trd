(function() {
    function update_rk_tips(){
        var rk_tip = document.getElementById("rk_tip");
        rk_tip.innerHTML = "";
        _ie({
            tag : "p",
            innerHTML : "在售数量",
        },rk_tip);
        _ie({
            tag : "p",
            innerHTML : "求购顶价",
            style : {
                marginRight: "10%"
            }
        },rk_tip);
        _ie({
            tag : "p",
            innerHTML : "在售底价",
        },rk_tip);
        _ie({
            tag : "p",
            innerHTML : "挂刀比",
            style : {
                marginRight: "3%"
            }
        },rk_tip);
    }
    update_rk_tips();

    var post_data = {"category":[],"minPrice":100,"minSellCount":100,"sellCountType":"DOWN","sellCountTimeRange":"DAY","sellCountChange":88,"categoryInclude":"TRUE","exterior":[],"quality":[],"rarity":[],"exteriorInclude":"TRUE","qualityInclude":"TRUE","rarityInclude":"TRUE","priceChangePercentTimeRange":"HALF_MONTH","container":[],"containerInclude":"TRUE","nameInclude":"TRUE","leaseCountType":"DOWN","leaseCountTimeRange":"WEEK","volCountTimeRange":"DAY","volLeaseCountTimeRange":"WEEK","volCount":"","maxPrice":500000,"type":"STEAM","page":1}
    var url = "https://api-csob.douyuex.com/api/v1/rank";
    Request.post(url,JSON.stringify(post_data),"index_rank_steam", "receive");

    wait4value("index_rank_steam").then(value => {
        update_rank();
    });

    function update_rank(){
        var resp = JSON.parse(all_resps["index_rank_steam"]).data.list;

        var e = document.getElementById("items");

        document.getElementById('loading').style.opacity = 0;
        setTimeout(function(){document.getElementById('loading').style.display = "none";},500);
        // 加载动画消失

        for (let item of resp) {
            insert_item(item);
        };
    }

    var _delay = 0;
    function insert_item(item){
        var rank = document.getElementById("items");

        var _item = _ie({
            tag : "div",
            id : item.goodsName,
            className : "item",
            children : [
                {
                    tag : "div",
                    className : "item_name",
                    children : [
                        {
                            tag : "p",
                            innerText : item.goodsName
                        }
                    ]
                }
            ]
        },rank);

        _item.addEventListener('click', function() {
            Jump.jump("item",item.goodsName);
        });

        let _infos = _ie({
            tag : 'div',
            className : "item_infos",
            children : [
                {
                    tag : "div",
                    className : "steam_num",
                    children : [
                        {
                            tag : "p",
                            innerHTML : "-"
                        }
                    ]
                },
                {
                    tag : "div",
                    className : "steam_datas",
                    children : [
                        {
                            tag : "div",
                            className : 'steam',
                            children : [
                                {
                                    tag : "p",
                                    innerHTML : "-"
                                },
                                {
                                    tag : "div",
                                    className : "steam_a",
                                    children : [
                                        {
                                            tag : "a",
                                            innerHTML : "-"
                                        },
                                        {
                                            tag: 'svg',
                                            attribute : {
                                                viewBox: '64 64 896 896',
                                            },
                                            children: [
                                                {
                                                    tag: 'path',
                                                    attribute : {
                                                        d: 'M880 912H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32h360c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H184v656h656V520c0-4.4 3.6-8 8-8h56c4.4 0 8 3.6 8 8v360c0 17.7-14.3 32-32 32zM770.87 199.13l-52.2-52.2a8.01 8.01 0 014.7-13.6l179.4-21c5.1-.6 9.5 3.7 8.9 8.9l-21 179.4c-.8 6.6-8.9 9.4-13.6 4.7l-52.4-52.4-256.2 256.2a8.03 8.03 0 01-11.3 0l-42.4-42.4a8.03 8.03 0 010-11.3l256.1-256.3z'
                                                    }
                                                }
                                            ]
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            tag : "div",
                            className : 'steam',
                            children : [
                                {
                                    tag : "p",
                                    innerHTML : "-"
                                },
                                {
                                    tag : "div",
                                    className : "steam_a",
                                    children : [
                                        {
                                            tag : "a",
                                            innerHTML : "-"
                                        },
                                        {
                                            tag: 'svg',
                                            attribute : {
                                                viewBox: '64 64 896 896',
                                            },
                                            children: [
                                                {
                                                    tag: 'path',
                                                    attribute : {
                                                        d: 'M880 912H144c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32h360c4.4 0 8 3.6 8 8v56c0 4.4-3.6 8-8 8H184v656h656V520c0-4.4 3.6-8 8-8h56c4.4 0 8 3.6 8 8v360c0 17.7-14.3 32-32 32zM770.87 199.13l-52.2-52.2a8.01 8.01 0 014.7-13.6l179.4-21c5.1-.6 9.5 3.7 8.9 8.9l-21 179.4c-.8 6.6-8.9 9.4-13.6 4.7l-52.4-52.4-256.2 256.2a8.03 8.03 0 01-11.3 0l-42.4-42.4a8.03 8.03 0 010-11.3l256.1-256.3z'
                                                    }
                                                }
                                            ]
                                        },
                                    ]
                                }
                            ]
                        },
                    ]
                },
                {
                    tag : "div",
                    className : "steam_rate",
                    children : [
                        {
                            tag : "p",
                            innerHTML : item.value.toFixed(3)
                        }
                    ]
                },
            ]
        },_item);

        gsap.from(_item, {
            duration: 0.3, 
            y: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: _delay
        });

        _delay += 0.1;

        function infos_handling(){
            var infos = JSON.parse(all_resps["item_info_"+item.goodsName]).data;
            var data = infos.list;

            var plants = ["BUFF","悠悠有品","IGXE","C5"];

            let max_purchase_count_index = data.reduce((max_index, item, index, arr) => 
                item.purchaseCount > arr[max_index].purchaseCount ? index : max_index, 0);
            _infos.children[0].children[0].innerHTML = data[max_purchase_count_index].purchaseCount;


            let max_purchase_max_price_index = data.reduce((max_index, item, index, arr) => 
                item.purchaseMaxPrice > arr[max_index].purchaseMaxPrice ? index : max_index, 0);
            _infos.children[1].children[0].children[0].innerHTML = data[max_purchase_max_price_index].purchaseMaxPrice/100;
            _infos.children[1].children[0].children[1].children[0].innerHTML = plants[max_purchase_max_price_index];
            _infos.children[1].children[0].children[1].addEventListener('click', function() {
                event.stopPropagation();
                Jump.jump(plants[max_purchase_max_price_index],data[max_min_price_index].goodsId);
            });
            

            let max_min_price_index = data.reduce((max_index, item, index, arr) => 
                item.minPrice < arr[max_index].minPrice ? index : max_index, 0);
            _infos.children[1].children[1].children[0].innerHTML = data[max_min_price_index].minPrice/100;
            _infos.children[1].children[1].children[1].children[0].innerHTML = plants[max_min_price_index];
            _infos.children[1].children[1].children[1].addEventListener('click', function() {
                event.stopPropagation();
                Jump.jump(plants[max_min_price_index],data[max_min_price_index].goodsId);
            });
        }

        setTimeout(function(){
            var url = "https://api-csob.douyuex.com/api/v2/goods/info";
            var post_data = {"goodsName":item.goodsName};
            Request.post(url,JSON.stringify(post_data),"item_info_"+item.goodsName, "receive");
            wait4value("item_info_"+item.goodsName).then(value => {
                infos_handling();
            });
        }, (_delay-0.1)*3000);
    };
})();