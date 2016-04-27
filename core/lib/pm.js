/**
 * web app 基本函数
 * @method
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
var pm = (function() {
  var pm = {};
  pm.init = function() {
    //设置html的font-size， 基准iphone5,分辨率宽度：640
    // document.addEventListener('DOMContentLoaded', function() {
      var html = document.documentElement;
      var windowWidth = html.clientWidth;
      html.style.fontSize = windowWidth / 6.4 + 'px';
    // }, false);
    //绑定返回按钮
    $(".goback").on("click", function() {
      goBack();
    });


  };


  /**-------私有函数--------**/
  /**
   * 返回到上一页
   * @method goBack
   * @return {[type]} [description]
   */
  function goBack() {
    window.history.back();
  }



  return pm;
}())
