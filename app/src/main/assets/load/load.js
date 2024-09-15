var lottieContainer = document.getElementById('animation_loading');
lottie.loadAnimation({
      container: lottieContainer, // 容器元素
      renderer: 'svg', // 渲染器类型，可以是'canvas'或'svg'
      loop: true, // 是否循环播放动画
      autoplay: true, // 是否自动播放动画
      animationData: anim_loading,
      speed: 2,
});
// load动画

var finished = false;

function finish(){
    if (!finished){
        finished = true;
        var tl = gsap.timeline();
        tl.to("#load", {duration: 0.25, opacity: 0, scale: 1.5});
        tl.play();
    
        setTimeout(function() {
            Jump.jump("index","");
        }, 500);
    }
}

// 获取本地数据库所储存的物品信息
var local_items = DataBase.query("SELECT * FROM items",[]).trim().split('\n');

function fetch_up2date_items(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://p-trd.cn/api/items?pre_check=1",true);
    xhr.timeout = 3000;
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var resp = JSON.parse(xhr.responseText).data;
            console.log(resp,local_items.length,local_items);
            if (resp > local_items.length){
                update_local_items()
            }else{
                finish()
            }
        }else {
            finish()
        }
    }
    xhr.ontimeout = function () {
        finish();
    };
}
function update_local_items(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://p-trd.cn/api/items",true);
    xhr.timeout = 3000;
    xhr.send(null);
    xhr.onreadystatechange = function () {
        var resp = JSON.parse(xhr.responseText).data;
        console.log(resp);
        DataBase.executeSQL("DELETE FROM items", []);
        for (var i = 0; i < resp.length; i++) {
            var item = resp[i];
            var buff_id = item.buff_id;
            var hash_name = item.hash_name;
            var item_name = item.name;
            var yyyp_id = "";
            DataBase.executeSQL(
                "INSERT OR IGNORE INTO items (item_name, hash_name, buff_id, yyyp_id) VALUES (?, ?, ?, ?)", 
                [item_name, hash_name, buff_id, yyyp_id]
            );
        }
        finish()
    }
    xhr.ontimeout = function () {
        finish();
    };
}

fetch_up2date_items()
