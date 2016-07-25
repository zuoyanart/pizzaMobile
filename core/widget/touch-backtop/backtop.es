/**
 *返回顶部
 */
let backtop = (() => {
    let self = {};
    self.init = (obj = ".pz-backtop") => {
        //返回顶部按钮点击事件
        $(obj).on("tap", function() {
            $(obj).css("right", "-500px");
            $(".pz-main").velocity("scroll", {
                duration: 500,
                easing: "ease-in-out",
                "complete": () => {
                    $("body").scrollTop(0);
                }
            });
        });
        //监听滚动事件
        window.onscroll = (e) => {
            let top = $("body").scrollTop();
            console.log(top);
            if (top > 500) {
                $(obj).removeAttr("style");
            } else {
                $(obj).css("right", "-500px");
            }
        }
    }

    return self;
}());
module.exports = backtop;
