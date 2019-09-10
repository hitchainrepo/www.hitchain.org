/**
 * Usage: var tpl = Template(templateString); tpl.render({"test": "test"}, callback(output)); variable name in templateString: args.test.
 **/
;
var LOG = typeof (TC) == 'object' ? TC.LOG : function(){};
var ERR = typeof (TC) == 'object' ? TC.ERR : window.alert;
function tcToString(obj) {
	if (typeof (obj) == "undefined" || obj == null) {
		return "";
	}
	if (typeof (obj) == "string") {
		return obj;
	}
	if (typeof (obj) == "number") {
		return number + "";
	}
	if (typeof (obj) == "boolean") {
		return obj ? "true" : "false";
	}
	if (typeof (obj) == "function") {
		return obj + "";
	}
	if (obj["status"] && obj["statusText"]) {
		return "Status: " + obj["status"] + ", Status text: " + obj["statusText"] + ", Response text: " + $(obj["responseText"]).text();
	}
	if (obj["stack"] && obj["message"] && obj["lineNumber"]) {
		return "Error: " + obj["message"] + ", lineNumber: " + obj["lineNumber"] + ", columnNumber: " + obj["columnNumber"] + ", stack: " + obj["stack"] + ", fileName: " + obj["fileName"];
	}
	try {
		return JSON.stringify(obj);
	} catch (err) {
		return obj;
	}
};
/**
 * js template engine use <!--##--> as js block, and use {{}} as output block, variable use "args." prefix.
 **/
function Template(tpl){
    if(!(tpl != null && typeof (tpl) == 'string')){
        ERR('QDP TPL Error：Template not found!\n');
        return null;
    }
    var obj = new Object();
    obj.tpl = tpl;
    obj.script = '';
    obj.parse = function() {
        if(obj.script.length > 0){
            return obj.script;
        }
        var text = obj.tpl;
        var scriptArr = [ '"use strict";\nvar view = "";\n' ];
        var str = [];
        var len = text.length || 0;
        var inJsBlock = false/* jsCodeBlock: <!--##--> */, inOutBlock = false/* outputBlock: {{}} */;
        for (var i = 0; i < len; i++) {
            var c = text.charAt(i);
            /* test if start with <!--# */
            if (!inOutBlock && c == '<' && text.charAt(i + 1) == '!' && text.charAt(i + 2) == '-' && text.charAt(i + 3) == '-' && text.charAt(i + 4) == '#') {
                inJsBlock = true;
                {/* add before string, the string before the <!--# */
                    while (str[str.length - 1] == '\n') {
                        str.pop();
                    }
                    scriptArr.push(';\nview=view+"');
                    scriptArr.push(str.join(''));
                    scriptArr.push('";\n');
                }
                str = [];
                i = i + 4;
                continue;
            }
            /* test if end with #--> */
            if (inJsBlock && c == '#' && text.charAt(i + 1) == '-' && text.charAt(i + 2) == '-' && text.charAt(i + 3) == '>') {
                inJsBlock = false;
                {/* add before script, the string between the <!--# and #--> */
                    scriptArr.push(str.join(''));
                    //scriptArr.push('\n');
                }
                str = [];
                i = i + 3;
                if(text.charAt(i + 1) == '\n'){// remove the jsblock line break.
                    i = i + 1;
                }
                continue;
            }
            /* test if start with {{ */
            if (!inJsBlock && c == '{' && text.charAt(i + 1) == '{') {
                inOutBlock = true;
                {/* add before string, the string before {{ */
                    scriptArr.push(';\nview=view+"');
                    scriptArr.push(str.join(''));
                    scriptArr.push('";\n');
                }
                str = [];
                i = i + 1;
                continue;
            }
            /* test if end with }} */
            if (inOutBlock && c == '}' && text.charAt(i + 1) == '}') {
                inOutBlock = false;
                {/* add before script, the string between the {{ and }} */
                    scriptArr.push(';\nview=view+(');
                    scriptArr.push(str.join(''));
                    scriptArr.push(');\n');
                }
                str = [];
                i = i + 1;
                continue;
            }
            /* out put the js block content. */
            if (inJsBlock || inOutBlock) {
                str.push(c);
                continue;
            }

            if (c == '\\') {
                str.push('\\\\');
            } else if (c == '"') {
                str.push('\\"');
            } else if (c == '\n') {
                str.push('\\n');
            } else if (c == '\r') {
                str.push('\\r');
            } else if (c == '\t') {
                str.push('\\t');
            } else {
                str.push(c);
            }
        }
        {/* add last string */
            scriptArr.push(';\nview=view+"');
            scriptArr.push(str.join(''));
            scriptArr.push('";\n');
        }
        {
            scriptArr.push(";\nreturn view;\n");
        }
        var script = scriptArr.join('');
        //LOG('template script:' + script);
        return obj.script = script;
    };
	obj.render = function(data, success, error) {
		var script = obj.parse();
		var fun = new Function('args', script);
		var out = '';
		try {
			out = fun(data);
			//LOG(out);
			if (typeof (success) == 'function') {
                success(out, data, script);
            }
            return out;
		} catch (err) {
			out = tcToString(err);
			ERR('QDP.Tpl.render error: ' + out + '\n' + script);
			if (typeof (error) == 'function') {
                error(err, data, script);
            }
            return out;
		}
	};
    return obj;
};