var ejs=require("ejs");
var fs=require("fs");
var ctrl=require("../../control");
var config=require("../../config.json");

function checkLogind(req,res,type,path){
    if(req.session.userId){
        return true;
    }else{
        if("get"==type){
            var path=path?"?path="+path:"";
            res.redirect("/login"+path);
        }else{
            res.send({"status":"sorry","message":"用户登录已经超时，请重新登录！"});
            return false;
        }
    }
}

function checkStudio(req,res,type,callback){
    if(req.session.studioId){
        callback(null,{"status":"ok"}); 
    }else{
        var jsonReq={};
        jsonReq.userId=req.session.userId;
        ctrl.Users.getUserInfoById(jsonReq,function(err,result){
            if(result.studioId){
                req.session.studioId=result.studioId;
                callback(err,{"status":"ok"}); 
            }else{
                if("get"==type){
                    res.redirect("/applystudio");
                    callback(err,{"status":"sorry"}); 
                }else{
                    callback(err,{"status":"sorry"}); 
                }
            } 
        });    
    }
}


exports.checkLogind=checkLogind;
exports.checkStudio=checkStudio;
exports.ejs=ejs;
exports.fs=fs;
exports.ctrl=ctrl;
exports.config=config;
