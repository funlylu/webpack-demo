var $ = require('jquery');
var headerHtml=require("../../html/header.tpl.html");
require("../../css/header.css");

var Header = function() {
    this.opts = {
        type: 0, //0-Responsive,1-static,2-fixed
        active:".home"//active item
    };
    this.$h = false;
    this.fixedHeader = false;
    this.staticHeader = false;
    var _ = this;

    // scroll event
    function scrollEventHandle() {
        var scrolltop = $(window).scrollTop(),
            staticH = _.staticHeader.height();

        if (scrolltop > staticH) {
            _.staticHeader.hide();
            _.fixedHeader.show();
        } else {
            _.staticHeader.show();
            _.fixedHeader.hide();
        }
    }
    // init
    _.init = function(h, opts) {
        _.$h = h;
        _.fixedHeader = _.$h.find(".fixed");
        _.staticHeader = _.$h.find(".static");
        _.opts = $.extend(_.opts, opts);
        
        console.log(_.opts.active);
        _.$h.find(".nav-list").find(_.opts.active).addClass("active");

        switch (_.opts.type) {
            case 1:
                _.staticHeader.show();
                _.fixedHeader.hide();
                break;
            case 2:
                _.staticHeader.hide();
                _.fixedHeader.show();
                break;
            default:
                _.staticHeader.show();
                _.fixedHeader.hide();
                $(window).scroll(scrollEventHandle);
        }
    }
};

//  Create a jQuery plugin
module.exports = function(o) {
    //  Enable multiple-slider support
    return this.each(function(index) {
        var me = $(this);
         me.html(headerHtml);
        var instance = (new Header).init(me, o);
    });
};
