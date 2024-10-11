// 个性化

// 涨跌颜色
function trend_color_load(){
    var status = load_trend_color_preference();
    if (status == "bearish"){
        document.getElementById("trend_color_text").innerHTML = "<up>红涨</up><down>绿跌</down>"
    }else {
        document.getElementById("trend_color_text").innerHTML = "<up>绿涨</up><down>红跌</down>"
    }
}
trend_color_load();
document.getElementById("trend_color_preference").onclick = function(){
    var status = load_trend_color_preference();
    if (status == "bearish"){
        DataBase.executeSQL("INSERT OR REPLACE INTO config (name, value) VALUES (?, ?)",["trend_color_preference","bullish"]);
    }else {
        DataBase.executeSQL("INSERT OR REPLACE INTO config (name, value) VALUES (?, ?)",["trend_color_preference","bearish"]);
    }
    trend_color_load();
}

// 赞助我们
document.getElementById("sponsor").onclick = function(){
    Jump.jump("web","https://afdian.com/a/7dul2")
}

// 赞助鸣谢
document.getElementById('thanks_sponsors').addEventListener('click', function() {
    window.location.href = 'sponsor.html';
});