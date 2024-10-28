function ru_button_init(element){
    element.className = "ru_button";

    var label = ru_ie({
        tag : "label",
    },element);

    // 设置文本内容
    element.text = function(text){
        label.innerHTML = text
    }

    var text = element.getAttribute('text');
    if (text) {
        element.text(text)
    }

    // 触摸事件
    element.touch = function(func = () => {}){
        // 如果不传入函数，直接触发 touchstart 事件并立即结束触摸
        if (func.toString() === (() => {}).toString()) {
            const touchStartEvent = new Event('touchstart');  // 创建一个 touchstart 事件
            element.dispatchEvent(touchStartEvent);  // 触发 touchstart 事件

            const touchEndEvent = new Event('touchend');  // 创建一个 touchend 事件
            element.dispatchEvent(touchEndEvent);  // 立即触发 touchend 事件
            return;
        }

        // 添加 touchstart 事件监听器
        element.addEventListener('touchstart', function(event) {
            func(event); // 执行传入的处理函数，并将事件对象传递给它
        });
    }

    // 长时间触摸事件
    element.long_touch = function(func = () => {},long_press_time = 500) {
        // 如果传入的 func 是数字，将其视为长按时间
        if (typeof func === 'number') {
            long_press_time = func; // 将长按时间设置为传入的数字
            func = () => {}; // 重置 func 为一个空函数
        }

        if (func.toString() === (() => {}).toString()) {
            // 创建一个 touchstart 事件
            const event = new Event('touchstart');
            // 触发 touchstart 事件
            element.dispatchEvent(event);
    
            // 模拟长按时间
            setTimeout(() => {
                // 创建一个 touchend 事件
                const endEvent = new Event('touchend');
                // 触发 touchend 事件
                element.dispatchEvent(endEvent);
            }, long_press_time);
        }
    
        let long_press_timer;
    
        // 添加 touchstart 事件监听器
        element.addEventListener('touchstart', function(event) {
            // 在 touchstart 时开始计时
            long_press_timer = setTimeout(() => {
                // 长按事件触发
                func(event);
            }, long_press_time);
        });
    
        // 添加 touchend 事件监听器
        element.addEventListener('touchend', function() {
            // 清除计时器，如果没有达到长按时间则不触发长按事件
            clearTimeout(long_press_timer);
        });
    
        // 可选：处理 touchcancel 事件以防止意外触发
        element.addEventListener('touchcancel', function() {
            clearTimeout(long_press_timer);
        });
    };

    // 轻触涟漪动画
    var t_a = element.getAttribute('t_a');
    if (!(t_a && t_a === "false")) {
        element.touch(function(e) {
            const ripple = document.createElement('span'); // 创建涟漪元素
            const rect = element.getBoundingClientRect(); // 获取按钮位置
            const size = Math.max(rect.width, rect.height); // 计算涟漪的大小

            // 使用 touches 获取触摸点的坐标
            const touch = e.touches[0]; // 获取第一个触摸点
            const x = touch.clientX - rect.left - size / 2; // 计算涟漪起始位置
            const y = touch.clientY - rect.top - size / 2;

            ripple.classList.add('ripple'); // 添加涟漪的 CSS 类
            ripple.style.width = ripple.style.height = `${size}px`; // 设置涟漪大小
            ripple.style.left = `${x}px`; // 设置涟漪位置
            ripple.style.top = `${y}px`;

            element.appendChild(ripple); // 将涟漪元素添加到按钮
            ripple.addEventListener('animationend', () => {
                ripple.remove(); // 动画结束后移除涟漪元素
            });
        });
    }

    // 长按提示
    var l_t_a = element.getAttribute('l_t_a');
    if (!(l_t_a && l_t_a === "false")){
        element.long_touch(function(event) {
            element.setAttribute("long_touched", "true");
        
            element.addEventListener('touchend', function() {
                element.setAttribute("long_touched", "false");
            });
        
            // 可选：处理 touchcancel 事件以防止意外触发
            element.addEventListener('touchcancel', function() {
                element.setAttribute("long_touched", "false");
            });
        });
    }
}