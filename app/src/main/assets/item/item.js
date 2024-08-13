let urlParams = new URLSearchParams(window.location.search);
var item_name = urlParams.get("name");
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

document.getElementById("item-name").innerText = item_name;

var loaded = {
    "infos" : false,
    "ai" : false,
    "news" : false,
}

var item_id = 0;
function load_item_id(){
    item_id = JSON.parse(all_resps["item_infos"]).data.list[0].goodsId;
}
// 先尝试请求csgoob获取item_id


function load_ai(){

}

function load_news(){

}

function switch_content(nav){
    document.getElementById("container_infos").style.display = "none";

    var dict = {
        "infos" : load_infos,
        "ai" : load_ai,
        "news" : load_news,
    }

    var navs = document.getElementById("nav_menu").children;
    for (var i = 0;i < navs.length;i++){
        navs[i].style.color = "rgba(29, 29, 31, 0.45)";
    }

    document.getElementById("nav_"+nav).style.color = "rgba(29, 29, 31)"

    document.getElementById("container_" + nav).style.display = "flex";

    if (!loaded[nav]){
        dict[nav]();
        loaded[nav] = true;
    }
}

switch_content("infos");
document.getElementById("nav_infos").addEventListener('click', function() {
    switch_content("infos");
});
document.getElementById("nav_ai").addEventListener('click', function() {
    switch_content("ai");
});
document.getElementById("nav_news").addEventListener('click', function() {
   switch_content("news");
});

document.getElementById("back").addEventListener('click', function() {
    Jump.jump("index","");
});