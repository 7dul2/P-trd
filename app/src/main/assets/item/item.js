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

var stared = false;
function star_switch(){
    console.log(stared);
    var star = document.getElementById("star");
    if (stared){
        star.children[0].style.display = "none";
        star.children[1].style.display = "";
        star.addEventListener('click', function() {
            stared = false;
            DataBase.executeSQL("DELETE FROM stars WHERE item_name = ?", [item_name]);
            star_switch();
        });
    }else{
        star.children[1].style.display = "none";
        star.children[0].style.display = "";
        star.addEventListener('click', function() {
            stared = true;
            DataBase.executeSQL("INSERT OR IGNORE INTO stars (item_name) VALUES (?)",[item_name]);
            star_switch();
        });
    }
}
var results = DataBase.query("SELECT item_name FROM stars where item_name = ?",[item_name]);
if (results.length != 0){
    stared = true;
}    
star_switch();


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
        navs[i].style.color = "rgba(245,245,247, 0.45)";
    }

    document.getElementById("nav_"+nav).style.color = "rgba(245,245,247)"

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