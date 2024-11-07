(function() {
    function get_nav() {
        const active_element = document.querySelector('.nav p[data-active="true"]');
        return active_element;
    }

    var pop = document.getElementById("side_pop");

    document.getElementById("params").addEventListener('click', function() {
        load_params();

        toggle_width(pop); // 弹出窗口

        var nav = get_nav();
        document.getElementById("pop_name").innerHTML = nav.innerHTML;
        // 修改pop_name
    })

    document.getElementById("pop_back").addEventListener('click', function() {
        toggle_width(pop);
        // 允许滚动
    });

    for (var key in types) {
        if (types.hasOwnProperty(key)) {
            _ie({
                tag : "p",
                innerHTML : key
            },document.getElementById("type"));
            // 循环types,将内容插入到类型选择框
        }
    }

    for (var key in time_ranges) {
        if (time_ranges.hasOwnProperty(key)) {
            _ie({
                tag : "p",
                innerHTML : key
            },document.getElementById("time_ranges"));
        }
    }
    function init_select_effects() {
        const select_elements = document.querySelectorAll('._select');
    
        select_elements.forEach(select_element => {
            
            const toggle_button = select_element.children[0];
            const content_div = select_element.children[1];
            const svg_icon = toggle_button.querySelector('svg'); // 获取 SVG 元素
            const options = content_div.querySelectorAll('p'); // 获取所有选项
    
            // 默认隐藏内容区域
            content_div.style.display = 'none';
    
            toggle_button.addEventListener('click', function() {
                if (content_div.style.display === 'none' || !content_div.style.display) {
                    content_div.style.display = 'block'; // 显示元素
                    gsap.fromTo(content_div, 
                        { opacity: 0, scale: 0.95 }, // 初始状态
                        { opacity: 1, scale: 1, duration: 0.1 } // 结束状态
                    );
                    gsap.to(svg_icon, {
                        rotation: 180, // 逆时针旋转 180 度
                        duration: 0.1
                    });
                } else {
                    // 隐藏弹出框
                    gsap.to(content_div, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.1,
                        onComplete: () => { 
                            content_div.style.display = 'none'; // 动画完成后隐藏
                        }
                    });

                    // 旋转回 0 度
                    gsap.to(svg_icon, {
                        rotation: 0, // 重置旋转回 0 度
                        duration: 0.1
                    });
                }
                options.forEach(option => {
                    option.addEventListener('click', function() {
                        const selectedText = this.textContent; // 获取被选中的文本
                        toggle_button.querySelector('p').textContent = selectedText;
                        gsap.to(content_div, {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.1,
                            onComplete: () => { 
                                content_div.style.display = 'none'; // 动画完成后隐藏
                            }
                        });
                        gsap.to(svg_icon, {
                            rotation: 0, // 重置旋转回 0 度
                            duration: 0.1
                        });
                    });
                });
            });
        });
    }
    // 初始化所有_select元素的效果
    init_select_effects();

    category.forEach(c => {
        var group = _ie({
            tag : "div",
            className : "_items_group"
        },document.getElementById("category"));

        _ie({
            tag : "div",
            className : "items_header",
            children : [
                {
                    tag : "p",
                    innerHTML : c.name
                }
            ]
        },group);


        if (c.category && c.category.length > 0) {
            var names = _ie({
                tag : "div",
                className : "items_names"
            },group);

            c.category.forEach(c2 => {
                _ie({
                    tag : "div",
                    className : "_item",
                    children : [
                        {
                            tag : "p",
                            innerHTML : c2.name
                        }
                    ]
                },names)
            })
        }
    });
    var group = _ie({
        tag : "div",
        className : "_items_group"
    },document.getElementById("exterior"));
    var names = _ie({
        tag : "div",
        className : "items_names"
    },group);
    exterior.forEach(function(item) {
        _ie({
            tag : "div",
            className : "_item",
            children : [
                {
                    tag : "p",
                    innerHTML : item
                }
            ]
        },names)
    });
    var group = _ie({
        tag : "div",
        className : "_items_group"
    },document.getElementById("quality"));
    var names = _ie({
        tag : "div",
        className : "items_names"
    },group);
    quality.forEach(function(item) {
        _ie({
            tag : "div",
            className : "_item",
            children : [
                {
                    tag : "p",
                    innerHTML : item
                }
            ]
        },names)
    });
    var group = _ie({
        tag : "div",
        className : "_items_group"
    },document.getElementById("rarity"));
    var names = _ie({
        tag : "div",
        className : "items_names"
    },group);
    rarity.forEach(function(item) {
        _ie({
            tag : "div",
            className : "_item",
            children : [
                {
                    tag : "p",
                    innerHTML : item
                }
            ]
        },names)
    });

    function init_items() {
        const itemGroups = document.querySelectorAll('._items_group');
    
        itemGroups.forEach(group => {
            const header = group.querySelector('.items_header');
            const items = group.querySelectorAll('._item');
    
            // 处理单个item的触摸滑动效果
            items.forEach(item => {
                item.addEventListener('click', function (event) {
                    const isActive = item.getAttribute('data-active') === 'true';
                    item.setAttribute('data-active', !isActive);
                });
            });

            if (header){
                // 处理 items_header 的全选/全不选效果
                header.addEventListener('click', function () {
                    const allActive = Array.from(items).every(item => item.getAttribute('data-active') === 'true');
                    
                    items.forEach(item => {
                        // 如果所有都是选中状态，则取消选中，否则全选
                        item.setAttribute('data-active', allActive ? 'false' : 'true');
                    });
                });
            }
        });
    }
    // 初始化 items_names 的点击效果
    init_items();

    function init_pop_nav(){
        const headings = document.querySelectorAll('.pop_heading');

        var pop_bar_sub = document.getElementById("pop_bar_sub");
        pop_bar_sub.innerHTML = ""; // 清空内容

        headings.forEach(heading => {
            const p_element = heading.querySelector('p');

            let nav = _ie({
                tag : "p",
                innerHTML : p_element.innerText
            },pop_bar_sub);

            nav.addEventListener('click', function() {
                // 滚动到对应的p_element
                p_element.scrollIntoView({
                    behavior: 'smooth', // 平滑滚动
                    block: 'start'
                });
            });
        });
    };

    init_pop_nav();

    function load_params(){
        // 排序类型
        var type = null;
        document.getElementById("selected_type").innerHTML = "排序类型"; // 初始化
        if (params.hasOwnProperty("type")) {
            var p = params.type.replace(/_DESC|_ASC|_BUFF|_YYYP|_IGXE|_C5/g, "");
            if (flipped_types[p]) {
                document.getElementById("selected_type").innerHTML = flipped_types[p];
                type = p;
            }
        }

        // 平台选择
        document.getElementById("selected_market").innerHTML = "平台选择";
        document.querySelectorAll('[params-bind="markets"]').forEach(element => {
            element.style.display = "";
        });// 初始化
        if (marketable_types.includes(type)){
            var regex = new RegExp('_DESC|_ASC|' + p, 'g');
            var m = params.type.replace(regex, "");
            var t = {
                "_BUFF" : "BUFF",
                "_YYYP" : "悠悠有品",
                "_IGXE" : "IGXE",
                "_C5" : "C5"
            };
            document.getElementById("selected_market").innerHTML = t[m];
        }else {
            document.querySelectorAll('[params-bind="markets"]').forEach(element => {
                element.style.display = "none";
            });// 如果不能选择市场,就隐藏
        }

        // 排序方向
        document.getElementById("sort_type").innerHTML = "排序方向";
        document.querySelectorAll('[params-bind="sort"]').forEach(element => {
            element.style.display = "";
        });// 初始化
        if (sortable_types.includes(type)){
            var regex = new RegExp('_BUFF|_YYYP|_IGXE|_C5|' + p, 'g');
            var s = params.type.replace(regex, "");
            var t = {
                "_DESC" : "降序-由大变小",
                "_ASC" : "升序-由小变大",
            };
            document.getElementById("sort_type").innerHTML = t[s];
        }else {
            document.querySelectorAll('[params-bind="sort"]').forEach(element => {
                element.style.display = "none";
            });// 如果不能选择市场,就隐藏
        }

        // 时间范围
        document.getElementById("time_range").innerHTML = "时间范围"; // 初始化
        if (params.hasOwnProperty("timeRange")) {
            for (var key in time_ranges) {
                if (time_ranges.hasOwnProperty(key)) {
                    var i = time_ranges[key];
                    if (i === params.timeRange){
                        document.getElementById("time_range").innerHTML = key;
                    }
                }
            }
        }

        const items = document.querySelectorAll('._item');
        items.forEach(item => {
            item.setAttribute('data-active','false');
        });

        // 武器选择
        if (params.hasOwnProperty("category")) {
            var c = params.category;

            c.forEach(key => {
                var name = categories[key];
                items.forEach(item => {
                    if (item.children[0].innerHTML === name){
                        item.setAttribute('data-active','true');
                    }
                });
            });
        }


        // 磨损选择
        if (params.hasOwnProperty("exterior")) {
            var e = params.exterior;
            e.forEach(key => {
                items.forEach(item => {
                    if (item.children[0].innerHTML === key){
                        item.setAttribute('data-active','true');
                    }
                });
            });
        }
        

        // 类别选择
        if (params.hasOwnProperty("quality")) {
            var q = params.quality;
            q.forEach(key => {
                items.forEach(item => {
                    if (item.children[0].innerHTML === key){
                        item.setAttribute('data-active','true');
                    }
                });
            });
        }

        // 品质选择
        if (params.hasOwnProperty("rarity")) {
            var r = params.rarity;
            r.forEach(key => {
                items.forEach(item => {
                    if (item.children[0].innerHTML === key){
                        item.setAttribute('data-active','true');
                    }
                });
            });
        }
    };

    function get_params(){
        var selected_type = document.getElementById("selected_type").innerHTML;
        var p = {};
        if (selected_type == "排序类型"){
            return false
        } // 如果没有选择类型

        if (!types.hasOwnProperty(selected_type)){
            return false
        } // 如果选择的类型不属于types

        p.type = types[selected_type];

        var y = true;
        document.querySelectorAll('[params-bind="markets"]').forEach(element => {
            if (element.style.display == "none"){
                y = false;
            }
        });// 如果市场被隐藏无法选择
        if (y){
            var t = {
                "BUFF" : "_BUFF",
                "悠悠有品" : "_YYYP",
                "IGXE" : "_IGXE",
                "C5" : "_C5"
            };
            p.type += t[document.getElementById("selected_market").innerHTML]
        }


        var y = true;
        document.querySelectorAll('[params-bind="sort"]').forEach(element => {
            if (element.style.display == "none"){
                y = false
            }
        });// 如果排序被隐藏无法选择
        if (y){
            var t = {
                "降序-由大变小" : "_DESC",
                "升序-由小变大" : "_ASC",
            };
            p.type += t[document.getElementById("sort_type").innerHTML]
        }


        var time_range =  document.getElementById("time_range").innerHTML;
        if (time_range === "时间范围"){
            return false
        } // 如果没用选择时间

        if (!time_ranges.hasOwnProperty(time_range)){
            return false
        } // 如果选择的时间不属于time_ranges

        p.timeRange = time_ranges[time_range];


        p.category = [];
        var c = document.getElementById("category");
        var items = c.querySelectorAll('._item');
        items.forEach(item => {
            if (item.getAttribute('data-active') === "true"){
                p.category.push(flipped_categories[item.children[0].innerHTML])
            }
        });

        p.exterior = [];
        var e = document.getElementById("exterior");
        var items = e.querySelectorAll('._item');
        items.forEach(item => {
            if (item.getAttribute('data-active') === "true"){
                p.exterior.push(item.children[0].innerHTML);
            }
        });

        p.quality = [];
        var q = document.getElementById("quality");
        var items = q.querySelectorAll('._item');
        items.forEach(item => {
            if (item.getAttribute('data-active') === "true"){
                p.quality.push(item.children[0].innerHTML);
            }
        });

        p.rarity = [];
        var r = document.getElementById("rarity");
        var items = r.querySelectorAll('._item');
        items.forEach(item => {
            if (item.getAttribute('data-active') === "true"){
                p.rarity.push(item.children[0].innerHTML);
            }
        });

        return p
    }

    var targetNode = document.getElementById("selected_type");
    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var t = types[mutation.target.textContent];


                if (sortable_types.includes(t)){
                    document.querySelectorAll('[params-bind="sort"]').forEach(element => {
                        element.style.display = "";
                    });
                }else {
                    document.querySelectorAll('[params-bind="sort"]').forEach(element => {
                        element.style.display = "none";
                    });
                }

                if (marketable_types.includes(t)){
                    document.querySelectorAll('[params-bind="markets"]').forEach(element => {
                        element.style.display = "";
                    });
                }else {
                    document.querySelectorAll('[params-bind="markets"]').forEach(element => {
                        element.style.display = "none";
                    });
                }
            }
        }
    });
    var config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    document.getElementById("reset").addEventListener('click', function() {
        reset();
        load_params();
    });


    document.getElementById("change_save").addEventListener('click', function() {
        var rank_name = document.getElementById("pop_name").innerText;
        var rank_names = {
            "周涨幅榜" : true,
            "周跌幅榜" : true,
            "周热销榜" : true,
            "周热租榜" : true,
        }
        if (rank_names[rank_name]) {
            ru_msg({
                text : "预设排行榜无法修改！"
            });
            return
        }

        var p = get_params();

        if (!p) {
            ru_msg({
                text : "必选项未填写！"
            });
            return
        }

        var param_string = escape(JSON.stringify(p));

        DataBase.executeSQL("UPDATE rank SET params = ? WHERE name = ?", [param_string, rank_name]);

        // 收回弹出窗口
        toggle_width(pop); 

        routes_update(rank_name,p);
    });

    document.getElementById("new_rank").addEventListener('click', function() {
        var p = get_params();

        if (!p) {
            ru_msg({
                text : "必选项未填写！"
            });
            return
        }

        pop_up();

        var fliter = "";

        document.querySelectorAll('.customize_nav').forEach(element => {
            fliter += element.textContent + "|"
        });

        var e = _ie({
            tag : "div",
            style : {
                display: 'flex',
                width: '100%',
                height: '50%',
                flexDirection: 'column',
                justifyContent: 'space-between'
            },
            children : [
                {
                    tag : "p",
                    innerHTML : "保存自定义",
                    style : {
                        color : "var(--text-color)",
                        fontSize: 'var(--heading-2-font-size)',
                        fontWeight : 600,
                        margin : 0,
                    }
                },
                {
                    tag : "div",
                    id : "p_c_1",
                },
                {
                    tag : "div",
                    id : "p_c_2",
                },
            ]
        },document.getElementById("pop_up_container"));

        var p_input = _ie({
            tag : "ru_input",
            attribute : {
                hint : "排行榜名称",
                check : "^(?!(" + fliter + "周涨幅榜|周跌幅榜|周热销榜|周热租榜)$).*"
            }
        },document.getElementById("p_c_1"));

        var p_btn = _ie({
            tag : "ru_button",
            attribute : {
                text : "确认"
            }
        },document.getElementById("p_c_2"));

        setTimeout(function(){
            p_btn.touch(function(){
                if (p_input.value() === ""){
                    ru_msg({
                        text : "请输入名称。"
                    });
                    return
                }
                if (!p_input.check()){
                    ru_msg({
                        text : "名称已存在!"
                    });
                    return
                }
                
                p.priceChangePercentTimeRange = "WEEK";
                p.page = 1;
                var param_string = escape(JSON.stringify(p));

                DataBase.executeSQL("INSERT OR IGNORE INTO rank (name,params) VALUES (?,?)",[p_input.value(),param_string]);

                // 收回弹出窗口
                toggle_width(pop); 

                routes_new(p_input.value(), p);

                routes_load(p_input.value());

                // 收回弹出框
                pop_up();
            })
        },100);
    });


    document.getElementById("rank_delete").addEventListener('click', function() {
        var rank_name = document.getElementById("pop_name").innerText;
        var rank_names = {
            "周涨幅榜" : true,
            "周跌幅榜" : true,
            "周热销榜" : true,
            "周热租榜" : true,
        }
        if (rank_names[rank_name]) {
            ru_msg({
                text : "你不能删除预设排行榜!"
            });
            return
        }

        DataBase.executeSQL("DELETE FROM rank WHERE name = ?", [rank_name]);

        routes_delete(rank_name);

        toggle_width(pop); 
    });
})();
