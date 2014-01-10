var db=require("../../db");
var Common=db.Common;
var Users=db.Users;


function _test_insertUserName(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Users.insertUserName({
            "database":database,
            "username":"test1",
            "pass":"test1"
        },function(err,result){
            database.close();
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> insertUserName Error")}
            if(result.status=="ok"){
                console.log("db_users-------->insertUserName ok");
            }else{
                console.log("db_users=========>insertUserName ok");
            }
        
        });
    });
}

function _test_compareNameAndPass(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Users.compareNameAndPass({
            "database":database,
            "username":"test1",
            "pass":"test1"
        },function(err,result){
            database.close();
            if(err){return console.log("****** db_users>>>>>>>>>>> compareNameAndPass Error")}
            if(result.status=="ok"){
                console.log("db_users-------->compareNameAndPass ok");
            }else{
                console.log("db_users========>compareNameAndPass ok");
            }
        });
    });
}

function _test_searchUser(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Users.searchUser({
            "database":database,
            "keyword":"test1",
        },function(err,result){
            database.close();
            if(err){return console.log("****** db_users>>>>>>>>>>> searchUser Error")}
            if(result.length>0){
                console.log("db_users-------->searchUser ok");
            }
        });
    });
}

exports.test=function(){
    _test_insertUserName();
    _test_compareNameAndPass();
    _test_searchUser();
}
