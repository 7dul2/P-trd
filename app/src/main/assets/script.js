var Version = "Alpha.1.0.5";
function update_check(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://p-trd.cn/api/version",true);
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var resp = JSON.parse(xhr.responseText).data;
            if (resp.version != Version){
                show_new_version(resp)
            }
        }
    }
}
function show_new_version(resp){
    console.log(resp);
    pop_up();

    _ie({
        tag : "p",
        innerText : "发现新版本",
        style : {
            fontSize : "18px",
            fontWight : "600",
            color : "rgba(245,245,247)",
        },
    },document.getElementById("pop_up_container"))

    _ie(
        {
        tag : 'div',
        style : {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '15px',
            alignItems: 'center'
        },
        children : [
            {
                tag : 'div',
                children : [
                    {
                        tag : "p",
                        innerText : "当前版本：",
                        style : {
                            color : "rgba(245,245,247, 0.5)",
                        }
                    },
                    {
                        tag : "p",
                        innerText : Version,
                        style : {
                            color : "rgba(245,245,247)",
                            fontSize : "16px",
                            fontWight : 600
                        }
                    },
                ],
                style : {
                    display: 'flex',
                    alignItems: 'center'
                }
            },
            {
                tag : "p",
                innerText : "→",
                style : {
                    color : "rgba(245,245,247, 0.5)",
                }
            },
            {
                tag : 'div',
                children : [
                    {
                        tag : "p",
                        innerText : "最新版本：",
                        style : {
                            color : "rgba(245,245,247, 0.5)",
                        }
                    },
                    {
                        tag : "p",
                        innerText : resp.version,
                        style : {
                            color : "rgba(245,245,247)",
                            fontSize : "16px",
                            fontWight : 600
                        }
                    }
                ],
                style : {
                    display: 'flex',
                    alignItems: 'center'
                }
            },
        ]
    },document.getElementById("pop_up_container"));

    _ie({
        tag : "textarea",
        value : resp.bulletin,
        style : {
            fontSize: '18px',
            color: 'rgb(245, 245, 247)',
            backgroundColor: 'rgb(29, 29, 31)',
            border: 'none',
            width: '100%',
            height: '10rem',
            marginTop: '5%'
        },
    },document.getElementById("pop_up_container"));

    _ie({
        tag : 'div',
        children : [
            {
                tag : "p",
                id : "btn_refuse",
                innerText : "拒绝"
            },
            {
                tag : "p",
                id : "btn_update",
                innerText : "更新"
            }
        ], 
        style : {
            display: 'flex',
            color: 'white',
            justifyContent: 'space-between',
            width: '60%',
            margin: '0 20%',
            fontSize: '18px',
            fontWeight: '600'
        }
    },document.getElementById("pop_up_container"));

    document.getElementById("btn_refuse").addEventListener('click', function() {
        pop_up()
    });
    document.getElementById("btn_update").addEventListener('click', function() {
        Jump.jump("web","http://p-trd.cn/download");
    });

}

function insertElement(attribute,parent){
    var attribute = Object.assign({},attribute);
    var element;
    // 判断是否是SVG元素，如果是则用createElementNS创建
    if (attribute.tag === 'svg' || attribute.tag === 'path') {
        element = document.createElementNS('http://www.w3.org/2000/svg', attribute.tag);
    } else {
        element = document.createElement(attribute.tag);
    }
    // 创建element对象
    delete attribute.tag;
    // 删除标签名称
    if (attribute.attribute !== undefined){
        for (var i in attribute.attribute) {
            element.setAttribute(i,attribute.attribute[i]);}
        delete attribute.attribute;
    }
    // 设置其他自定义参数
    if (attribute.children !== undefined){
        for (var i in attribute.children) {
            insertElement(attribute.children[i],element)
        }
        delete attribute.children;
    }
    for (var key in attribute) {
        if (key !== 'style'){
            element[key] = attribute[key];
        }
    }
    // 将其他要赋值的赋值
    parent.appendChild(element);
    // 将element对象添加
  
    if (attribute.style !== undefined){
        for (var i in attribute.style) {
            element.style[i] = attribute.style[i];
        }
    }
    // 设置style
  
    return(element);
    // 返回 element对象
  }// 用于添加element元素的函数
