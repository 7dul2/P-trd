(function() {
    var markets = {
        "BUFF" : 0,
        "悠悠有品" : 1,
        "IGXE" : 2,
        "C5" : 3
    }

    var time_ranges = {
        "近1天" : "DAY",
        "近1周" : "WEEK",
        "近1个月" : "MONTH",
        "近6个月" : "HALF_YEAR",
        "近1年" : "YEAR",
    }

    function fetch(){
        var select = document.getElementById("index_select").innerText.split("-");

        var m = select[0];
        var t = select[1];

        var time_unit = "DAY";
        if (t == "近1天" || t == "近1周" || t == "近1个月"){
            time_unit = "HOUR"
        }

        var url = "https://api-csob.ok-skins.com/api/v1/index/chart?category=all&platform="+markets[m]+"&type="+time_unit;
        Request.get(url,"market_index", "receive");
        wait4value("market_index").then(value => {
            data_heading(time_ranges[t]);
        })
    }

    function get_first_index(data, time_frame) {
        const current_time = Date.now();
        const time_ranges = {
            "DAY": 86400000,
            "WEEK": 604800000,
            "MONTH": 2629800000,
            "HALF_YEAR": 15768000000,
            "YEAR": 31536000000
        };
        const time_limit = current_time - (time_ranges[time_frame] || 0);
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] >= time_limit) {
                return i;
            }
        }
        return 0;
    }

    function data_heading(t){
        var resp = JSON.parse(all_resps["market_index"]).data.list;

        var i = get_first_index(resp, t);

        var first_index = resp[i][1];
        var up2date_index = resp[resp.length-1][1];

        var change = (up2date_index - first_index).toFixed(2);
        var change_rate = (change / first_index *100).toFixed(2);

        var index_number_text = change > 0 ? `<up>${up2date_index}</up>` : (change < 0 ? `<down>${up2date_index}</down>` : up2date_index);
        document.getElementById("index_number").innerHTML = index_number_text;

        var index_change_text = (change > 0 ? '+' : '') + change_rate + "%/" + (change > 0 ? '+' : '') + change;
        var index_change_HTML = change > 0 ? `<up>${index_change_text}</up>` : (change < 0 ? `<down>${index_change_text}</down>` : index_change_text);
        document.getElementById("index_change").innerHTML = index_change_HTML;
    

        var indexs = resp.map(item => item[1]).slice(i+1);

        var color = (change > 0) ? config.up_color : (change < 0) ? config.down_color : '#8e8e8e';

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
                    data: indexs,
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
    
        var myChart = echarts.init(document.getElementById('index_chart'));
        myChart.setOption(option);

        var timestamps = resp.map(item => {
            const date = new Date(item[0]);
            return date.getFullYear() + '-' + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                   date.getDate().toString().padStart(2, '0');
        }).slice(i+1);

        pop_up_chart(indexs,timestamps);
    }

    function selection_pop_up(){
        pop_up();

        _ie(
            {
                tag: 'div',
                className: 'select_container',
                children: [
                    {
                        tag: 'p',
                        innerText: '平台'
                    },
                    {
                        tag: 'div',
                        className: 'selections platform-selections',
                        children: [
                            { tag: 'a', innerText: 'BUFF' },
                            { tag: 'a', innerText: '悠悠有品' },
                            { tag: 'a', innerText: 'IGXE' },
                            { tag: 'a', innerText: 'C5' },
                            { tag: 'div', className: 'selection-indicator' }
                        ]
                    },
                    {
                        tag: 'p',
                        innerText: '时间范围'
                    },
                    {
                        tag: 'div',
                        className: 'selections time-selections',
                        children: [
                            { tag: 'a', innerText: '近1天' },
                            { tag: 'a', innerText: '近1周' },
                            { tag: 'a', innerText: '近1个月' },
                            { tag: 'a', innerText: '近6个月' },
                            { tag: 'a', innerText: '近1年' },
                            { tag: 'div', className: 'selection-indicator' }
                        ]
                    },
                    {
                        tag: 'div',
                        className: 'select_confirm',
                        children: [
                            {
                                tag: 'div',
                                children: [
                                    { tag: 'p', innerText: '确认' }
                                ]
                            }
                        ]
                    }
                ]
            },
            document.getElementById("pop_up_container")
        );

        const platformLinks = document.querySelectorAll('.platform-selections a');
        const platformIndicator = document.querySelector('.platform-selections .selection-indicator');
        const timeLinks = document.querySelectorAll('.time-selections a');
        const timeIndicator = document.querySelector('.time-selections .selection-indicator');
        let selectedPlatform = 'BUFF';
        let selectedTime = '近1周';
        function updateIndicator(links, indicator, event) {
            const activeLink = event.target;
            const rect = activeLink.getBoundingClientRect();
            const containerRect = activeLink.closest('.selections').getBoundingClientRect();
            const scrollLeft = activeLink.closest('.selections').scrollLeft;
            indicator.style.left = `${rect.left - containerRect.left + window.scrollX + scrollLeft}px`;
            indicator.style.width = `${rect.width}px`;
        }
        platformLinks.forEach(link => link.addEventListener('click', function(event) {
            event.preventDefault();
            selectedPlatform = this.textContent;
            updateIndicator(platformLinks, platformIndicator, event);
        }));
        timeLinks.forEach(link => link.addEventListener('click', function(event) {
            event.preventDefault();
            selectedTime = this.textContent;
            updateIndicator(timeLinks, timeIndicator, event);
        }));
        if (platformLinks.length > 0) {
            platformLinks[0].click();
        }
        if (timeLinks.length > 0) {
            timeLinks[1].click();
        }
        const confirmButton = document.querySelector('.select_confirm div');
        confirmButton.addEventListener('click', function() {
            document.getElementById("index_select").innerText = selectedPlatform + "-" + selectedTime;
            delete all_resps["market_index"];
            fetch();
            pop_up();
        });
    }

    function pop_up_chart(value,timestamps){
        document.getElementById("index_chart_box").onclick = function(){
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
                                        innerText : value[value.length-1],
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
                        data: value,
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
        };
    }

    document.getElementById("index_select_box").addEventListener('click', () => {
        selection_pop_up();
    })

    document.getElementById("index_title").addEventListener('click', () => {
        Jump.jump("markets","");
    });

    fetch();
})();