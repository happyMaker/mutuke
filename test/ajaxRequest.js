var ejs=require("ejs");
    config=require("../config.json");
var js_version=config.js_version,
    css_version=config.css_version;
    var fs=require("fs");
    var db=require("../db");
    var ctrl=require("../control");
    var test=require("../test/canvas_test");

function _insertUserName(){
        ctrl.Users.insertUserName({
            username:"songTestOne",
            pass:"abc"
        },function(err,json){
            console.log(err,json);
        });
}
_insertUserName();
exports.insetUser=_insertUserName;
