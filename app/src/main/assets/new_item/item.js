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

    document.getElementById('loading').style.opacity = 1;

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
    Jump.jump("index","");
});