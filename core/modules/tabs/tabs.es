/**
 * tab切换
 * @method
 * @param  {[type]} obj   那个tab
 * @param  {[type]} index 第几个默认被选中
 * @return {[type]}       [description]
 */
let tabs = (obj=".pz-tabs", index=0) => {
    let self = {};
    self.init = () => {
        getMaxHeight(index);
        $(obj + "> .pz-tabs-menu div").on("tap", function(){
            let o = $(this);
            if (o.hasClass("active")) {
                return;
            } else {
                o.parent().find(".active").removeClass("active");
                o.addClass("active");
                let index = o.index();
                let divitem =   $(obj + " >.pz-tabs-body > div").eq(index);
                $(obj + " >.pz-tabs-body").find(".active").removeAttr("style").removeClass("active");
                divitem.velocity({
                  left:0
                },300,"ease", function() {
                  $(obj + ">.pz-tabs-body").find(".active").removeAttr("style").removeClass("active");
                  divitem.addClass("active");
                });
            }
        });
    }
    /**
     * 控制最大高度
     * @method
     * @param  {[type]} indx [description]
     * @return {[type]}      [description]
     */
    let getMaxHeight = (index) =>{
        let divitem =   $(obj + ">.pz-tabs-body > div");
        let buttonitem =   $(obj + ">.pz-tabs-menu > div");
        $(buttonitem[index]).addClass("active");
        $(divitem[index]).css("left",0).addClass("active");
        let height = 0;
        for(let i=0,l=divitem.length;i<l;i++) {
          height = height > $(divitem[i]).height() ? height : $(divitem[i]).height();
        }
        $(obj + "> .pz-tabs-body").append('<p style="height:'+height+'px"></p>');

    }

    return self;
};
module.exports = tabs;
