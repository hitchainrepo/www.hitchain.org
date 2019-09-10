;
"use strict";

$(document).ready(function() {
    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    feather.replace();
});

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider());
var version = web3.version.api;
console.log(version);

var userPostAjax = false;

function remove0x(str1) {
    if (str1.startsWith("0x") == true) {
        str1 = str1.substr(str1.length - str1.length + 2);
    }
    return str1;
}

function encodeBool(boolVal){
    return boolVal===true?encodeUint256(1):encodeUint256(0);
}
function decodeBool(hex){
    return parseInt(hex, 16)===1;
}
/**
* 1
* 0000000000000000000000000000000000000000000000000000000000000001
*/
function encodeUint256(unit256){
    return web3.padLeft(unit256+"", 256/4);
}
/**
* 0x0000000000000000000000000000000000000000000000000000000000000001
* 1
*/
function decodeUint256(hex){
    return parseInt(hex, 16);
}
/**
* 0x2bc8307ecc99ed184bae05a0b6b4371d406bf490
* 0000000000000000000000002bc8307ecc99ed184bae05a0b6b4371d406bf490
*/
function encodeAddress(address){//
    return web3.padLeft(remove0x(address), 256/4);
}
/**
* 0x0000000000000000000000002bc8307ecc99ed184bae05a0b6b4371d406bf490
* 0x2bc8307ecc99ed184bae05a0b6b4371d406bf490
*/
function decodeAddress(hex){
    return "0x"+web3.toBigNumber(hex).toString(16);
}

/**
* helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld-helloworld
* 000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a468656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c642d68656c6c6f776f726c6400000000000000000000000000000000000000000000000000000000
*/
function encodeStr(str){
    var strHex = web3.fromUtf8(str).substring(2);
    var strLen = strHex.length;
    return encodeUint256("20", 256/4)+encodeUint256(web3.toHex(strLen).substring(2), 256/4)+web3.padRight(strHex, parseInt((strLen+256/4-1)/(256/4))*(256/4));
}
function decodeStr(hex){
    return web3.toUtf8("0x"+hex.substring(2+256/4*2));
}

function buildParam(contractAddress, functionName, params/*[{type:"uint256|address|string|bool", value:""}]*/){
    var functionSig = web3.sha3(functionName).substring(0,10);
    window.ethCallId = window.ethCallId || 1;
    var paramData = functionSig;
    params = params || [];
    for(var i=0; i<params.length; i++){
        var paramEncode = "",  type = params[i].type, value = params[i].value;
        paramEncode = type=="uint256" ? encodeUint256(value) : paramEncode;
        paramEncode = type=="address" ? encodeAddress(value) : paramEncode;
        paramEncode = type=="string" ? encodeStr(value) : paramEncode;
        paramEncode = type=="bool" ? encodeBool(value) : paramEncode;
        paramData += paramEncode;
    }
    console.log("paramData", paramData);
    var data = {
        jsonrpc:"2.0",
        method:"eth_call",
        id:(++window.ethCallId),
        params:[{
            to:contractAddress,
            data: paramData
        }, "latest"]
    };
    return data;
}

function ajaxEth(param, resultType/*"uint256|address|string|bool"*/, successFunc, errorFunc){
    if(userPostAjax){
        ajaxPost(param, resultType/*"uint256|address|string|bool"*/, successFunc, errorFunc);
    }else{
        ajaxGet(param, resultType/*"uint256|address|string|bool"*/, successFunc, errorFunc);
    }
}

