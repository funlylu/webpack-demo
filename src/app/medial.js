require("../css/reset.css");
var $ = require('jquery');
$.fn.header = require('ui/header.js');

var pageMedial=function () {
    var header=$("#header");
    var _init=function () {
    	header.header({type:2,active:".channel-2"});
    };
return{
		init:function() { _init();}
	}
}();

$(document).ready(function() {
	pageMedial.init();
});
