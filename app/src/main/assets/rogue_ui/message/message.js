var r_u_message_list = "";

function ru_message_init(element){
    element.remove();

    var element = ru_ie({
        tag : "r_u_message_list",
        className : "ru_message_list"
    },document.body);

    r_u_message_list = element;
}

// 用来发消息的方法
function ru_msg(params) {
    var text = params.text;
    if (text === undefined){
        text = "";
    }

    var msg_element = ru_ie({
        tag : "ru_button",
        attribute: {
            text : text,
            l_t_a : "false",
            t_a : "false"
        }
    },r_u_message_list);


    let timeout_id;
    let is_paused = false;

    var time = params.time;
    if (time === undefined){
        time = 5000;
    }
    
    function start_timeout() {
        timeout_id = setTimeout(function () {
            msg_element.setAttribute("pop_out", "true");
    
            // 在 0.3 秒后移除属性
            setTimeout(function () {
                msg_element.remove();
            }, 300);
        }, time);
    }
    
    function pause_timeout() {
        clearTimeout(timeout_id);
        is_paused = true;
    }
    
    function resume_timeout() {
        is_paused = false;
        start_timeout();
    }
    
    msg_element.addEventListener("touchstart", function () {
        if (is_paused) {
            msg_element.removeAttribute("paused");
            // 恢复计时
            resume_timeout();
        } else {
            msg_element.setAttribute("paused", "true");
            clearTimeout(timeout_id);
            is_paused = true;
            time = 1000;
        }
    });
    
    // 启动计时
    start_timeout();
}