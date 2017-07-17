require("../css/reset.css");
require("../css/base.css");
var $ = require('jquery');
$.fn.header = require('ui/header.js');
$.fn.carousel = require('ui/carousel.js');

var pageIndex=function () {
  var header=$("#header");
  var carousel=$("#myCarsoule");
  var _init=function () {
   	  header.header();
   	  carousel.carousel({time:3000});
   };
	return{
		init:function() { _init();}
	}
}();

$(document).ready(function() {
	pageIndex.init();
});
