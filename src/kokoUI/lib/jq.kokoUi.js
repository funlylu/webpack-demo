/*!
 * Custom Jquery extends and methods
 */

(function($) {
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

    // load html to current content - Koko 2017-08-26
    $.fn.loadHtml = function(option) {
        var defaults = {
            url: "",
            time: 500,
            autoClose: true,
        };

    };
    // Jquery Mothod Extend
    $.extend({
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
        }

    });

})(jQuery);