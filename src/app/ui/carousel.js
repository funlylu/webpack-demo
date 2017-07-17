var $ = require('jquery');
var carsouleHtml=require("../../html/carsoule.tpl.html");
require('../../css/carousel.css');

var Carousel=function () {
 var _=this;
  _.opts={
  	time:1000
  };
  _.$carousel=null;
  _.listNum=null;
  _.timer=null;
 
  function _carousel() {
   var cItem=_.$carousel.find(".slide-flag .item.active"),
       i=parseInt(cItem.attr("data-i")),
       cImg=_.$carousel.find(".slide-list>.list").eq(i),
       next= i+1>=_.listNum? 0:i+1;
      
     console.log(next);
      // change 
      cItem.removeClass("active");
      cImg.removeClass("active");

      _.$carousel.find(".slide-flag .item").eq(next).addClass('active');
      _.$carousel.find(".slide-list>.list").eq(next).addClass('active');
  }
 _.init=function (carousel,opts) {
     _.$carousel=carousel;
     _.opts = $.extend(_.opts, opts);
     _.listNum=_.$carousel.find(".slide-list>.list").length;

  	//add event
    _.timer = setInterval(function() {_carousel();},_.opts.time);
    
    // hover timer
    _.$carousel.find('.slide-list').hover(function() {
    	console.log("hover-----");
 		clearInterval(_.timer);
 		_.timer=null;
 	}, function() {
    	console.log("out----");
    	if (_.timer===null) {
			_.timer = setInterval(function() {
			_carousel();
			console.log();
			},_.opts.time);
	  	}
 	});

 	// nav click event
 	 _.$carousel.find('.slide-flag').on('click', '.item', function(event) {
 	 	event.preventDefault();
 	 	/* Act on the event */
 	 	 var cItem=_.$carousel.find(".slide-flag .item.active"),
             cImg=_.$carousel.find(".slide-list>.list.active");
              // change 
		      cItem.removeClass("active");
		      cImg.removeClass("active");

		      $(this).addClass('active');
		      var i=parseInt($(this).attr("data-i"));
		      _.$carousel.find(".slide-list>.list").eq(i).addClass('active');
 	 });
  };
};
//  Create a jQuery plugin
module.exports = function(o) {
    return this.each(function(index) {
        var me = $(this);
        me.html(carsouleHtml);
        var instance = (new Carousel).init(me, o);
    });
};
