<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_137970_p1tpzmomxp9cnmi.css">
    <link rel='mask-icon' href="https://raw.githubusercontent.com/ElemeFE/element/dev/examples/assets/images/element-logo-small.svg" color="#409EFF">
    <link rel="stylesheet" href="//shadow.elemecdn.com/npm/highlight.js@9.3.0/styles/color-brewer.css">
    <title>Element - The world's most popular Vue UI framework</title>
    <meta name="description" content="Element3，一套为开发者、设计师和产品经理准备的基于 Vue 3.0 的桌面端组件库" />
  </head>
  <body>
    <script>
      if (!window.Promise) {
        document.write('<script src="//cdn.jsdelivr.net/npm/es6-promise@4.1.1/dist/es6-promise.min.js"><\/script><script>ES6Promise.polyfill()<\/script>')
      }
    </script>
    <div id="app"></div>
    <% if (process.env.NODE_ENV === 'production') { %>
      <script src="//shadow.elemecdn.com/npm/vue@2.5.21/dist/vue.runtime.min.js"></script>
      <script src="//shadow.elemecdn.com/npm/vue-router@3.0.1/dist/vue-router.min.js"></script>
      <script src="//shadow.elemecdn.com/app/element/highlight.pack.b1f71b31-3c07-11e9-ba1a-55bba1877129.js"></script>
    <% } %>
  </body>
  <% if (process.env.NODE_ENV === 'production') { %><script>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?6a0d9f308914e36537ea58cf79904414";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>


<% } %>

</html>
