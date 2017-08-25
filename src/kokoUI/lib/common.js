/*! 
 * Common Js for entire pages
 * @Lastest Update 2015-09-14 12:20
 */

var app = {
    version: "1.0",
    lang: null
};

/*!
 * jQuery Cookie Plugin v1.4.1
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }
    var config = $.cookie = function(key, value, options) {
        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }
            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
        // Read
        var result = key ? undefined : {};
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }
            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }
        return result;
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };
}));


/*!
 * Custom Jquery extends and methods
 */

(function($) {

    $.fn.tabs = function(options) {
        return this.each(function() {
            var defaults = {
                onSelect: null
            };
            var opts = $.extend(defaults, typeof options == 'object' && options);
            var wrap = $(this);
            var changeTab = function(obj, i) {
                $("li", obj).removeClass("selected");
                $("li:eq(" + i + ")", obj).addClass("selected");
                var tabsBody = $("#" + obj.attr("data-body"));
                if (tabsBody.length > 0) {
                    $(">div", tabsBody).hide();
                    $(">div:eq(" + i + ")", tabsBody).show();
                }
            };
            var setTab = function(obj, opts) {
                $("li", obj).on('click', function() {
                    var cIndex = $("li", obj).index($(this));
                    changeTab(obj, cIndex);
                    if (opts.onSelect) { opts.onSelect($(this).attr("data-value")); };
                });
            };
            if (typeof options == "string") {
                if (options == "reset") { changeTab(wrap, 0); };
            } else {
                var dIndex = $("li", wrap).index($("li.selected", wrap));
                changeTab(wrap, dIndex);
                setTab(wrap, opts);
            };
        });
    };

    $.fn.checkbox2 = function(options) {
        return this.each(function(i) {
            var defaults = {
                check: "default"
            };
            var opts = $.extend(defaults, options);
            var obj = $(this);
            if (obj.attr("data-index")) { $("span[data-type=checkbox2][data-index=" + obj.attr("data-index") + "]").remove() };
            //if ($("span[data-type=checkbox2]",obj.parent()).length>0){ return true; }
            if (opts.check != "default") { obj.prop("checked", opts.check); };
            var level = obj.attr("data-level");
            level = (level) ? "data-level=\"" + level + "\"" : "";
            var isCheck = obj.prop("checked");
            var ele1 = $("<span class=\"checkbox " + ((isCheck) ? "on" : "") + "\" data-type=\"checkbox2\" data-index=\"" + i + "\" data-value=\"" + obj.val() + "\" " + level + " isCheck=\"" + isCheck + "\"></span>");
            obj.before(ele1).attr("data-index", i).hide();
            ele1.on('click', function() {
                obj.click();
                var check = obj.prop("checked");
                if (check) {
                    ele1.addClass("on").attr("isCheck", true);
                } else {
                    ele1.removeClass("on").attr("isCheck", false);
                };

                // Check is Check group
                var checkName = obj.attr('data-check');
                var checkAttr = obj.attr('data-check-attr');
                if (checkName) {
                    $("input[" + checkAttr + "=" + checkName + "]").each(function() {
                        var p = $(this).parent();
                        if (check) {
                            $(".checkbox", p).addClass("on").attr("isCheck", true);
                        } else {
                            $(".checkbox", p).removeClass("on");
                        }
                    });
                } else {
                    if (checkAttr) {
                        var p = $("input[data-check=" + obj.attr(checkAttr) + "]").parent();
                        if ($("input[" + checkAttr + "=" + obj.attr(checkAttr) + "]:checked").length == $("input[" + checkAttr + "=" + obj.attr(checkAttr) + "]").length) {
                            $(".checkbox", p).addClass("on").attr("isCheck", true);
                        } else {
                            $(".checkbox", p).removeClass("on").attr("isCheck", false);
                        }
                    };
                };

            });
        });
    };

    $.fn.radio2 = function(options) {
        return this.each(function() {
            var defaults = {
                mode: 1,
                onVal: 1,
                onCheck: null
            };
            var opts = $.extend(defaults, options);
            var obj = $(this);
            var wrap = obj.parent();
            var name = obj.attr("name");

            $("input[name=" + name + "]", wrap).each(function(i) {
                var t = $(this);
                t.attr({ "data-name": name + "_" + i, "data-index": i }).hide();
                $("label[for=" + t.attr("id") + "]", wrap).attr({ "data-name": name + "_" + i, "data-index": i });
                if (opts.mode == 1) {
                    var isOn = (t.is(":checked")) ? "on" : "";
                    var ele1 = "<span class=\"radio " + isOn + "\" data-name=\"" + name + "_" + i + "\" data-index=\"" + i + "\"></span>";
                    t.before(ele1);
                } else { $("label[for=" + t.attr("id") + "]", wrap).hide(); };
            });

            if (opts.mode == 1) {
                $("span[class^=radio][data-name^=" + name + "],label[data-name^=" + name + "]", wrap).on('click', function() {
                    var cName = $(this).attr("data-name");
                    var cIndex = $(this).attr("data-index");
                    $("span[data-name^=" + name + "]", wrap).removeClass("on");
                    $("span[data-name=" + cName + "]", wrap).addClass("on");
                    $("input[name=" + name + "]", wrap).removeAttr("checked");
                    $("input[name=" + name + "]:eq(" + parseInt(cIndex) + ")", wrap).prop("checked", true);
                    var val = $("input[name=" + name + "]:checked", wrap).val();

                    if (opts.onCheck) { opts.onCheck(val); };
                });
            };
            if (opts.mode == 2) {
                var isOn2 = ($("input[name=" + name + "]:checked").val() == opts.onVal) ? "on" : "off";
                var ele2 = $("<button type=\"button\" class=\"btn-switch " + isOn2 + "\" data-name=\"" + name + "\" data-value=\"" + isOn2 + "\"></button>");
                obj.before(ele2);
                ele2.on('click', function() {
                    var t = $(this);
                    $("input[name=" + name + "]", wrap).removeAttr("checked");
                    var cOn = t.attr("data-value");
                    if (cOn == "on") {
                        t.removeClass("on").attr("data-value", "off");
                        $("input[name=" + name + "][value!=" + opts.onVal + "]", wrap).prop("checked", true);
                    } else {
                        t.addClass("on").attr("data-value", "on");
                        $("input[name=" + name + "][value=" + opts.onVal + "]", wrap).prop("checked", true);
                    }
                    var val = $("input[name=" + name + "]:checked", wrap).val();
                    if (opts.onCheck) { opts.onCheck(val); };
                });
            };

        });
    };

    $.fn.checkGroup = function(options) {
        return this.each(function() {
            var defaults = {
                field: null,
                attr: null,
                onCheck: null,
                onCheckAll: null,
                onCheckOne: null,
                onInit: null
            };
            var opts = $.extend(defaults, options);
            var t = $(this);
            var inputName = (opts.field == null) ? t.attr("data-check") : opts.field;
            var attrName = ((opts.attr == null) ? 'name' : opts.attr);
            var obj = $("input[" + attrName + "='" + inputName + "']");
            t.attr({ "data-check-attr": attrName, "data-level": 0 }).unbind().prop("checked", false).on('click', function() {
                if (t.prop("checked")) {
                    obj.prop("checked", true);
                    obj.closest("tr").addClass("active");
                } else {
                    obj.prop("checked", false);
                    obj.closest("tr").removeClass("active");
                };
                if (opts.onCheck != null) { $(this).each(opts.onCheck); };
                if (opts.onCheckAll != null) { $(this).each(opts.onCheckAll); };
            });
            obj.attr({ "data-check-attr": attrName, "data-level": 1 }).unbind().on('click', function() {
                var objLength = obj.length;
                var objType = obj.attr("type");
                switch (objType) {
                    case "radio":
                        if ($(this).is(":checked")) { $(this).closest("tr").addClass("active").siblings().removeClass("active"); }
                        break;
                    case "checkbox":
                        if ($(this).is(":checked")) { $(this).closest("tr").addClass("active"); } else { $(this).closest("tr").removeClass("active"); };
                        break;
                }
                if ($("input[" + attrName + "='" + inputName + "']:checked").length == objLength) { t.prop("checked", true); } else { t.prop("checked", false); };
                if (opts.onCheck != null) { $(this).each(opts.onCheck); };
                if (opts.onCheckOne != null) { $(this).each(opts.onCheckOne); };
            });
            if (opts.onInit != null) { opts.onInit(); }
        });
    };

    $.fn.getOptions = function(options) {
        return this.each(function() {
            var defaults = {
                url: "",
                data: "",
                async: false,
                fieldValue: "id",
                fieldKey: "name",
                value: "",
                showDefault: true,
                defaultName: router.lang.option.plsSelect,
                model: 0,
                optdata: null
            };
            // Init Parameter
            var opts = $.extend(defaults, options);
            var obj = $(this);
            var setOptions = function(json, obj, opts) {
                var html = (opts.showDefault) ? "<option value=\"\">" + opts.defaultName + "</option>" : "";
                switch (opts.model) {
                    case 0:
                        var len = json.data.length;
                        for (var i = 0; i < len; i++) {
                            html += "<option value=\"" + json.data[i][opts.fieldValue] + "\">" + json.data[i][opts.fieldKey] + "</option>";
                        };
                        break;
                    case 1:
                        var len = json.data.length;
                        for (var i = 0; i < len; i++) {
                            html += "<option value=\"" + json.data[i] + "\">" + json.data[i] + "</option>";
                        };
                        break;
                    case 2:
                        for (var key in json.data) {
                            var tmp = json.data[key];
                            if (opts.data.model != "") {
                                if (key == opts.data.model) {
                                    for (var i = 0; i < tmp.length; i++)
                                        html += "<option value=\"" + tmp[i] + "\">" + tmp[i] + "</option>";
                                    break;
                                } else continue;
                            } else {
                                for (var i = 0; i < tmp.length; i++)
                                    html += "<option value=\"" + tmp[i] + "\">" + tmp[i] + "</option>";
                            }
                        }
                        break;
                }
                obj.html(html);
                if (opts.value != "") { obj.val(opts.value); };
            };
            if (opts.url == "") {
                if (opts.optdata) {
                    setOptions(opts.optdata, obj, opts);
                    return opts.optdata;
                } else return false;
            };
            $.ajax({
                url: opts.url,
                data: opts.data,
                async: opts.async,
                dataType: "json",
                cache: false,
                success: function(json) {
                    if (!$.validateJson(json)) { return false; };
                    setOptions(json, obj, opts);
                }
            });
        });
    };

    $.fn.fillForm = function(options, fn) {
        return this.each(function() {
            var fields = options;
            var form = $(this);
            var len = 0;
            for (key in fields) {
                len++;
                var obj = form.find("*[name='" + key + "']");
                if (obj.length > 0) {
                    var label = obj.get(0).tagName;
                    var value = (fields[key] == null) ? "" : fields[key];
                    if (label == "INPUT" || label == "SELECT" || label == "TEXTAREA") {
                        var type = obj.attr("type");
                        if (type == "radio") {
                            $("input[name='" + key + "'][value='" + value + "']", form).attr("checked", true);
                        } else if (type == "file") {} else {
                            obj.val(value);
                            obj.attr("old-value", value);
                            if (obj.attr("data-value") != undefined) { obj.attr("data-value", value); };
                        };
                    } else { // other label like span to init as input
                        if (obj.attr("data-label") == "input") {
                            obj.text(value);
                        };
                        if (obj.attr("data-label") == "img") {
                            obj.attr("src", value);
                        };
                    }
                }
            }
            if (fn != undefined) { fn(); };
        });
    };

    /*filter Form value - koko 2015-11-20*/
    $.fn.filterForm = function(formData) {
        var form = $(this);
        var options = form.find('input,select');
        options.each(function(index, el) {
            if ($(el).attr("old-value") == $(el).val()) {
                $(el).attr({ "disabled": "disabled" });
                console.log("old-value:" + $(el).attr("old-value"));
            }
        });
        return true;
    };

    $.fn.showAlert = function(options) {
        return this.each(function() {
            var defaults = {
                float: false,
                cssPos: "fixed",
                position: "before",
                html: "&nbsp;",
                type: "", // success (green) , error (red)
                scroll: true,
                time: 4500,
                autoClose: true,
                close: false
            };
            var opts = $.extend(defaults, options);

            var t = $(this);
            var type = (opts.type == "") ? "" : "-" + opts.type;
            var divId = "alert" + Math.ceil(Math.random() * 123465789);
            var closeHtml = "<button class=\"alert-close\" data-dismiss=\"alert\">&times;</button>";
            var cssPos = (opts.float) ? "position:" + opts.cssPos + ";z-index:9999999999;box-sizing:border-box;width:100%;top:0;left:0;" : "";
            var div = "<div class=\"alert alert" + type + "\" id=\"" + divId + "\" style=\"display:none;overflow:hidden;zoom:1;" + cssPos + "\">" + ((opts.close) ? closeHtml : "") + "" + ((opts.html == "") ? "&nbsp;" : opts.html) + "</div>";
            switch (opts.position) {
                case "append":
                    t.append(div);
                    break;
                case "prepend":
                    t.prepend(div);
                    break;
                case "before":
                    t.before(div);
                    break;
                case "after":
                    t.after(div);
                    break;
                default:
                    t.append(div);
            }
            //if (opts.float){ t.css("position","relative"); };
            $("#" + divId).slideDown("fast");
            if (opts.scroll) { $.scrollTo($("#" + divId), -62); }
            if (opts.autoClose) {
                var sto = setTimeout(function() { $("#" + divId).slideUp('fast', function() { $(this).remove(); }); }, opts.time);
            }
            if (opts.close) {
                $("#" + divId + " .alert-close").on('click', function() { $("#" + divId).remove(); });
            }
        });
    };

    /* disable or enabled some form option(select,input and so on) - Koko 2015-11-20*/
    $.fn.setOptionBan = function(action) { //action=0 --disabled action=1 enable
        switch (action) {
            case 0:
                $(this).find("input,select").attr({ "disabled": "disabled" });
                break;
            case 1:
                $(this).find("input[disabled=disabled],select[disabled=disabled]").removeAttr('disabled');
                break;
        }
    };

    // Jquery Mothod Extend
    $.extend({

        scrollTo: function(el, offeset) {
            var elOffset = (el == undefined) ? undefined : el.offset();
            var pos = (el == undefined) ? 0 : (elOffset == undefined) ? 0 : elOffset.top;
            var action = function() {
                $("html,body").animate({ scrollTop: pos + (offeset ? offeset : 0) }, "fast");
            };
            action();
            // /msie/.test(navigator.userAgent.toLowerCase())
        },

        showToolTip: function(x, y, contents) {
            //console.log($(".chart-tooltip").length);
            $(".chart-tooltip").remove();
            var id = "toolTip" + (Math.floor(Math.random() * 999999));
            var html = "<div id=\"" + id + "\" class=\"chart-tooltip\">" + contents + "</div>";
            var obj = $(html);
            obj.appendTo("body");
            var w = obj.width() + 16;
            var h = obj.height() + 26;
            obj.css({ top: y - h, left: x - w / 2 }).fadeIn("fast", function() {
                var offset = $("#" + id + "").offset();
                if (offset == undefined) { return false; }
                var ll = parseInt(offset.left) + parseInt(w);
                var winW = $(window).width();
                if (ll > winW) { obj.css({ left: winW - w }); }
            });
            return id;
        },

        showLoad: function(msg, target, color) {
            var wrap = $("body");
            var cls = "",
                cl = "background-color:#000";
            if (target != undefined) {
                wrap = target;
                cls = " mask-inner"
            };
            if (color != undefined) { cl = "background-color:" + color; };
            if (msg == undefined) { msg = router.lang.common.loading; };
            var loadObj = $("<div class=\"mask" + cls + "\"><div class=\"mask-msg\"><div class=\"inner\"><span class=\"loading\"></span><div>" + msg + "</div></div></div><div class=\"mask-bg\" style=\"" + cl + "\"></div></div>");
            if (wrap.attr("data-oldPosition") == undefined) { wrap.attr("data-oldPosition", wrap.css("position")) };
            wrap.addClass("load-mask-parent").append(loadObj).css("position", "relative");
        },
        hideLoad: function(msg) {
            var maskParent = $(".load-mask-parent");
            if (maskParent.length > 0) { maskParent.css("position", maskParent.attr("data-oldPosition")); };
            $(".mask").remove();
        },

        showWindow: function(title, msg, url) {
            var html = "<div id=\"winWarn\" class=\"modal hide\" data-backdrop=\"static\"><div class=\"modal-header\"><h3 class=\"font-orange\"><i class=\"icon-warning\"></i>&nbsp;&nbsp;" + title + "</h3></div><div class=\"modal-body\">" + msg + "</div><div class=\"modal-footer\"><button class=\"btn black\" data-dismiss=\"modal\" aria-hidden=\"true\">确定</button></div></div>";
            $("body").append(html);
            var w = $("#winWarn");
            w.modal();
            w.on("hidden", function() {
                if (url != "" && url != undefined && code == 0) { window.top.location.href = url; } else { w.remove(); };
            });
        },

        isPosInt: function(val) {
            var r = false;
            if (val != "") {
                var reg = /^\d+$/;
                r = reg.test(val);
            }
            return r;
        },

        checkboxVal: function(name, sep, dataType) {
            var r = "";
            var obj = $("input[name='" + name + "']:checked");
            if (r != undefined) {
                var l = obj.length;
                obj.each(function(i) {
                    var val = $(this).val();
                    if (dataType != undefined && dataType != "") { val = $(this).attr(dataType); }
                    r += val + ((l == (i + 1)) ? "" : sep);
                });
            }
            return r;
        },

        convertDUR: function(ms, type) {
            if (ms == undefined) { return ""; };
            var r = "0 " + router.lang.time.second;
            if (ms > 0) {
                var days = Math.floor(ms / (24 * 3600 * 1000));
                var remainder1 = ms % (24 * 3600 * 1000);
                var hours = Math.floor(remainder1 / (3600 * 1000));
                var remainder2 = remainder1 % (3600 * 1000);
                var minutes = Math.floor(remainder2 / (60 * 1000));
                var remainder3 = remainder2 % (60 * 1000);
                var seconds = Math.round(remainder3 / 1000);
                days = (days == 0) ? "" : days + router.lang.time.day;
                hours = (hours == 0) ? "" : hours + router.lang.time.hour;
                minutes = (minutes == 0) ? "" : minutes + router.lang.time.minute;
                seconds = (seconds == 0) ? "" : seconds + router.lang.time.second;
            };
            if (type == undefined) {
                return (ms >= 60000) ? (days + hours + minutes) : ((ms >= 30000) ? seconds : r = "< 30" + router.lang.time.second);
            } else {
                return (ms >= 60000) ? (days + hours + minutes) : ((ms > 0) ? seconds : r);
            }
        },

        validateJson: function(json) {
            var r = true;
            if (json.status != undefined) {
                if (json.status == 302 && json.url != undefined) {
                    window.top.location.href = gb_path + json.url;
                    return false;
                }
            };
            if (json.code == 1) { //modify by koko
                $.showLoad(json.msg);
                $("body").showAlert({ html: router.lang.common.erStok, position: "append", float: true, type: "error", time: 3500 });
                if (json.url == undefined) {
                    setTimeout(function() { window.location.href = window.location.protocol + '//' + window.location.host; }, 3500);
                    return false;
                }
                setTimeout(function() { window.location.href = json.url; }, 3500);
                return false;
            }
            if (json.code > 1) {
                if (json.code == 2)
                    $("body").showAlert({ html: router.lang.common.timeOut, position: "append", float: true, type: "error", time: 5000 });
                if (json.code == 3)
                    $("body").showAlert({ html: router.lang.common.innerError, position: "append", float: true, type: "error", time: 5000 });
                // else  other show in the page
                r = false;
            };
            return r;
        },

        setLanguage: function(lang) {
            $.cookie('language', lang, { expires: 30, path: "/" });
        },

        getLanguage: function() {
            var lang = $.cookie('language') || navigator.userLanguage || navigator.language;
            lang = (lang == 'zh' || lang == 'zh-CN' || lang == 'zh-Hans' || lang == 'zh-SG') && 'zh-CN' || (lang == 'zh-Hant' || lang == 'zh-MO' || lang == 'zh-TW' || lang == 'zh-HK') && 'zh-TW' || 'en';
            return lang;
        },

        setPageLang: function() {
            var lang = $.getLanguage();
            var s = $(".sidebar").length;
            var path = (s > 0) ? '../../' : '../';
            $.ajax({ url: '' + path + 'static/js/locale/lang.' + lang + '.js', dataType: 'json', async: false, cache: false, success: function(json) { router.lang = json; } });
            /* load lang of validate form*/
            $.getScript(path + "static/js/plugins/form/jquery.validate.messages." + lang + ".js");
            $("*[lang-id]").each(function(i) {
                var obj = $(this);
                var langID = obj.attr("lang-id");
                if (langID) {
                    var arr = langID.split("."),
                        len = arr.length,
                        text = router.lang;
                    for (var i = 0; i < len; i++) { text = text[arr[i]]; };
                    if (arr[0] == "placeholder")
                        obj.attr("placeholder", text);
                    else
                        obj.html(text);
                };

            });
        }

    });

})(jQuery);

$(function() {

    // add by koko 2015-11-04
    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    $.setPageLang();
});