function ajaxPost(param, resultType/*"uint256|address|string|bool"*/, successFunc, errorFunc){
    $.ajax({
        //请求方式
        type : "POST",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "https://ropsten.infura.io/v3/80f1c00345214da4bdbc4d02f35fb265",
        //数据，json字符串
        data : JSON.stringify(param),
        //请求成功
        success : function(result) {
            console.log(result);
            var value = null;
            value = resultType=="uint256" ? decodeUint256(result.result) : value;
            value = resultType=="address" ? decodeAddress(result.result) : value;
            value = resultType=="string" ? decodeStr(result.result) : value;
            value = resultType=="bool" ? decodeBool(result.result) : value;
            if(typeof(successFunc)=="function"){
                successFunc(value)
            }
            //console.log(parseInt(result.result, 16));
            //console.log(hex_to_ascii(result.result));
        },
        //请求失败，包含具体的错误信息
        error : function(e){
            console.log(e.status);
            console.log(e.responseText);
            if(typeof(errorFunc)=="function"){
                errorFunc(e)
            }
        }
    });
}

function ajaxGet(param, resultType/*"uint256|address|string|bool"*/, successFunc, errorFunc){
    $.ajax({
        //请求方式
        type : "GET",
        //请求的媒体类型
        contentType: "application/json;charset=UTF-8",
        //请求地址
        url : "https://api-ropsten.etherscan.io/api?module=proxy&action=eth_call&to="+param.params[0].to+"&data="+param.params[0].data+"&tag=latest",
        //请求成功
        success : function(result) {
            console.log(result);
            var value = null;
            value = resultType=="uint256" ? decodeUint256(result.result) : value;
            value = resultType=="address" ? decodeAddress(result.result) : value;
            value = resultType=="string" ? decodeStr(result.result) : value;
            value = resultType=="bool" ? decodeBool(result.result) : value;
            if(typeof(successFunc)=="function"){
                successFunc(value)
            }
            //console.log(parseInt(result.result, 16));
            //console.log(hex_to_ascii(result.result));
        },
        //请求失败，包含具体的错误信息
        error : function(e){
            console.log(e.status);
            console.log(e.responseText);
            if(typeof(errorFunc)=="function"){
                errorFunc(e)
            }
        }
    });
}

//==========================================================================================

function getMaxId(contractAddress, successFunc, errorFunc){
    return ajaxEth(buildParam(contractAddress, "id()"), "uint256", successFunc, errorFunc);
}
//"0x48e154cb7040602163236df58a8cc3c0836425e1"
function getRepositoryName(contractAddress, id, successFunc, errorFunc){
    return ajaxEth(buildParam(contractAddress, "id_name(uint256)", [{type:"uint256", value:id}]), "string", successFunc, errorFunc);
}
function getRepositoryNames(contractAddress, successFunc, errorFunc){
    var args={contractAddress: contractAddress, maxId: 0, currId: 0, list:[]};
    var maxIdSuccess = successFunc || function(maxId){
        this.maxId = maxId;
        this.currId = maxId;
        getRepositoryName(this.contractAddress, this.currId, callbackFunc(this, nameSuccess), errorFunc);
    };
    var nameSuccess = function(name){
        console.log("Current args", this);
        var json = {id: this.currId, owner: this.contractAddress, repositoryName: name};
        this.list.push(json);
        var tpl=Template($("#tpl_repository").html());
        $("#mCSB_1_container").append(tpl.render(json));
        if(this.currId > 1){
            this.currId -= 1;
            getRepositoryName(this.contractAddress, this.currId, callbackFunc(this, nameSuccess), errorFunc);
        }
    };
    getMaxId(contractAddress, callbackFunc(args, maxIdSuccess), errorFunc);
}

function callbackFunc(args, targetFunc){
    return function(){
        targetFunc.apply(args, arguments);
    };
}
//==========================================================================================
function listRepositories(){
    var address = $("#txtSearchInput").val();
    if(address){
        $("#mCSB_1_container").empty();
        getRepositoryNames(address);
    }else{
        $("#mCSB_1_container").empty();
    }
}

