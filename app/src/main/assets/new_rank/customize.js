(function() {
    var result = DataBase.query("SELECT * FROM rank",[])
        .trim()
        .split('\n')
        .map(item => item.split(","));

    var customizes = {};

    result.forEach(item => {
        customizes[item[0]] = JSON.parse(decodeURIComponent(item[1].trim()));
    });

    for (var key in customizes) {
        if (customizes.hasOwnProperty(key)) {
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

                    is_preset = true;

                    // 所有导航项设置为未激活状态
                    var navs = document.querySelectorAll('.nav p');
                    navs.forEach(function(item) {
                        item.setAttribute("data-active", "false");
                    });

                    // 设置当前点击的导航项为激活状态
                    nav.setAttribute("data-active", "true");

                    params = {...value};
                    load();

                    // document.getElementById('value_name').innerHTML = value_name[key];
                });
            })(key, customizes[key]);
        }
    }
    init_nav();
})();