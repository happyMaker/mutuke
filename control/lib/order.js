/*
 *control lib order.js
 * */

var db=require("../../db");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var Thumbnail=require("./thumbnail");
var Permission=require("./permission");

var addOrder=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            bindUser:jsonReq.userId
        }
       db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
           if("creator"==result){
               db.Order.addOrder(jsonReq,function(err,result){
                   callback(err,result);
                    poolMain.release(database);
               });
           }else{
                callback({"message":"no premission"});
                poolMain.release(database);
           }
       });
   });
}

var getOrderList=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
           db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
           if("creator"==result){
               db.Order.getOrderList(jsonReq,function(err,result){
                   callback(err,result);
                    poolMain.release(database);
               });
           }else{
                callback({"message":"no premission"});
                poolMain.release(database);
           }
       });
   });
}
var getOrderData=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
           db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
           if("creator"==result){
           }else{
           }
       });
    });
}



/**
 *product 
 */


//给用户绑定模板
function addProductToOrder(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Order.addProductToOrder(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
}

//删除用户绑定的product
function getProductsFromOrder(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result,resJson){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result||"binder"==result){
                jsonReq.userId=resJson.userId;
                db.Order.getProductsFromOrder(jsonReq,function(err,res){
                    poolMain.release(database);
                    if(err){return callback(err);};
                    callback(err,res);
                });
            }else{
                poolMain.release(database);
                callback("not found")
            }
        });
    });
}
function subProductFromOrder(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Order.subProductFromOrder(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
};
//删除用户绑定的模板
function removeProductFromOrder(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Order.removeProductFromOrder(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
}

exports.addOrder=addOrder;
exports.getOrderList=getOrderList;
exports.getProductsFromOrder=getProductsFromOrder;
exports.addProductToOrder=addProductToOrder;
exports.removeProductFromOrder=removeProductFromOrder;
exports.subProductFromOrder=subProductFromOrder;
