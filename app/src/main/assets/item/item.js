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

var item_name = new URLSearchParams(window.location.search).get("name");
document.getElementById("item_name").innerText = item_name;

(function(){
    const copyText = document.getElementById("item_name");
    let originalText = copyText.innerText;
    let pressTimer;
    copyText.addEventListener("touchstart", function(event) {
        event.stopPropagation();
        pressTimer = setTimeout(() => {
            Clipboard.copyToClipboard(originalText);
            gsap.timeline()
                .to(copyText, { duration: 0.3, opacity: 0 })
                .call(() => {
                    copyText.innerText = "已复制";
                })
                .to(copyText, { opacity: 1, duration: 0.3 })
                .to(copyText, { opacity: 0.5, repeat: 1, yoyo: true, duration: 0.2 })
                .to(copyText, { opacity: 0, duration: 0.3, delay: 0.3 })
                .call(() => {
                    copyText.innerText = originalText;
                })
                .to(copyText, { opacity: 1, duration: 0.3 });
        }, 500);
    });
    copyText.addEventListener("touchend", function(event) {
        event.stopPropagation();
        clearTimeout(pressTimer);
    });
    copyText.addEventListener("touchmove", function(event) {
        event.stopPropagation();
        clearTimeout(pressTimer);
    });
}())

lottie.loadAnimation({
    container: document.getElementById('loading'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: anim_loading,
    speed: 2,
});

var index_now = "";
function switch_content(index){
    if (index_now === index){
        return
    }else {
        index_now = index;
    }

    var navs = document.getElementById("nav").children;

    for (let i = 0; i < navs.length; i++){
        var nav = navs[i];
        nav.setAttribute("data-active", "false");
    }

    navs[index].setAttribute("data-active", "true");

    document.getElementById("container").innerHTML = "";

    document.getElementById('loading').style.display = "";

    _ie({
        tag : "script",
        src : "item_" + (index+1) + ".js"
    },document.getElementById("container"));
}

var navs = document.getElementById("nav").children;
for (let i = 0; i < navs.length; i++){
    var nav = navs[i];
    nav.addEventListener('click', function() {
        switch_content(i);
    });
}
switch_content(0);

document.getElementById("back").addEventListener('click', function() {
    Jump.goBack();
});

function is_stared(){
    var results = DataBase.query("SELECT item_name FROM stars where item_name = ?",[item_name]);
    if (results.length != 0){
        return true
    }
    return false
}
function star_update(){
    var div = document.getElementById("star");
    div.innerHTML = "";
    if (is_stared()){
        _ie({
            tag: 'svg',
            attribute : {
                width: '1.3rem',
                viewBox: '64 64 896 896',
            },
            style : {
                fill : "var(--chart-color-3)"
            },
            children: [
                {
                    tag: 'path',
                    attribute : {
                        d: 'M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z'
                    }
                }
            ]
        },div);
    }else {
        _ie({
            tag: 'svg',
            attribute : {
                width: '1.3rem',
                viewBox: '64 64 896 896',
            },
            children: [
                {
                    tag: 'path',
                    attribute : {
                        d: 'M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z'
                    }
                }
            ]
        },div);
    }
}
star_update();
document.getElementById("star").addEventListener('click', function() {
    if (is_stared()){
        DataBase.executeSQL("DELETE FROM stars WHERE item_name = ?", [item_name]);
    }else{
        DataBase.executeSQL("INSERT OR IGNORE INTO stars (item_name) VALUES (?)",[item_name]);
    }
    star_update()
});