var _ie = insertElement;// 简写


window.onload = function() {
    // 创建 pop_up
    _ie({
        tag: "div",
        id: "pop_up",
        style: {
            position: 'fixed',
            width: '87%',
            height: '50%',
            bottom: '-50%', // 初始位置在屏幕下方
            left: '-1px',
            backgroundColor: 'rgb(29, 29, 31)',
            zIndex: '999',
            borderRadius: '2rem 2rem 0px 0px',
            padding: '5% 7%',
            boxShadow: 'rgba(245, 245, 247, 0.1) 0px 0px 20px 0px',
            display: 'none',
            justifyContent: 'flex-start',
            flexDirection: 'column'
        },
        children: [
            {
                tag : "div",
                id: "drag_handle",
                style : {
                    width: '100%',
                    height: '5%',
                    marginTop: '-5%',
                    display: 'flex',
                    justifyContent: 'center'
                },
                children : [
                    {
                        tag: "div",
                        style: {
                            backgroundColor: 'rgba(245, 245, 247, 0.6)',
                            width: '10%',
                            height: '16%',
                            borderRadius: '15px',
                            marginTop: '2%',
                            cursor: 'pointer'
                        }
                    }
                ]
            },
            {
                tag : "div",
                id : "pop_up_container",
                style : {
                    width : "100%",
                    height : "100%",
                },
            }
        ]
    }, document.body);

    // 创建遮罩层
    var mask = _ie({
        tag: "div",
        id: "pop_up_mask",
        style: {
            position: 'fixed',
            width: '101%',
            height: '101%',
            top: '-1px',
            left: '-1px',
            backgroundColor: 'rgba(29, 29, 31, 0.8)',
            zIndex: '998',
            display: "none",
        }
    }, document.body);

    mask.addEventListener('click', function() {
        pop_up();
    });

    // 获取元素并添加拖动事件监听器
    var dragHandle = document.getElementById("drag_handle");
    var popUp = document.getElementById("pop_up");
    var startY, initialY;

    dragHandle.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        e.preventDefault();
        startY = e.touches[0].clientY; // 获取初始触摸位置
        initialY = parseFloat(getComputedStyle(popUp).bottom);
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function onDrag(e) {
        e.preventDefault();
        let deltaY = e.touches[0].clientY - startY; // 计算触摸移动的距离
        let newY = initialY - deltaY;
        
        if (newY > 0) {
            newY = 0;
        }
    
        popUp.style.bottom = `${newY}px`;
    }
    

    function stopDrag(e) {
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', stopDrag);
        let currentY = parseFloat(getComputedStyle(popUp).bottom);
        if (currentY < 0) {
            gsap.to(popUp, {duration: 0.3, bottom: '-60%', ease: "power2.inOut"});
            pop_up_mask();
            pop_up_display = false;
        }
    }
}
var pop_up_display = false;
function pop_up_mask() {
    var mask = document.getElementById("pop_up_mask");
    if (!pop_up_display) {
        mask.style.display = "flex";
        gsap.to(mask, {duration: 0.3, opacity: 1, ease: "power2.inOut"});
    } else {
        gsap.to(mask, {duration: 0.3, opacity: 0, ease: "power2.inOut", onComplete: function() {
            mask.style.display = "none";
        }});
    }
}
function pop_up() {
    var e = document.getElementById("pop_up");
    if (!pop_up_display) {
        document.getElementById("pop_up_container").innerHTML = "";
        e.style.display = "flex";
        gsap.to(e, {duration: 0.3, bottom: '0', ease: "power2.inOut"});
    } else {
        gsap.to(e, {duration: 0.3, bottom: '-50%', ease: "power2.inOut", onComplete: function() {
            e.style.display = "none";
        }});
    }
    pop_up_mask();
    pop_up_display = !pop_up_display;
}






