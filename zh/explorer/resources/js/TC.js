;
'use strict';

/**
 * init global variable.
 */
window = typeof(window) !== "object" || window == null ? {} : window;
/**
 * init TC util.
 */
TC = window.TC = typeof(TC) !== "object" || TC == null ? {} : TC;
/**
 * setting application context.
 */
TC.ctx = TC.ctx || window.ctx || "";
/**
 * debug=true will output log
 */
TC.DEBUG = TC.DEBUG || false;
/**
 * a no op function.
 */
TC.noop = TC.noop || function() {};
/**
 * if has console object then LOG = console.log.
 * Usage: TC.LOG("hello world")
 */
TC.LOG = TC.LOG || function(){
    TC.DEBUG && TC.isObject(console) && TC.isFunction(console.log) && console.log.apply(this, arguments);
};
/**
 * if has console object then ERR = console.error.
 * Usage: TC.ERR("hello world")
 */
TC.ERR = TC.ERR || function(){
    TC.DEBUG && TC.isObject(console) && TC.isFunction(console.error) && console.error.apply(this, arguments);
};
TC.EUC = TC.EUC || encodeURIComponent;
TC.DUC = TC.DUC || decodeURIComponent;
TC.DU  = TC.DU  || decodeURI;
/**
 * test if the parameter is a function or a function name.
 * @param functionName
 * @returns {Boolean}
 */
TC.isFunction = TC.isFunction || function(functionOrName){
    return typeof(functionOrName) == "function" || TC.isString(functionOrName) && typeof(window[functionOrName]) == "function";
};
/**
 * test if the parameter is object type
 * @param obj
 * @returns {Boolean}
 */
TC.isObject = TC.isObject || function (obj) {
	return typeof(obj) == "object";
};
/**
 * test if the parameter is array type, consider the parent window.
 * @param arr
 * @returns {Boolean}
 */
TC.isArray = TC.isArray || function (arr) {
	return typeof(arr) == "object" && Object.prototype.toString.call(arr) == "[object Array]";
};
/**
 * tst if parameter is string type.
 * @param str
 * @returns {Boolean}
 */
TC.isString = TC.isString || function (str) {
	return typeof (str) == "string";
};
/**
 * tst if parameter is number type.
 * @param num
 * @returns {Boolean}
 */
TC.isNumber = TC.isNumber || function (num) {
	return typeof (num) == "number";
};
/**
 * tst if parameter is number type.
 * @param num
 * @returns {Boolean}
 */
TC.isDate = TC.isDate || function (date) {
	return typeof(date) == "object" && Object.prototype.toString.call(date) == "[object Date]";
};
/**
 * object to string.
 * @param obj
 * @returns {String}
 */
TC.toStr= TC.toStr || function (obj) {
	if (typeof (obj) == "undefined" || obj == null) {
		return "";
	}
	if (typeof (obj) == "string") {
		return obj;
	}
	if (typeof (obj) == "number") {
		return obj + "";
	}
	if (typeof (obj) == "boolean") {
		return obj ? "true" : "false";
	}
	if (typeof (obj) == "function") {
		return obj + "";
	}
	if (obj["status"] && obj["statusText"]) {// ajax response raw data.
		return "Status: " + obj["status"] + ", Status text: " + obj["statusText"] + ", Response text: " + obj["responseText"];
	}
	if (obj["stack"] && obj["message"] && obj["lineNumber"]) {// ajax response error raw data.
		return "Error: " + obj["message"] + ", lineNumber: " + obj["lineNumber"] + ", columnNumber: " + obj["columnNumber"] + ", stack: " + obj["stack"]
				+ ", fileName: " + obj["fileName"];
	}
	try {
		return JSON.stringify(obj);
	} catch (err) {
		return obj;
	}
};
/**
 * escape ["] or ['] to [\"] or [\'].
 * @param str
 * @param char is ["] or [']
 * @returns {String}
 */
