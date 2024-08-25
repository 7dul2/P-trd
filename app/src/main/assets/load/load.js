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

function finish(){
    var tl = gsap.timeline();
    tl.to("#load", {duration: 0.25, opacity: 0, scale: 1.5});
    tl.play();

    setTimeout(function() {
        Jump.jump("index","");
    }, 500);
}

finish();


