define('slider/slider', function(require, exports, module) {

  /**
   * 图片轮转
   * @param  {[type]} ( [description]
   * @return {[type]}   [description]
   */
  "use strict";
  
  var slider = function slider(options) {
      var self = {};
      var loop = null;
      var option = {
          obj: ".pz-slider",
          interval: 3000 };
      //时间间隔
      $.extend(option, options);
      var width = $(option.obj).width(); //一屏的宽度
      var lilength = $(option.obj + ">ul>li").length;
      /**
       * 初始化
       * @return {[type]} [description]
       */
      self.init = function () {
          var lis = $(option.obj + ">ul>li");
          $(lis[0]).addClass("active-left");
          $(option.obj + ">ul").append($(lis[0]).clone());
          move();
      };
      /**
       * 移动函数
       * @method
       * @return {[type]} [description]
       */
      var move = function move() {
          $(option.obj + "> ul > .active-left").animate({
              "translateX": -width + "px"
          }, 800, "linear", function () {
              var activeLeft = $(this);
              activeLeft.removeClass("active-left").removeAttr("style");
          });
  
          $(option.obj + "> ul >.active").animate({
              "translateX": -width + "px"
          }, 800, "linear", function () {
              var active = $(this);
              var oli = $(option.obj + ">ol>li");
              var index = active.index();
              if (index < 0 || index > lilength - 1) {
                  index = 0;
              }
              oli.removeClass("active");
              oli.eq(index).addClass("active");
              active.addClass("active-left").removeClass("active").removeAttr("style");
              if (active.next().length == 0) {
                  active.removeClass();
                  $(option.obj + ">ul>li").eq(0).addClass("active-left");
                  $(option.obj + ">ul>li").eq(1).addClass("active");
              } else {
                  active.next().addClass("active");
              }
              setTimeout(function () {
                  move();
              }, option.interval);
          });
      };
  
      return self;
  };
  
  module.exports = slider;
  //# sourceMappingURL=/widget/slider/slider.js.map
  

});
