function insertElement(attribute,parent){
  var attribute = Object.assign({},attribute);
  var element = document.createElement(attribute.tag);
  // 创建element对象
  delete attribute.tag;
  // 删除标签名称
  if (attribute.attribute !== undefined){
      for (var i in attribute.attribute) {
          element.setAttribute(i,attribute.attribute[i]);}
      delete attribute.attribute;}
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
      var events = {'onHover':''};
      var style_str = "";
      for (var i in attribute.style) {
          if (i in events !== true){
              element.style[i] = attribute.style[i];
              style_str += i + ":" + attribute.style[i] + ";";
          }else{
              for (var t in attribute.style[i]){
                  events[i] += t + ":" + attribute.style[i][t] + ";"
              }
          }
      }
      delete attribute.style;
  }
  // 设置style

  return(element);
  // 返回 element对象
}// 用于添加element元素的函数
var _ie = insertElement;// 简写