// 用于插入元素的方法
var ru_ie = function(attribute,parent){
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
}



// 获取当前路径
var script_element = document.getElementById('rogue_ui');
var current_path = script_element.src.substring(0, script_element.src.lastIndexOf('/') + 1); 



// 插入总样式
ru_ie({
    tag : "link",
    attribute: {
        rel : "stylesheet",
        href  : current_path + "rogue_ui.css"
    }
}, document.head);

// 存储已加载的资源，防止重复加载
var loaded_resources = {};

// 遍历所有找到的 ru_ 标签，动态加载对应资源
function load_resources_for_element(element) {
    var tag_name = element.tagName.toLowerCase().replace("ru_", "");
    console.log(`Processing element: ${tag_name}`);

    var css_name = current_path + tag_name + "/" + tag_name + ".css";
    var js_name = current_path + tag_name + "/" + tag_name + ".js";

    // 输出路径
    console.log(`CSS Path: ${css_name}`);
    console.log(`JS Path: ${js_name}`);

    // 动态加载 CSS 文件
    if (!loaded_resources[css_name]) {
        console.log(`Loading CSS: ${css_name}`);
        ru_ie({
            tag: "link",
            attribute: {
                rel: "stylesheet",
                href: css_name
            }
        }, document.head);
        loaded_resources[css_name] = true; // 标记为已加载
    }

    // 动态加载 JS 文件
    function loadJS(src) {
        return new Promise((resolve, reject) => {
            if (loaded_resources[src]) {
                // 如果已经加载过，直接 resolve
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.onload = () => {
                loaded_resources[src] = true; // 加载成功后标记为已加载
                resolve(); // 解析 Promise
            };
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${src}`)); // 加载失败
            };
            document.head.appendChild(script);
        });
    }

    // 加载 JS 文件并初始化
    loadJS(js_name)
        .then(() => {
            // 确保对应的初始化函数存在后再调用
            const initFunction = window["ru_" + tag_name + "_init"];
            if (typeof initFunction === 'function') {
                initFunction(element); // 调用初始化函数
            } else {
                console.warn(`Initialization function ru_${tag_name}_init is not defined.`);
            }
        })
        .catch(error => {
            console.error(error.message);
        });
}

// 使用 MutationObserver 监听 DOM 的变化
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase().startsWith('ru_')) {
                // 检查是否是以 ru_ 开头的标签
                load_resources_for_element(node);
            }
        });
    });
});

var component_names = ['input','button','message'];

// 确保在 DOMContentLoaded 后调用 observe
document.addEventListener("DOMContentLoaded", function() {
    // 获取所有以 'ru_' 开头的标签
    component_names.forEach(function(tag_name) {
        var element = document.querySelectorAll(`ru_${tag_name}`);
        if (element) {
            element.forEach(load_resources_for_element);
        }
    });

    // 开始监听 document.body 里的节点变化
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        console.error("document.body is not available yet.");
    }
});