//function getcontractabi(contractaddress) {
//    $.post("https://Ropsten.etherscan.io/api",
//    {
//        module: "contract",
//        action: "getabit",
//        address: contractaddress
//    },
//    function(data, status) {
//        console.log("contractAbi = " + data)
//    });
//}
//
//var Web3 = require('web3');
//
//var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/80f1c00345214da4bdbc4d02f35fb265"));
//
//var version = web3.version.api;
//console.log(version);
//var MyContract;
//var myContractInstance;
//try {
//    MyContract = web3.eth.contract([{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "removePrMember", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_PR_COMM", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_PR_MEMBER", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_startedIndex", "type": "uint256" }], "name": "removeStarted", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "name": "id_type_count_address", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_DELEGATOR", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_PR_AUTH", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_OWNER", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "id_url", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_name", "type": "string" }], "name": "repositoryId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_STARTED", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "name": "id_type_count_string", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "address" }], "name": "id_type_address", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TYPE_MEMBER", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_url", "type": "string" }, { "name": "_urlNew", "type": "string" }], "name": "updateUrl", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "removeMember", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_type", "type": "uint256" }], "name": "disableType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "addMember", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "hash_id", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "addRepository", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "email", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "updateName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "name": "id_type_disable", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "id_name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "addPrMember", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "name": "id_type_count", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "removeDelegator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "id", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_address", "type": "address" }], "name": "addDelegator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_url", "type": "string" }], "name": "addPullRequest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_url", "type": "string" }], "name": "addStarted", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_type", "type": "uint256" }], "name": "enableType", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_newName", "type": "string" }], "name": "updateRepository", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_email", "type": "string" }], "name": "updateEmail", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "VERSION", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "value", "type": "bool" }], "name": "Success", "type": "event" }]);
//    myContractInstance = MyContract.at("0x48e154cb7040602163236df58a8cc3c0836425e1");
//} catch(err) {
//    console.log(err.message);
//}
//
//function testCall(){
//    var functionSig = web3.sha3("id_name(uint256)").substring(0,10);
//    window.ethCallId = window.ethCallId || 1;
//    var paramData = functionSig+web3.padLeft("6", 256/4);
//    console.log("paramData", paramData);
//    var data = {
//        jsonrpc:"2.0",
//        method:"eth_call",
//        id:(++window.ethCallId),
//        params:[{
//            to:"0x48e154cb7040602163236df58a8cc3c0836425e1",
//            data: paramData
//        }, "latest"]
//    };
//    $.ajax({
//        //请求方式
//        type : "POST",
//        //请求的媒体类型
//        contentType: "application/json;charset=UTF-8",
//        //请求地址
//        url : "https://ropsten.infura.io/v3/80f1c00345214da4bdbc4d02f35fb265",
//        //数据，json字符串
//        data : JSON.stringify(data),
//        //请求成功
//        success : function(result) {
//            console.log(result);
//            //console.log(parseInt(result.result, 16));
//            console.log(hex_to_ascii(result.result));
//        },
//        //请求失败，包含具体的错误信息
//        error : function(e){
//            console.log(e.status);
//            console.log(e.responseText);
//        }
//    });
//}
//
//function ethcall2(strMethodName, strInputElementName, strOutputElementName, strOutputtype, strOutputFieldNames, strBtnName) {
//    var functionNametoCall = "myContractInstance." + strMethodName;
//    var result;
//    try {
//        var inputs = [];
//        var elms = document.querySelectorAll("[id=" + strInputElementName + "]");
//        //console.log("elms.length = " + elms.length);
//        for (var i = 0; i < elms.length; i++) {
//            var type = elms[i].getAttribute('data-type');
//            var grp = elms[i].getAttribute('data-grp');
//            var values = [];
//
//            if (elms[i].value == '' && grp === null) {
//                document.getElementById(strInputElementName).focus();
//                alert('Input value cannot be empty');
//                return false;
//            }
//
//            var value = strip(elms[i].value);
//
//            if (value) {
//                if (type.indexOf('[') !== -1 && type.indexOf(']') !== -1) values.push(value.split(','));
//                else values.push(value);
//            } else values.push('');
//
//            inputs.push({
//                type: type,
//                value: values,
//                grp: grp
//            });
//
//        }
//
//        var params = encodeParams(inputs);
//
//        showLoading(true, strBtnName);
//
//        new Function(functionNametoCall + "(" + params + ", function(err, res){ if (err) {result = err;} else { result = res; } showMessage('" + strMethodName + "',result,'" + strOutputElementName + "','" + strOutputFieldNames + "','" + strBtnName + "');   });")();
//
//        // result = eval(functionNametoCall + "(" + strparas + ");");
//        // $('#overlay').show();
//    } catch(err) {
//        //$('#overlay').show();
//        result = "" + err + "";
//        showLoading(false, strBtnName);
//    }
//    //setTimeout(function () {
//    //    $('#overlay').show();
//    //}, 2500);
//    //document.getElementById(strOutputElementName).innerHTML = "<br><br> [&nbsp;<b>" + strMethodName + "</b> method Response ]<br>" + formatmultipleoutputs(result, strOutputFieldNames) + "<br>";
//}
//
//function encodeParams(values) {
//    var params = '';
//
//    if (values.length === 0) return undefined;
//
//    for (i = 0; i < values.length; i++) {
//        var param = values[i];
//
//        if (param.value !== '') {
//            if (param.grp !== null) {
//                var _grp = values.filter(function(x) {
//                    return x.grp == param.grp
//                });
//                var _grpParam = '';
//
//                for (g = 0; g < _grp.length; g++) {
//                    param = _grp[g];
//
//                    if (param.value[0] !== '') {
//                        if (g == 0) _grpParam = toHex(param.type, Escape(param.value[0]));
//                        else _grpParam = _grpParam + ',' + toHex(param.type, Escape(param.value[0]));
//                    }
//                }
//                // _grpParam += ']';
//                if (i == 0) params += _grpParam;
//                else params += ',' + _grpParam;
//
//                i += _grp.length - 1;
//            } else {
//                if (i == 0) params = toHex(param.type, Escape(param.value[0]));
//                else params = params + ',' + toHex(param.type, Escape(param.value[0]));
//            }
//        }
//    }
//
//    return params;
//}
//
//function toHex(type, val) {
//
//    if (Array.isArray(val)) {
//        var param = "[";
//
//        var i;
//        for (i = 0; i < val.length; i++) {
//            if (i == 0) param += toHex(type, val[i]);
//            else param = param + ',' + toHex(type, val[i]);
//        }
//        param += "]";
//
//        return param;
//
//    } else {
//        if (type.indexOf('bool') !== -1) return JSON.parse(val);
//        else if (type.indexOf('address') !== -1) return "'" + add0xforAddress(val) + "'"
//        else return "'" + val + "'"
//    }
//
//};
//
//function strip(val) {
//
//    val = val.replace(/"/g, '');
//    val = val.replace('[', '');
//    val = val.replace(']', '');
//
//    return val;
//}
//
//function showMessage(strMethodName, result, strOutputElementName, strOutputFieldNames, strBtnName) {
//
//    document.getElementById(strOutputElementName).innerHTML = "<br><br> [&nbsp;<b>" + strMethodName + "</b> method Response ]<br>" + formatmultipleoutputs(result, strOutputFieldNames) + "<br>";
//    showLoading(false, strBtnName);
//
//    //var obj = window.parent.document.getElementById('readcontractiframe');
//    //   parent.resizeIframe(obj, 0);
//}
//
//function showLoading(isShow, strBtnName) {
//    if (isShow) {
//        $(" <img id='waiting_" + strBtnName + "' class='waitingImg' src='/images/ajax-loader2.gif' style='margin-left:5px;' alt='Loading' />").insertAfter($('#' + strBtnName));
//        $('#' + strBtnName).prop('disabled', true);
//    } else {
//        $('#' + strBtnName).prop('disabled', false);
//        $('#waiting_' + strBtnName).remove();
//    }
//}
//
//function Escape(val) {
//    if (typeof val === 'string' || val instanceof String) return val.replace(/'/g, "\\u0027");
//    else return val;
//
//}
//
//function formatmultipleoutputs(strVal, strOutputFieldNames) {
//    var strAnswer = '';
//    //console.log("strVal = " + strVal);
//    //console.log("strOutputFieldNames = " + strOutputFieldNames);
//    //console.log("strVal.length = " + strVal.length);
//    if (strOutputFieldNames.includes(';') == true) {
//        var res_2 = strOutputFieldNames.split(';');
//        for (i = 0; i < strVal.length; i++) {
//            var tmparray = res_2[i].toString().split('|');
//            strAnswer = strAnswer + "&nbsp;<span class='text-success'><i class='fa  fa-angle-double-right'></i></span> ";
//            if (res_2[i] != null && res_2[i].toString() != '') {
//                strAnswer = strAnswer + " <strong>" + tmparray[0] + "</strong> &nbsp; <span class='text-monospace text-secondary'><i>" + tmparray[1] + "</i></span> <b>:</b> &nbsp;"
//            }
//            strAnswer = strAnswer + formatresult(strVal[i].toString(), tmparray[1]) + "<br>";
//        }
//    } else {
//        strAnswer = strAnswer + "&nbsp;<span class='text-success'><i class='fa  fa-angle-double-right'></i></span> ";
//        if (strOutputFieldNames != '') {
//            var tmparray = strOutputFieldNames.toString().split('|');
//            strAnswer = strAnswer + " <strong>" + tmparray[0] + "</strong> &nbsp; <span class='text-secondary'><i>" + tmparray[1] + "</i></span> <b>:</b> &nbsp;";
//            strVal = formatresult(strVal.toString(), tmparray[1])
//        }
//        strAnswer = strAnswer + replaceAll(strVal, ",", "<br>&nbsp;<span class='text-success'><i class='fa  fa-angle-double-right'></i></span> ") + "<br>";
//    }
//    return strAnswer;
//}
//
//function htmlEncode(value) {
//    return $('<div/>').text(value).html();
//}
//function replaceAll(str, find, replace) {
//    return str.replace(new RegExp(find, 'g'), replace);
//}
//function formatresult(strResult, resulttype) {
//    if (resulttype.startsWith('uint')) {
//        return toFixed(strResult);
//    } else if (resulttype == 'string') {
//        return htmlEncode(strResult);
//        //return hex_to_ascii(strResult);
//    } else if (resulttype == 'address') {
//        if (strResult != '0x0000000000000000000000000000000000000000') {
//            return "<a href='/address/" + strResult + "' target='_blank'>" + strResult + "</a>";
//        } else {
//            return htmlEncode(strResult);
//        }
//        //} else if (resulttype == 'bool') {
//        //    return Boolean(remove0x(strResult));
//    } else {
//        return htmlEncode(strResult);
//    }
//}
//function hex_to_ascii(str1) {
//    var hex = str1.toString();
//    var str = '';
//    for (var n = 0; n < hex.length; n += 2) {
//        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
//    }
//    return str;
//}
//function extractaddress(str1) {
//    if (str1.length > 40) {
//        str1.substr(str1.length - 40)
//    }
//    return str1;
//}
//function remove0x(str1) {
//    if (str1.startsWith("0x") == true) {
//        str1 = str1.substr(str1.length - str1.length + 2);
//    }
//    return str1;
//}
//function add0xforAddress(straddress) {
//    straddress = straddress.trim();
//    if (straddress.startsWith("0x") == false && straddress.length == 40) {
//        straddress = "0x" + straddress;
//    }
//    return straddress;
//}
//function toFixed(x) {
//    if (x.indexOf("e+") !== -1) {
//        var value = web3.toBigNumber(x);
//        x = value.toString(10);
//    }
//    return x;
//}
//function getParameterByName(name) {
//    var url = window.location.href;
//    name = name.replace(/[\[\]]/g, "\\$&");
//    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//    results = regex.exec(url);
//    if (!results) return null;
//    if (!results[2]) return '';
//    return decodeURIComponent(results[2].replace(/\+/g, " "));
//}