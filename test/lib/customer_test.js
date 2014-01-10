var db=require("../../db");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;
var Common=db.Common;

var testUserId=new objectId("527ce977e920d9af09000001");
var testCusId=new objectId("527cea824ae799ba0a000001");

function _test_createCustomerListForUser(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.createCustomerListForUser({
            "database":database,
            "userId":testUserId
        },function(err,result){
            if(err){return console.log("******db_customer>>>>>>>>>>>>>>>>>>> getCustomerById Error")};
            console.log("db_customer",result);
        });
    });
}

function testRelation(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.getUserAndCustomerRelation({
            "database":database,
            "userId":"527b8be29544dc3c72000001",
            "cusInfoId":"527fcc612413c7cf24000001"
        },function(err,result){
            if(err){return console.log("******db_customer>>>>>>>>>>>>>>>>>>> getCustomerById Error")};
            console.log("db_customer",result);
        });
    });
}


function _test_addCustomerToList(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.addCustomerToList({
            "database":database,
            "userId":testUserId,
            "cusId":new objectId()
        },function(err,result){
            database.close();
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> insertUserName Error")};
            if(result.status=="ok"){
                console.log("db_customer-------->add Customer ok");
            }
        });
    });
}


function _test_addCustomerInfo(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.addCustomerInfo({
            "database":database,
            "imageId":new objectId(),
            "userId":testUserId,
            "message":"abc",
            "boyInfo":{
                    "name":"刘德华",
                    "phone":"13000000000"
                },
            "girlInfo":{
                    "name":"张惠妹",
                    "phone":"13222222222"
                },
            "address":"北京"
        },function(err,result){
            database.close();
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> addCustomerInfo Error")};
            console.log("db_customer",result);
            if(result.length>0){
                console.log("db_customer-------->addCustomerInfo insert ok");
            }else{
                console.log("db_customer========>addCustomerInfo insert faile ok");
            }
        });
    });
}

function _test_getCustomerList(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.getCustomerList({
            "database":database,
            "userId":testUserId
        },function(err,result){
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> getCustomerById Error")};
            console.log(result);
        });
    });

};

function _test_getCustomerById(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.getCustomerInfoById({
            "database":database,
            "cusId":new objectId("527cec280f75e7ce0a000002") 
        },function(err,result){
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> getCustomerById Error")};
            console.log(result);
        });
    });
}



    testRelation();
exports.test=function(){
    /*
    _test_createCustomerListForUser();
    _test_addCustomerToList();
    _test_addCustomerInfo();
    _test_getCustomerList();
    _test_getCustomerById();
    */
}
/*
exports.createCustomerListForUser=_createCustomerListForUser;
exports.addCustomerToList=_addCustomerToList;
exports.addCustomerInfo=_addCustomerInfo;
exports.getCustomerList=_getCustomerList;

exports.getCustomerInfoById=_getCustomerInfoById;
*/
