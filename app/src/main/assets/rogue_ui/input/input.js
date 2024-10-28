function ru_input_init(element){
    element.className = "ru_input";

    var input = ru_ie({
        tag : "input",
        type : "text",
    },element);

    var label = ru_ie({
        tag : "label",
    },element);

    // 当 label 被点击时，使 input 聚焦
    label.addEventListener('click', function() {
        input.focus();
    });

    // 用于获取当前值,有两种模式
    element.value = function(func = () => {}, delay = 300) {
        // 不传入函数,就直接返回当前值
        if (func.toString() === (() => {}).toString()) {
            return input.value;
        }

        // 传入函数,就构建防抖(防抖delay可调),当内容改变时,将当前值传入函数
        let debounceTimer; // 防抖计时器
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func(input.value);
            }, delay);
        });
    };

    // 修改hint提示
    element.hint = function(hint) {
        // 如果hint为空,就取消
        if (hint === ""){
            element.setAttribute("hintable", "false");
            element.setAttribute("hint", hint);
            return 
        }

        element.setAttribute("hintable", "true");

        element.setAttribute("hint", hint);

        label.innerHTML = hint;
    };

    // 尝试获取hint参数
    var hint_text = element.getAttribute('hint');
    if (hint_text) {
        // 如果之前hint-label被屏蔽就移除屏蔽
        element.setAttribute("hintable", "true");

        // hint文本显示
        element.hint(hint_text);
    } else {
        // 没有hint就禁止显示hint
        element.setAttribute("hintable", "false");
    }

    // 当input被聚焦
    input.addEventListener('focus', () => {
        element.setAttribute("focus", "true");
    });

    // 当input失去焦点
    input.addEventListener('blur', () => {
        var value = element.value();
        if (value.trim() !== ""){
            // 当其中有内容,禁止收回
            element.setAttribute("focus", "true");
        }else {
            // 当其中无内容,允许收回
            element.setAttribute("focus", "false");
        }
    });

    // 遮罩使用切换
    element.mask = function(){
        var mask = element.getAttribute('mask');

        if (!mask) {
            element.setAttribute("mask", 'false');
            return
        }

        if (mask !== "true"){
            input.type = "password";
            element.setAttribute("mask", 'true');
        }else {
            input.type = 'text';
            element.setAttribute('mask','false')
        }
    }
    element.mask()

    // 检查内容是否合法
    element.check = function(value = ""){
        if (value === ""){
            value = input.value;
        }

        var check = element.getAttribute('check');

        if (!check) {
            element.setAttribute("alert", "false");
            return true
        }

        if (value === ""){
            element.setAttribute("alert", "false");
            return null
        }

        // 预设的一些匹配
        var regexs = {
            only_number : "^\d+$",
            email : "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        }

        if (check in regexs) {
            check = regexs[check]; // 将 check 更新为对应的正则表达式
        } 

        check = new RegExp(check);
        
        // 进行检查
        if (!check.test(value)) {
            element.setAttribute("alert", "true");
            return false
        }else {
            element.setAttribute("alert", "false");
            return true
        }
    }

    // 自动检查
    element.value(function(value){
        element.check(value)
    },500);


}