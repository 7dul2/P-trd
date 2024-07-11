


function anim(){
    // 创建时间轴
    var tl = gsap.timeline();
    // 第一个动画，假设你要对左侧的元素进行动画
    tl.to("#left", {duration: 0.8, opacity: 1, x: 0});
    // 在第一个动画开始后的0.1秒后开始第二个动画
    tl.to("#right", {duration: 0.8, opacity: 1,x :0}, "-=0.1");
    // 将 #animation_loading 元素的初始位置设置为默认位置下方
    tl.set("#animation_loading", {opacity: 0});
    // 在动画开始时将 #animation_loading 元素的透明度调整为 1，并淡入和向上移动至默认位置
    tl.to("#animation_loading", {duration: 0.8, opacity: 1}, "-=0.1");
    // 将 #load 元素透明度渐变为0，同时缩小至0，延迟1.5秒后执行
    tl.to("#load", {duration: 0.5, opacity: 0, scale: 1.5, delay: 1.5});
    var anim_loading_data = `{"v":"5.12.2","fr":60,"ip":0,"op":180,"w":640,"h":640,"nm":"合成 1","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"“loading/icons”轮廓 3","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10,"x":"var $bm_rt;\n$bm_rt = thisComp.layer('\\u201Cloading/icons\\u201D轮廓').transform.rotation;"},"p":{"a":0,"k":[320,320,0],"ix":2,"l":2},"a":{"a":0,"k":[32,32,0],"ix":1,"l":2},"s":{"a":0,"k":[1000,1000,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-12.15],[12.15,0],[0,12.15],[-12.15,0]],"o":[[0,12.15],[-12.15,0],[0,-12.15],[12.15,0]],"v":[[22,0],[0,22],[-22,0],[0,-22]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.250980407,0.411764711142,0.890196084976,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":4,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[32,32],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":65,"ix":1,"x":"var $bm_rt;\n$bm_rt = $bm_sum(thisComp.layer('\\u201Cloading/icons\\u201D轮廓').content('修剪路径 1').end, 5);"},"e":{"a":0,"k":95,"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":180,"st":0,"ct":1,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"“loading/icons”轮廓","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":180,"s":[-360]}],"ix":10},"p":{"a":0,"k":[320,320,0],"ix":2,"l":2},"a":{"a":0,"k":[32,32,0],"ix":1,"l":2},"s":{"a":0,"k":[1000,1000,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-12.15],[12.15,0],[0,12.15],[-12.15,0]],"o":[[0,12.15],[-12.15,0],[0,-12.15],[12.15,0]],"v":[[22,0],[0,22],[-22,0],[0,-22]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.250980407,0.411764711142,0.890196084976,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":4,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[32,32],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":0,"s":[20]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.612],"y":[0]},"t":60,"s":[75]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":120,"s":[43]},{"t":180,"s":[20]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":0,"s":[60]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.612],"y":[0]},"t":60,"s":[85.643]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.604],"y":[0]},"t":120,"s":[73]},{"t":180,"s":[60]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":180,"st":0,"ct":1,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"“loading/icons”轮廓 2","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10,"x":"var $bm_rt;\n$bm_rt = thisComp.layer('\\u201Cloading/icons\\u201D轮廓').transform.rotation;"},"p":{"a":0,"k":[320,320,0],"ix":2,"l":2},"a":{"a":0,"k":[32,32,0],"ix":1,"l":2},"s":{"a":0,"k":[1000,1000,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,-12.15],[12.15,0],[0,12.15],[-12.15,0]],"o":[[0,12.15],[-12.15,0],[0,-12.15],[12.15,0]],"v":[[22,0],[0,22],[-22,0],[0,-22]],"c":true},"ix":2},"nm":"路径 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0.250980407,0.411764711142,0.890196084976,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":4,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[32,32],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"组 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":0,"k":15,"ix":2,"x":"var $bm_rt;\n$bm_rt = $bm_sub(thisComp.layer('\\u201Cloading/icons\\u201D轮廓').content('修剪路径 1').start, 5);"},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":180,"st":0,"ct":1,"bm":0}],"markers":[],"props":{}}`;
    var anim_loading = JSON.parse(anim_loading_data.replace(/[\x00-\x1F\x7F-\xFF]/g, ''));
    var lottieContainer = document.getElementById('animation_loading');
    // 使用lottie.loadAnimation()方法加载JSON文件并将其应用到指定的容器中
    lottie.loadAnimation({
          container: lottieContainer, // 容器元素
          renderer: 'svg', // 渲染器类型，可以是'canvas'或'svg'
          loop: true, // 是否循环播放动画
          autoplay: true, // 是否自动播放动画
          animationData: anim_loading,
          speed: 2,
    });
    // 开始时间轴
    tl.play();
}
setTimeout(function() {
    anim()
}, 1000);

setTimeout(function() {
    Jump.jump("index","");
}, 5000);
