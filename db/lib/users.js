var Common=require("./common");
var mongodb=require("mongodb"),
    format=require("util").format,
    objectId=mongodb.ObjectID,
    crypto=require("crypto");

    var _createObjectId=Common.createObjectId;

    var _newThirdparty=function(jsonReq,callback){
        var database=jsonReq.database; 
        var type=jsonReq.idType;//QQ weibo ..
        var insertObj={};
            insertObj[type]=jsonReq.openId;
            insertObj["createDate"]=new Date().toISOString();
            
        var col=database.collection("users");
        col.insert(insertObj,function(err,res){
            if(err){return callback(err)};
            callback(err,res);
        });
    };

    var _getUserByOpenId=function(jsonReq,callback){
        var database=jsonReq.database;
        var openId=jsonReq.openId;
        var col=database.collection("users");
        col.findOne({$or:[{"qq":openId},{"weibo":openId}]},function(err,doc){
            callback(err,doc);
        });
    
    };

//user collection;
    var _insertUserName=function(jsonReq,callback){
            var database=jsonReq.database;
            var col=database.collection("users");
            var username=jsonReq.username;
            var pass=jsonReq.pass;
            col.find({"name":username},{"name":1}).toArray(function(err,item){
                if(err){return callback(err)};
                var count=item.length;
                if(count>0){
                    callback(err,{"status":"sorry","message":"name ware exist!"});
                }else{
                    var md5=crypto.createHash("md5");
                    var md5Pass=md5.update(pass).digest("base64");
                    var date=new Date().toISOString();
                    col.insert({"name":username,"pass":md5Pass,createDate:date},function(err,res){
                        if(err){return callback(err)};
                        callback(err,{"status":"ok"});
                    });
                }
            });
    };

    var _compareNameAndPass=function(jsonReq,callback){
        var database=jsonReq.database;
        var username=jsonReq.username||"--";
        var pass=jsonReq.pass||"--";

        var col=database.collection("users");
        var md5=crypto.createHash("md5");
        var md5Pass=md5.update(pass).digest("base64");

        col.find({"name":username,"pass":md5Pass}).toArray(function(err,item){
            if(item.length>0){
                callback(err,{"status":"ok","data":item[0]});
            }else{
                callback(err,{"status":"sorry"});
            }
        })
    }

    var getUserInfoById=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var col=database.collection("users");
        var uid=_createObjectId(userId);
        if(!uid){return callback("create uid error at getUserInfoById")}
        col.findOne({"_id":uid},function(err,doc){
            if(err){return callback(err)}
            callback(err,doc);
        });
    };

    var addStudioId=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var col=database.collection("users");
        var uid=_createObjectId(userId);
        var studioId=_createObjectId(jsonReq.studioId);
        if(!uid){return callback("create uid error at getUserInfoById")}
        col.update({"_id":uid},{"$set":{"studioId":studioId}},function(err,doc){
            if(err){return callback(err)}
            callback(err,doc);
        });
    }
    
    var checkUsername=function(jsonReq,callback){
        var database=jsonReq.database;
        var username=jsonReq.username;
        var col=database.collection("users");
        col.findOne({"name":username},function(err,item){
            var result=0;
            if(item){
                result=1;
            }
            callback(err,result);
        });
    }


function _searchUser(jsonReq,callback){
        var database=jsonReq.database;
        var keyword=jsonReq.keyword;
        var col=database.collection("users");
        col.find({$or:[{"name":keyword},{"qq":keyword},{"email":keyword}]},{"name":1,"_id":0}).toArray(function(err,item){
            callback(err,item);
        });
}


exports.searchUser=_searchUser;
exports.insertUserName=_insertUserName;
exports.compareNameAndPass=_compareNameAndPass;
exports.getUserInfoById=getUserInfoById;
exports.checkUsername=checkUsername;
exports.addStudioId=addStudioId;
exports.getUserByOpenId=_getUserByOpenId;
exports.newThirdparty=_newThirdparty;