var anim_loading_data = `{"v":"5.12.2","fr":60,"ip":0,"op":180,"w":640,"h":640,"nm":"合成 1","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"“loading/icons”轮廓 3","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10,"x":"var $bm_rt;\n$bm_rt = thisComp.layer('\\u201Cloading/icons\\u201D轮廓').transform.rotation;"},"p":{"a":0,"k":[320,320,0],"ix":2,"l":2},"a":{"a":0,"k":[32,32,0],"ix":1,"l":2},"s":{"a":0,"k":[1000,1000,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-12.15],[12.15,0],[0,12.15],[-12.15,0]],"o":[[0,12.15],[-12.15,0],[0,-12.15],[12.15,0]],"v":[[22,0],[0,22],[-22,0],[0,-22]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.250980407,0.411764711142,0.890196084976,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":4,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[32,32],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":65,"ix":1,"x":"var $bm_rt;\n$bm_rt = $bm_sum(thisComp.layer('\\u201Cloading/icons\\u201D轮廓').content('修剪路径 1').end, 5);"},"e":{"a":0,"k":95,"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":180,"st":0,"ct":1,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"“loading/icons”轮廓","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":180,"s":[-360]}],"ix":10},"p":{"a":0,"k":[320,320,0],"ix":2,"l":2},"a":{"a":0,"k":[32,32,0],"ix":1,"l":2},"s":{"a":0,"k":[1000,1000,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-12.15],[12.15,0],[0,12.15],[-12.15,0]],"o":[[0,12.15],[-12.15,0],[0,-12.15],[12.15,0]],"v":[[22,0],[0,22],[-22,0],[0,-22]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.250980407,0.411764711142,0.890196084976,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":4,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[32,32],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":0,"s":[20]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.612],"y":[0]},"t":60,"s":[75]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":120,"s":[43]},{"t":180,"s":[20]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":0,"s":[60]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.612],"y":[0]},"t":60,"s":[85.643]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":120,"s":[73]},{"t":180,"s":[60]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":180,"st":0,"ct":1,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"“loading/icons”轮廓 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10,"x":"var $bm_rt;\n$bm_rt = thisComp.layer('\\u201Cloading/icons\\u201D轮廓').transform.rotation;"},"p":{"a":0,"k":[320,320,0],"ix":2,"l":2},"a":{"a":0,"k":[32,32,0],"ix":1,"l":2},"s":{"a":0,"k":[1000,1000,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-12.15],[12.15,0],[0,12.15],[-12.15,0]],"o":[[0,12.15],[-12.15,0],[0,-12.15],[12.15,0]],"v":[[22,0],[0,22],[-22,0],[0,-22]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.250980407,0.411764711142,0.890196084976,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":4,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[32,32],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":0,"k":15,"ix":2,"x":"var $bm_rt;\n$bm_rt = $bm_sub(thisComp.layer('\\u201Cloading/icons\\u201D轮廓').content('修剪路径 1').start, 5);"},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":180,"st":0,"ct":1,"bm":0}],"markers":[],"props":{}}`;
var anim_loading = JSON.parse(anim_loading_data.replace(/[\x00-\x1F\x7F-\xFF]/g, ''));





var _items_ = "";
function load_items(){
    _items_ = DataBase.query("SELECT * FROM items",[]).trim().split('\n').map(item=>item.split(','));
}
load_items();
// 匹配buff_id,传入hash_name或者name都可以
function match_id(name,market){
    for (const item of _items_) {
        if (item[0] == name || item[1] == name){
            if (market == "buff"){
                return item[2]
            }
            if (market == "yyyp"){
                return item[3]
            }
        }
    }
    return 0
}