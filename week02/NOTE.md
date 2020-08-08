- ### 1. 本周学习了浏览器工作原理的总览

  ULR（HTTP）=> HTML(parse) => DOM(CSS Computing) => DOM With CSS(Layout) => DOM With Position(render) => Bitmap

  ### 2. 了解了状态机的基本概念以及js中如何实现一个状态机

  - 状态机分为Moore型和Mealy型状态机

  - js中实现Mealy状态机

  - ```javascript
    //每个函数就是一个状态机
    function state(input){//参数就是输入
        //函数逻辑
        return next;//返回值作为下一个状态，下一个状态也必须是一个函数并且是状态函数
    }
    
    //使用循环调用状态机
    while(input){
        state = state(input);
    }
    ```

    ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

  ### 3. 根据课上练习进一步了解了状态机，以及使用状态机和不适用状态机处理字符串的区别

  ```javascript
  function match(str){
    let state = start;
    for(let s of str){
      state = state(s);
    }
    return state === end;
  }
  function start(s){
    return s === 'a' ? foundA : start;
  }
  function end(s){
    return end;
  }
  function foundA(s){
    return s === 'b' ? foundB: start(s);
  }
  function foundB(s){
    return s === 'a' ? foundA2: start(s);
  }
  function foundA2(s){
    return s === 'b' ? foundB2: start(s);
  }
  function foundB2(s){
    return s === 'a' ? foundA3: start(s);
  }
  function foundA3(s){
    return s === 'b' ? foundB3: start(s);
  }
  function foundB3(s){
    return s === 'x' ? end: foundB2(s);
  }
  ```

  ![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

  ### 4. 学习了HTTP请求中HTTP协议解析

  ### 5. 根据老师讲解编写一个HTTP请求

  - 设计HTTP请求类
  - Content-Type是必须要有的字段且有默认值
  - body是KV格式
  - 不同的Content-Type会影响body的格式

  ### 6.创建connection实现发送请求的异步代码

  - response须分段构造所以用responseParser解析
  - 解析responseText用状态机分析文本结构

  ### 7. 设计ResponseParser和TrunkedBodyParser实现了response和responseBody的解析
