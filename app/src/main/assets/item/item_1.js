(function() {
    var tags = _ie({
        tag : "div",
        className : "tags",
    },document.getElementById("container"));

    var relations = _ie({
        tag : "div",
        className : "relations",
    },document.getElementById("container"));

    var info_heading = _ie({
        tag: 'div',
        attribute: {
            class: 'info_heading'
        },
        style : {
            diplay : "none"
        },
        children: [
            {
                tag: 'p',
                children: [
                    {
                        tag: 'text',
                    }
                ]
            },
            {
                tag: 'div',
                attribute: {
                    class: 'info_indexs'
                },
            },
            {
                tag: 'div',
                attribute: {
                    class: 'info_setting'
                },
                children: [
                    {
                        tag: 'svg',
                        attribute: {
                            viewBox: '64 64 896 896',
                            width: '1.3rem'
                        },
                        children: [
                            {
                                tag: 'path',
                                attribute: {
                                    d: 'M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },document.getElementById("container"));
    var horizontal_infos_list = _ie({
        tag : "div",
        className : "horizontal_infos_list",
    },document.getElementById("container"));
    
    var chart = _ie({
        tag : "div",
        className : "chart"
    },document.getElementById("container"));

    // infos
    var url = "https://api-csob.ok-skins.com/api/v2/goods/info";
    var post_data = {"goodsName":item_name};
    Request.post(url,JSON.stringify(post_data),"item_info", "receive");
    wait4value("item_info").then(value => {
        document.getElementById('loading').style.display = "none";
        infos_handling();
    });

    function extractTextInBrackets(str) {
        const matches = str.match(/[\(\（]([^\)\）]+)[\)\）]/g);
        var result = matches ? matches.map(text => text.slice(1, -1)).join('-') : '';
        if (result === ""){
            return "普通";
        }
        return result
    }

    function infos_handling(){
        var resp = JSON.parse(all_resps["item_info"]).data;

        all_resps["id"] = resp.list[0].goodsId;

        // tags
        var tag_info = resp.info;
        if (tag_info.exterior){
            gsap.from(_ie({tag:"div",className:"tag",children:[{tag:"p",innerHTML:tag_info.exterior}]},tags), {
                duration: 0.5, 
                x: 50, 
                opacity: 0,
                ease: "power3.out",
                delay: 0
            });
        }
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
                        innerHTML : extractTextInBrackets(relation_info[i].goodsName),
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
        var info_heading_names = ["在售价","求购价"];
        info_heading.style.display = "";
        gsap.from(info_heading, {
            duration: 0.5, 
            y: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0
        });

        var info = info.reduce((acc, item) => {
            // 检查平台是否已存在于 acc 中
            if (!acc.some(existingItem => existingItem.platform === item.platform)) {
                acc.push(item); // 如果不存在，则添加到 acc
            }
            return acc;
        }, []);

        // 在售价格
        const _prices = Array.from(info.values()).map(item => item.minPrice || 0);
        var p_min = _prices.indexOf(Math.min(..._prices.filter(price => price > 0)));
        var p_max = _prices.indexOf(Math.max(..._prices.filter(price => price > 0)));
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
                            innerHTML: isNaN(info[0].minPrice / 100) ? 0 : info[0].minPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "BUFF"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: isNaN(info[1].minPrice / 100) ? 0 : info[1].minPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "悠悠有品"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: isNaN(info[2].minPrice / 100) ? 0 : info[2].minPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "IGXE"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: isNaN(info[3].minPrice / 100) ? 0 : info[3].minPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "C5"
                        }
                    ]
                }
            ]
        };
        _option.children[p_min].children[1].innerHTML += "<b>Min</b>";
        _option.children[p_max].children[1].innerHTML += "<b>Max</b>";
        gsap.from(_ie(_option,horizontal_infos_list), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.3
        });
        // 求购价格
        const _buy_prices = Array.from(info.values()).map(item => item.purchaseMaxPrice || 0);
        var b_min = _buy_prices.indexOf(Math.min(..._buy_prices.filter(price => price > 0)));
        var b_max = _buy_prices.indexOf(Math.max(..._buy_prices.filter(price => price > 0)));
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
                            innerHTML: isNaN(info[0].purchaseMaxPrice / 100) ? 0 : info[0].purchaseMaxPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "BUFF"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: isNaN(info[1].purchaseMaxPrice / 100) ? 0 : info[1].purchaseMaxPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "悠悠有品"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: isNaN(info[2].purchaseMaxPrice / 100) ? 0 : info[2].purchaseMaxPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "IGXE"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "info",
                    children: [
                        {
                            tag: "p",
                            innerHTML: isNaN(info[3].purchaseMaxPrice / 100) ? 0 : info[3].purchaseMaxPrice / 100
                        },
                        {
                            tag: "a",
                            innerHTML: "C5"
                        }
                    ]
                }
            ]
        };
        _option.children[b_max].children[1].innerHTML += "<b>Max</b>";
        _option.children[b_min].children[1].innerHTML += "<b>Min</b>";
        gsap.from(_ie(_option,horizontal_infos_list), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.6
        });
        // 租赁

        // 挂刀
        var markets = ["BUFF","悠悠有品","IGXE","C5"];
        var _option = {
            tag : "div",
            className : "infos",
            children :[
                {
                    tag : "div",
                    className : "info",
                    id : "steam_max",
                    children : [
                        {
                            tag : "p",
                            innerHTML : "<c>求购价:</c>" + info[b_max].purchaseMaxPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : markets[b_max] + "<b>Max</b>"
                        }
                    ]
                },
                {
                    tag : "div",
                    className : "info",
                    id : "steam_min",
                    children : [
                        {
                            tag : "p",
                            innerHTML : "<c>售价:</c>" + info[p_min].minPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : markets[p_min] + "<b>Min</b>"
                        }
                    ]
                },
                {
                    tag : "div",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[0].steamPrice/100
                        },
                        {
                            tag : "a",
                            innerHTML : "Steam价格"
                        }
                    ]
                },
                {
                    tag : "div",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : info[0].sellCount
                        },
                        {
                            tag : "a",
                            innerHTML : "在售量"
                        }
                    ]
                },
                {
                    tag : "div",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : tag_info.steamRatio.toFixed(3)
                        },
                        {
                            tag : "a",
                            innerHTML : "挂刀比"
                        }
                    ]
                },
                                {
                    tag : "div",
                    className : "info",
                    children : [
                        {
                            tag : "p",
                            innerHTML : (((1/tag_info.steamRatio)-1)*100).toFixed(2) + "%"
                        },
                        {
                            tag : "a",
                            innerHTML : "收益率"
                        }
                    ]
                },
            ]
        };
        gsap.from(_ie(_option,horizontal_infos_list), {
            duration: 0.5, 
            x: 50, 
            opacity: 0,
            ease: "power3.out",
            delay: 0.9
        });
        info_heading_names.push("挂刀");
        document.getElementById("steam_max").addEventListener('click', function() {
            Jump.jump(markets[b_max],info[b_max].goodsId);
        });            
        document.getElementById("steam_min").addEventListener('click', function() {
            Jump.jump(markets[p_min],info[p_min].goodsId);
        });

        const info_indexs = document.querySelector('.info_indexs');
        const cards = document.querySelectorAll('.infos');
        function create_indicators() {
            info_indexs.innerHTML = '';
            cards.forEach((_, index) => {
                const dot = document.createElement('div');
                if (index === 0) {
                    dot.classList.add('index');
                }
                info_indexs.appendChild(dot);
            });
        }
        create_indicators();

        function update_indicator(active_index) {
            info_heading.children[0].innerHTML = info_heading_names[active_index];
            const dots = info_indexs.querySelectorAll('div');
            dots.forEach((dot, index) => {
                if (index === active_index) {
                    dot.classList.add('index');
                } else {
                    dot.classList.remove('index');
                }
            });
        }
        let scroll_timeout;
        horizontal_infos_list.addEventListener('scroll', () => {
            if (scroll_timeout) {
                clearTimeout(scroll_timeout);
            }
            scroll_timeout = setTimeout(() => {
                let container_width = horizontal_infos_list.clientWidth;
                let scroll_left = horizontal_infos_list.scrollLeft;
                let active_card_index = Math.round(scroll_left / container_width);
                update_indicator(active_card_index);
            }, 10);
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
        var url = "https://api-csob.ok-skins.com/api/v2/goods/chart";
        var post_data = {"goodsId":all_resps["id"],"platform":0,"timeRange":"YEAR","data":["createTime","minPrice","sellCount"]};
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

        var url = "https://api-csob.ok-skins.com/api/v1/goods/chart/kline";
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
                        upColor: config.up_color,
                        downColor: config.down_color,
                        upBorderColor: config.up_color,
                        downBorderColor: config.down_color,
                        upWickColor: config.up_color,
                        downWickColor: config.down_color
                    },
                    priceMark: {
                        last: {
                            upColor: config.up_color,
                            downColor: config.down_color
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
                        upColor: config.up_color,
                        downColor: config.down_color,
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