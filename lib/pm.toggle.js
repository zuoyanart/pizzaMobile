/**
 * toggle按钮
 * @method
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
var pm = (function(self) {
  /**
   * 开关按钮方法
   * @method function
   * @param  {[type]}   selector [description]
   * @param  {Function} cb       [description]
   * @return {[type]}            [description]
   */
  self.toggle = function(elem, selector, cb) {
      if (typeof(selector) == "function") {
        cb = selector;
        $(elem).on('swipeLeft', function(event) {
          if (toggleDefOper("left", $(this))) {
            cb($(this), "left");
          }
        });
        $(elem).on('swipeRight', function() {
          if (toggleDefOper("right", $(this))) {
            cb($(this), "right");
          }
        });
      } else {
        $(elem).on('swipeLeft', selector, function() {
          if (toggleDefOper("left", $(this))) {
            cb($(this), "left");
          }
        });
        $(elem).on('swipeRight', selector, function() {
          if (toggleDefOper("right", $(this))) {
            cb($(this), "right");
          }
        });
      }
    }
    /**
     * 开关按钮默认操作
     * @method toggleDefOper
     * @param  {[type]}      target [description]
     * @param  {[type]}      obj    [description]
     * @return {[type]}             [description]
     */
  function toggleDefOper(target, obj) {
    var validSwipe = false; //是否是有效的滑动
    var toggleClass = obj.attr("class");
    if (toggleClass.indexOf(" active") > -1 && target === 'left') { //包含active
      validSwipe = true;
      obj.removeClass("active");
    } else if (toggleClass.indexOf(" active") == -1 && target === 'right') {
      validSwipe = true;
      obj.addClass("active");
    }
    return validSwipe;
  }



  return self;
}(pm));
