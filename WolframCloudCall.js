var url = "https://www.wolframcloud.com/obj/c76a917e-be78-44d8-8edb-64e74f8db8c7";

/* 
JavaScript EmbedCode usage:

var wcc = new WolframCloudCall();
wcc.call(key, input, function(result) { console.log(result); });
*/

(function() {
    WolframCloudCall = function() {	this.init(); };
    
    var p = WolframCloudCall.prototype;
    
    p.init = function() {};
    
    p._createCORSRequest = function(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    };
    
    p._encodeArgs = function(args) {
        var argName;
        var params = "";
        for (argName in args) {
            params += (params == "" ? "" : "&");
            params += encodeURIComponent(argName) + "=" + encodeURIComponent(args[argName]);
        }
        return params;
    };
    
    p._auxCall = function(url, args, callback) {
        var params = this._encodeArgs(args);
        var xhr = this._createCORSRequest("post", url);
        if (xhr) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("EmbedCode-User-Agent", "EmbedCode-JavaScript/1.0");
            xhr.onload = function() {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    var response = xhr.responseText
                    response = response.substring(1,response.length-2)
                    var i = response.lastIndexOf(',')

                    callback([response.substring(0,i), response.substring(i+3)]);
                     //respone = response.replace(" \"","").split(",")
                } else {
                    callback(null);
                }
            };
            xhr.send(params);
        } else {
            throw new Error("Could not create request object.");
        }
    };
    
    p.call = function(seed, QuestionID, key, input, callback) {
        
        var args = {seed : seed, QuestionID : QuestionID, key: key, input: input};
        var callbackWrapper = function(result) {
            if (result === null) callback(null);
            else callback(result);
        };
        this._auxCall(url, args, callbackWrapper);
    };
    })();