TC.escape = TC.escape || function (str, char) {
	var s = "";
	if (!TC.isString(str) || str.length == 0) {
		return "";
	}
	s = str.replace(/\\/g, "\\\\");
	if (char == "'") {
		s = s.replace(/\'/g, "\\'");
	} else if (char == '"') {
		s = s.replace(/\"/g, '\\"');
	}
	return s;
};
/**
 * encode html chars:[&=.&amp;, <=&lt;, >=&gt;,  =&nbsp;, '=&apos;, "=&quot;, \n=<br>].
 * @param str
 * @param br if br==true then will convert \n to <br>
 * @returns {String}
 */
TC.encode = TC.encode || function (str, br) {
	var s = "";
	if (!TC.isString(str) || str.length == 0) {
		return "";
	}
	s = str.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/\'/g, "&apos;");
	s = s.replace(/\"/g, "&quot;");
	s = br === true ? s.replace(/\n/g, "<br>") : s;
	return s;
};
/**
 * decode html chars: [.&amp;=&, &lt;=<, &gt;=>, &nbsp;= , &apos;=', &quot;=", <br>=\n].
 * @param str
 * @param br if br==true then convert <br> to \n
 * @returns {String}
 */
TC.decode = TC.decode || function (str, br) {
	var s = "";
	if (!TC.isString(str) || str.length == 0) {
		return "";
	}
	s = str.replace(/&amp;/g, "&");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&apos;/g, "\'");
	s = s.replace(/&quot;/g, "\"");
	s = br === true ? s.replace(/<br>/g, "\n") : s;
	return s;
};
/**
 * destroy a object by remove all properties.
 * @param obj
 */
TC.destroy = TC.destroy || function (obj) {
	if (TC.isObject(obj)) {
		for (var prop in obj) {
			try {
				delete obj[prop];
			} catch (err) {
			}
		}
	}
};
/**
 * get random string.
 * @returns {String}
 */
TC.random = TC.random || function () {
	return (Math.random() + "").substring(2);
};
/**
 * return string hash.
 * @returns {String}
 */
TC.hash = TC.hash || function (str) {
	var hash = 0, i, chr, len;
	if (!TC.isString(str) || str.length == 0) {
		return hash;
	}
	for (i = 0, len = str.length; i < len; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
/**
 * return the object or array or string length.
 * @returns {Number}
 */
TC.len = TC.len || function (obj) {
	if (typeof(obj) == "undefined" || obj == null) {
		return 0;
	} else if (obj.length > 0) {
		return parseInt(obj.length);
	} else if (obj.length == 0) {
		return 0;
	}
	var len = 0;
	for ( var key in obj) {
		if (key != "toString" || key != "valueOf" /* ie contains those properties */) {
			len = len + 1;
		}
	}
	return len;
};
/**
 * if the object properties or array or string length < 1 the is empty.
 * @returns {Boolean}
 */
TC.isEmpty = TC.isEmpty || function (obj) {
	return TC.len(obj) < 1;
};
/**
 * test object is plain object.
 * @returns {Boolean}
 */
TC.isPlainObject = TC.isPlainObject || function (obj) {
	return TC.isObject(obj) && Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * convert arguments=(key, value, key, value...) to map.
 * @returns {Object}
 */
TC.toMap = TC.toMap || function () {
	var obj = {};
	for (var i = 0; i < arguments.length; i++) {
		obj[arguments[i]] = obj[i + 1];
		i = i + 1;
	}
	return obj;
};
/**
 * extend object properties.
 * @returns {Object}
 */
TC.extend = TC.extend || function (src, src2) {
	if (TC.isPlainObject(src) && TC.isPlainObject(src2)) {
		for ( var prop in src2) {
			src[prop] = src2[prop];
		}
	}
	return src;
};
/**
 * copy object by json.
 * @returns {Object}
 */
TC.jsonCopy = TC.jsonCopy || function (src) {
	if (!TC.isObject(src)) {
		return null;
	}
	return JSON.parse(JSON.stringify(src));
};
/**
 * combine objects to one object.
 * @returns {Object}
 */
TC.combine = TC.combine || function () {
	var args = Array.prototype.slice.call(arguments, 0);
	var obj = {};
	for (var i = 0; i < args.length; i++) {
		TC.merge(obj, TC.jsonCopy(args[i]));
	}
	return obj;
};
/**
 * merge another object to object.
 * @param to      the object be merged
 * @param from    the object be copied
 * @param useVue  use Vue.set to merge properties
 * @returns {Object}
 */
TC.merge = TC.merge || function (to, from, useVue) {
	if (!from) {
		return to;
	}
	to = to == null ? {} : to;
	var key, toVal, fromVal;
	var keys = Object.keys(from);
	var hasOwn = function(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	};
	var set = (useVue != false && TC.isObject(Vue)) ? Vue.set : function(target, key, val) {
		if (Array.isArray(target)) {
			target.length = Math.max(target.length, key);
			target.splice(key, 1, val);
			return val;
		}
		target[key] = val;
		return val;
	};
	for (var i = 0; i < keys.length; i++) {
		key = keys[i];
		toVal = to[key];
		fromVal = from[key];
		if (!hasOwn(to, key)) {
			set(to, key, fromVal);
		} else if (TC.isPlainObject(toVal) && TC.isPlainObject(fromVal)) {
			TC.merge(toVal, fromVal);
		} else {
			set(to, key, fromVal);
		}
	}
	return to;
};
/**
 * join strings to path.
 * @returns {String}
 */
TC.pathJoin = TC.pathJoin || function () {
	var path = '';
	for (var i = 0; i < arguments.length; i++) {
		var arg = TC.isString(arguments[i]) ? arguments[i] : (arguments[i] + '');
		if (!arg) {
			continue;
		}
		if (!path) {
			path = arg;
			continue;
		}

        var pathEnd = path.charAt(path.length - 1) == '/';
        var argStart = arg.charAt(0) == '/';
        if (pathEnd && argStart) {
            path = path + arg.substring(1);
        } else if (!pathEnd && !argStart) {
            path = path + '/' + arg;
        } else {
            path = path + arg;
        }
	}
	return path;
};
/**
 * url query string to parameter map.
 * @param queryStr the url query string
 * @param name     if provide name will return the parameter value of the name
 * @param map      if provide map will fill the parameter to the map
 * @returns {Object|String}
 */
TC.paramMap = TC.paramMap || function (queryStr, name, map) {
	var pattern = /(\w*)=([a-zA-Z0-9\u4e00-\u9fa5]+)/ig, params = map || {}; /*定义正则表达式和一个空对象*/
	decodeURIComponent(queryStr || window.location.href, true).replace(pattern, function(a, b, c) {
		params[b] = c;
	});
	return name ? (params[name] ? params[name] : null) : params;
};
/**
 * join the url with the query string
 * @param baseUrl       the url base
 * @param paramStrs     the url query string
 * @param removeParams  the parameter exclude
 * @returns {String}
 */
TC.fixUrl = TC.fixUrl || function (baseUrl, paramStrs, removeParams) {
	baseUrl = baseUrl || window.location.href;
	baseUrl = baseUrl.indexOf("?") > -1 ? baseUrl.substring(0, baseUrl.indexOf("?")) : baseUrl;
	var paramMap = TC.paramMap(baseUrl, null);
	if (TC.isArray(paramStrs)) {
		for (var i = 0; i < paramStrs.length; i++) {
			if (paramStrs[i]) {
				paramMap = TC.paramMap(paramStrs[i], null, paramMap);
			}
		}
	}
	if (TC.isArray(removeParams)) {
		for (var i = 0; i < removeParams; i++) {
			if (removeParams[i]) {
				delete paramMap[removeParams[i]];
			}
		}
	}
	var paramSplit = [];
	for ( var p in paramMap) {
		paramSplit.push(p + '=' + paramMap[p]);
	}
	var lastChar = baseUrl.charAt(baseUrl.length - 1), queryChar = baseUrl.indexOf("?") < 0 ? "?" : (lastChar == "?" ? "" : (lastChar == "&" ? "" : "&"));
	var url = baseUrl + queryChar + (paramSplit.length > 0 ? paramSplit.join("&") : "");
	return url.charAt(url.length - 1) == "?" || url.charAt(url.length - 1) == "&" ? url.substring(0, url.length - 1) : url;
};
/**
 * convert form serialized data to json object.
 * @param formData  the form data is an array contains {name:value} objects
 * @returns {Object}
 */
TC.jsonForm = function (formData) {
	var newFormData = {};
	formData = TC.isArray(formData) ? formData : [formData];
	TC.map(formData, function(data){
	    if(!TC.isPlainObject(data)){
	        return;
	    }
        TC.map(data, function(value, key) {
            var val = TC.isPlainObject(value) || TC.isArray(value) ? JSON.stringify(value) : (value + '');
            newFormData[key] = val;
        });
	});
	return newFormData;
};

TC.props = function (obj, join) {
	var props = [];
	if (TC.isObject(obj)) {
		props = Object.keys(obj);
	}
	return join ? props.join(join) : props;
};

/**
 * just like toMap.
 */
TC.obj = function (obj) {
	obj = obj || {};
	var args = Array.prototype.slice.call(arguments, 1) || [];
	for (var i = 0; i < args.length; i++) {
		obj[args[i]] = args[i + 1] == null ? null : args[i + 1];
		i++;
	}
	return obj;
};

TC.map = function (obj, func) {
	var arr = [];
	if (obj == null) {
		return arr;
	}
	if (TC.isArray(obj)) {
		for (var i = 0; i < obj.length; i++) {
			arr.push(func(obj[i], i, i));
		}
	} else if (TC.isObject(obj)) {
		var i = 0;
		for ( var prop in obj) {
			arr.push(func(obj[prop], prop, i));
			i = i + 1;
		}
	} else if (TC.isString(obj)) {
		for (var i = 0; i < obj.length; i++) {
			arr.push(func(obj.charAt(i), i, i));
		}
	} else if (TC.isNumber(obj)) {
		for (var i = 1; i < obj; i++) {
			arr.push(func(i, i, i));
		}
	}
	return arr;
};

/**
 * get object value by path, such as: path=/a/b, object={a:{b:1}}, return 1;
 */
TC.byPath = function (target, path) {
	var obj = target, paths = (path || '').split('/'), p = "";
	for (var i = 0; i < paths.length; i++) {
		var p = paths[i];
		if (p == "") {
			continue;
		}
		if (p && TC.isObject(obj)) {
			obj = obj[p];
		} else {
			return null;
		}
	}
	return obj;
};
//==========StringUtils
TC.padRight = TC.padRight || function(str, length, padChar){
    padChar = padChar == null ? " " : padChar;
    if(padChar.length > 1){
        padChar = padChar.substring(0, 1);
    }
    if(str.length >= length){
        return str;
    }
    var newStr = [];
    for(var i=0; i<length-str.length; i++){
        newStr.push(padChar);
    }
    newStr.push(str);
    return newStr.join("");
};
TC.padLeft = TC.padLeft || function(str, length, padChar){
    padChar = padChar == null ? " " : padChar;
    if(padChar.length > 1){
        padChar = padChar.substring(0, 1);
    }
    if(str.length >= length){
        return str;
    }
    var newStr = [str];
    for(var i=0; i<length-str.length; i++){
        newStr.push(padChar);
    }
    return newStr.join("");
};
//===========
TC.upperCase = TC.UC = TC.upperCase || function(str){
    return TC.toStr(str).toUpperCase();
};
TC.lowerCase = TC.LC = TC.lowerCase || function(str){
    return TC.toStr(str).toLowerCase();
};
TC.capitalize = TC.CAP = TC.capitalize || function(str){
    return TC.isString(str) && str.length > 0 ? (str.substring(0,1).toUpperCase() + str.substring(1)) : str;
};
TC.unCapitalize = TC.UCAP = TC.unCapitalize || function(str){
    return TC.isString(str) && str.length > 0 ? (str.substring(0,1).toLowerCase() + str.substring(1)) : str;
};
TC.isJavaFieldLike = TC.isJavaFieldLike || function(str){
    return TC.isString(str) && str.length > 0 && str.indexOf("_") < 0 && TC.LC(str.substring(0, 1)) == str.substring(0, 1);
};
TC.isJavaClassLike = TC.isJavaClassLike || function(str){
    return TC.isString(str) && str.length > 0 && str.indexOf("_") < 0 && TC.UC(str.substring(0, 1)) == str.substring(0, 1) && TC.UC(str) != str;
};
TC.isColumnLike = TC.isColumnLike || function(str){
    return TC.isString(str) && str.length > 0 && (str.indexOf("_") > -1 || TC.UC(str) == str);
};
TC.columnToField = TC.columnToField || function(str){
    if( !(TC.isString(str) && str.length > 0) ){
        return null;
    }
    var field = str;
    if(TC.isColumnLike(field)){
        var split = field.split("_");
        for(var i=0; i<split.length; i++){
            split[i] = i == 0 ? TC.LC(split[i]) : TC.CAP(TC.LC(split[i]));
        }
        field = split.join("");
    }
    return field;
};
TC.fieldToColumn = TC.fieldToColumn || function(str){
    if( !(TC.isString(str) && str.length > 0) ){
        return null;
    }
    var column = str;
    if(TC.isJavaFieldLike(column)){
        var split = column.split(/(?=[A-Z])/);
        for(var i=0; i<split.length; i++){
            split[i] = TC.UC(split[i]);
        }
        column = split.join("_");
    }
    return column;
};
TC.tableToClass = TC.tableToClass || function(str){
    return TC.CAP(TC.columnToField(str));
};
TC.classToTable = TC.classToTable || function(str){
    return TC.fieldToColumn(str);
};
TC.packageToPath = TC.packageToPath || function(){
    var args = Array.prototype.slice.call(arguments, 0) || [];
    return args.join("/").replace(/\./g, "/").replace(/\/\//g, "/");
};
TC.DbTypeMapping = TC.DbTypeMapping || {
    java: {
        String: {java: "String", standard: "VARCHAR", h2: "VARCHAR", mysql: "VARCHAR", oracle: "VARCHAR2", sqlserver: "NVARCHAR", postgresql: "VARCHAR"},
        StringEx: {java: "StringEx", standard: "LONGVARCHAR", h2: "VARCHAR(1G)", mysql: "LONGTEXT(1G)", oracle: "LONG(1G)", sqlserver: "NTEXT(1G)", postgresql: "TEXT(1G)"},
        Boolean: {java: "Boolean", standard: "BOOLEAN", h2: "BOOLEAN", mysql: "BIT", oracle: "NUMBER(1)", sqlserver: "BIT", postgresql: "BOOT"},
        Integer: {java: "Integer", standard: "INTEGER", h2: "INTEGER", mysql: "INT", oracle: "NUMBER(10,0)", sqlserver: "INT", postgresql: "INT4"},
        Long: {java: "Long", standard: "LONG", h2: "BIGINT", mysql: "BIGINT", oracle: "NUMBER(19,0)", sqlserver: "BIGINT", postgresql: "INT8"},
        Float: {java: "Float", standard: "FLOAT", h2: "REAL", mysql: "FLOAT", oracle: "FLOAT", sqlserver: "FLOAT", postgresql: "FLOAT8"},
        Double: {java: "Double", standard: "DOUBLE", h2: "DOUBLE", mysql: "DOUBLE", oracle: "FLOAT(24)", sqlserver: "FLOAT", postgresql: "FLOAT8"},
        BigDecimal: {java: "BigDecimal", standard: "DECIMAL", h2: "DECIMAL", mysql: "DECIMAL", oracle: "FLOAT(24)", sqlserver: "NUMBERIC", postgresql: "NUMBERIC"},
        Blob: {java: "Blob", standard: "BLOB", h2: "BLOB", mysql: "LONGBLOB", oracle: "BLOB", sqlserver: "BLOB", postgresql: "BLOB"},
        Clob: {java: "Clob", standard: "CLOB", h2: "CLOB", mysql: "LONGTEXT", oracle: "CLOB", sqlserver: "CLOB", postgresql: "TEXT"},
        Date: {java: "Date", standard: "DATETIME", h2: "DATETIME", mysql: "DATETIME", oracle: "TIMESTAMP", sqlserver: "DATETIME", postgresql: "TIMESTAMP"}
    },
    standard: {
        VARCHAR: {java: "String", standard: "VARCHAR", h2: "VARCHAR", mysql: "VARCHAR", oracle: "VARCHAR2", sqlserver: "NVARCHAR", postgresql: "VARCHAR"},
        LONGVARCHAR: {java: "StringEx", standard: "LONGVARCHAR", h2: "VARCHAR(1G)", mysql: "LONGTEXT(1G)", oracle: "LONG(1G)", sqlserver: "NTEXT(1G)", postgresql: "TEXT(1G)"},
        BOOLEAN: {java: "Boolean", standard: "BOOLEAN", h2: "BOOLEAN", mysql: "BIT", oracle: "NUMBER(1)", sqlserver: "BIT", postgresql: "BOOT"},
        INTEGER: {java: "Integer", standard: "INTEGER", h2: "INTEGER", mysql: "INT", oracle: "NUMBER(10,0)", sqlserver: "INT", postgresql: "INT4"},
        LONG: {java: "Long", standard: "LONG", h2: "BIGINT", mysql: "BIGINT", oracle: "NUMBER(19,0)", sqlserver: "BIGINT", postgresql: "INT8"},
        FLOAT: {java: "Float", standard: "FLOAT", h2: "REAL", mysql: "FLOAT", oracle: "FLOAT", sqlserver: "FLOAT", postgresql: "FLOAT8"},
        DOUBLE: {java: "Double", standard: "DOUBLE", h2: "DOUBLE", mysql: "DOUBLE", oracle: "FLOAT(24)", sqlserver: "FLOAT", postgresql: "FLOAT8"},
        DECIMAL: {java: "BigDecimal", standard: "DECIMAL", h2: "DECIMAL", mysql: "DECIMAL", oracle: "FLOAT(24)", sqlserver: "NUMBERIC", postgresql: "NUMBERIC"},
        BLOB: {java: "Blob", standard: "BLOB", h2: "BLOB", mysql: "LONGBLOB", oracle: "BLOB", sqlserver: "BLOB", postgresql: "BLOB"},
        CLOB: {java: "Clob", standard: "CLOB", h2: "CLOB", mysql: "LONGTEXT", oracle: "CLOB", sqlserver: "CLOB", postgresql: "TEXT"},
        DATETIME: {java: "Date", standard: "DATETIME", h2: "DATETIME", mysql: "DATETIME", oracle: "TIMESTAMP", sqlserver: "DATETIME", postgresql: "TIMESTAMP"}
    }
};
TC.standardTypeToJavaType = TC.standardTypeToJavaType || function(type){
    type = type.indexOf("(")>0 ? type.substring(0, type.indexOf("(")) :  type;
    return (TC.DbTypeMapping.standard[type]||{}).java;
};
TC.standardTypeToDbType = TC.standardTypeToDbType || function(type, db){
    type = type.indexOf("(")>0 ? type.substring(0, type.indexOf("(")) :  type;
    return (TC.DbTypeMapping.standard[type]||{})[db];
};
TC.javaTypeToStandardType = TC.javaTypeToStandardType || function(type){
    return (TC.DbTypeMapping.java[type]||{}).standard;
};
TC.javaTypeToDbType = TC.javaTypeToDbType || function(type, db){
    return (TC.DbTypeMapping.java[type]||{})[db];
};
TC.dateFormat = TC.dateFormat || function(format, date){
    format = format || "yyyy-MM-dd HH:mm:ss";
    date = date == null ? new Date() : date;
    if(!TC.isDate(date)){
        return null;
    }
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "H+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(format)){
        format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(format)){
            format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return format;
};
//
TC.localGet=function (key, defaultValue) {
	var value = localStorage.getItem(key);
	if (value == null) {
		return defaultValue || value;
	}
	if (value.charAt(0) == '{' || value.charAt(0) == '[') {//'}',']'
		return JSON.parse(value);
	}
	return typeof (defaultValue) == typeof (value) ? (value || defaultValue) : defaultValue;
};
TC.localSet = function (key, value) {
	if (value == null) {
		localStorage.removeItem(key);
	} else {
		localStorage.setItem(key, value == null ? '' : (typeof (value) == 'string' ? value : JSON.stringify(value)));
	}
};
TC.sessionGet = function (key, defaultValue) {
	var value = sessionStorage.getItem(key);
	if (value == null) {
		return defaultValue || value;
	}
	if (value.charAt(0) == '{' || value.charAt(0) == '[') {//'}',']'
		return JSON.parse(value);
	}
	return typeof (defaultValue) == typeof (value) ? (value || defaultValue) : defaultValue;
};
TC.sessionSet = function (key, value) {
	if (value == null) {
		sessionStorage.removeItem(key);
	} else {
		sessionStorage.setItem(key, value == null ? '' : (typeof (value) == 'string' ? value : JSON.stringify(value)));
	}
};
TC.isSuccess = function (data) {//"header":{"status":"success"
	return TC.ajaxDataHead(data, 'status') == 'success';
};
TC.ajaxData = function (data) {
	return data && data.body != null ? data.body : null;
};
TC.ajaxDataBody = function (data) {
	return data && data.body && data.body.body != null ? data.body.body : null;
};
TC.ajaxDataHead = function (data, key) {
	return data && data.body && data.body.header != null ? (key != null ? data.body.header[key] : data.body.header) : null;
};
TC.setCookie = function (name, value, days) {
	var d = new Date();
	days = (value == null ? -1 : (days || 0));
	d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
	window.document.cookie = name + "=" + (value == null ? '' : value) + ";path=/;expires=" + d.toGMTString();
};
TC.getCookie = function (name) {
	var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
};
