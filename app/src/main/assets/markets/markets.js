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

lottie.loadAnimation({
    container: document.getElementById('loading'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: anim_loading,
    speed: 2,
});

var index_now = null;
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

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('loading').style.display = "";

    document.getElementById('mark').style.opacity = 0;

    console.log(index+1,"ie");
    _ie({
        tag : "script",
        src : "markets_" + (index+1) + ".js"
    },document.getElementById("container"));
}

var navs = document.getElementById("nav").children;
for (var i = 0; i < navs.length; i++) {
    (function(index) {
        var nav = navs[index];
        nav.addEventListener('click', function() {
            all_resps = {};
            switch_content(index);
        });
    })(i);
}
switch_content(0);

document.getElementById("back").addEventListener('click', function() {
    Jump.jump("index","");
});
